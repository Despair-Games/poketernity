import type { SessionSaveData } from "#types/session-data";
import type { SystemSaveData } from "#types/system-data";

export interface UpdateAllSavedataRequest {
  system: SystemSaveData;
  session: SessionSaveData;
  sessionSlotId: number;
  clientSessionId: string;
}
