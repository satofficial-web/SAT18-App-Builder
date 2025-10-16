import React, { useState, useCallback } from 'react';
import { BuildConfig } from './types';
import { useBuildProcess } from './hooks/useBuildProcess';

import Header from './components/Header';
import ConfigForm from './components/ConfigForm';
import { ActionButtons } from './components/ActionButtons';
import LogViewer from './components/LogViewer';
import Footer from './components/Footer';
import { CogIcon } from './components/icons/CogIcon';
import { CheckCircleIcon } from './components/icons/CheckCircleIcon';

const App: React.FC = () => {
  const [config, setConfig] = useState<BuildConfig>({
    webProject: null,
    appName: 'My Awesome App',
    packageId: 'com.example.awesomeapp',
    enableAdMob: false,
    adMobId: '',
    appIcon: null,
  });

  const {
    status,
    logs,
    apkUrl,
    apkName,
    startBuild,
    cancelBuild,
    clearLogs,
  } = useBuildProcess();

  const handleConfigChange = useCallback((newConfig: Partial<BuildConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  }, []);

  const handleStartBuild = () => {
    // Basic validation
    if (!config.webProject) {
        alert('Please select a web project folder (.zip).');
        return;
    }
    if (!config.appName.trim()) {
        alert('Please enter an App Name.');
        return;
    }
    const packageIdRegex = /^[a-z][a-z0-9_]*(\.[a-z0-9_]+)+$/;
    if (!config.packageId.trim() || !packageIdRegex.test(config.packageId)) {
        alert('Please enter a valid Package ID (e.g., com.example.app).');
        return;
    }

    startBuild(config);
  };

  const handleDownload = () => {
    if (apkUrl && apkName) {
      const link = document.createElement('a');
      link.href = apkUrl;
      link.setAttribute('download', apkName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  const isBuilding = status === 'running';

  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-gray-800/50 p-6 rounded-lg shadow-xl border border-gray-700">
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <CogIcon className="w-6 h-6 text-gray-400" />
              Konfigurasi Build
            </h2>
            <p className="text-sm text-gray-400 mt-1">
                Isi detail aplikasi Anda dan unggah file yang diperlukan.
            </p>
          </div>
          
          <ConfigForm 
            config={config} 
            onConfigChange={handleConfigChange} 
            isBuilding={isBuilding}
          />
        </div>

        <div className="bg-gray-800/50 p-6 rounded-lg shadow-xl border border-gray-700 mt-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              Kontrol & Status
            </h2>
            <ActionButtons 
                status={status}
                start={handleStartBuild}
                cancel={cancelBuild}
                clear={clearLogs}
                canDownload={!!apkUrl && status === 'completed'}
                onDownload={handleDownload}
            />
        </div>

        {status === 'completed' && (
            <div className="bg-green-900/50 border border-green-700 text-green-300 px-4 py-3 rounded-lg relative mt-8 flex items-center gap-3">
                <CheckCircleIcon className="w-6 h-6" />
                <span>
                    <strong className="font-bold">Build Selesai!</strong>
                    <span className="block sm:inline ml-2">APK Anda siap untuk diunduh.</span>
                </span>
            </div>
        )}
        
        <div className="mt-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              Log Build
            </h2>
            <LogViewer logs={logs} />
        </div>

      </main>
      <Footer />
    </div>
  );
};

export default App;