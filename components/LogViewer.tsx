
import React, { useEffect, useRef } from 'react';
import { LogMessage, LogLevel } from '../types';

interface LogViewerProps {
  logs: LogMessage[];
}

const getLogLevelColor = (level: LogLevel): string => {
  switch (level) {
    case LogLevel.SUCCESS:
      return 'text-green-400';
    case LogLevel.ERROR:
      return 'text-red-400';
    case LogLevel.WARN:
      return 'text-yellow-400';
    case LogLevel.CMD:
      return 'text-cyan-400';
    case LogLevel.INFO:
    default:
      return 'text-gray-400';
  }
};

const LogViewer: React.FC<LogViewerProps> = ({ logs }) => {
  const endOfLogsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfLogsRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="bg-black rounded-md h-96 overflow-y-auto p-4 text-sm font-mono border border-gray-700">
      {logs.map((log, index) => (
        <div key={index} className="flex items-start">
          <span className="text-gray-600 mr-4 select-none">{log.timestamp}</span>
          <span className={`${getLogLevelColor(log.level)} mr-2 font-bold`}>
            {log.level === LogLevel.CMD ? '>' : `[${log.level}]`}
          </span>
          <p className="whitespace-pre-wrap flex-1">
            {log.message}
          </p>
        </div>
      ))}
      <div ref={endOfLogsRef} />
       {logs.length === 0 && <div className="text-gray-500">Build logs will appear here...</div>}
    </div>
  );
};

export default LogViewer;
