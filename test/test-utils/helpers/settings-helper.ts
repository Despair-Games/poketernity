import { BattleStyle } from "#enums/battle-style";
import { ExpGainSpeed } from "#enums/exp-gain-speed";
import { PlayerGender } from "#enums/player-gender";
import { settings } from "#system/settings-manager";
import { GameManagerHelper } from "#test/test-utils/helpers/game-manager-helper";
import { enumValueToKey } from "#utils/common-utils";

/**
 * Helper to handle settings for tests
 */
export class SettingsHelper extends GameManagerHelper {
  private _battleStyle: BattleStyle = BattleStyle.SET;

  get battleStyle(): BattleStyle {
    return this._battleStyle;
  }

  /**
   * Change the battle style to Switch or Set mode (tests default to {@linkcode BattleStyle.SET})
   * @param mode {@linkcode BattleStyle.SWITCH} or {@linkcode BattleStyle.SET}
   */
  set battleStyle(mode: BattleStyle) {
    this._battleStyle = mode;
  }

  /**
   * Disable/Enable type hints settings
   * @param enable true to enabled, false to disabled
   */
  typeHints(enable: boolean): void {
    settings.update("display", "enableTypeHints", enable);
    this.log(`Type Hints ${enable ? "enabled" : "disabled"}`);
  }

  /**
   * Change the player gender
   * @param gender the {@linkcode PlayerGender} to set
   */
  playerGender(gender: PlayerGender) {
    settings.update("display", "playerGender", gender);
    this.log(`Gender set to: ${enumValueToKey(PlayerGender, gender)} (=${gender})`);
  }

  /**
   * Change the exp gains speed
   * @param speed the {@linkcode ExpGainSpeed} to set
   */
  expGainSpeed(speed: ExpGainSpeed) {
    settings.update("general", "expGainSpeed", speed);
    this.log(`Exp Gain Speed set to: ${enumValueToKey(ExpGainSpeed, speed)} (=${speed})`);
  }

  private log(...params: any[]) {
    console.log("Settings:", ...params);
  }
}
