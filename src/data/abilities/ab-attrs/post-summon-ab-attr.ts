import { AbAttr } from "#abilities/ab-attr";
import type { BaseAbAttrParams } from "#types/ab-attr-param-types";
import type { AbAttrKey } from "#types/ability-types";

/** Base class for effects that activate when the source Pokemon enters the field. */
// TODO: Most post-summon abilities should activate when the pokemon gains the ability (such as from Skill Swap)
// cf https://github.com/pagefaultgames/pokerogue/pull/5146
export abstract class PostSummonAbAttr extends AbAttr {
  protected override readonly abAttrKey: AbAttrKey = "PostSummonAbAttr";

  constructor(showAbility: boolean = true) {
    super(showAbility);
  }

  public abstract override apply(params: BaseAbAttrParams): void;
}
