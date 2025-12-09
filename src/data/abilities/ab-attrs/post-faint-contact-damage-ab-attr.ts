import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import { PostFaintAbAttr } from "#abilities/post-faint-ab-attr";
import { getPokemonNameWithAffix } from "#app/messages";
import { HitResult } from "#enums/hit-result";
import { MoveFlags } from "#enums/move-flags";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { toDmgValue, ValueHolder } from "#utils/common-utils";
import { inSpeedOrder } from "#utils/speed-order-generator";
import i18next from "i18next";

/**
 * Attribute that damages an attacker for a fraction of its HP if the attacker KO's the user with a contact move.
 *
 * Currently used by the ability Aftermath (Inflicts 1/4 of the attacker's HP in damage).
 */
export class PostFaintContactDamageAbAttr extends PostFaintAbAttr {
  /**
   * The denominator for the damage ratio (e.g., if this equals 4, the ability inflicts 1/4 of the attacker's HP in damage)
   */
  private readonly damageRatio: number;

  constructor(damageRatio: number) {
    super();

    this.damageRatio = damageRatio;
  }

  public override apply(_pokemon: Pokemon, simulated: boolean, attacker?: Pokemon, move?: Move): void {
    if (simulated || attacker == null || move == null) {
      return;
    }

    const abilityDamage = toDmgValue(attacker.getMaxHp() * (1 / this.damageRatio));
    attacker.damageAndUpdate(abilityDamage, {
      result: HitResult.OTHER,
      preventEndure: true,
    });
  }

  public override canApply(...[pokemon, simulated, attacker, move]: Parameters<this["apply"]>): boolean {
    if (move == null || attacker == null || !move.checkFlag(MoveFlags.MAKES_CONTACT, attacker, pokemon)) {
      return false;
    }

    const cancelled = new ValueHolder(false);
    const moveName = pokemon.getPokemonMove(move.id)?.name ?? move.name;
    for (const p of inSpeedOrder()) {
      applyAbAttrs(
        "FieldPreventExplosionLikeAbAttr",
        p,
        simulated,
        cancelled,
        getPokemonNameWithAffix(attacker),
        moveName,
      );

      if (cancelled.value) {
        break;
      }
    }

    applyAbAttrs("BlockNonDirectDamageAbAttr", attacker, simulated, cancelled);

    return !cancelled.value;
  }

  public override getTriggerMessage(pokemon: Pokemon, abilityName: string): string {
    return i18next.t("abilityTriggers:postFaintContactDamage", {
      pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
      abilityName,
    });
  }
}
