// -- start tsdoc imports --
/* biome-ignore-start lint/correctness/noUnusedImports: tsdoc imports */
import type { SEMI_INVULNERABLE_BATTLER_TAG_TYPES } from "#constants/battler-tag-constants";
/* biome-ignore-end lint/correctness/noUnusedImports: tsdoc imports */
// -- end tsdoc imports --

import { globalScene } from "#app/global-scene";
import { BattlerTag } from "#battler-tags/battler-tag";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import type { BattlerTagType } from "#enums/battler-tag-type";
import type { MoveId } from "#enums/move-id";
import type { Pokemon } from "#field/pokemon";
import { getFrameMs } from "#utils/common-utils";

/**
 * Tag representing the {@link https://bulbapedia.bulbagarden.net/wiki/Semi-invulnerable_turn | Semi-invulnerable} state
 * during the execution of several two-turn moves.
 *
 * @privateRemarks
 * Tags that use or subclass this should be added to {@linkcode SEMI_INVULNERABLE_BATTLER_TAG_TYPES}
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
