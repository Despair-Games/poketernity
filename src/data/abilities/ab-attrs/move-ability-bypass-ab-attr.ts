import { AbAttr } from "#abilities/ab-attr";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import type { MoveAbilityBypassAbAttrParams } from "#types/ab-attr-param-types";

type MoveIgnoreFunc = (pokemon: Pokemon, move: Move) => boolean;

export class MoveAbilityBypassAbAttr extends AbAttr {
  protected override readonly abAttrKey = "MoveAbilityBypassAbAttr";

  private readonly moveIgnoreFunc: MoveIgnoreFunc;

  constructor(moveIgnoreFunc: MoveIgnoreFunc = () => true) {
    super(false);

    this.moveIgnoreFunc = moveIgnoreFunc;
  }

  public override apply({ cancelled }: MoveAbilityBypassAbAttrParams): void {
    cancelled.value = true;
  }

  public override canApply({ pokemon, move }: Parameters<this["apply"]>[0]): boolean {
    return this.moveIgnoreFunc(pokemon, move);
  }
}
