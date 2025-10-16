// src/types.ts
export type BuildStatus = 'idle' | 'running' | 'completed' | 'error' | 'cancelled';

export interface BuildLog {
  ts: string;
  tag?: string;
  message: string;
}

export interface UseBuildProcessReturn {
  status: BuildStatus;
  progress: number;
  logs: BuildLog[];
  apkUrl?: string | null;
  apkName?: string | null;
  error?: string | null;
  startBuild: (config: BuildConfig) => Promise<void>;
  cancelBuild: () => void;
  clearLogs: () => void;
}

// Keep BuildConfig for potential future re-integration of the config form
export interface BuildConfig {
  webProject: File | null;
  appName: string;
  packageId: string;
  enableAdMob: boolean;
  adMobId: string;
  appIcon: File | null;
}