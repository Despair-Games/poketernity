import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import type { ExposedTag } from "#battler-tags/exposed-tag";
import { getBattlerTag } from "#battler-tags/get-battler-tag";
import { MINOR_EFFECT_SCORE_BONUS } from "#constants/ai-constants";
import type { BattlerTagType } from "#enums/battler-tag-type";
import { Stat } from "#enums/stat";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import { AddBattlerTagAttr } from "#moves/add-battler-tag-attr";
import type { Move } from "#moves/move";
import i18next from "i18next";

/**
 * Drops the target's immunity to types it is immune to
 * and makes its evasiveness be ignored during accuracy
 * checks.
 * Used by: {@linkcode MoveId.ODOR_SLEUTH | Odor Sleuth}, {@linkcode MoveId.MIRACLE_EYE | Miracle Eye} and {@linkcode MoveId.FORESIGHT | Foresight}
 */
export class ExposedMoveAttr extends AddBattlerTagAttr {
  constructor(tagType: BattlerTagType) {
    super(tagType, false, { failOnOverlap: true });
  }

  override applyEffect(user: Pokemon, target: Pokemon, move: Move): boolean {
    if (!super.applyEffect(user, target, move)) {
      return false;
    }

    globalScene.phaseManager.createAndUnshiftPhase(
      "MessagePhase",
      i18next.t("moveTriggers:exposedMove", {
        pokemonName: getPokemonNameWithAffix(user),
        targetPokemonName: getPokemonNameWithAffix(target),
      }),
    );

    return true;
  }

  /**
   * Grants an Effect Score bonus based on the following:
   * - If the user or its ally has a move that would bypass a type immunity from the target
   * because of this effect, this grants a {@link MINOR_EFFECT_SCORE_BONUS | minor bonus}.
   * - Otherwise, if the target's evasiveness stat is above 0 stages, this grants 50%(+1).
   * @todo Move types are only derived from their base type, not {@linkcode Pokemon.getMoveType}
   */
  public override getRawEffectScore(user: EnemyPokemon, target: Pokemon, move: Move): number {
    const stubTag = getBattlerTag(this.tagType, 0, move.id, 0) as ExposedTag;
    const targetTypes = target.getTypes(true, true);
    const allyAttacks = user.getField().flatMap((p) => p.getAttackMoves(true));

    for (const t of targetTypes) {
      if (allyAttacks.some((mv) => stubTag.ignoreImmunity(t, mv.type))) {
        return MINOR_EFFECT_SCORE_BONUS;
      }
    }

    const targetHasEvaBoost = target.getStatStage(Stat.EVA) > 0;
    return targetHasEvaBoost ? this.getRandomScore(user, 50) : 0;
  }
}
