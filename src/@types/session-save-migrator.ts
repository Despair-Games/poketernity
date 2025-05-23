import type { SessionSaveData } from "#types/session-data";

export interface SessionSaveMigrator {
  version: string;
  migrate: (data: SessionSaveData) => void;
}
