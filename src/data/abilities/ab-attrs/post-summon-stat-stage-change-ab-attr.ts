import type { IntimidateImmunityAbAttr } from "#app/data/abilities/ab-attrs/intimidate-immunity-ab-attr";
import type { PostIntimidateStatStageChangeAbAttr } from "#app/data/abilities/ab-attrs/post-intimidate-stat-stage-change-ab-attr";
import { PostSummonAbAttr } from "#app/data/abilities/ab-attrs/post-summon-ab-attr";
import { applyAbAttrs } from "#app/data/abilities/apply-ab-attrs";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { StatStageChangePhase } from "#app/phases/stat-stage-change-phase";
import { BooleanHolder } from "#app/utils";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { BattleStat } from "#enums/stat";

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

  override apply(pokemon: Pokemon, simulated: boolean): boolean {
    if (simulated) {
      return true;
    }

    if (this.selfTarget) {
      // we unshift the StatStageChangePhase to put it right after the showAbility and not at the end of the
      // phase list (which could be after CommandPhase for example)
      globalScene.unshiftPhase(new StatStageChangePhase(pokemon.getBattlerIndex(), pokemon, this.stats, this.stages));
      return true;
    }
    for (const opponent of pokemon.getOpponents()) {
      const cancelled = new BooleanHolder(false);
      if (this.intimidate) {
        applyAbAttrs<IntimidateImmunityAbAttr>(AbAttrFlag.INITIMIDATE_IMMUNITY, opponent, simulated, cancelled);
        applyAbAttrs<PostIntimidateStatStageChangeAbAttr>(
          AbAttrFlag.POST_INTIMIDATE_STAT_STAGE_CHANGE,
          opponent,
          simulated,
          cancelled,
        );

        if (opponent.getTag(BattlerTagType.SUBSTITUTE)) {
          cancelled.value = true;
        }
      }
      if (!cancelled.value) {
        globalScene.unshiftPhase(
          new StatStageChangePhase(opponent.getBattlerIndex(), pokemon, this.stats, this.stages),
        );
      }
    }
    return true;
  }
}
