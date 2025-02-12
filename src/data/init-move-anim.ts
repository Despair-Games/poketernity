import { allMoves } from "#app/data/data-lists";
import { chargeAnims } from "./charge-anims";
import { moveAnims } from "./move-anims";
import { AnimConfig } from "./anim-config";
import { initMoveChargeAnim } from "./init-move-charge-anim";
import type { Move } from "#app/data/move";
import { BeakBlastHeaderAttr } from "#app/data/move-attrs/beak-blast-header-attr";
import { DelayedAttackAttr } from "#app/data/move-attrs/delayed-attack-attr";
import { globalScene } from "#app/global-scene";
import { animationFileName } from "#app/utils";
import { MoveId } from "#enums/move-id";

//#region Exports

export function initMoveAnim(move: MoveId): Promise<void> {
  return new Promise((resolve) => {
    if (moveAnims.has(move)) {
      if (moveAnims.get(move) !== null) {
        resolve();
      } else {
        const loadedCheckTimer = setInterval(() => {
          if (moveAnims.get(move) !== null) {
            const chargeAnimSource = allMoves[move].isChargingMove()
              ? allMoves[move]
              : (allMoves[move].getAttrs(DelayedAttackAttr)[0] ?? allMoves[move].getAttrs(BeakBlastHeaderAttr)[0]);
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
      const defaultMoveAnim = allMoves[move].isAttackMove()
        ? MoveId.TACKLE
        : (allMoves[move] as Move).isSelfStatusMove() // as Move is necessary for the ts-compiler
          ? MoveId.FOCUS_ENERGY
          : MoveId.TAIL_WHIP;

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
            const chargeAnimSource = allMoves[move].isChargingMove()
              ? allMoves[move]
              : (allMoves[move].getAttrs(DelayedAttackAttr)[0] ?? allMoves[move].getAttrs(BeakBlastHeaderAttr)[0]);
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
  const moveAnim = new AnimConfig(animSource);
  if (moveAnims.get(move) === null) {
    moveAnims.set(move, moveAnim);
    return;
  }
  moveAnims.set(move, [moveAnims.get(move) as AnimConfig, moveAnim]);
}

//#endregion
