import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { VariablePowerAttr } from "#moves/variable-power-attr";
import type { NumberHolder } from "#utils/common-utils";

/**
 * Attribute to scale move power inversely with its remaining PP.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Trump_Card_(move) | Trump Card}.
 */
export class LessPPMorePowerAttr extends VariablePowerAttr {
  override apply(user: Pokemon, _target: Pokemon, move: Move, power: NumberHolder): boolean {
    const ppMax = move.pp;
    const ppUsed = user.getMoveset().find((m) => m.moveId === move.id)?.ppUsed ?? 0;

    let ppRemains = ppMax - ppUsed;
    // Reduce to 0 to avoid negative numbers if user has 1PP before attack and target has Pressure
    if (ppRemains < 0) {
      ppRemains = 0;
    }

    switch (ppRemains) {
      case 0:
        power.value = 200;
        break;
      case 1:
        power.value = 80;
        break;
      case 2:
        power.value = 60;
        break;
      case 3:
        power.value = 50;
        break;
      default:
        power.value = 40;
        break;
    }
    return true;
  }
}
