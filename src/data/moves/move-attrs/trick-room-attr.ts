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
   * Grants (+1) for each party member that is outsped by all active opponents,
   * up to (+3). The AI is discouraged from using Trick Room when the effect is
   * active to disable the effect.
   */
  public override getEffectScore(user: EnemyPokemon, _target: Pokemon, _move: Move): number {
    if (globalScene.arena.hasTag(ArenaTagType.TRICK_ROOM)) {
      return BAD_MOVE_PENALTY;
    }

    const numOutspedAllies = user.getParty().filter((ally) => {
      const allySpd = ally.isActive(true) ? ally.getEffectiveStat(Stat.SPD) : ally.getStat(Stat.SPD);
      const isOutsped = ally.getOpponents().every((opp) => opp.getEffectiveStat(Stat.SPD) > allySpd);
      return isOutsped ? MINOR_EFFECT_SCORE_BONUS : -MINOR_EFFECT_SCORE_BONUS;
    }).length;

    return Math.min(numOutspedAllies, SOFT_EFFECT_SCORE_LIMIT);
  }
}
