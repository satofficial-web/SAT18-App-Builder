
import React, { useState } from 'react';
import { BuildConfig, LogMessage } from './types';
import Header from './components/Header';
import ConfigForm from './components/ConfigForm';
import ActionButtons from './components/ActionButtons';
import LogViewer from './components/LogViewer';
import Footer from './components/Footer';
import { useBuildProcess } from './hooks/useBuildProcess';

const App: React.FC = () => {
  const [config, setConfig] = useState<BuildConfig>({
    webProject: null,
    appName: 'My Awesome App',
    packageId: 'com.sat18.myapp',
    enableAdMob: false,
    adMobId: '',
    appIcon: null,
  });
  
  const { 
    logs, 
    isCheckingEnv, 
    isBuilding, 
    isEnvOk, 
    checkEnvironment, 
    startBuild 
  } = useBuildProcess();

  const handleConfigChange = (newConfig: Partial<BuildConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  return (
    <div className="bg-gray-900 text-gray-300 min-h-screen font-mono flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-gray-800 rounded-lg shadow-2xl p-6 border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-bold text-cyan-400 mb-4 border-b-2 border-cyan-500/30 pb-2">1. Configuration</h2>
              <ConfigForm config={config} onConfigChange={handleConfigChange} isBuilding={isBuilding || isCheckingEnv} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-cyan-400 mb-4 border-b-2 border-cyan-500/30 pb-2">2. Actions</h2>
              <ActionButtons
                onCheckEnv={checkEnvironment}
                onBuild={() => startBuild(config)}
                isCheckingEnv={isCheckingEnv}
                isBuilding={isBuilding}
                isEnvOk={isEnvOk}
                isConfigReady={!!config.webProject && !!config.appName && !!config.packageId}
              />
            </div>
          </div>
        </div>

        <div className="mt-8 bg-gray-800 rounded-lg shadow-2xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-cyan-400 mb-4 border-b-2 border-cyan-500/30 pb-2">3. Build Output</h2>
          <LogViewer logs={logs} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
