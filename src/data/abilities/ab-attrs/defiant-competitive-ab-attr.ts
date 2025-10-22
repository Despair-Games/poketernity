import { PostStatStageChangeAbAttr } from "#abilities/post-stat-stage-change-ab-attr";
import { globalScene } from "#app/global-scene";
import type { BattleStat } from "#enums/stat";
import type { Pokemon } from "#field/pokemon";

/**
 * Attribute to increase some of the user's stats in response to negative stat changes inflicted by an opponent.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Defiant_(ability) | Defiant}
 * and {@link https://bulbapedia.bulbagarden.net/wiki/Competitive_(ability) | Competitive}.
 *
 * | Ability     | Stat change |
 * |-------------|-------------|
 * | Defiant     | +2 Atk      |
 * | Competitive | +2 SpA      |
 *
 *
 */
export class DefiantCompetitiveAbAttr extends PostStatStageChangeAbAttr {
  private readonly statsToChange: BattleStat[];
  private readonly stages: number;

  constructor(statsToChange: BattleStat[], stages: number) {
    super();

    this.statsToChange = statsToChange;
    this.stages = stages;
  }

  public override apply(
    pokemon: Pokemon,
    simulated: boolean,
    _statStagesChanged: BattleStat[],
    _stagesChanged: number,
    _source: Pokemon | undefined,
    _isStickyWeb: boolean,
  ): void {
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

  public override canApply(...[pokemon, , , stagesChanged, source, isStickyWeb]: Parameters<this["apply"]>): boolean {
    // Ability does not activate if the stat change was caused by the ability holder or its ally.
    // The only known exception to this rule is Sticky Web.
    const isSourceAllied = source != null && [pokemon, pokemon.getAlly()].includes(source);
    return stagesChanged < 0 && (isStickyWeb || !isSourceAllied);
  }
}
