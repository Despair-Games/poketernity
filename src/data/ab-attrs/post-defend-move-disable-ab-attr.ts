import type { Move } from "#app/data/move";
import { MoveFlags } from "../../enums/move-flags";
import type { Pokemon } from "#app/field/pokemon";
import type { HitResult } from "#app/field/pokemon";
import { BattlerTagType } from "#enums/battler-tag-type";
import { PostDefendAbAttr } from "./post-defend-ab-attr";

export class PostDefendMoveDisableAbAttr extends PostDefendAbAttr {
  private readonly chance: number;

  constructor(chance: number) {
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
    if (attacker.getTag(BattlerTagType.DISABLED) === null) {
      if (
        move.checkFlag(MoveFlags.MAKES_CONTACT, attacker, pokemon)
        && (this.chance === -1 || pokemon.randSeedInt(100) < this.chance)
      ) {
        if (simulated) {
          return true;
        }

        attacker.addTag(BattlerTagType.DISABLED, 4, 0, pokemon.id);
        return true;
      }
    }
    return false;
  }
}
