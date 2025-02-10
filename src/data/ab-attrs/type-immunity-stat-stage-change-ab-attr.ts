import type { AbAttrCondition } from "#app/@types/AbAttrCondition";
import type { Move } from "#app/data/move";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { StatStageChangePhase } from "#app/phases/stat-stage-change-phase";
import type { BooleanHolder, NumberHolder } from "#app/utils";
import type { BattleStat } from "#enums/stat";
import type { ElementalType } from "#enums/elemental-type";
import { TypeImmunityAbAttr } from "./type-immunity-ab-attr";

export class TypeImmunityStatStageChangeAbAttr extends TypeImmunityAbAttr {
  private readonly stat: BattleStat;
  private readonly stages: number;

  constructor(immuneType: ElementalType, stat: BattleStat, stages: number, condition?: AbAttrCondition) {
    super(immuneType, condition);

    this.stat = stat;
    this.stages = stages;
  }

  override apply(
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
        globalScene.unshiftPhase(
          new StatStageChangePhase(pokemon.getBattlerIndex(), pokemon, [this.stat], this.stages),
        );
      }
    }

    return ret;
  }
}
