import type Move from "#app/data/move";
import type Pokemon from "#app/field/pokemon";
import type { HitResult } from "#app/field/pokemon";
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
  private effects: StatusEffect[];

  constructor(...effects: StatusEffect[]) {
    /** This effect does not require a damaging move */
    super((_user, _target, _move) => true);
    this.effects = effects;
  }
  /**
   * Applies confusion to the target pokemon.
   * @param pokemon {@link Pokemon} attacking
   * @param _passive N/A
   * @param defender {@link Pokemon} defending
   * @param move {@link Move} used to apply status effect and confusion
   * @param _hitResult N/A
   * @param args [0] {@linkcode StatusEffect} applied by move
   * @returns true if defender is confused
   */
  override applyPostAttackAfterMoveTypeCheck(
    pokemon: Pokemon,
    _passive: boolean,
    simulated: boolean,
    defender: Pokemon,
    move: Move,
    _hitResult: HitResult,
    args: any[],
  ): boolean {
    const effect: StatusEffect = args[0];
    if (this.effects.indexOf(effect) > -1 && !defender.isFainted()) {
      if (simulated) {
        return defender.canAddTag(BattlerTagType.CONFUSED);
      } else {
        return defender.addTag(BattlerTagType.CONFUSED, pokemon.randSeedIntRange(2, 5), move.id, defender.id);
      }
    }
    return false;
  }
}
