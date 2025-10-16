import { useState, useCallback, useRef } from 'react';
import { BuildStatus, BuildLog, UseBuildProcessReturn, BuildConfig } from '../types';
import { processWebProjectZip } from '../engine/buildEngine';

export const useBuildProcess = (): UseBuildProcessReturn => {
  const [status, setStatus] = useState<BuildStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<BuildLog[]>([]);
  const [apkUrl, setApkUrl] = useState<string | null>(null);
  const [apkName, setApkName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const timeoutIds = useRef<ReturnType<typeof setTimeout>[]>([]);
  const isCancelled = useRef(false);

  const addLog = useCallback((message: string, tag?: string) => {
    setLogs(prev => [...prev, { ts: new Date().toLocaleTimeString(), message, tag }]);
  }, []);

  const clearTimeouts = () => {
    timeoutIds.current.forEach(clearTimeout);
    timeoutIds.current = [];
  };

  const cancelBuild = useCallback(() => {
    isCancelled.current = true;
    clearTimeouts();
    setStatus('cancelled');
    addLog('Build process cancelled by user.', 'CANCEL');
  }, [addLog]);

  const clearLogs = useCallback(() => {
    setLogs([]);
    setApkUrl(null);
    setApkName(null);
    setError(null);
    setProgress(0);
    setStatus('idle');
  }, []);
  
  const runStep = useCallback((stepFunction: () => Promise<any>, delay: number) => {
    return new Promise((resolve, reject) => {
      const id = setTimeout(() => {
        if (isCancelled.current) {
          return reject(new Error('Cancelled'));
        }
        stepFunction().then(resolve).catch(reject);
      }, delay);
      timeoutIds.current.push(id);
    });
  }, []);

  const startBuild = useCallback(async (config: BuildConfig) => {
    setStatus('running');
    setProgress(0);
    setLogs([]);
    setApkUrl(null);
    setApkName(null);
    setError(null);
    isCancelled.current = false;
    
    try {
      addLog('Build process started.', 'START');

      // --- REAL VALIDATION STEP ---
      addLog('Validating web project ZIP...', 'VALIDATE');
      if (!config.webProject) throw new Error("Web Project ZIP is missing.");
      
      const validationResult = await processWebProjectZip(config.webProject);
      addLog(`Found ${validationResult.fileCount} files in ZIP.`, 'VALIDATE');
      addLog(`Entry point found: ${validationResult.indexPath}`, 'VALIDATE');
      setProgress(10);
      
      // --- SIMULATED STEPS START HERE ---
      const steps = [
        { msg: 'Setting up build environment...', tag: 'SETUP', delay: 1000, progress: 20 },
        { msg: 'Installing dependencies (npm install)...', tag: 'DEPS', delay: 3000, progress: 35 },
        { msg: 'Compiling TypeScript and assets...', tag: 'COMPILE', delay: 2500, progress: 55 },
        { msg: 'Generating Android project...', tag: 'ANDROID', delay: 1500, progress: 70 },
        { msg: 'Running Gradle build...', tag: 'GRADLE', delay: 4000, progress: 90 },
        { msg: 'Signing APK...', tag: 'SIGN', delay: 1000, progress: 95 },
        { msg: 'Build successful! APK is ready.', tag: 'SUCCESS', delay: 500, progress: 100 },
      ];

      for (const step of steps) {
         await runStep(async () => {
            addLog(step.msg, step.tag);
            setProgress(step.progress);
        }, step.delay);
      }

      const generatedApkName = `${config.appName.replace(/\s+/g, '-')}-release.apk`;
      setApkName(generatedApkName);
      const dummyBlob = new Blob([`Dummy APK for ${config.appName}`], { type: 'application/vnd.android.package-archive' });
      setApkUrl(URL.createObjectURL(dummyBlob));
      setStatus('completed');

    } catch (err: any) {
        if (isCancelled.current) {
            // Already handled by cancelBuild
            return;
        }
        const errorMessage = err.message || 'An unknown error occurred.';
        setError(errorMessage);
        addLog(errorMessage, 'ERROR');
        setStatus('error');
    }

  }, [addLog, runStep]);

  return {
    status,
    progress,
    logs,
    apkUrl,
    apkName,
    error,
    startBuild,
    cancelBuild,
    clearLogs,
  };
};