import type { SystemSaveData } from "#app/@types/SystemData";
import type { SessionSaveData } from "#app/@types/SessionData";

export interface UpdateAllSavedataRequest {
  system: SystemSaveData;
  session: SessionSaveData;
  sessionSlotId: number;
  clientSessionId: string;
}
