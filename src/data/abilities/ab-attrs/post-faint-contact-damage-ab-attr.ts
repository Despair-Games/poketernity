import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import type { BlockNonDirectDamageAbAttr } from "#abilities/block-non-direct-damage-ab-attr";
import type { FieldPreventExplosionLikeAbAttr } from "#abilities/field-prevent-explosion-like-ab-attr";
import { PostFaintAbAttr } from "#abilities/post-faint-ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { HitResult } from "#enums/hit-result";
import { MoveFlags } from "#enums/move-flags";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { BooleanHolder, toDmgValue } from "#utils/common-utils";
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

  override apply(pokemon: Pokemon, simulated: boolean, attacker?: Pokemon, move?: Move): boolean {
    if (move && attacker && move.checkFlag(MoveFlags.MAKES_CONTACT, attacker, pokemon)) {
      //If the mon didn't die to indirect damage
      const cancelled = new BooleanHolder(false);
      globalScene
        .getField(true)
        .map((p) =>
          applyAbAttrs<FieldPreventExplosionLikeAbAttr>(
            AbAttrFlag.FIELD_PREVENT_EXPLOSION_LIKE,
            p,
            simulated,
            cancelled,
            getPokemonNameWithAffix(attacker),
            move.name,
          ),
        );

      applyAbAttrs<BlockNonDirectDamageAbAttr>(AbAttrFlag.BLOCK_NON_DIRECT_DAMAGE, attacker, simulated, cancelled);
      if (cancelled.value) {
        return false;
      }
      if (!simulated) {
        const abilityDamage = toDmgValue(attacker.getMaxHp() * (1 / this.damageRatio));
        attacker.damageAndUpdate(abilityDamage, {
          result: HitResult.OTHER,
          preventEndure: true,
        });
      }
      return true;
    }

    return false;
  }

  override getTriggerMessage(pokemon: Pokemon, abilityName: string, ..._args: any[]): string {
    return i18next.t("abilityTriggers:postFaintContactDamage", {
      pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
      abilityName,
    });
  }
}
