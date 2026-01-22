import { AbAttr } from "#abilities/ab-attr";
import { getPokemonNameWithAffix } from "#app/messages";
import type { FieldPreventExplosionLikeAbAttrParams } from "#types/ab-attr-param-types";
import i18next from "i18next";

/**
 * Prevents the use of self-KO explosion moves and the activation of the ability Aftermath while the ability holder is on the field.
 *
 * Moves prevented include Self-Destruct, Explosion, Mind Blown, and Misty Explosion
 *
 * The ability Aftermath's Japanese name means `Induced Explosion` which is why it is included here.
 *
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Damp_(Ability) | Damp (Bulbapedia)}
 */
export class FieldPreventExplosionLikeAbAttr extends AbAttr {
  protected override readonly abAttrKey = "FieldPreventExplosionLikeAbAttr";

  constructor() {
    super(true);
  }

  public override apply({ cancelled }: FieldPreventExplosionLikeAbAttrParams): void {
    cancelled.value = true;
  }

  /**
   * UNUSED - Can be used once move conditional checking differentiates between simulated and non-simulated checks
   *
   * Returns an ability activation message in cases where Damp prevents the usage of a move
   * @returns the appropriate trigger message or null
   */
  public override getTriggerMessage({ attacker, move }: Parameters<this["apply"]>[0]): string | null {
    return null;

    // biome-ignore lint/correctness/noUnreachable: to be implemented later
    const pokemonName = getPokemonNameWithAffix(attacker);
    const moveName = attacker.getPokemonMove(move.id)?.name ?? move.name;
    return i18next.t("moveTriggers:cannotUseMove", { pokemonName, moveName });
  }
}
