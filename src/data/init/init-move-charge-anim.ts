import { chargeAnims } from "../animations/charge-anims";
import { AnimConfig } from "../animations/anim-config";
import { globalScene } from "#app/global-scene";
import { ChargeAnim } from "#enums/charge-anim";

//#region Exports

export function initMoveChargeAnim(chargeAnim: ChargeAnim): Promise<void> {
  return new Promise((resolve) => {
    if (chargeAnims.has(chargeAnim)) {
      if (chargeAnims.get(chargeAnim) !== null) {
        resolve();
      } else {
        const loadedCheckTimer = setInterval(() => {
          if (chargeAnims.get(chargeAnim) !== null) {
            clearInterval(loadedCheckTimer);
            resolve();
          }
        }, 50);
      }
    } else {
      chargeAnims.set(chargeAnim, null);
      globalScene
        .cachedFetch(`./battle-anims/${ChargeAnim[chargeAnim].toLowerCase().replace(/\_/g, "-")}.json`)
        .then((response) => response.json())
        .then((ca) => {
          if (Array.isArray(ca)) {
            populateMoveChargeAnim(chargeAnim, ca[0]);
            populateMoveChargeAnim(chargeAnim, ca[1]);
          } else {
            populateMoveChargeAnim(chargeAnim, ca);
          }
          resolve();
        });
    }
  });
}

//#endregion
//#region Helpers

function populateMoveChargeAnim(chargeAnim: ChargeAnim, animSource: any) {
  const moveChargeAnim = new AnimConfig(animSource);
  if (chargeAnims.get(chargeAnim) === null) {
    chargeAnims.set(chargeAnim, moveChargeAnim);
    return;
  }
  chargeAnims.set(chargeAnim, [chargeAnims.get(chargeAnim) as AnimConfig, moveChargeAnim]);
}

//#endregion
