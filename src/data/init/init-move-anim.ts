import { LegacyAnimConfig } from "#animations/anim-config";
import { chargeAnims } from "#animations/charge-anims";
import { moveAnims } from "#animations/move-anims";
import { globalScene } from "#app/global-scene";
import { allMoves } from "#data/data-lists";
import { MoveId } from "#enums/move-id";
import { initMoveChargeAnim } from "#init/init-move-charge-anim";
import { BeakBlastHeaderAttr } from "#moves/beak-blast-header-attr";
import { DelayedAttackAttr } from "#moves/delayed-attack-attr";
import type { Move } from "#moves/move";
import { animationFileName } from "#utils/string-utils";

//#region Exports

export async function initMoveAnim(moveId: MoveId): Promise<void> {
  return new Promise((resolve) => {
    const move = allMoves.get(moveId);
    if (moveAnims.has(moveId)) {
      if (moveAnims.get(moveId) === null) {
        const loadedCheckTimer = setInterval(() => {
          if (moveAnims.get(moveId) !== null) {
            const chargeAnimSource = move.isChargingMove()
              ? move
              : (move.getAttrs(DelayedAttackAttr)[0] ?? move.getAttrs(BeakBlastHeaderAttr)[0]);
            if (chargeAnimSource && chargeAnims.get(chargeAnimSource.chargeAnim) === null) {
              return;
            }
            clearInterval(loadedCheckTimer);
            resolve();
          }
        }, 50);
      } else {
        resolve();
      }
    } else {
      moveAnims.set(moveId, null);
      let defaultMoveAnim: MoveId = MoveId.TAIL_WHIP;
      if (move.isAttackMove()) {
        defaultMoveAnim = MoveId.TACKLE;
      } else if ((move as Move).isSelfStatusMove()) {
        defaultMoveAnim = MoveId.FOCUS_ENERGY;
      }

      globalScene
        .cachedFetch(`./battle-anims/${animationFileName(moveId)}.json`)
        .then((response) => {
          const contentType = response.headers.get("content-type");
          if (!response.ok || contentType?.indexOf("application/json") === -1) {
            useDefaultAnim(moveId, defaultMoveAnim);
            logMissingMoveAnim(moveId, response.status, response.statusText);
            return resolve();
          }
          return response.json();
        })
        .then((ba) => {
          if (Array.isArray(ba)) {
            populateMoveAnim(moveId, ba[0]);
            populateMoveAnim(moveId, ba[1]);
          } else {
            populateMoveAnim(moveId, ba);
          }
          const chargeAnimSource = move.isChargingMove()
            ? move
            : (move.getAttrs(DelayedAttackAttr)[0] ?? move.getAttrs(BeakBlastHeaderAttr)[0]);
          if (chargeAnimSource) {
            // biome-ignore lint/nursery/noNestedPromises: not sure how to fix
            initMoveChargeAnim(chargeAnimSource.chargeAnim).then(() => resolve());
          } else {
            resolve();
          }
        })
        .catch((error) => {
          useDefaultAnim(moveId, defaultMoveAnim);
          logMissingMoveAnim(moveId, error);
          return resolve();
        });
    }
  });
}

//#endregion
//#region Helpers

/**
 * Populates the default animation for the given move.
 *
 * @param move the move to populate an animation for
 * @param defaultMoveAnim the move to use as the default animation
 */
function useDefaultAnim(move: MoveId, defaultMoveAnim: MoveId): void {
  populateMoveAnim(move, moveAnims.get(defaultMoveAnim));
}

/**
 * Helper method for printing a warning to the console when a move animation is missing.
 *
 * @param move the move to populate an animation for
 * @param optionalParams parameters to add to the error logging
 *
 * @remarks use {@linkcode useDefaultAnim} to use a default animation
 */
function logMissingMoveAnim(move: MoveId, ...optionalParams: any[]): void {
  const moveName = animationFileName(move);
  console.warn(`Could not load animation file for move '${moveName}'`, ...optionalParams);
}

function populateMoveAnim(move: MoveId, animSource: any): void {
  const moveAnim = new LegacyAnimConfig(animSource);
  if (moveAnims.get(move) === null) {
    moveAnims.set(move, moveAnim);
    return;
  }
  moveAnims.set(move, [moveAnims.get(move) as LegacyAnimConfig, moveAnim]);
}

//#endregion
