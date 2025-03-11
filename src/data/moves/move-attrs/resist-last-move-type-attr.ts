import { ElementalType } from "#enums/elemental-type";
import type { Pokemon } from "#app/field/pokemon";
import type { GameMode } from "#app/game-mode";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { NumberHolder } from "#app/utils";
import i18next from "i18next";
import { applyChallenges } from "#app/utils/challenge-utils";
import { ChallengeType } from "#enums/challenge-type";
import { type Move } from "#app/data/moves/move";
import { getTypeDamageMultiplier } from "#app/data/type";
import { MoveEffectAttr } from "#app/data/moves/move-attrs/move-effect-attr";
import type { MoveConditionFunc } from "#app/@types/MoveConditionFunc";

/**
 * Attribute used for Conversion 2, to convert the user's type to a random type that resists the target's last used move.
 * Fails if the user already has ALL types that resist the target's last used move.
 * Fails if the opponent has not used a move yet
 * Fails if the type is unknown or stellar
 */
export class ResistLastMoveTypeAttr extends MoveEffectAttr {
  constructor() {
    super(true);
  }

  override applyEffect(user: Pokemon, target: Pokemon, _move: Move): boolean {
    const [targetMove] = target.getLastXMoves(1); // target's most recent move
    if (!targetMove) {
      return false;
    }

    const moveType = targetMove.type;
    const userTypes = user.getTypes();
    const validTypes = this.getTypeResistances(globalScene.gameMode, moveType).filter((t) => !userTypes.includes(t));

    const type = validTypes[user.randSeedInt(validTypes.length)];
    user.summonData.types = [type];
    globalScene.queueMessage(
      i18next.t("battle:transformedIntoType", {
        pokemonName: getPokemonNameWithAffix(user),
        type: i18next.t(`pokemonInfo:Type.${ElementalType[type]}`),
      }),
    );
    user.updateInfo();

    return true;
  }

  /**
   * Retrieve the types resisting a given type. Used by Conversion 2
   * @returns An array populated with Types, or an empty array if no resistances exist (Unknown or Stellar type)
   */
  getTypeResistances(gameMode: GameMode, type: number): ElementalType[] {
    const typeResistances: ElementalType[] = [];

    for (let i = 0; i < Object.keys(ElementalType).length; i++) {
      const multiplier = new NumberHolder(1);
      multiplier.value = getTypeDamageMultiplier(type, i);
      applyChallenges(gameMode, ChallengeType.TYPE_EFFECTIVENESS, multiplier);
      if (multiplier.value < 1) {
        typeResistances.push(i);
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
  override getCondition(): MoveConditionFunc {
    return (user, target, _move) => {
      const [targetMove] = target.getLastXMoves();
      if (!targetMove) {
        return false;
      }

      const { move: moveData, type: moveType } = targetMove;
      if (!moveData || [ElementalType.STELLAR, ElementalType.UNKNOWN].includes(moveType)) {
        return false;
      }
      const userTypes = user.getTypes();
      const validTypes = this.getTypeResistances(globalScene.gameMode, moveType).filter((t) => !userTypes.includes(t)); // valid types are ones that are not already the user's types
      return validTypes.length > 0;
    };
  }
}
