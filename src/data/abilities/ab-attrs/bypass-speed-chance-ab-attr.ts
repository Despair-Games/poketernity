import { AbAttr } from "#abilities/ab-attr";
import { getPokemonNameWithAffix } from "#app/messages";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import i18next from "i18next";

/**
 * If a Pokémon with this Ability selects a damaging move, it has a 30% chance of going first in its priority bracket.
 * If the Ability activates, this is announced at the start of the turn (after move selection).
 */
export class BypassSpeedChanceAbAttr extends AbAttr {
  protected override readonly abAttrKey = "BypassSpeedChanceAbAttr";
  /** The percent chance for this effect to apply */
  public readonly chance: number;

  constructor(chance: number) {
    super(true);
    this.chance = chance;
  }

  public override apply(pokemon: Pokemon, simulated: boolean, _move: Move): void {
    if (!simulated && pokemon.randSeedInt(100) < this.chance) {
      pokemon.addTag(BattlerTagType.BYPASS_SPEED);
    }
  }

  public override canApply(...[, , move]: Parameters<this["apply"]>): boolean {
    return move.isAttackMove();
  }

  public override getTriggerMessage(pokemon: Pokemon, _abilityName: string): string {
    return i18next.t("abilityTriggers:quickDraw", { pokemonName: getPokemonNameWithAffix(pokemon) });
  }
}
