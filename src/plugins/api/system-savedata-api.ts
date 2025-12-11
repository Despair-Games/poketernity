import { ApiBase } from "#api/api-base";
import type {
  GetSystemSavedataRequest,
  UpdateSystemSavedataRequest,
  VerifySystemSavedataRequest,
  VerifySystemSavedataResponse,
} from "#types/api-types";
import type { SystemSaveData } from "#types/system-data";

/** A wrapper for system savedata API requests. */
export class SystemSavedataApi extends ApiBase {
  //#region Public

  /**
   * Get the system savedata.
   * @param params - The {@linkcode GetSystemSavedataRequest} to send
   * @returns The system savedata as `string`, or `null` on error
   */
  public async get(params: GetSystemSavedataRequest): Promise<string | null> {
    try {
      const urlSearchParams = this.toUrlSearchParams(params);
      const response = await this.doGet(`/savedata/system/get?${urlSearchParams}`);
      const rawSavedata = await response.text();

      return rawSavedata;
    } catch (err) {
      console.warn("Could not get system savedata!", err);
      return null;
    }
  }

  /**
   * Verify if the session is valid.
   * If not, the `SystemSaveData` is returned.
   * @param params - The {@linkcode VerifySystemSavedataRequest} to send
   * @returns A {@linkcode SystemSaveData} if **NOT** valid, otherwise `null`.
   */
  // TODO: add handling for errors
  public async verify(params: VerifySystemSavedataRequest): Promise<SystemSaveData | null> {
    const urlSearchParams = this.toUrlSearchParams(params);
    const response = await this.doGet(`/savedata/system/verify?${urlSearchParams}`);

    if (response.ok) {
      const verifySavedata = (await response.json()) as VerifySystemSavedataResponse;

      if (!verifySavedata.valid) {
        console.warn("Invalid system savedata!");
        return verifySavedata.systemData;
      }
    } else {
      console.warn("System savedata verification failed!", response.status, response.statusText);
    }

    return null;
  }

  /**
   * Update the system savedata.
   * @param params - The {@linkcode UpdateSystemSavedataRequest} to send
   * @param rawSystemData - The raw {@linkcode SystemSaveData}
   * @returns An error message if something went wrong
   */
  public async update(params: UpdateSystemSavedataRequest, rawSystemData: string): Promise<string> {
    try {
      const urSearchParams = this.toUrlSearchParams(params);
      const response = await this.doPost(`/savedata/system/update?${urSearchParams}`, rawSystemData);

      return await response.text();
    } catch (err) {
      console.warn("Could not update system savedata!", err);
    }

    return "Unknown Error";
  }

  //#endregion
}
