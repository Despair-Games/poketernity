import type Pokemon from "#app/field/pokemon";
import type { HitResult } from "#app/field/pokemon";
import { BattlerTagType } from "#enums/battler-tag-type";
import type Move from "../move";
import { PostAttackAbAttr } from "./post-attack-ab-attr";

/**
 * Ability attribute for Gorilla Tactics
 * @extends PostAttackAbAttr
 */

export class GorillaTacticsAbAttr extends PostAttackAbAttr {
  constructor() {
    super((_user, _target, _move) => true, false);
  }

  /**
   *
   * @param {Pokemon} pokemon the {@linkcode Pokemon} with this ability
   * @param _passive n/a
   * @param simulated whether the ability is being simulated
   * @param _defender n/a
   * @param _move n/a
   * @param _hitResult n/a
   * @param _args n/a
   * @returns `true` if the ability is applied
   */
  override applyPostAttackAfterMoveTypeCheck(
    pokemon: Pokemon,
    _passive: boolean,
    simulated: boolean,
    _defender: Pokemon,
    _move: Move,
    _hitResult: HitResult | null,
    _args: any[],
  ): boolean {
    if (simulated) {
      return simulated;
    }

    if (pokemon.getTag(BattlerTagType.GORILLA_TACTICS)) {
      return false;
    }

    pokemon.addTag(BattlerTagType.GORILLA_TACTICS);
    return true;
  }
}
