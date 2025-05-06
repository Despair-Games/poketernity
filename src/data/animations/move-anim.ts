import { LegacyAnimConfig } from "#app/data/animations/anim-config";
import { moveAnims } from "#app/data/animations/move-anims";
import { allMoves } from "#app/data/data-lists";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { BattlerIndex } from "#enums/battler-index";
import { MoveFlags } from "#enums/move-flags";
import type { MoveId } from "#enums/move-id";
import { BattleAnim } from "./battle-anims";

/**
 * Animation for effects during the use of a move.
 * @extends BattleAnim
 * @todo Should "target" or "targetIndex" be used?
 */
export class MoveAnim extends BattleAnim {
  public moveId: MoveId;

  constructor(move: MoveId, user: Pokemon, targetIndex: BattlerIndex, playOnEmptyField: boolean = false) {
    super(user, globalScene.getPokemonByBattlerIndex(targetIndex), playOnEmptyField);

    this.moveId = move;
  }

  getAnim(): LegacyAnimConfig {
    const anim = moveAnims.get(this.moveId);
    const animSource = this.user?.isPlayer() ? 0 : 1;
    return anim instanceof LegacyAnimConfig ? anim : anim?.[animSource]!; // TODO: resolve bang
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
