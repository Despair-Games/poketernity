import type { Settings } from "#types/Settings";

export interface SettingsSaveMigrator {
  version: string;
  migrate: (data: Partial<Settings>) => void;
}
