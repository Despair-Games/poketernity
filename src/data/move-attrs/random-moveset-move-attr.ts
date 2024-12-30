import type { BattlerIndex } from "#app/battle";
import { MoveFlags } from "#enums/move-flags";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { MovePhase } from "#app/phases/move-phase";
import { type Move, getMoveTargets } from "#app/data/move";
import { OverrideMoveEffectAttr } from "#app/data/move-attrs/override-move-effect-attr";

export class RandomMovesetMoveAttr extends OverrideMoveEffectAttr {
  private enemyMoveset: boolean | null;

  constructor(enemyMoveset?: boolean) {
    super();

    this.enemyMoveset = enemyMoveset!; // TODO: is this bang correct?
  }

  override apply(user: Pokemon, target: Pokemon, _move: Move): boolean {
    const moveset = (!this.enemyMoveset ? user : target).getMoveset();
    const moves = moveset.filter((m) => !m.getMove().hasFlag(MoveFlags.IGNORE_VIRTUAL));
    if (moves.length) {
      const move = moves[user.randSeedInt(moves.length)];
      const moveIndex = moveset.findIndex((m) => m.moveId === move?.moveId);
      const moveTargets = getMoveTargets(user, move.moveId);
      if (!moveTargets.targets.length) {
        return false;
      }
      let selectTargets: BattlerIndex[];
      switch (true) {
        case moveTargets.multiple || moveTargets.targets.length === 1: {
          selectTargets = moveTargets.targets;
          break;
        }
        case moveTargets.targets.indexOf(target.getBattlerIndex()) > -1: {
          selectTargets = [target.getBattlerIndex()];
          break;
        }
        default: {
          moveTargets.targets.splice(moveTargets.targets.indexOf(user.getAlly().getBattlerIndex()));
          selectTargets = [moveTargets.targets[user.randSeedInt(moveTargets.targets.length)]];
          break;
        }
      }
      const targets = selectTargets;
      user.getMoveQueue().push({ move: move.moveId, targets: targets, ignorePP: true });
      globalScene.unshiftPhase(new MovePhase(user, targets, moveset[moveIndex], true));
      return true;
    }

    return false;
  }
}
