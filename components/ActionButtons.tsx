import React from 'react';
import { BuildStatus } from '../types';

interface Props {
  status: BuildStatus;
  start: () => void;
  cancel: () => void;
  clear: () => void;
  canDownload?: boolean;
  onDownload?: () => void;
}

const baseButtonClass = "px-4 py-2 rounded-md font-semibold text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

export const ActionButtons: React.FC<Props> = ({ status, start, cancel, clear, canDownload, onDownload }) => {
  const isIdle = status === 'idle' || status === 'completed' || status === 'error' || status === 'cancelled';

  return (
    <div className="flex gap-3 items-center flex-wrap">
      {isIdle && (
        <button 
            onClick={start} 
            className={`${baseButtonClass} bg-cyan-600 hover:bg-cyan-700 text-white focus:ring-cyan-500`}
        >
          ▶ Mulai Build (Simulasi)
        </button>
      )}

      {status === 'running' && (
        <button 
            onClick={cancel} 
            className={`${baseButtonClass} bg-red-600 hover:bg-red-700 text-white focus:ring-red-500`}
        >
          ✖ Batalkan
        </button>
      )}

      <button 
        onClick={clear} 
        className={`${baseButtonClass} bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500`}
      >
        🧹 Bersihkan Log
      </button>

      {canDownload && onDownload && isIdle && (
        <button 
            onClick={onDownload} 
            className={`${baseButtonClass} bg-green-600 hover:bg-green-700 text-white focus:ring-green-500`}
        >
          ⬇ Download APK
        </button>
      )}
    </div>
  );
};
