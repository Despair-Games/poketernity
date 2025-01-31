import { allMoves } from "#app/data/all-moves";
import { chargeAnims, moveAnims } from "#app/data/battle-anims";
import { AnimConfig } from "#app/data/anim-config";
import { BeakBlastHeaderAttr } from "#app/data/move-attrs/beak-blast-header-attr";
import { DelayedAttackAttr } from "#app/data/move-attrs/delayed-attack-attr";
import type { Moves } from "#enums/moves";
import { loadAnimAssets } from "#app/utils/anim-utils";

export function loadMoveAnimAssets(moveIds: Moves[], startLoad?: boolean): Promise<void> {
  return new Promise((resolve) => {
    const moveAnimations = moveIds.map((m) => moveAnims.get(m) as AnimConfig).flat();
    for (const moveId of moveIds) {
      const chargeAnimSource = allMoves[moveId].isChargingMove()
        ? allMoves[moveId]
        : (allMoves[moveId].getAttrs(DelayedAttackAttr)[0] ?? allMoves[moveId].getAttrs(BeakBlastHeaderAttr)[0]);
      if (chargeAnimSource) {
        const moveChargeAnims = chargeAnims.get(chargeAnimSource.chargeAnim);
        moveAnimations.push(moveChargeAnims instanceof AnimConfig ? moveChargeAnims : moveChargeAnims![0]); // TODO: is the bang correct?
        if (Array.isArray(moveChargeAnims)) {
          moveAnimations.push(moveChargeAnims[1]);
        }
      }
    }
    loadAnimAssets(moveAnimations, startLoad).then(() => resolve());
  });
}
