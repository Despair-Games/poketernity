import { PostSummonAbAttr } from "#abilities/post-summon-ab-attr";
import { globalScene } from "#app/global-scene";
import { AbilityApplyMode } from "#enums/ability-apply-mode";
import { Stat } from "#enums/stat";
import type { Pokemon } from "#field/pokemon";

/**
 * Download raises either the Attack stat or Special Attack stat by one stage depending on the foe's currently lowest defensive stat:
 * it will raise Attack if the foe's current Defense is lower than its current Special Defense stat;
 * otherwise, it will raise Special Attack.
 */
export class DownloadAbAttr extends PostSummonAbAttr {
  /**
   * @param pokemon The {@linkcode Pokemon} with this ability
   * @returns Returns `true` if ability is used successful, `false` if not.
   */
  public override apply(pokemon: Pokemon, simulated: boolean): void {
    if (simulated) {
      return;
    }

    const oppDef = this.getTotalOpposingDefensiveStat(pokemon, Stat.DEF);
    const oppSpDef = this.getTotalOpposingDefensiveStat(pokemon, Stat.SPDEF);
    const statToBoost = oppDef < oppSpDef ? Stat.ATK : Stat.SPATK;

    globalScene.phaseManager.createAndUnshiftPhase(
      "StatStageChangePhase",
      pokemon.getBattlerIndex(),
      pokemon,
      [statToBoost],
      1,
    );
  }

  public override canApply(...[pokemon]: Parameters<this["apply"]>): boolean {
    return pokemon.getOpponents().length > 0;
  }

  /**
   * @param pokemon - The {@linkcode Pokemon} applying this attribute's effect
   * @param stat - The {@linkcode Stat} to evaluate
   * @returns The combined effective stat of the given Pokemon's opponents for the given stat.
   */
  private getTotalOpposingDefensiveStat(pokemon: Pokemon, stat: typeof Stat.DEF | typeof Stat.SPDEF): number {
    return pokemon
      .getOpponents()
      .reduce(
        (totalStat, opp) => totalStat + opp.getEffectiveStat(stat, { abilityApplyMode: AbilityApplyMode.IGNORE }),
        0,
      );
  }
}
