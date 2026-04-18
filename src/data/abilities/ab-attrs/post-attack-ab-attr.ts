import { AbAttr } from "#abilities/ab-attr";
import { MoveCategory } from "#enums/move-category";
import type { PostAttackAbAttrParams } from "#types/ab-attr-param-types";

export abstract class PostAttackAbAttr extends AbAttr {
  protected override readonly abAttrKey = "PostAttackAbAttr";

  /** Whether it only applies to attack moves. */
  private readonly attackMovesOnly: boolean;

  constructor(attackMovesOnly: boolean = true, showAbility: boolean = true) {
    super(showAbility);

    this.attackMovesOnly = attackMovesOnly;
  }

  public abstract override apply(params: PostAttackAbAttrParams): void;

  public override canApply({ pokemon, defender, move }: Parameters<this["apply"]>[0]): boolean {
    return !this.attackMovesOnly || pokemon.getMoveCategory(defender, move) !== MoveCategory.STATUS;
  }
}
