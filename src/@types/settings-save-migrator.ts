import type { Settings } from "#app/@types/settings";

export interface SettingsSaveMigrator {
  version: string;
  migrate: (data: Partial<Settings>) => void;
}
