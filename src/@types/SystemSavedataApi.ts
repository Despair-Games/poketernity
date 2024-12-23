import type { SystemSaveData } from "#app/@types/SystemData";

export interface GetSystemSavedataRequest {
  clientSessionId: string;
}

export class UpdateSystemSavedataRequest {
  clientSessionId: string;
  trainerId?: number;
  secretId?: number;
}

export interface VerifySystemSavedataRequest {
  clientSessionId: string;
}

export interface VerifySystemSavedataResponse {
  valid: boolean;
  systemData: SystemSaveData;
}
