import type { SystemSaveData } from "#types/system-data";

export interface SystemSaveMigrator {
  version: string;
  migrate: (data: SystemSaveData) => void;
}
