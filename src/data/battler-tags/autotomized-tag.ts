import { BattlerTag } from "#app/data/battler-tags/battler-tag";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import i18next from "i18next";

/**
 * Battler Tag that keeps track of how many times the user has Autotomized
 * Each count of Autotomization reduces the weight by 100kg
 */
export class AutotomizedTag extends BattlerTag {
  public autotomizeCount: number = 0;
  constructor(sourceMoveId: MoveId = MoveId.AUTOTOMIZE) {
    super(BattlerTagType.AUTOTOMIZED, BattlerTagLapseType.CUSTOM, 1, sourceMoveId);
  }

  /**
   * Adds an autotomize count to the Pokemon. Each stack reduces weight by 100kg
   * If the Pokemon is over 0.1kg it also displays a message.
   * @param pokemon The Pokemon that is being autotomized
   */
  override onAdd(pokemon: Pokemon): void {
    const minWeight = 0.1;
    if (pokemon.getWeight() > minWeight) {
      globalScene.queueMessage(
        i18next.t("battlerTags:autotomizeOnAdd", {
          pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
        }),
      );
    }
    this.autotomizeCount += 1;
  }

  override onOverlap(pokemon: Pokemon): void {
    this.onAdd(pokemon);
  }
}
