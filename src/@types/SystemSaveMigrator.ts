import type { SystemSaveData } from "#app/@types/SystemData";

export interface SystemSaveMigrator {
  version: string;
  migrate: (data: SystemSaveData) => void;
}
