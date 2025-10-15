
export interface BuildConfig {
  webProject: File | null;
  appName: string;
  packageId: string;
  enableAdMob: boolean;
  adMobId: string;
  appIcon: File | null;
}

export enum LogLevel {
  INFO = 'INFO',
  CMD = 'CMD',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  WARN = 'WARN',
}

export interface LogMessage {
  level: LogLevel;
  message: string;
  timestamp: string;
}
