import { Type } from "#enums/type";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import i18next from "i18next";
import type { Move } from "#app/data/move";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";

/**
 * Attribute to change the user's type to match that of the first move in its moveset.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Conversion_(move) Conversion}.
 * @extends MoveEffectAttr
 */
export class FirstMoveTypeAttr extends MoveEffectAttr {
  constructor() {
    super(true);
  }

  /** Changes the user's type to match that of the first move in its moveset */
  override apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    if (!super.apply(user, target, move)) {
      return false;
    }

    const firstMoveType = target.getMoveset()[0].getMove().type;
    user.summonData.types = [firstMoveType];
    globalScene.queueMessage(
      i18next.t("battle:transformedIntoType", {
        pokemonName: getPokemonNameWithAffix(user),
        type: i18next.t(`pokemonInfo:Type.${Type[firstMoveType]}`),
      }),
    );

    return true;
  }
}
