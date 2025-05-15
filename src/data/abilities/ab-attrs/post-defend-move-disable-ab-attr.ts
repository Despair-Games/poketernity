import { PostDefendAbAttr } from "#abilities/post-defend-ab-attr";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveFlags } from "#enums/move-flags";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";

export class PostDefendMoveDisableAbAttr extends PostDefendAbAttr {
  private readonly chance: number;

  constructor(chance: number) {
    super();

    this.chance = chance;
  }

  override apply(pokemon: Pokemon, simulated: boolean, attacker: Pokemon, move: Move): boolean {
    if (attacker.getTag(BattlerTagType.DISABLED) === null) {
      if (
        move.checkFlag(MoveFlags.MAKES_CONTACT, attacker, pokemon)
        && (this.chance === -1 || pokemon.randSeedInt(100) < this.chance)
        && !attacker.isMax()
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
