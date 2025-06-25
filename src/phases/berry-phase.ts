import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import type { HealFromBerryUseAbAttr } from "#abilities/heal-from-berry-use-ab-attr";
import type { PreventBerryUseAbAttr } from "#abilities/prevent-berry-use-ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { CommonAnim } from "#enums/common-anim";
import { BerryUsedEvent } from "#events/battle-scene";
import { BerryModifier } from "#modifier/modifier";
import { FieldPhase } from "#phases/base/field-phase";
import { BooleanHolder } from "#utils/common-utils";
import i18next from "i18next";

/**
 * The phase after attacks where the pokemon eat berries
 */
export class BerryPhase extends FieldPhase {
  public override readonly phaseName = "BerryPhase";

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
          globalScene.phaseManager.createAndUnshiftPhase(
            "MessagePhase",
            i18next.t("abilityTriggers:preventBerryUse", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
          );
        } else {
          globalScene.phaseManager.createAndUnshiftPhase(
            "CommonAnimPhase",
            CommonAnim.USE_ITEM,
            pokemon.getBattlerIndex(),
            pokemon.getBattlerIndex(),
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
