import React, { useEffect, useRef } from 'react';
import { BuildLog } from '../types';

interface LogViewerProps {
  logs: BuildLog[];
}

const LogViewer: React.FC<LogViewerProps> = ({ logs }) => {
  const endOfLogsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfLogsRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="bg-black text-gray-200 p-4 rounded-lg h-96 overflow-y-auto font-mono text-sm shadow-inner border border-gray-700">
      {logs.length === 0 && (
        <div className="text-gray-500">
            Log kosong — tekan "Mulai Build" untuk mensimulasikan proses.
        </div>
      )}
      {logs.map((log, i) => (
        <div key={i} className="flex">
          <span className="text-cyan-400/80 mr-3 select-none">[{log.ts}]</span>
          {log.tag && <span className="text-green-400/90 w-24 flex-shrink-0">[{log.tag}]</span>}
          <p className="text-gray-200 whitespace-pre-wrap flex-1">
            {log.message}
          </p>
        </div>
      ))}
       <div ref={endOfLogsRef} />
    </div>
  );
};

export default LogViewer;
