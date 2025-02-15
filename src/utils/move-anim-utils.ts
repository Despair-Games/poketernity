import { allMoves } from "#app/data/data-lists";
import { chargeAnims } from "#app/data/charge-anims";
import { moveAnims } from "#app/data/move-anims";
import { AnimConfig } from "#app/data/anim-config";
import { BeakBlastHeaderAttr } from "#app/data/move-attrs/beak-blast-header-attr";
import { DelayedAttackAttr } from "#app/data/move-attrs/delayed-attack-attr";
import { loadAnimAssets } from "#app/utils/anim-utils";
import type { MoveId } from "#enums/move-id";

export function loadMoveAnimAssets(moveIds: MoveId[], startLoad?: boolean): Promise<void> {
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
