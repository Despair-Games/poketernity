import { AbilityBattlerTag } from "#app/data/battler-tags/ability-battler-tag";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import type { MovePhase } from "#app/phases/move-phase";
import { ShowAbilityPhase } from "#app/phases/show-ability-phase";
import { AbilityId } from "#enums/ability-id";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import i18next from "i18next";

/**
 * Tag representing the effects of {@link https://bulbapedia.bulbagarden.net/wiki/Truant_(Ability) | Truant}.
 * Prevents the owner from using a move every other turn.
 * @extends AbilityBattlerTag
 */
export class TruantTag extends AbilityBattlerTag {
  constructor() {
    super(BattlerTagType.TRUANT, AbilityId.TRUANT, BattlerTagLapseType.MOVE, 1);
  }

  override lapse(pokemon: Pokemon, lapseType: BattlerTagLapseType): boolean {
    if (!pokemon.hasAbility(AbilityId.TRUANT)) {
      return super.lapse(pokemon, lapseType);
    }
    const passive = pokemon.getAbility().id !== AbilityId.TRUANT;

    const lastMove = pokemon.getLastXMoves().find(() => true);

    if (lastMove && lastMove.move.id !== MoveId.NONE) {
      globalScene.getCurrentPhase<MovePhase>()?.cancel();
      globalScene.unshiftPhase(new ShowAbilityPhase(pokemon.id, passive));
      globalScene.queueMessage(
        i18next.t("battlerTags:truantLapse", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
      );
    }

    return true;
  }
}
