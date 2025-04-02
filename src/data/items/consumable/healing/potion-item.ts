import type { Percentage } from "#app/@types/Percentage";
import type { Pokemon } from "#app/field/pokemon";
import { ItemId } from "#enums/ItemId";
import { t } from "i18next";
import { HealingItem } from "../healing-item";
import { percentToNumber } from "#app/utils";

export class PotionItem extends HealingItem {
  public override id: ItemId;

  /** The absolute amount of HP to be restored */
  private healAmount?: number;
  /** The (alternate) percentage amount of HP to be restored */
  private healAmountPercent: Percentage;

  constructor(id: ItemId) {
    super();
    switch (id) {
      case ItemId.POTION:
        this.healAmount = 20;
        this.healAmountPercent = "10%";
        break;
      case ItemId.SUPER_POTION:
        this.healAmount = 50;
        this.healAmountPercent = "25%";
        break;
      case ItemId.HYPER_POTION:
        this.healAmount = 200;
        this.healAmountPercent = "50%";
        break;
      case ItemId.MAX_POTION:
        this.healAmountPercent = "100%";
        break;
      default:
        throw new Error(`Invalid healing-item id: ${ItemId[id]} (=${id})`);
    }
  }

  override get name(): string {
    return t(`item:potion.${ItemId[this.id]}.name`);
  }

  override get description(): string {
    const { healAmount, healAmountPercent } = this;
    return t(`item:potion.description`, { healAmount, healAmountPercent });
  }

  public override onHeal(pokemon: Pokemon, quiet?: boolean): void {
    const absoluteHealAmount = this.healAmount ?? 0;
    const percentHealAmount = pokemon.getMaxHp() * percentToNumber(this.healAmountPercent);

    const healAmount = Math.max(absoluteHealAmount, percentHealAmount);
    pokemon.heal(healAmount, quiet);
  }
}
