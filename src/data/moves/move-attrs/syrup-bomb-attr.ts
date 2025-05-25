import { BattlerTagType } from "#enums/battler-tag-type";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import { AddBattlerTagAttr } from "#moves/add-battler-tag-attr";
import type { Move } from "#moves/move";

/**
 * Attribute to apply {@link https://bulbapedia.bulbagarden.net/wiki/Syrup_Bomb_(move) | Syrup Bomb's}
 * secondary effect. Lowers the target's Speed by 1 stage
 * at the end of each turn for 3 turns.
 * @extends AddBattlerTagAttr
 */
export class SyrupBombAttr extends AddBattlerTagAttr {
  constructor() {
    super(BattlerTagType.SYRUP_BOMB, false, { turnCountMin: 3 });
  }

  /** Grants a 60%(+1) bonus if the target has higher Speed than the user */
  public override getRawEffectScore(user: EnemyPokemon, target: Pokemon, _move: Move): number {
    return target.outspeeds(user) ? this.getRandomScore(user, 60) : 0;
  }
}
