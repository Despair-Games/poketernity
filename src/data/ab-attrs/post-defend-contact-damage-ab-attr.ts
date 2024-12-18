import type Move from "#app/data/move";
import { MoveFlags } from "#app/data/move";
import type { Pokemon } from "#app/field/pokemon";
import { HitResult } from "#app/field/pokemon";
import { getPokemonNameWithAffix } from "#app/messages";
import { toDmgValue } from "#app/utils";
import i18next from "i18next";
import { BlockNonDirectDamageAbAttr } from "./block-non-direct-damage-ab-attr";
import { PostDefendAbAttr } from "./post-defend-ab-attr";

export class PostDefendContactDamageAbAttr extends PostDefendAbAttr {
  private damageRatio: number;

  constructor(damageRatio: number) {
    super();

    this.damageRatio = damageRatio;
  }

  override applyPostDefend(
    pokemon: Pokemon,
    _passive: boolean,
    simulated: boolean,
    attacker: Pokemon,
    move: Move,
    _hitResult: HitResult,
    _args: any[],
  ): boolean {
    if (
      !simulated
      && move.checkFlag(MoveFlags.MAKES_CONTACT, attacker, pokemon)
      && !attacker.hasAbilityWithAttr(BlockNonDirectDamageAbAttr)
    ) {
      attacker.damageAndUpdate(toDmgValue(attacker.getMaxHp() * (1 / this.damageRatio)), HitResult.OTHER);
      // TODO: This should be handled by `damage()`
      attacker.turnData.damageTaken += toDmgValue(attacker.getMaxHp() * (1 / this.damageRatio));
      return true;
    }

    return false;
  }

  override getTriggerMessage(pokemon: Pokemon, abilityName: string, ..._args: any[]): string {
    return i18next.t("abilityTriggers:postDefendContactDamage", {
      pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
      abilityName,
    });
  }
}
