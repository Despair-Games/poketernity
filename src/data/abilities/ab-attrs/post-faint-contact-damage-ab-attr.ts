import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import { PostFaintAbAttr } from "#abilities/post-faint-ab-attr";
import { getPokemonNameWithAffix } from "#app/messages";
import { HitResult } from "#enums/hit-result";
import { MoveFlags } from "#enums/move-flags";
import type { PostFaintAbAttrParams } from "#types/ab-attr-param-types";
import { toDmgValue, ValueHolder } from "#utils/common-utils";
import { inSpeedOrder } from "#utils/speed-order-generator";
import i18next from "i18next";

/**
 * Attribute that damages an attacker for a fraction of its HP if the attacker KOs the user with a contact move.
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Aftermath_(Ability) | Aftermath (Bulbapedia)}
 * @privateRemarks
 * Currently can only be used for Aftermath due to the `applyAbAttrs("FieldPreventExplosionLikeAbAttr", ...)`
 */
export class PostFaintContactDamageAbAttr extends PostFaintAbAttr {
  /**
   * The denominator for the damage ratio (e.g., if this equals 4, the ability inflicts 1/4 of the attacker's HP in damage)
   */
  // TODO: change to be the actual ratio instead of just the denominator
  private readonly damageRatio: number;

  constructor(damageRatio: number) {
    super();

    this.damageRatio = damageRatio;
  }

  public override apply({ simulated, attacker, move }: PostFaintAbAttrParams): void {
    if (simulated || attacker == null || move == null) {
      return;
    }

    const abilityDamage = toDmgValue(attacker.getMaxHp() * (1 / this.damageRatio));
    attacker.damageAndUpdate(abilityDamage, { result: HitResult.OTHER, preventEndure: true });
  }

  public override canApply({ pokemon, simulated, attacker, move }: Parameters<this["apply"]>[0]): boolean {
    if (move == null || attacker == null || !move.checkFlag(MoveFlags.MAKES_CONTACT, attacker, pokemon)) {
      return false;
    }

    const cancelled = new ValueHolder(false);
    for (const p of inSpeedOrder()) {
      applyAbAttrs("FieldPreventExplosionLikeAbAttr", { pokemon: p, simulated, cancelled, move, attacker });

      if (cancelled.value) {
        return false;
      }
    }

    applyAbAttrs("BlockNonDirectDamageAbAttr", { pokemon: attacker, simulated, cancelled });

    return !cancelled.value;
  }

  public override getTriggerMessage({ pokemon }: Parameters<this["apply"]>[0], abilityName: string): string {
    return i18next.t("abilityTriggers:postFaintContactDamage", {
      pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
      abilityName,
    });
  }
}
