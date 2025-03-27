import type { MoveConditionFunc } from "#app/@types/MoveConditionFunc";
import { allMoves } from "#app/data/data-lists";
import { type Move } from "#app/data/moves/move";
import { CallMoveAttr } from "#app/data/moves/move-attrs/call-move-attr";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { BooleanHolder } from "#app/utils";
import { getMaxMoveList } from "#app/utils/move-utils";
import { MoveId } from "#enums/move-id";

/**
 * Attribute used to call a random move in the user or party's moveset.
 * Used for {@linkcode MoveId.ASSIST} and {@linkcode MoveId.SLEEP_TALK}
 *
 * Fails if the user has no callable moves.
 * @extends CallMoveAttr
 * @see {@linkcode getCondition} for move selection
 */
export class RandomMovesetMoveAttr extends CallMoveAttr {
  private readonly includeParty: boolean;
  private moveId: number;

  constructor(invalidMoves: ReadonlySet<MoveId>, includeParty: boolean = false) {
    super();
    this.includeParty = includeParty;
    this.invalidMoves = invalidMoves;
  }

  /**
   * User calls a random move (`moveId` selected in {@linkcode getCondition})
   * @param user - Pokemon that used the move and will call a random move
   * @param target - Pokemon that will be targeted by the random move (if single target)
   * @param move - Move being used
   * @param overridden - {@linkcode BooleanHolder} for if the move is overridden
   */
  override apply(user: Pokemon, target: Pokemon, _move: Move, overridden: BooleanHolder): boolean {
    return super.apply(user, target, allMoves.get(this.moveId), overridden);
  }

  override getCondition(): MoveConditionFunc {
    return (user, _target, _move) => {
      // includeParty will be true for Assist, false for Sleep Talk
      let allies: Pokemon[];
      if (this.includeParty) {
        allies = user.isPlayer()
          ? globalScene.getPlayerParty().filter((p) => p !== user && p.isAllowedInChallenge())
          : globalScene.getEnemyParty().filter((p) => p !== user);
      } else {
        allies = [user];
      }

      const partyMoveset = allies.map((p) => p.moveset).flat();
      const moves = partyMoveset.filter((m) => !this.invalidMoves.has(m.moveId) && !m.getMove().name.endsWith(" (N)"));

      if (moves.length === 0) {
        return false;
      }

      moves.sort((a, b) => a.moveId - b.moveId);
      this.moveId = moves[user.randSeedInt(moves.length)].moveId;
      return true;
    };
  }
}

export const invalidAssistMoves: ReadonlySet<MoveId> = Object.freeze(
  new Set([
    ...getMaxMoveList(),
    MoveId.ASSIST,
    MoveId.BANEFUL_BUNKER,
    MoveId.BEAK_BLAST,
    MoveId.BELCH,
    MoveId.BESTOW,
    MoveId.BOUNCE,
    MoveId.CELEBRATE,
    MoveId.CHATTER,
    MoveId.CIRCLE_THROW,
    MoveId.COPYCAT,
    MoveId.COUNTER,
    MoveId.COVET,
    MoveId.DESTINY_BOND,
    MoveId.DETECT,
    MoveId.DIG,
    MoveId.DIVE,
    MoveId.DRAGON_TAIL,
    MoveId.ENDURE,
    MoveId.FEINT,
    MoveId.FLY,
    MoveId.FOCUS_PUNCH,
    MoveId.FOLLOW_ME,
    MoveId.HELPING_HAND,
    MoveId.HOLD_HANDS,
    MoveId.KINGS_SHIELD,
    MoveId.MAT_BLOCK,
    MoveId.ME_FIRST,
    MoveId.METRONOME,
    MoveId.MIMIC,
    MoveId.MIRROR_COAT,
    MoveId.MIRROR_MOVE,
    MoveId.NATURE_POWER,
    MoveId.NONE,
    MoveId.PHANTOM_FORCE,
    MoveId.PROTECT,
    MoveId.RAGE_POWDER,
    MoveId.ROAR,
    MoveId.SHADOW_FORCE,
    MoveId.SHELL_TRAP,
    MoveId.SKETCH,
    MoveId.SKY_DROP,
    MoveId.SLEEP_TALK,
    MoveId.SNATCH,
    MoveId.SPIKY_SHIELD,
    MoveId.SPOTLIGHT,
    MoveId.STRUGGLE,
    MoveId.SWITCHEROO,
    MoveId.THIEF,
    MoveId.TRANSFORM,
    MoveId.TRICK,
    MoveId.WHIRLWIND,
  ]),
);

export const invalidSleepTalkMoves: ReadonlySet<MoveId> = Object.freeze(
  new Set([
    ...getMaxMoveList(),
    MoveId.ASSIST,
    MoveId.BELCH,
    MoveId.BEAK_BLAST,
    MoveId.BIDE,
    MoveId.BOUNCE,
    MoveId.COPYCAT,
    MoveId.DIG,
    MoveId.DIVE,
    MoveId.DYNAMAX_CANNON,
    MoveId.FREEZE_SHOCK,
    MoveId.FLY,
    MoveId.FOCUS_PUNCH,
    MoveId.GEOMANCY,
    MoveId.ICE_BURN,
    MoveId.ME_FIRST,
    MoveId.METRONOME,
    MoveId.MIRROR_MOVE,
    MoveId.MIMIC,
    MoveId.NONE,
    MoveId.PHANTOM_FORCE,
    MoveId.RAZOR_WIND,
    MoveId.SHADOW_FORCE,
    MoveId.SHELL_TRAP,
    MoveId.SKETCH,
    MoveId.SKULL_BASH,
    MoveId.SKY_ATTACK,
    MoveId.SKY_DROP,
    MoveId.SLEEP_TALK,
    MoveId.SOLAR_BLADE,
    MoveId.SOLAR_BEAM,
    MoveId.STRUGGLE,
    MoveId.UPROAR,
  ]),
);
