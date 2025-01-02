import { type Pokemon, PlayerPokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariablePowerAttr } from "#app/data/move-attrs/variable-power-attr";

/**
 * Attribute to set move power proportional to the user's friendship level.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Return_(move) Return},
 * {@link https://bulbapedia.bulbagarden.net/wiki/Pika_Papow_(move) Pika Papow},
 * and {@link https://bulbapedia.bulbagarden.net/wiki/Veevee_Volley_(move) Veevee Volley}.
 * @extends VariablePowerAttr
 */
export class FriendshipPowerAttr extends VariablePowerAttr {
  private invert: boolean;

  constructor(invert?: boolean) {
    super();

    this.invert = !!invert;
  }

  /** Sets the given move's power proportional to the user's friendship level */
  override apply(user: Pokemon, _target: Pokemon, _move: Move, power: NumberHolder): boolean {
    const friendshipPower = Math.floor(
      Math.min(user instanceof PlayerPokemon ? user.friendship : user.species.baseFriendship, 255) / 2.5,
    );
    power.value = Math.max(!this.invert ? friendshipPower : 102 - friendshipPower, 1);

    return true;
  }
}
