import { applyAbAttrs } from "#app/data/ability";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { StatStageChangePhase } from "#app/phases/stat-stage-change-phase";
import { BooleanHolder } from "#app/utils";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { BattleStat } from "#enums/stat";
import { IntimidateImmunityAbAttr } from "./intimidate-immunity-ab-attr";
import { PostIntimidateStatStageChangeAbAttr } from "./post-intimidate-stat-stage-change-ab-attr";
import { PostSummonAbAttr } from "./post-summon-ab-attr";

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
      globalScene.unshiftPhase(new StatStageChangePhase(pokemon.getBattlerIndex(), true, this.stats, this.stages));
      return true;
    }
    for (const opponent of pokemon.getOpponents()) {
      const cancelled = new BooleanHolder(false);
      if (this.intimidate) {
        applyAbAttrs(IntimidateImmunityAbAttr, opponent, simulated, cancelled);
        applyAbAttrs(PostIntimidateStatStageChangeAbAttr, opponent, simulated, cancelled);

        if (opponent.getTag(BattlerTagType.SUBSTITUTE)) {
          cancelled.value = true;
        }
      }
      if (!cancelled.value) {
        globalScene.unshiftPhase(new StatStageChangePhase(opponent.getBattlerIndex(), false, this.stats, this.stages));
      }
    }
    return true;
  }
}
