import { BAD_MOVE_PENALTY, MINOR_EFFECT_SCORE_BONUS, SOFT_EFFECT_SCORE_LIMIT } from "#app/constants/ai-constants";
import type { Move } from "#app/data/moves/move";
import { AddArenaTagAttr } from "#app/data/moves/move-attrs/add-arena-tag-attr";
import type { EnemyPokemon } from "#app/field/enemy-pokemon";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { ArenaTagRelativeSide } from "#enums/arena-tag-relative-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import { Stat } from "#enums/stat";

export class TrickRoomAttr extends AddArenaTagAttr {
  constructor() {
    super(ArenaTagType.TRICK_ROOM, ArenaTagRelativeSide.ALL, { turnCount: 5 });
  }

  /**
   * For each Pokemon in the user's party, this grants (+1) if the Pokemon is outsped
   * by all active opponents and (-1) otherwise. The total bonus from this effect cannot
   * be lower than the {@link BAD_MOVE_PENALTY | Bad Move Penalty} nor higher than the
   * {@link SOFT_EFFECT_SCORE_LIMIT | soft effect score cap}. The AI is discouraged from
   * using Trick Room when the effect is active to disable the effect.
   */
  public override getEffectScore(user: EnemyPokemon, _target: Pokemon, _move: Move): number {
    if (globalScene.arena.hasTag(ArenaTagType.TRICK_ROOM)) {
      return BAD_MOVE_PENALTY;
    }

    const allyScores = user.getParty().map((ally) => {
      const allySpd = ally.isActive(true) ? ally.getEffectiveStat(Stat.SPD) : ally.getStat(Stat.SPD);
      const isOutsped = ally.getOpponents().every((opp) => opp.getEffectiveStat(Stat.SPD) > allySpd);
      return isOutsped ? MINOR_EFFECT_SCORE_BONUS : -MINOR_EFFECT_SCORE_BONUS;
    });

    return Phaser.Math.Clamp(
      allyScores.reduce((total, score) => total + score, 0),
      BAD_MOVE_PENALTY,
      SOFT_EFFECT_SCORE_LIMIT,
    );
  }
}
