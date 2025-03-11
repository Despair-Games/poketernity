import type { Move } from "#app/data/moves/move";
import { MoveFlags } from "#enums/move-flags";
import type { Pokemon } from "#app/field/pokemon";
import { getPokemonNameWithAffix } from "#app/messages";
import { BattlerTagType } from "#enums/battler-tag-type";
import i18next from "i18next";
import { PostDefendAbAttr } from "./post-defend-ab-attr";

/**
 * This ability applies the Perish Song tag to the attacking pokemon
 * and the defending pokemon if the move makes physical contact and
 * at least one pokemon doesn't already have the Perish Song tag.
 * @extends PostDefendAbAttr
 */
export class PostDefendPerishSongAbAttr extends PostDefendAbAttr {
  override apply(pokemon: Pokemon, simulated: boolean, attacker: Pokemon, move: Move): boolean {
    if (move.checkFlag(MoveFlags.MAKES_CONTACT, attacker, pokemon)) {
      if (attacker.getTag(BattlerTagType.PERISH_SONG)) {
        return false;
      } else {
        if (!simulated) {
          attacker.addTag(BattlerTagType.PERISH_SONG, 4);
          pokemon.addTag(BattlerTagType.PERISH_SONG, 4);
        }
        return true;
      }
    }
    return false;
  }

  override getTriggerMessage(pokemon: Pokemon, abilityName: string, ..._args: any[]): string {
    return i18next.t("abilityTriggers:perishBody", {
      pokemonName: getPokemonNameWithAffix(pokemon),
      abilityName: abilityName,
    });
  }
}
