import { PostDefendAbAttr } from "#abilities/post-defend-ab-attr";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveFlags } from "#enums/move-flags";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";

export class PostDefendMoveDisableAbAttr extends PostDefendAbAttr {
  // TODO: create a generic way to do ability chances, like with moves
  /** Works the same as move effect chances: `-1` for "always", otherwise % chance to activate */
  private readonly chance: number;

  constructor(chance: number) {
    super();

    this.chance = chance;
  }

  public override apply(pokemon: Pokemon, simulated: boolean, attacker: Pokemon, _move: Move): void {
    if (!simulated) {
      attacker.addTag(BattlerTagType.DISABLED, 4, 0, pokemon.id);
    }
  }

  public override canApply(...[pokemon, , attacker, move]: Parameters<this["apply"]>): boolean {
    return (
      !attacker.hasTag(BattlerTagType.DISABLED)
      && move.checkFlag(MoveFlags.MAKES_CONTACT, attacker, pokemon)
      && (this.chance === -1 || pokemon.randSeedInt(100) < this.chance)
      && !attacker.isMax()
      && attacker.canAddTag(BattlerTagType.DISABLED)
    );
  }
}
