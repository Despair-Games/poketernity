import { PostFaintAbAttr } from "#abilities/post-faint-ab-attr";
import { getPokemonNameWithAffix } from "#app/messages";
import { HitResult } from "#enums/hit-result";
import type { PostFaintAbAttrParams } from "#types/ab-attr-param-types";
import i18next from "i18next";

/**
 * Attribute used for abilities that damage the opponent based on the damage done to the ability holder.
 * @see {@linkcode https://bulbapedia.bulbagarden.net/wiki/Innards_Out_(Ability) | Innards Out (Bulbapedia)}
 */
export class PostFaintHPDamageAbAttr extends PostFaintAbAttr {
  public override apply({ pokemon, simulated, attacker }: PostFaintAbAttrParams): void {
    if (simulated) {
      return;
    }

    const damage = pokemon.turnData.attacksReceived.at(0)?.damage;
    if (!damage) {
      return;
    }

    attacker?.damageAndUpdate(damage, { result: HitResult.OTHER });
  }

  public override canApply({ attacker, move }: Parameters<this["apply"]>[0]): boolean {
    return move != null && attacker != null && attacker.isOnField();
  }

  public override getTriggerMessage({ pokemon }: Parameters<this["apply"]>[0], abilityName: string): string {
    return i18next.t("abilityTriggers:postFaintHpDamage", {
      pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
      abilityName,
    });
  }
}
