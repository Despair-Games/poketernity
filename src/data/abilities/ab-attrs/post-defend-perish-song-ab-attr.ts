import { PostDefendAbAttr } from "#abilities/post-defend-ab-attr";
import { getPokemonNameWithAffix } from "#app/messages";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveFlags } from "#enums/move-flags";
import type { PostDefendAbAttrParams } from "#types/ab-attr-param-types";
import i18next from "i18next";

/**
 * This ability applies the Perish Song tag to the attacking pokemon
 * and the defending pokemon if the move makes physical contact and
 * the attacker doesn't already have the Perish Song tag.
 */
export class PostDefendPerishSongAbAttr extends PostDefendAbAttr {
  public override apply({ pokemon, simulated, attacker }: PostDefendAbAttrParams): void {
    if (!simulated) {
      attacker.addTag(BattlerTagType.PERISH_SONG, 4);
      pokemon.addTag(BattlerTagType.PERISH_SONG, 4);
    }
  }

  public override canApply({ pokemon, attacker, move }: Parameters<this["apply"]>[0]): boolean {
    return move.checkFlag(MoveFlags.MAKES_CONTACT, attacker, pokemon) && attacker.canAddTag(BattlerTagType.PERISH_SONG);
  }

  public override getTriggerMessage({ pokemon }: Parameters<this["apply"]>[0], abilityName: string): string {
    return i18next.t("abilityTriggers:perishBody", { pokemonName: getPokemonNameWithAffix(pokemon), abilityName });
  }
}
