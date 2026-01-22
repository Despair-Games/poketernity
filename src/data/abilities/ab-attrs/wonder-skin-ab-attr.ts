import { PreDefendAbAttr } from "#abilities/pre-defend-ab-attr";
import { MoveCategory } from "#enums/move-category";
import type { WonderSkinAbAttrParams } from "#types/ab-attr-param-types";

/**
 * Reduces the accuracy of status moves used against the Pokémon with this ability to 50%.
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Wonder_Skin_(Ability) | Wonder Skin (Bulbapedia)}
 */
export class WonderSkinAbAttr extends PreDefendAbAttr {
  protected override readonly abAttrKey = "WonderSkinAbAttr";

  public override apply({ moveAccuracy }: WonderSkinAbAttrParams): void {
    moveAccuracy.value = 50;
  }

  public override canApply({ move, moveAccuracy }: Parameters<this["apply"]>[0]): boolean {
    return move.category === MoveCategory.STATUS && moveAccuracy.value > 50;
  }
}
