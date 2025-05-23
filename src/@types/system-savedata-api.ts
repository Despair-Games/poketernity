import type { SystemSaveData } from "#types/system-data";

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
