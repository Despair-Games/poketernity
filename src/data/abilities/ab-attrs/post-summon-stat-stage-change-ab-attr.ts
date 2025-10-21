import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import type { IntimidateImmunityAbAttr } from "#abilities/intimidate-immunity-ab-attr";
import type { PostIntimidateStatStageChangeAbAttr } from "#abilities/post-intimidate-stat-stage-change-ab-attr";
import { PostSummonAbAttr } from "#abilities/post-summon-ab-attr";
import { globalScene } from "#app/global-scene";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { BattleStat } from "#enums/stat";
import type { Pokemon } from "#field/pokemon";
import { ValueHolder } from "#utils/common-utils";
import { inSpeedOrder } from "#utils/speed-order-generator";

export class PostSummonStatStageChangeAbAttr extends PostSummonAbAttr {
  private readonly stats: BattleStat[];
  private readonly stages: number;
  private readonly selfTarget: boolean;
  private readonly intimidate: boolean;

  constructor(stats: BattleStat[], stages: number, selfTarget: boolean = false, intimidate: boolean = false) {
    super();

    this.stats = stats;
    this.stages = stages;
    this.selfTarget = selfTarget;
    this.intimidate = intimidate;
  }

  public override apply(pokemon: Pokemon, simulated: boolean): void {
    if (simulated) {
      return;
    }

    const { phaseManager } = globalScene;

    if (this.selfTarget) {
      phaseManager.createAndUnshiftPhase(
        "StatStageChangePhase",
        pokemon.getBattlerIndex(),
        pokemon,
        this.stats,
        this.stages,
      );
      return;
    }

    for (const opponent of inSpeedOrder(pokemon.getOpposingArenaTagSide())) {
      const cancelled = new ValueHolder(false);
      if (this.intimidate) {
        if (opponent.hasTag(BattlerTagType.SUBSTITUTE)) {
          continue;
        }

        applyAbAttrs<IntimidateImmunityAbAttr>(AbAttrFlag.INTIMIDATE_IMMUNITY, opponent, simulated, cancelled);
      }

      if (!cancelled.value) {
        phaseManager.createAndUnshiftPhase(
          "StatStageChangePhase",
          opponent.getBattlerIndex(),
          pokemon,
          this.stats,
          this.stages,
        );
      }

      if (this.intimidate) {
        applyAbAttrs<PostIntimidateStatStageChangeAbAttr>(
          AbAttrFlag.POST_INTIMIDATE_STAT_STAGE_CHANGE,
          opponent,
          simulated,
        );
      }
    }
  }

  public override canApply(...[pokemon, simulated]: Parameters<this["apply"]>): boolean {
    if (this.selfTarget) {
      return true;
    }

    const opponents = pokemon.getOpponents();
    return opponents.some((opp) => {
      if (opp.hasTag(BattlerTagType.SUBSTITUTE)) {
        return false;
      }

      if (this.intimidate) {
        const cancelled = new ValueHolder(false);
        applyAbAttrs<IntimidateImmunityAbAttr>(AbAttrFlag.INTIMIDATE_IMMUNITY, opp, simulated, cancelled);
        return !cancelled.value;
      }
      return true;
    });
  }
}
