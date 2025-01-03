import { type Pokemon, type PlayerPokemon, PokemonMove } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { MovePhase } from "#app/phases/move-phase";
import { type Move, getMoveTargets } from "#app/data/move";
import { OverrideMoveEffectAttr } from "#app/data/move-attrs/override-move-effect-attr";
import { lastMoveCopiableCondition, type MoveConditionFunc } from "../move-conditions";

/**
 * Attr used for Copycat and Mirror Move
 */
export class CopyMoveAttr extends OverrideMoveEffectAttr {
  /**
   * Mirror move requires the user to be targeted last and can hit allies
   */
  private isMirrorMove: boolean;

  constructor(isMirrorMove: boolean = false) {
    super();

    this.isMirrorMove = isMirrorMove;
  }

  override apply(user: Pokemon, target: Pokemon, _move: Move, _args: any[]): boolean {
    const lastMove = globalScene.currentBattle.lastMove;

    /**
     * WIP
     * mirror move only works if the user was the last target
     * if (this.isMirrorMove && lastMove.target !== user) return false
     */

    const moveTargets = getMoveTargets(user, lastMove);

    // Copycat cannot target one's ally
    if (!this.isMirrorMove) {
      const allyBattlerIndex = user.getAlly()?.getBattlerIndex();
      moveTargets.targets = moveTargets.targets.filter((bi) => bi !== allyBattlerIndex);
    }

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
