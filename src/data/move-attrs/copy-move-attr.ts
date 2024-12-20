import { type Pokemon, type PlayerPokemon, PokemonMove } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { MovePhase } from "#app/phases/move-phase";
import { type MoveConditionFunc, allMoves, type Move, getMoveTargets } from "#app/data/move";
import { OverrideMoveEffectAttr } from "#app/data/move-attrs/override-move-effect-attr";

const lastMoveCopiableCondition: MoveConditionFunc = (_user, _target, _move) => {
  const copiableMove = globalScene.currentBattle.lastMove;

  if (!copiableMove) {
    return false;
  }

  if (allMoves[copiableMove].isChargingMove()) {
    return false;
  }

  // TODO: Add last turn of Bide
  return true;
};

export class CopyMoveAttr extends OverrideMoveEffectAttr {
  override apply(user: Pokemon, target: Pokemon, _move: Move, _args: any[]): boolean {
    const lastMove = globalScene.currentBattle.lastMove;

    const moveTargets = getMoveTargets(user, lastMove);
    if (!moveTargets.targets.length) {
      return false;
    }

    const targets =
      moveTargets.multiple || moveTargets.targets.length === 1
        ? moveTargets.targets
        : moveTargets.targets.indexOf(target.getBattlerIndex()) > -1
          ? [target.getBattlerIndex()]
          : [moveTargets.targets[user.randSeedInt(moveTargets.targets.length)]];
    user.getMoveQueue().push({ move: lastMove, targets: targets, ignorePP: true });

    globalScene.unshiftPhase(
      new MovePhase(user as PlayerPokemon, targets, new PokemonMove(lastMove, 0, 0, true), true),
    );

    return true;
  }

  override getCondition(): MoveConditionFunc {
    return lastMoveCopiableCondition;
  }
}
