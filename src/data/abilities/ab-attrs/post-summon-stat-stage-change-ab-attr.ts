import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import type { IntimidateImmunityAbAttr } from "#abilities/intimidate-immunity-ab-attr";
import type { PostIntimidateStatStageChangeAbAttr } from "#abilities/post-intimidate-stat-stage-change-ab-attr";
import { PostSummonAbAttr } from "#abilities/post-summon-ab-attr";
import { globalScene } from "#app/global-scene";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { BattleStat } from "#enums/stat";
import type { Pokemon } from "#field/pokemon";
import { StatStageChangePhase } from "#phases/stat-stage-change-phase";
import { BooleanHolder } from "#utils/common-utils";

export class PostSummonStatStageChangeAbAttr extends PostSummonAbAttr {
  private readonly stats: BattleStat[];
  private readonly stages: number;
  private readonly selfTarget: boolean;
  private readonly intimidate: boolean;

  constructor(stats: BattleStat[], stages: number, selfTarget: boolean = false, intimidate: boolean = false) {
    super(true, true);

    this.stats = stats;
    this.stages = stages;
    this.selfTarget = selfTarget;
    this.intimidate = intimidate;
  }

  public override apply(pokemon: Pokemon, simulated: boolean): boolean {
    if (simulated) {
      return true;
    }

    const { phaseManager } = globalScene;

    if (this.selfTarget) {
      phaseManager.unshiftPhase(new StatStageChangePhase(pokemon.getBattlerIndex(), pokemon, this.stats, this.stages));
      return true;
    }

    for (const opponent of pokemon.getOpponents()) {
      const cancelled = new BooleanHolder(false);
      if (this.intimidate) {
        if (opponent.hasTag(BattlerTagType.SUBSTITUTE)) {
          continue;
        }

        applyAbAttrs<IntimidateImmunityAbAttr>(AbAttrFlag.INTIMIDATE_IMMUNITY, opponent, simulated, cancelled);
      }

      if (!cancelled.value) {
        phaseManager.unshiftPhase(
          new StatStageChangePhase(opponent.getBattlerIndex(), pokemon, this.stats, this.stages),
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
    return true;
  }
}
