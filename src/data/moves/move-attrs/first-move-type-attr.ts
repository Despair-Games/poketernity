import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { ElementalType } from "#enums/elemental-type";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveEffectAttr } from "#moves/move-effect-attr";
import i18next from "i18next";

/**
 * Attribute to change the user's type to match that of the first move in its moveset.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Conversion_(move) | Conversion}.
 */
export class FirstMoveTypeAttr extends MoveEffectAttr {
  constructor() {
    super(true);
  }

  override applyEffect(user: Pokemon, target: Pokemon, _move: Move): boolean {
    const firstMoveType = target.getMoveset()[0].getMove().type;
    user.setTemporaryTypes(firstMoveType);
    globalScene.phaseManager.queueMessagePhase(
      i18next.t("battle:transformedIntoType", {
        pokemonName: getPokemonNameWithAffix(user),
        type: i18next.t(`pokemonInfo:Type.${ElementalType[firstMoveType]}`),
      }),
    );

    return true;
  }
}
