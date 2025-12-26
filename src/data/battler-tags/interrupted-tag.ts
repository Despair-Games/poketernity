import { globalScene } from "#app/global-scene";
import { BattlerTag } from "#battler-tags/battler-tag";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { ElementalType } from "#enums/elemental-type";
import type { MoveId } from "#enums/move-id";
import { MoveResult } from "#enums/move-result";
import type { Pokemon } from "#field/pokemon";
import { SelfStatusMove } from "#moves/move";
import type { MovePhase } from "#phases/move-phase";

/**
 * Tag to represent when the source's {@linkcode BattlerTagType.MID_AIR | flying} action
 * is cancelled by a grounding effect.
 */
export class InterruptedTag extends BattlerTag {
  constructor(sourceMoveId: MoveId) {
    super(BattlerTagType.INTERRUPTED, BattlerTagLapseType.PRE_MOVE, 0, sourceMoveId);
  }

  override canAdd(pokemon: Pokemon): boolean {
    return pokemon.hasTag(BattlerTagType.MID_AIR);
  }

  override onAdd(pokemon: Pokemon): void {
    super.onAdd(pokemon);

    pokemon.getMoveQueue().shift();
    pokemon.pushMoveHistory({
      move: SelfStatusMove.none(),
      result: MoveResult.OTHER,
      type: ElementalType.UNKNOWN,
      targets: [],
    });
  }

  override lapse(pokemon: Pokemon, lapseType: BattlerTagLapseType): boolean {
    globalScene.phaseManager.getCurrentPhase<MovePhase>().cancel();
    return super.lapse(pokemon, lapseType);
  }
}
