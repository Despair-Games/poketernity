import { AbAttr } from "#abilities/ab-attr";
import { StatusEffect } from "#enums/status-effect";
import type { SynchronizeStatusAbAttrParams } from "#types/ab-attr-param-types";

/** All status effects that can be transferred by Synchronize */
const syncStatuses = Object.freeze<ReadonlySet<StatusEffect>>(
  new Set([StatusEffect.BURN, StatusEffect.PARALYSIS, StatusEffect.POISON, StatusEffect.TOXIC]),
);

/**
 * If another Pokemon burns, paralyzes, poisons, or badly poisons this Pokemon,
 * that Pokemon receives the same non-volatile status condition.
 * @see {@linkcode https://bulbapedia.bulbagarden.net/wiki/Synchronize_(Ability) | Synchronize (Bulbapedia)}
 */
export class SynchronizeStatusAbAttr extends AbAttr {
  protected override readonly abAttrKey = "SynchronizeStatusAbAttr";

  constructor() {
    super(true);
  }

  public override apply({ pokemon, simulated, source, effect }: SynchronizeStatusAbAttrParams): void {
    if (!simulated) {
      source.trySetStatus(effect, true, pokemon);
    }
  }

  public override canApply({ source, effect }: Parameters<this["apply"]>[0]): boolean {
    // Synchronize is meant to activate even if the status effect cannot be applied to the source,
    // hence `canSetStatus` not being checked here.
    return source != null && syncStatuses.has(effect);
  }
}
