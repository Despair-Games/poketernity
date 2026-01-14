import { globalScene } from "#app/global-scene";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { VariablePowerAttr } from "#moves/variable-power-attr";
import type { NumberHolder } from "#utils/common-utils";
import { randSeedInt } from "#utils/random-utils";
import i18next from "i18next";

// TODO: this is not correct, fix later
const magnitudeThresholds = [5, 15, 35, 65, 75, 95];

export const magnitudeMessageFunc = (_user: Pokemon, _target: Pokemon, _move: Move): string => {
  let message!: string;

  globalScene.executeWithSeedOffset(
    () => {
      const rand = randSeedInt(100);

      let m = 0;
      for (; m < magnitudeThresholds.length; m++) {
        if (rand < magnitudeThresholds[m]) {
          break;
        }
      }

      message = i18next.t("moveTriggers:magnitudeMessage", { magnitude: m + 4 });
    },
    globalScene.currentBattle.turn << 6,
    globalScene.waveSeed,
  );

  return message;
};

/**
 * Attribute to set move power based on randomly assigned
 * {@link https://bulbapedia.bulbagarden.net/wiki/Magnitude_(move) | Magnitude} level.
 */
export class MagnitudePowerAttr extends VariablePowerAttr {
  override apply(_user: Pokemon, _target: Pokemon, _move: Move, power: NumberHolder): boolean {
    const magnitudePowers = [10, 30, 50, 70, 90, 100, 110, 150];

    globalScene.executeWithSeedOffset(
      () => {
        const rand = randSeedInt(100);

        let m = 0;
        for (; m < magnitudeThresholds.length; m++) {
          if (rand < magnitudeThresholds[m]) {
            break;
          }
        }

        power.value = magnitudePowers[m];
      },
      globalScene.currentBattle.turn << 6,
      globalScene.waveSeed,
    );

    return true;
  }
}
