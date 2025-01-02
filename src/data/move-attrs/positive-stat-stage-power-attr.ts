import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariablePowerAttr } from "#app/data/move-attrs/variable-power-attr";

/**
 * Tallies the number of positive stages for a given {@linkcode Pokemon}.
 * @param pokemon The {@linkcode Pokemon} that is being used to calculate the count of positive stats
 * @returns the amount of positive stats
 */
const countPositiveStatStages = (pokemon: Pokemon): number => {
  return pokemon.getStatStages().reduce((total, stat) => (stat && stat > 0 ? total + stat : total), 0);
};

/**
 * Attribute that increases power based on the amount of positive stat stage increases.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Stored_Power_(move) Stored Power}.
 * @extends VariablePowerAttr
 */
export class PositiveStatStagePowerAttr extends VariablePowerAttr {
  override apply(user: Pokemon, _target: Pokemon, _move: Move, power: NumberHolder): boolean {
    const positiveStatStages: number = countPositiveStatStages(user);

    power.value += positiveStatStages * 20;
    return true;
  }
}

/**
 * Punishment normally has a base power of 60,
 * but gains 20 power for every increased stat stage the target has,
 * up to a maximum of 200 base power in total.
 */
export class PunishmentPowerAttr extends VariablePowerAttr {
  private PUNISHMENT_MIN_BASE_POWER = 60;
  private PUNISHMENT_MAX_BASE_POWER = 200;

  /** Increases power by 20 * the number of the target's stat stages */
  override apply(_user: Pokemon, target: Pokemon, _move: Move, power: NumberHolder): boolean {
    const positiveStatStages: number = countPositiveStatStages(target);
    power.value = Math.min(this.PUNISHMENT_MAX_BASE_POWER, this.PUNISHMENT_MIN_BASE_POWER + positiveStatStages * 20);
    return true;
  }
}
