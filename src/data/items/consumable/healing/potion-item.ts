import { type HealingItemHealAmounts } from "./healing-item";
import { HealingItem } from "./healing-item";
import type { Pokemon } from "#app/field/pokemon";
import { ItemId } from "#enums/ItemId";
import { t } from "i18next";

export class PotionItem extends HealingItem {
  public override id: ItemId = ItemId.POTION;

  protected override healAmounts: HealingItemHealAmounts = [20, "100%"];

  override get name(): string {
    return t("item:potion.name"); // TODO: Show already translated modifier stuff
  }

  override get description(): string {
    return t("item:potion.description"); // TODO: Show already translated modifier stuff
  }

  public override onHeal(pokemon: Pokemon, quiet?: boolean): void {
    const healAmount = this.getHealAmount(pokemon);
    pokemon.heal(healAmount, quiet);
  }
}
