import type { Settings } from "#types/settings";

export interface SettingsSaveMigrator {
  version: string;
  migrate: (data: Partial<Settings>) => void;
}
