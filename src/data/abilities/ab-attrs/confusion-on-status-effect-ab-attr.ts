import { AbAttr } from "#abilities/ab-attr";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { StatusEffect } from "#enums/status-effect";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";

/**
 * This attribute applies confusion to the target whenever the user
 * directly poisons them with a move, e.g. Poison Puppeteer.
 * Called in {@linkcode StatusEffectAttr}.
 * @see {@linkcode applyPostAttack}
 */
export class ConfusionOnStatusEffectAbAttr extends AbAttr {
  protected override readonly abAttrKey = "ConfusionOnStatusEffectAbAttr";
  /** List of effects to apply confusion after */
  private readonly effects: StatusEffect[];

  constructor(...effects: StatusEffect[]) {
    /** This effect does not require a damaging move */
    super(false);
    this.effects = effects;
  }

  /**
   * Applies confusion to the target pokemon.
   * @param pokemon {@link Pokemon} attacking
   * @param simulated if `true`, suppresses changes to game state
   * @param defender {@link Pokemon} defending
   * @param move {@link Move} used to apply status effect and confusion
   * @param effect {@linkcode StatusEffect} applied by move
   * @returns true if defender is confused
   */
  public override apply(pokemon: Pokemon, simulated: boolean, defender: Pokemon, _effect: StatusEffect): void {
    if (!simulated) {
      defender.addTag(BattlerTagType.CONFUSED, pokemon.randSeedIntRange(2, 5), undefined, defender.id);
    }
  }

  public override canApply(...params: Parameters<this["apply"]>): boolean {
    const [, , defender, effect] = params;
    return (
      super.canApply(...params)
      && this.effects.includes(effect)
      && !defender.isFainted()
      && defender.canAddTag(BattlerTagType.CONFUSED)
    );
  }
}
