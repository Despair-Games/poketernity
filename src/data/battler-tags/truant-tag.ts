import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { AbilityBattlerTag } from "#battler-tags/ability-battler-tag";
import { AbilityId } from "#enums/ability-id";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import type { Pokemon } from "#field/pokemon";
import type { MovePhase } from "#phases/move-phase";
import { ShowAbilityPhase } from "#phases/show-ability-phase";
import i18next from "i18next";

/**
 * Tag representing the effects of {@link https://bulbapedia.bulbagarden.net/wiki/Truant_(Ability) | Truant}.
 * Prevents the owner from using a move every other turn.
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
      globalScene.phaseManager.getCurrentPhase<MovePhase>()?.cancel();
      globalScene.phaseManager.unshiftPhase(new ShowAbilityPhase(pokemon.id, passive));
      globalScene.phaseManager.queueMessagePhase(
        i18next.t("battlerTags:truantLapse", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
      );
    }

    return true;
  }
}
