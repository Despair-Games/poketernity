import type { Move } from "#app/data/moves/move";
import type { Pokemon } from "#app/field/pokemon";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { StatusEffect } from "#enums/status-effect";
import { PostAttackAbAttr } from "./post-attack-ab-attr";

/**
 * This attribute applies confusion to the target whenever the user
 * directly poisons them with a move, e.g. Poison Puppeteer.
 * Called in {@linkcode StatusEffectAttr}.
 * @extends PostAttackAbAttr
 * @see {@linkcode applyPostAttack}
 */
export class ConfusionOnStatusEffectAbAttr extends PostAttackAbAttr {
  /** List of effects to apply confusion after */
  private readonly effects: StatusEffect[];

  constructor(...effects: StatusEffect[]) {
    /** This effect does not require a damaging move */
    super(false);
    this._flags.add(AbAttrFlag.CONFUSION_ON_STATUS_EFFECT);
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
  override applyPostAttack(
    pokemon: Pokemon,
    simulated: boolean,
    defender: Pokemon,
    move: Move,
    effect: StatusEffect,
  ): boolean {
    if (this.effects.includes(effect) && !defender.isFainted()) {
      if (simulated) {
        return defender.canAddTag(BattlerTagType.CONFUSED);
      } else {
        return defender.addTag(BattlerTagType.CONFUSED, pokemon.randSeedIntRange(2, 5), move.id, defender.id);
      }
    }
    return false;
  }
}
