import { PostStatStageChangeAbAttr } from "#abilities/post-stat-stage-change-ab-attr";
import { globalScene } from "#app/global-scene";
import type { BattleStat } from "#enums/stat";
import type { PostStatStageChangeAbAttrParams } from "#types/ab-attr-param-types";

/**
 * Attribute to increase some of the user's stats in response to negative stat changes inflicted by an opponent.
 *
 * | Ability     | Stat change |
 * |:-----------:|:-----------:|
 * | Defiant     | +2 Atk      |
 * | Competitive | +2 SpA      |
 *
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Defiant_(ability)}
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Competitive_(ability)}
 */
export class DefiantCompetitiveAbAttr extends PostStatStageChangeAbAttr {
  // TODO: use `NonEmptyArray`
  private readonly statsToChange: BattleStat[];
  private readonly stages: number;

  constructor(statsToChange: BattleStat[], stages: number) {
    super();

    this.statsToChange = statsToChange;
    this.stages = stages;
  }

  public override apply({ pokemon, simulated }: PostStatStageChangeAbAttrParams): void {
    if (!simulated) {
      globalScene.phaseManager.createAndUnshiftPhase(
        "StatStageChangePhase",
        pokemon.getBattlerIndex(),
        pokemon,
        this.statsToChange,
        this.stages,
      );
    }
  }

  public override canApply({ pokemon, stagesChanged, source, isStickyWeb }: Parameters<this["apply"]>[0]): boolean {
    // Ability does not activate if the stat change was caused by the ability holder or its ally.
    // The only known exception to this rule is Sticky Web.
    const isSourceAllied = source != null && [pokemon, pokemon.getAlly()].includes(source);
    return stagesChanged < 0 && (isStickyWeb || !isSourceAllied);
  }
}
