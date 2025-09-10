import { LegacyAnimConfig } from "#animations/anim-config";
import { chargeAnims } from "#animations/charge-anims";
import { moveAnims } from "#animations/move-anims";
import { globalScene } from "#app/global-scene";
import { allMoves } from "#data/data-lists";
import { MoveId } from "#enums/move-id";
import { initMoveChargeAnim } from "#init/init-move-charge-anim";
import { BeakBlastHeaderAttr } from "#moves/beak-blast-header-attr";
import { DelayedAttackAttr } from "#moves/delayed-attack-attr";
import type { ChargingMove } from "#moves/move";
import { animationFileName } from "#utils/string-utils";

//#region Exports

export function initMoveAnim(move: MoveId): Promise<void> {
  return new Promise((resolve) => {
    if (moveAnims.has(move)) {
      if (moveAnims.get(move) !== null) {
        resolve();
      } else {
        const loadedCheckTimer = setInterval(() => {
          if (moveAnims.get(move) !== null) {
            const chargeAnimSource = allMoves.get(move).isChargingMove()
              ? (allMoves.get(move) as ChargingMove)
              : (allMoves.get(move).getAttrs(DelayedAttackAttr)[0]
                ?? allMoves.get(move).getAttrs(BeakBlastHeaderAttr)[0]);
            if (chargeAnimSource && chargeAnims.get(chargeAnimSource.chargeAnim) === null) {
              return;
            }
            clearInterval(loadedCheckTimer);
            resolve();
          }
        }, 50);
      }
    } else {
      moveAnims.set(move, null);
      let defaultMoveAnim: MoveId = MoveId.TAIL_WHIP;
      if (allMoves.get(move).isAttackMove()) {
        defaultMoveAnim = MoveId.TACKLE;
      } else if (allMoves.get(move).isSelfStatusMove()) {
        defaultMoveAnim = MoveId.FOCUS_ENERGY;
      }

      const fetchAnimAndResolve = (move: MoveId) => {
        globalScene
          .cachedFetch(`./battle-anims/${animationFileName(move)}.json`)
          .then((response) => {
            const contentType = response.headers.get("content-type");
            if (!response.ok || contentType?.indexOf("application/json") === -1) {
              useDefaultAnim(move, defaultMoveAnim);
              logMissingMoveAnim(move, response.status, response.statusText);
              return resolve();
            }
            return response.json();
          })
          .then((ba) => {
            if (Array.isArray(ba)) {
              populateMoveAnim(move, ba[0]);
              populateMoveAnim(move, ba[1]);
            } else {
              populateMoveAnim(move, ba);
            }
            const chargeAnimSource = allMoves.get(move).isChargingMove()
              ? (allMoves.get(move) as ChargingMove)
              : (allMoves.get(move).getAttrs(DelayedAttackAttr)[0]
                ?? allMoves.get(move).getAttrs(BeakBlastHeaderAttr)[0]);
            if (chargeAnimSource) {
              initMoveChargeAnim(chargeAnimSource.chargeAnim).then(() => resolve());
            } else {
              resolve();
            }
          })
          .catch((error) => {
            useDefaultAnim(move, defaultMoveAnim);
            logMissingMoveAnim(move, error);
            return resolve();
          });
      };
      fetchAnimAndResolve(move);
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
function useDefaultAnim(move: MoveId, defaultMoveAnim: MoveId) {
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
function logMissingMoveAnim(move: MoveId, ...optionalParams: any[]) {
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
