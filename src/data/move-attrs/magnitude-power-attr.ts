import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { NumberHolder } from "#app/utils";
import { randSeedInt } from "#app/utils";
import i18next from "i18next";
import type { Move } from "#app/data/move";
import { VariablePowerAttr } from "#app/data/move-attrs/variable-power-attr";

export const magnitudeMessageFunc = (_user: Pokemon, _target: Pokemon, _move: Move) => {
  let message: string;
  globalScene.executeWithSeedOffset(
    () => {
      const magnitudeThresholds = [5, 15, 35, 65, 75, 95];

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
  return message!;
};

export class MagnitudePowerAttr extends VariablePowerAttr {
  override apply(_user: Pokemon, _target: Pokemon, _move: Move, args: any[]): boolean {
    const power = args[0] as NumberHolder;

    const magnitudeThresholds = [5, 15, 35, 65, 75, 95];
    const magnitudePowers = [10, 30, 50, 70, 90, 100, 110, 150];

    let rand: number;

    globalScene.executeWithSeedOffset(
      () => (rand = randSeedInt(100)),
      globalScene.currentBattle.turn << 6,
      globalScene.waveSeed,
    );

    let m = 0;
    for (; m < magnitudeThresholds.length; m++) {
      if (rand! < magnitudeThresholds[m]) {
        break;
      }
    }

    power.value = magnitudePowers[m];

    return true;
  }
}
