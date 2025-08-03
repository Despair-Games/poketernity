import type { SessionSaveData } from "#types/session-data";
import type { Settings } from "#types/settings";
import type { SystemSaveData } from "#types/system-data";

export interface SessionSaveMigrator {
  version: string;
  migrate: (data: SessionSaveData) => void;
}

export interface SettingsSaveMigrator {
  version: string;
  migrate: (data: Partial<Settings>) => void;
}

export interface SystemSaveMigrator {
  version: string;
  migrate: (data: SystemSaveData) => void;
}
