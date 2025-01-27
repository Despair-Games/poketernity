import { allMoves } from "#app/data/all-moves";
import { type Move } from "#app/data/move";
import { CallMoveAttr } from "#app/data/move-attrs/call-move-attr";
import type { MoveConditionFunc } from "#app/data/move-conditions";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { BooleanHolder } from "#app/utils";
import { Moves } from "#enums/moves";

/**
 * Attribute used to call a random move in the user or party's moveset.
 * Used for {@linkcode Moves.ASSIST} and {@linkcode Moves.SLEEP_TALK}
 *
 * Fails if the user has no callable moves.
 * @extends RandomMoveAttr
 * @see {@linkcode getCondition} for move selection
 */
export class RandomMovesetMoveAttr extends CallMoveAttr {
  private includeParty: boolean;
  private moveId: number;

  constructor(invalidMoves: Moves[], includeParty: boolean = false) {
    super();
    this.includeParty = includeParty;
    this.invalidMoves = invalidMoves;
  }

  /**
   * User calls a random moveId selected in {@linkcode getCondition}
   * @param user Pokemon that used the move and will call a random move
   * @param target Pokemon that will be targeted by the random move (if single target)
   * @param move Move being used
   * @param args Unused
   */
  override apply(user: Pokemon, target: Pokemon, _move: Move, overridden: BooleanHolder): boolean {
    return super.apply(user, target, allMoves[this.moveId], overridden);
  }

  override getCondition(): MoveConditionFunc {
    return (user, _target, _move) => {
      // includeParty will be true for Assist, false for Sleep Talk
      let allies: Pokemon[];
      if (this.includeParty) {
        allies = user.isPlayer()
          ? globalScene.getPlayerParty().filter((p) => p !== user)
          : globalScene.getEnemyParty().filter((p) => p !== user);
      } else {
        allies = [user];
      }

      const partyMoveset = allies.map((p) => p.moveset).flat();
      const moves = partyMoveset.filter(
        (m) => !this.invalidMoves.includes(m.moveId) && !m.getMove().name.endsWith(" (N)"),
      );

      if (moves.length === 0) {
        return false;
      }

      moves.sort((a, b) => a.moveId - b.moveId);
      this.moveId = moves[user.randSeedInt(moves.length)].moveId;
      return true;
    };
  }
}

export const invalidAssistMoves: Moves[] = [
  Moves.ASSIST,
  Moves.BANEFUL_BUNKER,
  Moves.BEAK_BLAST,
  Moves.BELCH,
  Moves.BESTOW,
  Moves.BOUNCE,
  Moves.CELEBRATE,
  Moves.CHATTER,
  Moves.CIRCLE_THROW,
  Moves.COPYCAT,
  Moves.COUNTER,
  Moves.COVET,
  Moves.DESTINY_BOND,
  Moves.DETECT,
  Moves.DIG,
  Moves.DIVE,
  Moves.DRAGON_TAIL,
  Moves.ENDURE,
  Moves.FEINT,
  Moves.FLY,
  Moves.FOCUS_PUNCH,
  Moves.FOLLOW_ME,
  Moves.HELPING_HAND,
  Moves.HOLD_HANDS,
  Moves.KINGS_SHIELD,
  Moves.MAT_BLOCK,
  Moves.ME_FIRST,
  Moves.METRONOME,
  Moves.MIMIC,
  Moves.MIRROR_COAT,
  Moves.MIRROR_MOVE,
  Moves.NATURE_POWER,
  Moves.NONE,
  Moves.PHANTOM_FORCE,
  Moves.PROTECT,
  Moves.RAGE_POWDER,
  Moves.ROAR,
  Moves.SHADOW_FORCE,
  Moves.SHELL_TRAP,
  Moves.SKETCH,
  Moves.SKY_DROP,
  Moves.SLEEP_TALK,
  Moves.SNATCH,
  Moves.SPIKY_SHIELD,
  Moves.SPOTLIGHT,
  Moves.STRUGGLE,
  Moves.SWITCHEROO,
  Moves.THIEF,
  Moves.TRANSFORM,
  Moves.TRICK,
  Moves.WHIRLWIND,
];

export const invalidSleepTalkMoves: Moves[] = [
  Moves.ASSIST,
  Moves.BELCH,
  Moves.BEAK_BLAST,
  Moves.BIDE,
  Moves.BOUNCE,
  Moves.COPYCAT,
  Moves.DIG,
  Moves.DIVE,
  Moves.DYNAMAX_CANNON,
  Moves.FREEZE_SHOCK,
  Moves.FLY,
  Moves.FOCUS_PUNCH,
  Moves.GEOMANCY,
  Moves.ICE_BURN,
  Moves.ME_FIRST,
  Moves.METRONOME,
  Moves.MIRROR_MOVE,
  Moves.MIMIC,
  Moves.NONE,
  Moves.PHANTOM_FORCE,
  Moves.RAZOR_WIND,
  Moves.SHADOW_FORCE,
  Moves.SHELL_TRAP,
  Moves.SKETCH,
  Moves.SKULL_BASH,
  Moves.SKY_ATTACK,
  Moves.SKY_DROP,
  Moves.SLEEP_TALK,
  Moves.SOLAR_BLADE,
  Moves.SOLAR_BEAM,
  Moves.STRUGGLE,
  Moves.UPROAR,
];
