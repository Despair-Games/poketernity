import { AbilityBattlerTag } from "#app/data/battler-tags/ability-battler-tag";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { AbilityId } from "#enums/ability-id";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import i18next from "i18next";

/**
 * Tag representing the effects of {@link https://bulbapedia.bulbagarden.net/wiki/Slow_Start_(Ability) | Slow Start}.
 * Halves the owner's Attack and Speed stats for 5 turns.
 * @extends AbilityBattlerTag
 */
export class SlowStartTag extends AbilityBattlerTag {
  constructor() {
    super(BattlerTagType.SLOW_START, AbilityId.SLOW_START, BattlerTagLapseType.TURN_END, 5);
  }

  override onAdd(pokemon: Pokemon): void {
    super.onAdd(pokemon);

    globalScene.queueMessage(
      i18next.t("battlerTags:slowStartOnAdd", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
      null,
      false,
      null,
      true,
    );
  }

  override lapse(pokemon: Pokemon, lapseType: BattlerTagLapseType): boolean {
    if (!pokemon.hasAbility(this.ability)) {
      this.turnCount = 1;
    }

    return super.lapse(pokemon, lapseType);
  }

  override onRemove(pokemon: Pokemon): void {
    super.onRemove(pokemon);

    globalScene.queueMessage(
      i18next.t("battlerTags:slowStartOnRemove", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
      null,
      false,
      null,
    );
  }
}
