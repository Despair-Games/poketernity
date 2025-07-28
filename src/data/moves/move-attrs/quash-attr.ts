import { globalScene } from "#app/global-scene";
import { BAD_MOVE_PENALTY } from "#constants/ai-constants";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import { AddBattlerTagAttr } from "#moves/add-battler-tag-attr";
import type { Move } from "#moves/move";
import type { MoveConditionFunc } from "#types/move-condition-func";
import { isNil } from "#utils/common-utils";

/**
 * Attribute to apply {@link https://bulbapedia.bulbagarden.net/wiki/Quash_(move) | Quash's}
 * effect. Forces the target to move last in turn order.
 * @extends AddBattlerTagAttr
 */
export class QuashAttr extends AddBattlerTagAttr {
  constructor() {
    super(BattlerTagType.QUASHED, false, { failOnOverlap: true });
  }

  /** @todo Should this be converted to a scored {@linkcode MoveCondition}? */
  override getCondition(): MoveConditionFunc | null {
    return (_user, target, _move) => {
      const { turnManager } = globalScene.currentBattle;
      return !target.hasTag(BattlerTagType.QUASHED) && !isNil(turnManager.findCommandFromPokemon(target));
    };
  }

  /** {@link BAD_MOVE_PENALTY | Penalizes} the move if the current battle is not a double battle */
  public override getRawEffectScore(_user: EnemyPokemon, _target: Pokemon, _move: Move): number {
    return globalScene.currentBattle.double ? 0 : BAD_MOVE_PENALTY;
  }
}
