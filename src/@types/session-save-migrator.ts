import type { SessionSaveData } from "#app/@types/session-data";

export interface SessionSaveMigrator {
  version: string;
  migrate: (data: SessionSaveData) => void;
}
