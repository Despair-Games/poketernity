import type { AbilityId } from "#enums/ability-id";
import type { ElementalType } from "#enums/elemental-type";
import { isNullOrUndefined } from "#app/utils";
import type { Nature } from "#enums/nature";

/**
 * Data that can customize a Pokemon in non-standard ways from its Species
 * Currently only used by Mystery Encounters and Mints.
 */
export class CustomPokemonData {
  public spriteScale: number;
  public ability: AbilityId | -1;
  public passive: AbilityId | -1;
  public nature: Nature | -1;
  public types: ElementalType[];

  constructor(data?: CustomPokemonData | Partial<CustomPokemonData>) {
    if (!isNullOrUndefined(data)) {
      Object.assign(this, data);
    }

    this.spriteScale = this.spriteScale ?? -1;
    this.ability = this.ability ?? -1;
    this.passive = this.passive ?? -1;
    this.nature = this.nature ?? -1;
    this.types = this.types ?? [];
  }
}
