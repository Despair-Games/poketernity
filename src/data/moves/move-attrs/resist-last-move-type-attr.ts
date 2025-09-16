import type { GameMode } from "#app/game-mode";
import { globalScene } from "#app/global-scene";
import { getTypeDamageMultiplier } from "#data/type";
import { ChallengeType } from "#enums/challenge-type";
import { ElementalType } from "#enums/elemental-type";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import { ChangeTypeAttr } from "#moves/change-type-attr";
import type { Move } from "#moves/move";
import type { MoveConditionFunc } from "#types/move-types";
import { applyChallenges } from "#utils/challenge-utils";
import { ValueHolder } from "#utils/common-utils";
import { randSeedItem } from "#utils/random-utils";

/**
 * Attribute used for Conversion 2, to convert the user's type to a random type that resists the target's last used move.
 * Fails if the user already has ALL types that resist the target's last used move.
 * Fails if the opponent has not used a move yet
 * Fails if the type is unknown or stellar
 */
export class ResistLastMoveTypeAttr extends ChangeTypeAttr {
  constructor() {
    super(true);
  }

  protected override getType(user: Pokemon, target: Pokemon): ElementalType {
    const [{ type: targetMoveType }] = target.getLastXMoves(1);
    const userTypes = user.getTypes();
    const validTypes = this.getTypeResistances(globalScene.gameMode, targetMoveType).filter(
      (t) => !userTypes.includes(t),
    );

    return randSeedItem(validTypes);
  }

  /**
   * Retrieve the types resisting a given type. Used by Conversion 2
   * @returns An array populated with Types, or an empty array if no resistances exist (Unknown or Stellar type)
   */
  private getTypeResistances(gameMode: GameMode, type: ElementalType): ElementalType[] {
    const typeResistances: ElementalType[] = [];

    for (const elementalType of Object.values(ElementalType)) {
      const multiplier = new ValueHolder(1);
      multiplier.value = getTypeDamageMultiplier(type, elementalType);
      applyChallenges(gameMode, ChallengeType.TYPE_EFFECTIVENESS, multiplier);
      if (multiplier.value < 1) {
        typeResistances.push(elementalType);
      }
    }

    return typeResistances;
  }

  /**
   * This move fails if:
   * - The target hasn't moved yet
   * - The target's last move was either typeless or Stellar-type
   * - The user is already of all types that resist the target's last move
   */
  public override getCondition(): MoveConditionFunc {
    return (user, target, move) => {
      if (!super.getCondition()(user, target, move)) {
        return false;
      }

      const [{ type: moveType }] = target.getLastXMoves();
      if (moveType == null || moveType === ElementalType.STELLAR || moveType === ElementalType.UNKNOWN) {
        return false;
      }

      const userTypes = user.getTypes();
      // valid types are ones that are not already the user's types
      const validTypes = this.getTypeResistances(globalScene.gameMode, moveType).filter((t) => !userTypes.includes(t));
      return validTypes.length > 0;
    };
  }

  /**
   * @returns `0`.
   *
   * The base scoring for type-changing effects is disabled for Conversion 2 because
   * the effect's resolved type is random. Under the base logic, the user may become
   * stuck repeatedly using Conversion 2 in some game states.
   */
  public override getEffectScore(_user: EnemyPokemon, _target: Pokemon, _move: Move): number {
    return 0;
  }
}
