import { BattlerTagType } from "#enums/battler-tag-type";
import { AddBattlerTagAttr } from "./add-battler-tag-attr";

/**
 * Adds a {@link https://bulbapedia.bulbagarden.net/wiki/Seeding | Seeding} effect to the target
 * as seen with Leech Seed and Sappy Seed.
 * @extends AddBattlerTagAttr
 */
export class LeechSeedAttr extends AddBattlerTagAttr {
  constructor() {
    super(BattlerTagType.SEEDED);
  }
}
