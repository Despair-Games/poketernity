import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import type { NumberHolder } from "#app/utils";
import { randSeedInt } from "#app/utils";
import i18next from "i18next";
import type { Move } from "#app/data/move";
import { VariablePowerAttr } from "#app/data/move-attrs/variable-power-attr";

export const doublePowerChanceMessageFunc = (user: Pokemon, _target: Pokemon, move: Move) => {
  let message: string = "";
  globalScene.executeWithSeedOffset(
    () => {
      const rand = randSeedInt(100);
      if (rand < move.chance) {
        message = i18next.t("moveTriggers:goingAllOutForAttack", { pokemonName: getPokemonNameWithAffix(user) });
      }
    },
    globalScene.currentBattle.turn << 6,
    globalScene.waveSeed,
  );
  return message;
};

export class DoublePowerChanceAttr extends VariablePowerAttr {
  override apply(_user: Pokemon, _target: Pokemon, move: Move, args: any[]): boolean {
    let rand: number;
    globalScene.executeWithSeedOffset(
      () => (rand = randSeedInt(100)),
      globalScene.currentBattle.turn << 6,
      globalScene.waveSeed,
    );
    if (rand! < move.chance) {
      const power = args[0] as NumberHolder;
      power.value *= 2;
      return true;
    }

    return false;
  }
}
