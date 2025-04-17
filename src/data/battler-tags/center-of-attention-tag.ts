import { BattlerTag } from "#app/data/battler-tags/battler-tag";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import i18next from "i18next";

/**
 * Applies the "Center of Attention" volatile status effect, the effect applied by Follow Me, Rage Powder, and Spotlight.
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Center_of_attention | Center of Attention}
 * @extends BattlerTag
 */
export class CenterOfAttentionTag extends BattlerTag {
  public powder: boolean;

  constructor(sourceMoveId: MoveId) {
    super(BattlerTagType.CENTER_OF_ATTENTION, BattlerTagLapseType.TURN_END, 1, sourceMoveId);

    this.powder = this.sourceMoveId === MoveId.RAGE_POWDER;
  }

  /** "Center of Attention" can't be added if an ally is already the Center of Attention. */
  override canAdd(pokemon: Pokemon): boolean {
    return !pokemon.getField().find((p) => p.getTag(BattlerTagType.CENTER_OF_ATTENTION));
  }

  override onAdd(pokemon: Pokemon): void {
    super.onAdd(pokemon);

    globalScene.phaseManager.queueMessagePhase(
      i18next.t("battlerTags:centerOfAttentionOnAdd", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
    );
  }
}
