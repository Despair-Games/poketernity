import type { HealFromBerryUseAbAttr } from "#app/data/abilities/ab-attrs/heal-from-berry-use-ab-attr";
import type { PreventBerryUseAbAttr } from "#app/data/abilities/ab-attrs/prevent-berry-use-ab-attr";
import { applyAbAttrs } from "#app/data/abilities/apply-ab-attrs";
import { BerryUsedEvent } from "#app/events/battle-scene";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BerryModifier } from "#app/modifier/modifier";
import { FieldPhase } from "#app/phases/abstract-field-phase";
import { CommonAnimPhase } from "#app/phases/common-anim-phase";
import { BooleanHolder } from "#app/utils";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { CommonAnim } from "#enums/common-anim";
import { PhaseId } from "#enums/phase-id";
import i18next from "i18next";

/**
 * The phase after attacks where the pokemon eat berries
 * @extends FieldPhase
 */
export class BerryPhase extends FieldPhase {
  override readonly id = PhaseId.BERRY;

  public override start(): void {
    super.start();

    this.executeForAll((pokemon) => {
      const hasUsableBerry = !!globalScene.findModifier((m) => {
        return m.isBerryModifier() && m.shouldApply(pokemon);
      }, pokemon.isPlayer());

      if (hasUsableBerry) {
        const cancelled = new BooleanHolder(false);
        pokemon
          .getOpponents()
          .map((opp) => applyAbAttrs<PreventBerryUseAbAttr>(AbAttrFlag.PREVENT_BERRY_USE, opp, false, cancelled));

        if (cancelled.value) {
          globalScene.queueMessage(
            i18next.t("abilityTriggers:preventBerryUse", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
          );
        } else {
          globalScene.unshiftPhase(
            new CommonAnimPhase(pokemon.getBattlerIndex(), pokemon.getBattlerIndex(), CommonAnim.USE_ITEM),
          );

          for (const berryModifier of globalScene.applyModifiers(BerryModifier, pokemon.isPlayer(), pokemon)) {
            if (berryModifier.consumed) {
              berryModifier.consumed = false;
              pokemon.loseHeldItem(berryModifier);
            }
            globalScene.eventTarget.dispatchEvent(new BerryUsedEvent(berryModifier)); // Announce a berry was used
          }

          globalScene.updateModifiers(pokemon.isPlayer());

          applyAbAttrs<HealFromBerryUseAbAttr>(AbAttrFlag.HEAL_FROM_BERRY_USE, pokemon, false);
        }
      }
    });

    this.end();
  }
}
