import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { PokemonTransformPhase } from "#app/phases/pokemon-transform-phase";
import i18next from "i18next";
import type { Move } from "#app/data/move";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";

/**
 * Attribute to transform the user into the target,
 * copying its species, form, ability, moveset, and stats (except for HP).
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Transform_(move) Transform}.
 * @extends MoveEffectAttr
 * @see {@linkcode PokemonTransformPhase}
 */
export class TransformAttr extends MoveEffectAttr {
  override apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    if (!super.apply(user, target, move)) {
      return false;
    }

    globalScene.unshiftPhase(new PokemonTransformPhase(user.getBattlerIndex(), target.getBattlerIndex()));

    globalScene.queueMessage(
      i18next.t("moveTriggers:transformedIntoTarget", {
        pokemonName: getPokemonNameWithAffix(user),
        targetName: getPokemonNameWithAffix(target),
      }),
    );

    return true;
  }
}
