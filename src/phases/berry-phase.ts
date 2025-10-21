import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import type { HealFromBerryUseAbAttr } from "#abilities/heal-from-berry-use-ab-attr";
import type { PreventBerryUseAbAttr } from "#abilities/prevent-berry-use-ab-attr";
import { globalScene } from "#app/global-scene";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { CommonAnim } from "#enums/common-anim";
import { BerryUsedEvent } from "#events/battle-scene";
import { BerryModifier } from "#modifier/modifier";
import { BattlePhase } from "#phases/base/battle-phase";
import { ValueHolder } from "#utils/common-utils";
import { inSpeedOrder } from "#utils/speed-order-generator";

/**
 * The phase after attacks where the pokemon eat berries
 */
export class BerryPhase extends BattlePhase {
  public override readonly phaseName = "BerryPhase";

  public override start(): void {
    for (const pokemon of inSpeedOrder()) {
      const hasUsableBerry = !!globalScene.findModifier((m) => {
        return m.isBerryModifier() && m.shouldApply(pokemon);
      }, pokemon.isPlayer());

      if (hasUsableBerry) {
        const cancelled = new ValueHolder(false);
        for (const opp of inSpeedOrder(pokemon.getOpposingArenaTagSide())) {
          applyAbAttrs<PreventBerryUseAbAttr>(AbAttrFlag.PREVENT_BERRY_USE, opp, false, pokemon, cancelled);
          if (cancelled.value) {
            return;
          }
        }

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

    this.end();
  }
}
