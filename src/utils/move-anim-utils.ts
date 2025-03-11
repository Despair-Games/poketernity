import { allMoves } from "#app/data/data-lists";
import { chargeAnims } from "#app/data/animations/charge-anims";
import type { ChargingMove } from "#app/data/moves/move";
import { moveAnims } from "#app/data/animations/move-anims";
import { BeakBlastHeaderAttr } from "#app/data/moves/move-attrs/beak-blast-header-attr";
import { DelayedAttackAttr } from "#app/data/moves/move-attrs/delayed-attack-attr";
import { loadAnimAssets } from "#app/utils/anim-utils";
import type { MoveId } from "#enums/move-id";

export function loadMoveAnimAssets(moveIds: MoveId[], startLoad?: boolean): Promise<void> {
  return new Promise((resolve) => {
    const moveAnimations = moveIds.map((m) => moveAnims.get(m)!).flat();

    for (const moveId of moveIds) {
      const chargeAnimSource = allMoves.get(moveId).isChargingMove()
        ? (allMoves.get(moveId) as ChargingMove)
        : (allMoves.get(moveId).getAttrs(DelayedAttackAttr)[0]
          ?? allMoves.get(moveId).getAttrs(BeakBlastHeaderAttr)[0]);

      if (!chargeAnimSource) {
        continue;
      }

      const moveChargeAnims = chargeAnims.get(chargeAnimSource.chargeAnim);

      if (Array.isArray(moveChargeAnims)) {
        moveAnimations.push(moveChargeAnims[0]);
        moveAnimations.push(moveChargeAnims[1]);
      } else if (moveChargeAnims) {
        moveAnimations.push(moveChargeAnims);
      }
    }

    loadAnimAssets(moveAnimations, startLoad).then(() => resolve());
  });
}
