import { TypeImmunityAbAttr } from "#abilities/type-immunity-ab-attr";
import { globalScene } from "#app/global-scene";
import type { ElementalType } from "#enums/elemental-type";
import type { BattleStat } from "#enums/stat";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { StatStageChangePhase } from "#phases/stat-stage-change-phase";
import type { AbAttrCondition } from "#types/ab-attr-condition";
import type { BooleanHolder, NumberHolder } from "#utils/common-utils";

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
    cancelled: BooleanHolder,
    typeMultiplier: NumberHolder,
  ): boolean {
    const ret = super.apply(pokemon, simulated, attacker, move, cancelled, typeMultiplier);

    if (ret) {
      cancelled.value = true; // Suppresses "No Effect" message
      if (!simulated) {
        globalScene.phaseManager.unshiftPhase(
          new StatStageChangePhase(pokemon.getBattlerIndex(), pokemon, [this.stat], this.stages),
        );
      }
    }

    return ret;
  }
}
