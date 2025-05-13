import { chargeAnims } from "#animations/charge-anims";
import { moveAnims } from "#animations/move-anims";
import { allMoves } from "#data/data-lists";
import type { MoveId } from "#enums/move-id";
import { BeakBlastHeaderAttr } from "#moves/beak-blast-header-attr";
import { DelayedAttackAttr } from "#moves/delayed-attack-attr";
import type { ChargingMove } from "#moves/move";
import { loadAnimAssets } from "#utils/anim-utils";

export function loadMoveAnimAssets(moveIds: MoveId[], startLoad?: boolean): Promise<void> {
  return new Promise((resolve) => {
    const moveAnimations = moveIds.flatMap((m) => moveAnims.get(m)!);

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
