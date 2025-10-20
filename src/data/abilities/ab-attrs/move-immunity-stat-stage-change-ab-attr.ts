import { MoveImmunityAbAttr } from "#abilities/move-immunity-ab-attr";
import { globalScene } from "#app/global-scene";
import type { BattleStat } from "#enums/stat";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import type { PreDefendAbAttrCondition } from "#types/ability-types";
import type { ValueHolder } from "#utils/common-utils";

export class MoveImmunityStatStageChangeAbAttr extends MoveImmunityAbAttr {
  private readonly stat: BattleStat;
  private readonly stages: number;

  constructor(immuneCondition: PreDefendAbAttrCondition, stat: BattleStat, stages: number) {
    super(immuneCondition);
    this.stat = stat;
    this.stages = stages;
  }

  public override apply(
    pokemon: Pokemon,
    simulated: boolean,
    attacker: Pokemon,
    move: Move,
    cancelled: ValueHolder<boolean>,
  ): void {
    super.apply(pokemon, simulated, attacker, move, cancelled);
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
}
