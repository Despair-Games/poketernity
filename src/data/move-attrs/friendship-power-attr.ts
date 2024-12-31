import { type Pokemon, PlayerPokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariablePowerAttr } from "#app/data/move-attrs/variable-power-attr";

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
