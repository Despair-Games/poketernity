import type { FlinchEffectAbAttr } from "#app/data/abilities/ab-attrs/flinch-effect-ab-attr";
import { applyAbAttrs } from "#app/data/abilities/apply-ab-attrs";
import { BattlerTag } from "#app/data/battler-tags/battler-tag";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import type { MovePhase } from "#app/phases/move-phase";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { MoveId } from "#enums/move-id";
import i18next from "i18next";

/**
 * Tag representing the {@link https://bulbapedia.bulbagarden.net/wiki/Flinch | Flinch} status condition
 * @extends BattlerTag
 */
export class FlinchedTag extends BattlerTag {
  constructor(sourceMoveId: MoveId) {
    super(BattlerTagType.FLINCHED, [BattlerTagLapseType.PRE_MOVE, BattlerTagLapseType.TURN_END], 0, sourceMoveId);
  }

  override canAdd(pokemon: Pokemon): boolean {
    return !pokemon.isMax();
  }

  override onAdd(pokemon: Pokemon): void {
    super.onAdd(pokemon);

    applyAbAttrs<FlinchEffectAbAttr>(AbAttrFlag.FLINCH_EFFECT, pokemon, false);
  }

  /**
   * Cancels the Pokemon's next Move on the turn this tag is applied
   * @param pokemon The {@linkcode Pokemon} with this tag
   * @param lapseType The {@linkcode BattlerTagLapseType lapse type} used for this function call
   * @returns `false` (This tag is always removed after applying its effects)
   */
  override lapse(pokemon: Pokemon, lapseType: BattlerTagLapseType): boolean {
    if (lapseType === BattlerTagLapseType.PRE_MOVE) {
      (globalScene.phaseManager.getCurrentPhase() as MovePhase).cancel();
      globalScene.phaseManager.queueMessagePhase(
        i18next.t("battlerTags:flinchedLapse", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
      );
    }

    return super.lapse(pokemon, lapseType);
  }

  override getDescriptor(): string {
    return i18next.t("battlerTags:flinchedDesc");
  }
}
