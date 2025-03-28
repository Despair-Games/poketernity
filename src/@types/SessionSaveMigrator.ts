import type { SessionSaveData } from "#app/@types/SessionData";

export interface SessionSaveMigrator {
  version: string;
  migrate: (data: SessionSaveData) => void;
}
