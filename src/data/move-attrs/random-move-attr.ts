import { MoveFlags } from "#enums/move-flags";
import { MoveId } from "#enums/move-id";
import { type Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { LoadMoveAnimPhase } from "#app/phases/load-move-anim-phase";
import { getEnumValues } from "#app/utils";
import { type Move, getMoveTargets } from "#app/data/move";
import { allMoves } from "#app/data/all-moves";
import { OverrideMoveEffectAttr } from "#app/data/move-attrs/override-move-effect-attr";

/**
 * Attribute to invoke a random move and use it virtually on a random legal target.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Metronome_(move) | Metronome}.
 * @extends OverrideMoveEffectAttr
 */
export class RandomMoveAttr extends OverrideMoveEffectAttr {
  /**
   * This function exists solely to allow tests to override the randomly selected move by mocking this function.
   */
  public getMoveOverride(): MoveId | null {
    return null;
  }

  override apply(user: Pokemon, target: Pokemon, _move: Move): boolean {
    const moveIds = getEnumValues(MoveId).filter(
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
    user.getMoveQueue().push({ moveId: moveId, targets: targets, ignorePP: true });
    globalScene.unshiftPhase(new LoadMoveAnimPhase(moveId));
    globalScene.useMove({ pokemon: user, targets, move: moveId, followUp: true, when: "eager" });
    return true;
  }

  override isRandomMoveAttr(): this is this {
    return true;
  }
}
