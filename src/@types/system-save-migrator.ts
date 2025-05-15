import type { SystemSaveData } from "#app/@types/system-data";

export interface SystemSaveMigrator {
  version: string;
  migrate: (data: SystemSaveData) => void;
}
