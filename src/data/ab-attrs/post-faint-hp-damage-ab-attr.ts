import type Move from "#app/data/move";
import type Pokemon from "#app/field/pokemon";
import { HitResult } from "#app/field/pokemon";
import { getPokemonNameWithAffix } from "#app/messages";
import i18next from "i18next";
import { PostFaintAbAttr } from "./post-faint-ab-attr";

/**
 * Attribute used for abilities (Innards Out) that damage the opponent based on how much HP the last attack used to knock out the owner of the ability.
 */
export class PostFaintHPDamageAbAttr extends PostFaintAbAttr {
  constructor() {
    super();
  }

  override applyPostFaint(
    pokemon: Pokemon,
    _passive: boolean,
    simulated: boolean,
    attacker?: Pokemon,
    move?: Move,
    _hitResult?: HitResult,
    ..._args: any[]
  ): boolean {
    if (move !== undefined && attacker !== undefined && !simulated) {
      //If the mon didn't die to indirect damage
      const damage = pokemon.turnData.attacksReceived[0].damage;
      attacker.damageAndUpdate(damage, HitResult.OTHER);
      attacker.turnData.damageTaken += damage;
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
