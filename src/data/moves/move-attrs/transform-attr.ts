import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { SEMI_INVULNERABLE_BATTLER_TAG_TYPES } from "#constants/battler-tag-constants";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveEffectAttr } from "#moves/move-effect-attr";
import { PokemonTransformPhase } from "#phases/pokemon-transform-phase";
import type { MoveConditionFunc } from "#types/move-condition-func";
import i18next from "i18next";

/**
 * Attribute to transform the user into the target,
 * copying its species, form, ability, moveset, and stats (except for HP).
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Transform_(move) | Transform}.
 * @see {@linkcode PokemonTransformPhase}
 */
export class TransformAttr extends MoveEffectAttr {
  override getCondition(): MoveConditionFunc {
    /**
     * Only works if
     * - The user and target are both not already transformed
     * - The target is not semi invulnerable
     * - The target is not behind a substitute
     */
    return (user, target, _move) => canTransform(user, target);
  }

  override applyEffect(user: Pokemon, target: Pokemon, move: Move): boolean {
    if (!canTransform(user, target)) {
      return false;
    }
    globalScene.phaseManager.unshiftPhase(new PokemonTransformPhase(user.getBattlerIndex(), target.getBattlerIndex()));
    user.addTag(BattlerTagType.TRANSFORMED, 1, move.id, user.id);

    globalScene.phaseManager.queueMessagePhase(
      i18next.t("moveTriggers:transformedIntoTarget", {
        pokemonName: getPokemonNameWithAffix(user),
        targetName: getPokemonNameWithAffix(target),
      }),
    );

    return true;
  }
}

/**
 * Helper function to check if a transform is valid.
 * Transform fails if the target is transformed, behind a substitute, or semi-invulnerable
 * @param user the Pokemon doing the transforming
 * @param target the Pokemon that is the target of transform
 * @returns whether or not the transform succeeds
 */
export function canTransform(user: Pokemon, target: Pokemon): boolean {
  return (
    !user.hasTag(BattlerTagType.TRANSFORMED)
    || target.hasTag(
      BattlerTagType.TRANSFORMED,
      BattlerTagType.SUBSTITUTE,
      BattlerTagType.SKY_DROP, // Sky drop is not part of the semi invuln tag array at the moment
      ...SEMI_INVULNERABLE_BATTLER_TAG_TYPES,
    )
  );
}
