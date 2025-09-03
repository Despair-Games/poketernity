import { ApiBase } from "#api/api-base";

/**
 * A wrapper for daily-run API requests.
 */
export class DailyApi extends ApiBase {
  //#region Public

  /**
   * Request the daily-run seed.
   * @returns The active daily-run seed as `string`.
   */
  public async getSeed() {
    try {
      const response = await this.doGet("/daily/seed");
      return response.text();
    } catch (err) {
      console.warn("Could not get daily-run seed!", err);
      return null;
    }
  }
}
