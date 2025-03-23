import { BattlerTag } from "#app/data/battler-tags/battler-tag";
import { allMoves } from "#app/data/data-lists";
import { type Move, getMoveTargets } from "#app/data/moves/move";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { BattlerIndex } from "#enums/battler-index";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import type { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import { MoveResult } from "#enums/move-result";
import { MoveTarget } from "#enums/move-target";

/**
 * Locks the source into using a move consecutively for `turnCount - 1` turns. If the move fails or is interrupted
 * during any of these uses, this effect is removed.
 * @extends BattlerTag
 */
export abstract class MoveLockTag extends BattlerTag {
  protected lastTargets?: BattlerIndex[];

  constructor(tagType: BattlerTagType, turnCount: number, sourceMoveId: MoveId) {
    super(tagType, BattlerTagLapseType.AFTER_MOVE, turnCount, sourceMoveId);
  }

  override onRemove(pokemon: Pokemon): void {
    const moveQueue = pokemon.getMoveQueue();
    moveQueue.splice(0, moveQueue.length);
  }

  override lapse(pokemon: Pokemon, lapseType: BattlerTagLapseType): boolean {
    if (lapseType === BattlerTagLapseType.CUSTOM) {
      return this.handleCustomLapse(pokemon);
    } else {
      return this.handleAfterMoveLapse(pokemon);
    }
  }

  /**
   * Queues the tag's source move on all turns except this tag's last turn
   * if the tag holder's last move was successful. The queued move initially
   * has no targets; the move targeting is instead resolved by this tag's custom lapse.
   * @param pokemon the {@linkcode Pokemon} with this tag
   * @returns `true` if the tag is to be retained after lapsing
   */
  protected handleAfterMoveLapse(pokemon: Pokemon): boolean {
    if (!pokemon.getLastXMoves()?.[0]) {
      return false;
    }
    const { move: lastMove, targets: lastTargets, result: lastMoveResult } = pokemon.getLastXMoves()[0];

    // If this pokemon somehow used another move (e.g. via Dancer), don't advance this tag
    if (![this.sourceMoveId, MoveId.NONE].includes(lastMove.id)) {
      return true;
    }

    const ret =
      super.lapse(pokemon, BattlerTagLapseType.AFTER_MOVE)
      && lastTargets.length > 0
      && lastMoveResult === MoveResult.SUCCESS;

    if (ret) {
      const move = allMoves.get(this.sourceMoveId);
      this.lastTargets = lastTargets;
      pokemon.getMoveQueue().push({ move, targets: [], ignorePP: true, type: pokemon.getMoveType(move) });
    }

    return ret;
  }

  /**
   * Determines the next queued move's target during command selection
   * @param pokemon the {@linkcode Pokemon} with this tag
   */
  protected handleCustomLapse(pokemon: Pokemon): boolean {
    const queuedMove = pokemon.getMoveQueue()[0];

    /**
     * If the pokemon somehow doesn't have a queued move, abort
     * target adjustment and remove this tag. This is just a failsafe;
     * under normal circumstances, this should never happen.
     */
    if (!queuedMove) {
      return false;
    }

    queuedMove.targets = this.getNextTargets(pokemon, queuedMove.move);
    return true;
  }

  /**
   * Obtains the target(s) for move actions queued by this tag
   * @param pokemon the {@linkcode Pokemon} with this tag
   * @param move the {@linkcode Move} queued by this tag
   * @returns the target(s), by {@linkcode BattlerIndex}, for the next usage of this tag's move
   */
  protected getNextTargets(pokemon: Pokemon, move: Move): BattlerIndex[] {
    if (move.moveTarget === MoveTarget.RANDOM_NEAR_ENEMY) {
      return getMoveTargets(pokemon, move.id).targets;
    } else {
      // Failsafe if `this.lastTargets` has somehow not been set
      if (!this.lastTargets?.length) {
        this.lastTargets = pokemon.isPlayer() ? [BattlerIndex.ENEMY] : [BattlerIndex.PLAYER];
      }

      // Note: this assumes the locked move is single-target
      const lastTarget = globalScene.getFieldPokemonByBattlerIndex(this.lastTargets[0]);
      const adjacentIndex = this.lastTargets[0] + (this.lastTargets[0] % 2 === 0 ? 1 : -1);
      const adjacentTarget = globalScene.getFieldPokemonByBattlerIndex(adjacentIndex);

      if (
        !lastTarget?.isActive(true)
        && globalScene.currentBattle.double
        && adjacentTarget?.isActive(true)
        && adjacentTarget !== pokemon
      ) {
        return [adjacentIndex];
      } else {
        return this.lastTargets;
      }
    }
  }

  override loadTag(source: BattlerTag | any): void {
    super.loadTag(source);
    this.lastTargets = source.lastTargets;
  }
}
