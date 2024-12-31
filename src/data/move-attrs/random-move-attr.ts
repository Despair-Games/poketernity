import { MoveFlags } from "#enums/move-flags";
import { Moves } from "#enums/moves";
import { type Pokemon, PokemonMove } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { LoadMoveAnimPhase } from "#app/phases/load-move-anim-phase";
import { MovePhase } from "#app/phases/move-phase";
import { getEnumValues } from "#app/utils";
import { type Move, getMoveTargets } from "#app/data/move";
import { allMoves } from "#app/data/all-moves";
import { OverrideMoveEffectAttr } from "#app/data/move-attrs/override-move-effect-attr";

export class RandomMoveAttr extends OverrideMoveEffectAttr {
  /**
   * This function exists solely to allow tests to override the randomly selected move by mocking this function.
   */
  public getMoveOverride(): Moves | null {
    return null;
  }

  /**
   * Invokes a random move and uses it virtually on a random legal target
   * @param user the {@linkcode Pokemon} using the move
   * @param target the {@linkcode Pokemon} targeted by the move
   * @param _move n/a
   * @returns `true` if a move was successfully invoked
   */
  override apply(user: Pokemon, target: Pokemon, _move: Move): boolean {
    const moveIds = getEnumValues(Moves).filter(
      (m) => !allMoves[m].hasFlag(MoveFlags.IGNORE_VIRTUAL) && !allMoves[m].name.endsWith(" (N)"),
    );
    const moveId = this.getMoveOverride() ?? moveIds[user.randSeedInt(moveIds.length)];

    const moveTargets = getMoveTargets(user, moveId);
    if (!moveTargets.targets.length) {
      return false;
    }
    const targets =
      moveTargets.multiple || moveTargets.targets.length === 1
        ? moveTargets.targets
        : moveTargets.targets.indexOf(target.getBattlerIndex()) > -1
          ? [target.getBattlerIndex()]
          : [moveTargets.targets[user.randSeedInt(moveTargets.targets.length)]];
    user.getMoveQueue().push({ move: moveId, targets: targets, ignorePP: true });
    globalScene.unshiftPhase(new LoadMoveAnimPhase(moveId));
    globalScene.unshiftPhase(new MovePhase(user, targets, new PokemonMove(moveId, 0, 0, true), true));
    return true;
  }
}
