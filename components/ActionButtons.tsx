
import React from 'react';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { CogIcon } from './icons/CogIcon';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';

interface ActionButtonsProps {
  onCheckEnv: () => void;
  onBuild: () => void;
  isCheckingEnv: boolean;
  isBuilding: boolean;
  isEnvOk: boolean;
  isConfigReady: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onCheckEnv, onBuild, isCheckingEnv, isBuilding, isEnvOk, isConfigReady }) => {
  const isBusy = isCheckingEnv || isBuilding;

  return (
    <div className="space-y-4">
      <div className="flex items-start space-x-3 bg-gray-700/50 p-4 rounded-lg">
        <ShieldCheckIcon className={`h-6 w-6 mt-1 flex-shrink-0 ${isEnvOk ? 'text-green-400' : 'text-yellow-400'}`} />
        <div>
            <h3 className="text-base font-semibold">Environment Check</h3>
            <p className="text-sm text-gray-400 mt-1">
                Verify that Node.js, JDK, and Android SDK are correctly installed and configured before building.
            </p>
            <button
                onClick={onCheckEnv}
                disabled={isBusy}
                className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
                {isCheckingEnv ? (
                    <>
                        <CogIcon className="animate-spin -ml-1 mr-2 h-5 w-5" />
                        Checking...
                    </>
                ) : isEnvOk ? (
                     <>
                        <CheckCircleIcon className="-ml-1 mr-2 h-5 w-5" />
                        Environment OK
                    </>
                ) : (
                    "Check Environment"
                )}
            </button>
        </div>
      </div>
      
      <div className="flex items-start space-x-3 bg-gray-700/50 p-4 rounded-lg">
          <CogIcon className={`h-6 w-6 mt-1 flex-shrink-0 ${isBuilding ? 'animate-spin text-cyan-400' : 'text-cyan-500'}`} />
          <div>
            <h3 className="text-base font-semibold">Build APK</h3>
            <p className="text-sm text-gray-400 mt-1">
                Once the environment is verified and configuration is set, start the build process to generate the APK.
            </p>
            <button
                onClick={onBuild}
                disabled={!isEnvOk || isBusy || !isConfigReady}
                className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
                {isBuilding ? (
                    <>
                        <CogIcon className="animate-spin -ml-1 mr-2 h-5 w-5" />
                        Building...
                    </>
                ) : (
                    "Build APK"
                )}
            </button>
            {!isConfigReady && <p className="text-xs text-yellow-400 mt-2">Please provide a web project .zip to enable building.</p>}
            {!isEnvOk && <p className="text-xs text-yellow-400 mt-2">Please run a successful environment check first.</p>}
          </div>
      </div>
    </div>
  );
};

export default ActionButtons;
