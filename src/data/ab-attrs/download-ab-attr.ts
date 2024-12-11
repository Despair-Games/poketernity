import type Pokemon from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { StatStageChangePhase } from "#app/phases/stat-stage-change-phase";
import { type BattleStat, Stat } from "#enums/stat";
import { PostSummonAbAttr } from "./post-summon-ab-attr";

/**
 * Download raises either the Attack stat or Special Attack stat by one stage depending on the foe's currently lowest defensive stat:
 * it will raise Attack if the foe's current Defense is lower than its current Special Defense stat;
 * otherwise, it will raise Special Attack.
 * @extends PostSummonAbAttr
 * @see {@linkcode applyPostSummon}
 */
export class DownloadAbAttr extends PostSummonAbAttr {
  private enemyDef: number;
  private enemySpDef: number;
  private stats: BattleStat[];

  /**
   * @param pokemon The {@linkcode Pokemon} with this ability
   * @returns Returns `true` if ability is used successful, `false` if not.
   */
  override applyPostSummon(pokemon: Pokemon, _passive: boolean, simulated: boolean, _args: any[]): boolean {
    this.enemyDef = 0;
    this.enemySpDef = 0;

    for (const opponent of pokemon.getOpponents()) {
      this.enemyDef += opponent.getEffectiveStat(Stat.DEF);
      this.enemySpDef += opponent.getEffectiveStat(Stat.SPDEF);
    }

    if (this.enemyDef < this.enemySpDef) {
      this.stats = [Stat.ATK];
    } else {
      this.stats = [Stat.SPATK];
    }

    // only activate if there's actually an enemy to download from
    if (this.enemyDef > 0 && this.enemySpDef > 0) {
      if (!simulated) {
        globalScene.unshiftPhase(new StatStageChangePhase(pokemon.getBattlerIndex(), false, this.stats, 1));
      }
      return true;
    }

    return false;
  }
}
