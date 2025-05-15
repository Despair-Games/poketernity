import { MAJOR_EFFECT_SCORE_BONUS } from "#constants/ai-constants";
import { PLEDGE_MOVES } from "#constants/move-constants";
import type { ArenaTagRelativeSide } from "#enums/arena-tag-relative-side";
import type { ArenaTagType } from "#enums/arena-tag-type";
import type { MoveId } from "#enums/move-id";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import { AddArenaTagAttr } from "#moves/add-arena-tag-attr";
import type { Move } from "#moves/move";

/**
 * Attribute that adds a secondary effect to the field when two unique Pledge moves
 * are combined. The effect added varies based on the two Pledge moves combined.
 * @extends AddArenaTagAttr
 */
export class AddPledgeEffectAttr extends AddArenaTagAttr {
  private readonly requiredPledge: MoveId;

  constructor(tagType: ArenaTagType, requiredPledge: MoveId, relativeSide: ArenaTagRelativeSide) {
    super(tagType, relativeSide, {
      turnCount: 4,
      failOnOverlap: false,
    });

    this.requiredPledge = requiredPledge;
  }

  override apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    if (user.turnData.combiningPledge === this.requiredPledge) {
      return super.apply(user, target, move);
    }
    return false;
  }

  /**
   * Grants (+2) if the user's ally also knows a Pledge move.
   * @todo This doesn't track if the user and ally only know the same Pledge move
   */
  public override getEffectScore(user: EnemyPokemon, _target: Pokemon, _move: Move): number {
    const ally = user.getAlly();
    if (ally?.isActive(true) && PLEDGE_MOVES.some((mvId) => ally.hasMove(mvId))) {
      return MAJOR_EFFECT_SCORE_BONUS;
    }
    return 0;
  }
}
