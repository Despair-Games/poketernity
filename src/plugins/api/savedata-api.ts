import type { UpdateAllSavedataRequest } from "#app/@types/SavedataApi";
import { MAX_INT_ATTR_VALUE } from "#app/constants";
import { ApiBase } from "#app/plugins/api/api-base";
import { SessionSavedataApi } from "#app/plugins/api/session-savedata-api";
import { SystemSavedataApi } from "#app/plugins/api/system-savedata-api";

/**
 * A wrapper for savedata API requests.
 */
export class SavedataApi extends ApiBase {
  //#region Fields

  public readonly system: SystemSavedataApi;
  public readonly session: SessionSavedataApi;

  //#region Public

  constructor(base: string) {
    super(base);
    this.system = new SystemSavedataApi(base);
    this.session = new SessionSavedataApi(base);
  }

  /**
   * Update all savedata
   * @param bodyData The {@linkcode UpdateAllSavedataRequest | request data} to send
   * @returns An error message if something went wrong
   */
  public async updateAll(bodyData: UpdateAllSavedataRequest) {
    try {
      const rawBodyData = JSON.stringify(bodyData, (_k: any, v: any) =>
        typeof v === "bigint" ? (v <= MAX_INT_ATTR_VALUE ? Number(v) : v.toString()) : v,
      );
      const response = await this.doPost("/savedata/updateall", rawBodyData);
      return await response.text();
    } catch (err) {
      console.warn("Could not update all savedata!", err);
      return "Unknown error";
    }
  }
}
