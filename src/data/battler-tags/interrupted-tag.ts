import { BattlerTag } from "#app/data/battler-tags/battler-tag";
import { SelfStatusMove } from "#app/data/moves/move";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { MovePhase } from "#app/phases/move-phase";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { ElementalType } from "#enums/elemental-type";
import type { MoveId } from "#enums/move-id";
import { MoveResult } from "#enums/move-result";

/**
 * Tag to represent when the source's {@linkcode BattlerTagType.FLYING | flying} action
 * is cancelled by a grounding effect.
 * @extends BattlerTag
 */
export class InterruptedTag extends BattlerTag {
  constructor(sourceMoveId: MoveId) {
    super(BattlerTagType.INTERRUPTED, BattlerTagLapseType.PRE_MOVE, 0, sourceMoveId);
  }

  override canAdd(pokemon: Pokemon): boolean {
    return !!pokemon.getTag(BattlerTagType.FLYING);
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
    (globalScene.getCurrentPhase() as MovePhase).cancel();
    return super.lapse(pokemon, lapseType);
  }
}
