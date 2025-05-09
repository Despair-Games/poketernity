import { PostFaintAbAttr } from "#abilities/post-faint-ab-attr";
import { getPokemonNameWithAffix } from "#app/messages";
import { HitResult } from "#enums/hit-result";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import i18next from "i18next";

/**
 * Attribute used for abilities (Innards Out) that damage the opponent based on how much HP the last attack used to knock out the owner of the ability.
 * @extends PostFaintAbAttr
 */
export class PostFaintHPDamageAbAttr extends PostFaintAbAttr {
  override apply(pokemon: Pokemon, simulated: boolean, attacker?: Pokemon, move?: Move): boolean {
    if (!move || !attacker || !attacker.isOnField()) {
      return false;
    }

    if (!simulated) {
      //If the mon didn't die to indirect damage
      const damage = pokemon.turnData.attacksReceived[0].damage;
      attacker.damageAndUpdate(damage, { result: HitResult.OTHER });
    }
    return true;
  }

  override getTriggerMessage(pokemon: Pokemon, abilityName: string, ..._args: any[]): string {
    return i18next.t("abilityTriggers:postFaintHpDamage", {
      pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
      abilityName,
    });
  }
}
