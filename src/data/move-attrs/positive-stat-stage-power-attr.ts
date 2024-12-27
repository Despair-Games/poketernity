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
 */

export class PositiveStatStagePowerAttr extends VariablePowerAttr {
  /**
   * @param user The pokemon that is being used to calculate the amount of positive stats
   * @param _target N/A
   * @param _move N/A
   * @param args The argument for VariablePowerAttr, accumulates and sets the amount of power multiplied by stats
   * @returns Returns `true` if attribute is applied
   */
  override apply(user: Pokemon, _target: Pokemon, _move: Move, args: any[]): boolean {
    const positiveStatStages: number = countPositiveStatStages(user);

    (args[0] as NumberHolder).value += positiveStatStages * 20;
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

  /**
   * @param _user N/A
   * @param target The pokemon that the move is being used against, as well as calculating the stats for the min/max base power
   * @param _move N/A
   * @param args The value that is being changed due to VariablePowerAttr
   * @returns Returns true if attribute is applied
   */
  override apply(_user: Pokemon, target: Pokemon, _move: Move, args: any[]): boolean {
    const positiveStatStages: number = countPositiveStatStages(target);
    (args[0] as NumberHolder).value = Math.min(
      this.PUNISHMENT_MAX_BASE_POWER,
      this.PUNISHMENT_MIN_BASE_POWER + positiveStatStages * 20,
    );
    return true;
  }
}
