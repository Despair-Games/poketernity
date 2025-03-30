import type { Settings } from "#app/@types/Settings";

export interface SettingsSaveMigrator {
  version: string;
  migrate: (data: Partial<Settings>) => void;
}
