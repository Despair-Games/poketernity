import { LegacyAnimConfig } from "#animations/anim-config";
import { BattleAnim } from "#animations/battle-anims";
import { moveAnims } from "#animations/move-anims";
import { globalScene } from "#app/global-scene";
import { allMoves } from "#data/data-lists";
import type { FieldBattlerIndex } from "#enums/battler-index";
import { MoveFlags } from "#enums/move-flags";
import type { MoveId } from "#enums/move-id";
import type { Pokemon } from "#field/pokemon";

/**
 * Animation for effects during the use of a move.
 * @todo Should "target" or "targetIndex" be used?
 */
export class MoveAnim extends BattleAnim {
  public moveId: MoveId;

  constructor(move: MoveId, user: Pokemon, targetIndex: FieldBattlerIndex, playOnEmptyField: boolean = false) {
    super(user, globalScene.getPokemonByBattlerIndex(targetIndex), playOnEmptyField);

    this.moveId = move;
  }

  getAnim(): LegacyAnimConfig {
    const anim = moveAnims.get(this.moveId);
    const animSource = this.user?.isPlayer() ? 0 : 1;
    if (anim instanceof LegacyAnimConfig) {
      return anim;
    }
    if (anim) {
      return anim[animSource];
    }
    return undefined!; // TODO: fix this mess
  }

  isOppAnim(): boolean {
    return !this.user?.isPlayer() && Array.isArray(moveAnims.get(this.moveId));
  }

  protected override isHideUser(): boolean {
    return allMoves.get(this.moveId).checkFlag(MoveFlags.HIDE_USER, this.user, this.target);
  }

  protected override isHideTarget(): boolean {
    return allMoves.get(this.moveId).checkFlag(MoveFlags.HIDE_TARGET, this.user, this.target);
  }
}
