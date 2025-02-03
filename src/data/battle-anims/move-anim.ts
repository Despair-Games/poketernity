import { allMoves } from "#app/data/all-moves";
import { AnimConfig } from "#app/data/anim-config";
import { BattleAnim } from "#app/data/battle-anims";
import { moveAnims } from "#app/data/move-anims";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { BattlerIndex } from "#enums/battler-index";
import { MoveFlags } from "#enums/move-flags";
import type { MoveId } from "#enums/move-id";

export class MoveAnim extends BattleAnim {
  public moveId: MoveId;

  constructor(move: MoveId, user: Pokemon, targetIndex: BattlerIndex, playOnEmptyField: boolean = false) {
    super(user, globalScene.getFieldPokemonByBattlerIndex(targetIndex), playOnEmptyField);

    this.moveId = move;
  }

  getAnim(): AnimConfig {
    return moveAnims.get(this.moveId) instanceof AnimConfig
      ? (moveAnims.get(this.moveId) as AnimConfig)
      : (moveAnims.get(this.moveId)?.[this.user?.isPlayer() ? 0 : 1] as AnimConfig);
  }

  isOppAnim(): boolean {
    return !this.user?.isPlayer() && Array.isArray(moveAnims.get(this.moveId));
  }

  protected override isHideUser(): boolean {
    return allMoves[this.moveId].hasFlag(MoveFlags.HIDE_USER);
  }

  protected override isHideTarget(): boolean {
    return allMoves[this.moveId].hasFlag(MoveFlags.HIDE_TARGET);
  }
}
