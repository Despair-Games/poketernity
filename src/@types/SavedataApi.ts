import type { SessionSaveData } from "#types/SessionData";
import type { SystemSaveData } from "#types/SystemData";

export interface UpdateAllSavedataRequest {
  system: SystemSaveData;
  session: SessionSaveData;
  sessionSlotId: number;
  clientSessionId: string;
}
