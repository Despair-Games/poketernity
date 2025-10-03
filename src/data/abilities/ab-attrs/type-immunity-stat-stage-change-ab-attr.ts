import { TypeImmunityAbAttr } from "#abilities/type-immunity-ab-attr";
import { globalScene } from "#app/global-scene";
import type { ElementalType } from "#enums/elemental-type";
import type { BattleStat } from "#enums/stat";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import type { AbAttrCondition } from "#types/ability-types";
import type { ValueHolder } from "#utils/common-utils";

export class TypeImmunityStatStageChangeAbAttr extends TypeImmunityAbAttr {
  private readonly stat: BattleStat;
  private readonly stages: number;

  constructor(immuneType: ElementalType, stat: BattleStat, stages: number, condition?: AbAttrCondition) {
    super(immuneType, condition);

    this.stat = stat;
    this.stages = stages;
  }

  public override apply(
    pokemon: Pokemon,
    simulated: boolean,
    attacker: Pokemon,
    move: Move,
    cancelled: ValueHolder<boolean>,
    typeMultiplier: ValueHolder<number>,
  ): void {
    super.apply(pokemon, simulated, attacker, move, cancelled, typeMultiplier);
    if (!simulated) {
      globalScene.phaseManager.createAndUnshiftPhase(
        "StatStageChangePhase",
        pokemon.getBattlerIndex(),
        pokemon,
        [this.stat],
        this.stages,
      );
    }
  }

  // The StatStageChangePhase from this effect takes the place of the default trigger message
  public override getTriggerMessage(_pokemon: Pokemon, _abilityName: string): string | null {
    return null;
  }
}
