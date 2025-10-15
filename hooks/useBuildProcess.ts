import { useState, useCallback } from 'react';
import { BuildConfig, LogMessage, LogLevel } from '../types';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const useBuildProcess = () => {
  const [logs, setLogs] = useState<LogMessage[]>([]);
  const [isCheckingEnv, setIsCheckingEnv] = useState(false);
  const [isBuilding, setIsBuilding] = useState(false);
  const [isEnvOk, setIsEnvOk] = useState(false);

  const addLog = useCallback((level: LogLevel, message: string) => {
    setLogs(prev => [
      ...prev,
      {
        level,
        message,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  }, []);

  const checkEnvironment = useCallback(async () => {
    setIsCheckingEnv(true);
    setLogs([]);
    addLog(LogLevel.INFO, 'Starting environment check...');
    await sleep(500);

    addLog(LogLevel.INFO, 'Checking Node.js version...');
    await sleep(300);
    addLog(LogLevel.SUCCESS, 'Node.js v18.12.0 found.');

    addLog(LogLevel.INFO, 'Checking JDK version...');
    await sleep(300);
    addLog(LogLevel.SUCCESS, 'OpenJDK 11.0.12 found.');
    
    addLog(LogLevel.INFO, 'Checking ANDROID_SDK_ROOT...');
    await sleep(300);
    const isSdkSet = Math.random() > 0.1; // 90% chance of success
    if(isSdkSet) {
        addLog(LogLevel.SUCCESS, 'ANDROID_SDK_ROOT is set.');
        addLog(LogLevel.SUCCESS, 'All checks passed. Environment is ready!');
        setIsEnvOk(true);
    } else {
        addLog(LogLevel.ERROR, 'ANDROID_SDK_ROOT environment variable not found.');
        addLog(LogLevel.WARN, 'Please set ANDROID_SDK_ROOT to your Android SDK location.');
        setIsEnvOk(false);
    }
    
    setIsCheckingEnv(false);
  }, [addLog]);

  const startBuild = useCallback(async (config: BuildConfig) => {
    setIsBuilding(true);
    setLogs([]);
    addLog(LogLevel.INFO, `Starting build for app: ${config.appName}`);
    await sleep(500);

    addLog(LogLevel.INFO, `Validating input: ${config.webProject?.name}`);
    await sleep(300);
    addLog(LogLevel.SUCCESS, `Web project validated.`);
    
    addLog(LogLevel.INFO, 'Copying web build to android assets...');
    await sleep(1000);
    addLog(LogLevel.SUCCESS, 'Copied web build -> android assets.');

    addLog(LogLevel.INFO, 'Patching config files (AndroidManifest.xml, strings.xml)...');
    if (config.enableAdMob) {
      addLog(LogLevel.INFO, `Injecting AdMob ID: ${config.adMobId}`);
    }
    await sleep(800);
    addLog(LogLevel.SUCCESS, 'Configuration patched successfully.');

    addLog(LogLevel.CMD, 'npx @capacitor/cli sync android');
    await sleep(2500);
    addLog(LogLevel.SUCCESS, 'Capacitor sync complete.');

    // Fix: Replaced Node.js-specific 'process.platform' with browser-compatible 'navigator.platform' to avoid runtime errors. This correctly determines the user's OS to display the appropriate simulated command.
    const gradleCmd = typeof navigator !== 'undefined' && navigator.platform.includes('Win') ? 'gradlew.bat' : './gradlew';
    addLog(LogLevel.CMD, `${gradleCmd} assembleDebug`);
    await sleep(5000);
    addLog(LogLevel.INFO, '> Task :app:compileDebugJavaWithJavac');
    await sleep(4000);
    addLog(LogLevel.INFO, '> Task :app:mergeDebugAssets');
    await sleep(3000);
    addLog(LogLevel.SUCCESS, 'BUILD SUCCESSFUL in 1m 25s');
    
    const apkPath = 'android/app/build/outputs/apk/debug/app-debug.apk';
    addLog(LogLevel.SUCCESS, `APK generated: ${apkPath}`);
    addLog(LogLevel.INFO, 'Build finished.');

    setIsBuilding(false);
  }, [addLog]);

  return { logs, isCheckingEnv, isBuilding, isEnvOk, checkEnvironment, startBuild };
};
