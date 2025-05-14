import type { SystemSaveData } from "#types/SystemData";

export interface SystemSaveMigrator {
  version: string;
  migrate: (data: SystemSaveData) => void;
}
