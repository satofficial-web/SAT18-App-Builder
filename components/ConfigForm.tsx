
import React from 'react';
import { BuildConfig } from '../types';
import { FolderIcon } from './icons/FolderIcon';
import { ImageIcon } from './icons/ImageIcon';

interface ConfigFormProps {
  config: BuildConfig;
  onConfigChange: (newConfig: Partial<BuildConfig>) => void;
  isBuilding: boolean;
}

const FileInput: React.FC<{ id: string; label: string; file: File | null; onChange: (file: File | null) => void; accept: string; disabled: boolean; icon: React.ReactNode; }> = ({ id, label, file, onChange, accept, disabled, icon }) => (
    <div className="mt-2">
        <label htmlFor={id} className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
        <label htmlFor={id} className={`flex items-center justify-between w-full px-3 py-2 text-sm text-left ${disabled ? 'bg-gray-700 cursor-not-allowed' : 'bg-gray-700 hover:bg-gray-600 cursor-pointer'} border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500`}>
            <span className={`truncate ${file ? 'text-white' : 'text-gray-400'}`}>
                {file ? file.name : `Select ${label}...`}
            </span>
            {icon}
        </label>
        <input id={id} type="file" className="hidden" accept={accept} disabled={disabled} onChange={(e) => onChange(e.target.files ? e.target.files[0] : null)} />
    </div>
);


const ConfigForm: React.FC<ConfigFormProps> = ({ config, onConfigChange, isBuilding }) => {
  
  const handleFileChange = (field: keyof BuildConfig, file: File | null) => {
    onConfigChange({ [field]: file });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    onConfigChange({ [name]: type === 'checkbox' ? checked : value });
  };

  return (
    <form className="space-y-4">
      <div>
        <FileInput 
          id="webProject"
          label="Web Project Folder (dist/build)"
          file={config.webProject}
          onChange={(file) => handleFileChange('webProject', file)}
          accept=".zip"
          disabled={isBuilding}
          icon={<FolderIcon className="h-5 w-5 text-gray-400" />}
        />
         <p className="text-xs text-gray-500 mt-1">Please provide the production build folder (e.g., 'dist', 'build') as a .zip file.</p>
      </div>

      <div>
        <label htmlFor="appName" className="block text-sm font-medium text-gray-400">App Name</label>
        <input type="text" name="appName" id="appName" value={config.appName} onChange={handleInputChange} disabled={isBuilding} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm" />
      </div>

      <div>
        <label htmlFor="packageId" className="block text-sm font-medium text-gray-400">Package ID</label>
        <input type="text" name="packageId" id="packageId" value={config.packageId} onChange={handleInputChange} disabled={isBuilding} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm" placeholder="com.example.app" />
      </div>

       <div>
        <FileInput 
          id="appIcon"
          label="App Icon (.png)"
          file={config.appIcon}
          onChange={(file) => handleFileChange('appIcon', file)}
          accept="image/png"
          disabled={isBuilding}
          icon={<ImageIcon className="h-5 w-5 text-gray-400" />}
        />
      </div>

      <div className="pt-2">
        <div className="relative flex items-start">
          <div className="flex items-center h-5">
            <input id="enableAdMob" name="enableAdMob" type="checkbox" checked={config.enableAdMob} onChange={handleInputChange} disabled={isBuilding} className="focus:ring-cyan-500 h-4 w-4 text-cyan-600 bg-gray-700 border-gray-600 rounded" />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="enableAdMob" className="font-medium text-gray-300">Enable AdMob</label>
          </div>
        </div>
      </div>
      
      {config.enableAdMob && (
        <div>
          <label htmlFor="adMobId" className="block text-sm font-medium text-gray-400">AdMob App ID</label>
          <input type="text" name="adMobId" id="adMobId" value={config.adMobId} onChange={handleInputChange} disabled={isBuilding} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm" placeholder="ca-app-pub-..." />
        </div>
      )}
    </form>
  );
};

export default ConfigForm;
