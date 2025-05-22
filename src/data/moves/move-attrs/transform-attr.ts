import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { SemiInvulnerableTag } from "#battler-tags/semi-invulnerable-tag";
import { SEMI_INVULNERABLE_BATTLER_TAG_TYPES } from "#constants/battler-tag-constants";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveEffectAttr } from "#moves/move-effect-attr";
import { PokemonTransformPhase } from "#phases/pokemon-transform-phase";
import i18next from "i18next";

/**
 * Attribute to transform the user into the target,
 * copying its species, form, ability, moveset, and stats (except for HP).
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Transform_(move) | Transform}.
 * @extends MoveEffectAttr
 * @see {@linkcode PokemonTransformPhase}
 */
export class TransformAttr extends MoveEffectAttr {
  override applyEffect(user: Pokemon, target: Pokemon, move: Move): boolean {
    if (!canTransform(user, target)) {
      return false;
    }
    globalScene.phaseManager.unshiftPhase(new PokemonTransformPhase(user.getBattlerIndex(), target.getBattlerIndex()));
    user.addTag(BattlerTagType.TRANSFORMED, 0, move.id, user.id);

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
 * Helper function to check if a transform is valid
 * @param user the Pokemon doing the transforming
 * @param target the Pokemon that is the target of transform
 * @returns whether or not the transform succeeds
 */
export function canTransform(user: Pokemon, target: Pokemon): boolean {
  console.log("user transformed: ", user.hasTag(BattlerTagType.TRANSFORMED));
  console.log("target transformed: ", target.hasTag(BattlerTagType.TRANSFORMED));
  if (
    user.hasTag(BattlerTagType.TRANSFORMED)
    || target.hasTag(BattlerTagType.TRANSFORMED)
    || target.hasTag(...SEMI_INVULNERABLE_BATTLER_TAG_TYPES)
    || target.hasTag(BattlerTagType.SUBSTITUTE)
  ) {
    console.log("can transform false");
    return false;
  }
  console.log("can transform true");
  return true;
}
