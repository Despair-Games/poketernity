import { Abilities } from "#enums/abilities";
import { MultiHitType } from "#enums/multi-hit-type";
import { Species } from "#enums/species";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { ChangeMultiHitTypeAttr } from "#app/data/move-attrs/change-multi-hit-type-attr";

export class WaterShurikenMultiHitTypeAttr extends ChangeMultiHitTypeAttr {
  override apply(user: Pokemon, _target: Pokemon, _move: Move, args: any[]): boolean {
    if (user.species.speciesId === Species.GRENINJA && user.hasAbility(Abilities.BATTLE_BOND) && user.formIndex === 2) {
      (args[0] as NumberHolder).value = MultiHitType._3;
      return true;
    }
    return false;
  }
}
