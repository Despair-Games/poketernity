import { Type } from "#enums/type";
import type { Pokemon } from "#app/field/pokemon";
import type { GameMode } from "#app/game-mode";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { toReadableString, NumberHolder } from "#app/utils";
import i18next from "i18next";
import { applyChallenges, ChallengeType } from "#app/data/challenge";
import { type Move } from "#app/data/move";
import { allMoves } from "../move";
import { getTypeDamageMultiplier } from "#app/data/type";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";
import type { MoveConditionFunc } from "../move-conditions";

/**
 * Attribute used for Conversion 2, to convert the user's type to a random type that resists the target's last used move.
 * Fails if the user already has ALL types that resist the target's last used move.
 * Fails if the opponent has not used a move yet
 * Fails if the type is unknown or stellar
 *
 * TODO:
 * If a move has its type changed (e.g. {@linkcode Moves.HIDDEN_POWER}), it will check the new type.
 */
export class ResistLastMoveTypeAttr extends MoveEffectAttr {
  constructor() {
    super(true);
  }
  /**
   * User changes its type to a random type that resists the target's last used move
   * @param user Pokemon that used the move and will change types
   * @param target Opposing pokemon that recently used a move
   * @param move Move being used
   * @param args Unused
   * @returns `true` if the function succeeds
   */
  override apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    if (!super.apply(user, target, move, args)) {
      return false;
    }

    const [targetMove] = target.getLastXMoves(1); // target's most recent move
    if (!targetMove) {
      return false;
    }

    const moveData = allMoves[targetMove.move];
    if (moveData.type === Type.STELLAR || moveData.type === Type.UNKNOWN) {
      return false;
    }
    const userTypes = user.getTypes();
    const validTypes = this.getTypeResistances(globalScene.gameMode, moveData.type).filter(
      (t) => !userTypes.includes(t),
    ); // valid types are ones that are not already the user's types
    if (!validTypes.length) {
      return false;
    }
    const type = validTypes[user.randSeedInt(validTypes.length)];
    user.summonData.types = [type];
    globalScene.queueMessage(
      i18next.t("battle:transformedIntoType", {
        pokemonName: getPokemonNameWithAffix(user),
        type: toReadableString(Type[type]),
      }),
    );
    user.updateInfo();

    return true;
  }

  /**
   * Retrieve the types resisting a given type. Used by Conversion 2
   * @returns An array populated with Types, or an empty array if no resistances exist (Unknown or Stellar type)
   */
  getTypeResistances(gameMode: GameMode, type: number): Type[] {
    const typeResistances: Type[] = [];

    for (let i = 0; i < Object.keys(Type).length; i++) {
      const multiplier = new NumberHolder(1);
      multiplier.value = getTypeDamageMultiplier(type, i);
      applyChallenges(gameMode, ChallengeType.TYPE_EFFECTIVENESS, multiplier);
      if (multiplier.value < 1) {
        typeResistances.push(i);
      }
    }

    return typeResistances;
  }

  override getCondition(): MoveConditionFunc {
    return (_user, target, _move) => {
      const moveHistory = target.getLastXMoves();
      return moveHistory.length !== 0;
    };
  }
}
