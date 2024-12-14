import type { TitleStatsResponse } from "#app/@types/Api";
import { ApiBase } from "#app/plugins/api/api-base";
import { AccountApi } from "#app/plugins/api/account-api";
import { AdminApi } from "#app/plugins/api/admin-api";
import { DailyApi } from "#app/plugins/api/daily-api";
import { SavedataApi } from "#app/plugins/api/savedata-api";

/**
 * A wrapper for API requests.
 */
export class Api extends ApiBase {
  //#region Fields∏

  public readonly account: AccountApi;
  public readonly daily: DailyApi;
  public readonly admin: AdminApi;
  public readonly savedata: SavedataApi;

  //#region Public

  constructor(base: string) {
    super(base);
    this.account = new AccountApi(base);
    this.daily = new DailyApi(base);
    this.admin = new AdminApi(base);
    this.savedata = new SavedataApi(base);
  }

  /**
   * Request game title-stats.
   */
  public async getGameTitleStats() {
    try {
      const response = await this.doGet("/game/titlestats");
      return (await response.json()) as TitleStatsResponse;
    } catch (err) {
      console.warn("Could not get game title stats!", err);
      return null;
    }
  }

  /**
   * Unlink the currently logged in user from Discord.
   * @returns `true` if unlinking was successful, `false` if not
   */
  public async unlinkDiscord() {
    try {
      const response = await this.doPost("/auth/discord/logout");
      if (response.ok) {
        return true;
      } else {
        console.warn(`Discord unlink failed (${response.status}: ${response.statusText})`);
      }
    } catch (err) {
      console.warn("Could not unlink Discord!", err);
    }

    return false;
  }

  /**
   * Unlink the currently logged in user from Google.
   * @returns `true` if unlinking was successful, `false` if not
   */
  public async unlinkGoogle() {
    try {
      const response = await this.doPost("/auth/google/logout");
      if (response.ok) {
        return true;
      } else {
        console.warn(`Google unlink failed (${response.status}: ${response.statusText})`);
      }
    } catch (err) {
      console.warn("Could not unlink Google!", err);
    }

    return false;
  }

  //#endregion
}

export const api = new Api(import.meta.env.VITE_SERVER_URL ?? "http://localhost:8001");
