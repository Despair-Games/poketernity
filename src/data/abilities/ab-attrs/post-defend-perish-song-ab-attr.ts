import { PostDefendAbAttr } from "#abilities/post-defend-ab-attr";
import { getPokemonNameWithAffix } from "#app/messages";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveFlags } from "#enums/move-flags";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import i18next from "i18next";

/**
 * This ability applies the Perish Song tag to the attacking pokemon
 * and the defending pokemon if the move makes physical contact and
 * the attacker doesn't already have the Perish Song tag.
 */
export class PostDefendPerishSongAbAttr extends PostDefendAbAttr {
  public override apply(pokemon: Pokemon, simulated: boolean, attacker: Pokemon, move: Move): boolean {
    if (move.checkFlag(MoveFlags.MAKES_CONTACT, attacker, pokemon)) {
      if (attacker.hasTag(BattlerTagType.PERISH_SONG)) {
        return false;
      }

      if (!simulated) {
        attacker.addTag(BattlerTagType.PERISH_SONG, 4);
        pokemon.addTag(BattlerTagType.PERISH_SONG, 4);
      }
      return true;
    }
    return false;
  }

  public override getTriggerMessage(pokemon: Pokemon, abilityName: string): string {
    return i18next.t("abilityTriggers:perishBody", {
      pokemonName: getPokemonNameWithAffix(pokemon),
      abilityName: abilityName,
    });
  }
}
