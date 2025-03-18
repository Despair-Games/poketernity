import { BattlerTag } from "#app/data/battler-tags/battler-tag";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getFrameMs } from "#app/utils";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import type { BattlerTagType } from "#enums/battler-tag-type";
import type { MoveId } from "#enums/move-id";

/**
 * Tag representing the {@link https://bulbapedia.bulbagarden.net/wiki/Semi-invulnerable_turn | Semi-invulnerable} state
 * during the execution of several two-turn moves.
 * @extends BattlerTag
 */
export class SemiInvulnerableTag extends BattlerTag {
  constructor(tagType: BattlerTagType, turnCount: number, sourceMoveId: MoveId) {
    super(tagType, BattlerTagLapseType.MOVE_EFFECT, turnCount, sourceMoveId);
  }

  override onAdd(pokemon: Pokemon): void {
    super.onAdd(pokemon);

    pokemon.setVisible(false);
  }

  override onRemove(pokemon: Pokemon): void {
    // Wait 2 frames before setting visible for battle animations that don't immediately show the sprite invisible
    globalScene.tweens.addCounter({
      duration: getFrameMs(2),
      onComplete: () => pokemon.setVisible(true),
    });
  }
}
