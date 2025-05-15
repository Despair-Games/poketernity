import type { SessionSaveData } from "#app/@types/session-data";
import type { SystemSaveData } from "#app/@types/system-data";

export interface UpdateAllSavedataRequest {
  system: SystemSaveData;
  session: SessionSaveData;
  sessionSlotId: number;
  clientSessionId: string;
}
