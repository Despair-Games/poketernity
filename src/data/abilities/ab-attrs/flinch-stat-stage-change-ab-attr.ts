import { FlinchEffectAbAttr } from "#abilities/flinch-effect-ab-attr";
import { globalScene } from "#app/global-scene";
import type { BattleStat } from "#enums/stat";
import type { Pokemon } from "#field/pokemon";
import type { BaseAbAttrParams } from "#types/ab-attr-param-types";

/**
 * Attribute that prompts a stat stage change after the ability holder is flinched. \
 * Only applied if the {@linkcode Pokemon} hasn't already acted this turn.
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Steadfast_(Ability) Steadfast (Bulbapedia)}
 */
export class FlinchStatStageChangeAbAttr extends FlinchEffectAbAttr {
  /** The {@linkcode BattleStat | stats} to change. */
  private readonly stats: BattleStat[];

  /** The number of stages to apply to the {@linkcode stats}. */
  private readonly stages: number;

  constructor(stats: BattleStat[], stages: number) {
    super();

    this.stats = stats;
    this.stages = stages;
  }

  public override apply({ pokemon, simulated }: BaseAbAttrParams): void {
    if (!simulated) {
      globalScene.phaseManager.createAndUnshiftPhase(
        "StatStageChangePhase",
        pokemon.getBattlerIndex(),
        pokemon,
        this.stats,
        this.stages,
      );
    }
  }
}
