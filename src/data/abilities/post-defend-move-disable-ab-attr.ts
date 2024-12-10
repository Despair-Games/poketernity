import type Pokemon from "#app/field/pokemon";
import type { HitResult } from "#app/field/pokemon";
import { BattlerTagType } from "#enums/battler-tag-type";
import type Move from "../move";
import { MoveFlags } from "../move";
import { PostDefendAbAttr } from "./post-defend-ab-attr";

export class PostDefendMoveDisableAbAttr extends PostDefendAbAttr {
  private chance: integer;
  private attacker: Pokemon;
  private move: Move;

  constructor(chance: integer) {
    super();

    this.chance = chance;
  }

  override applyPostDefend(
    pokemon: Pokemon,
    _passive: boolean,
    simulated: boolean,
    attacker: Pokemon,
    move: Move,
    _hitResult: HitResult,
    _args: any[],
  ): boolean {
    if (attacker.getTag(BattlerTagType.DISABLED) === null && !move.hitsSubstitute(attacker, pokemon)) {
      if (
        move.checkFlag(MoveFlags.MAKES_CONTACT, attacker, pokemon)
        && (this.chance === -1 || pokemon.randSeedInt(100) < this.chance)
      ) {
        if (simulated) {
          return true;
        }

        this.attacker = attacker;
        this.move = move;
        this.attacker.addTag(BattlerTagType.DISABLED, 4, 0, pokemon.id);
        return true;
      }
    }
    return false;
  }
}
