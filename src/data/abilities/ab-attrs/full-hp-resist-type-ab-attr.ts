import { PreDefendAbAttr } from "#abilities/pre-defend-ab-attr";
import { getPokemonNameWithAffix } from "#app/messages";
import { FixedDamageAttr } from "#moves/fixed-damage-attr";
import type { FullHpResistTypeAbAttrParams } from "#types/ab-attr-param-types";
import i18next from "i18next";

/**
 * When the source is at full HP, incoming attacks will have a maximum `0.5x` type effectiveness multiplier.
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Tera_Shell_(Ability)}
 */
export class FullHpResistTypeAbAttr extends PreDefendAbAttr {
  protected override readonly abAttrKey = "FullHpResistTypeAbAttr";

  constructor() {
    super(true);
  }

  public override apply({ pokemon, simulated, typeMultiplier }: FullHpResistTypeAbAttrParams): void {
    typeMultiplier.value = 0.5;
    if (!simulated) {
      pokemon.turnData.moveEffectiveness = 0.5;
    }
  }

  public override canApply({ pokemon, move, typeMultiplier }: Parameters<this["apply"]>[0]): boolean {
    return pokemon.isFullHp() && typeMultiplier.value > 0.5 && !move.hasAttr(FixedDamageAttr);
  }

  public override getTriggerMessage({ pokemon }: Parameters<this["apply"]>[0], _abilityName: string): string {
    return i18next.t("abilityTriggers:fullHpResistType", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) });
  }
}
