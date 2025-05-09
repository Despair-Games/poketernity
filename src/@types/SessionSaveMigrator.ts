import type { SessionSaveData } from "#types/SessionData";

export interface SessionSaveMigrator {
  version: string;
  migrate: (data: SessionSaveData) => void;
}
