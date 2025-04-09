import type { PokemonStatStageChangeCondition } from "#app/@types/PokemonStatStageChangeCondition";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { StatStageChangePhase } from "#app/phases/stat-stage-change-phase";
import type { BattleStat } from "#enums/stat";
import { PostStatStageChangeAbAttr } from "./post-stat-stage-change-ab-attr";

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
 * @extends PostStatStageChangeAbAttr
 */
export class PostStatStageChangeStatStageChangeAbAttr extends PostStatStageChangeAbAttr {
  private readonly condition: PokemonStatStageChangeCondition;
  private readonly statsToChange: BattleStat[];
  private readonly stages: number;

  constructor(condition: PokemonStatStageChangeCondition, statsToChange: BattleStat[], stages: number) {
    super(true);

    this.condition = condition;
    this.statsToChange = statsToChange;
    this.stages = stages;
  }

  override apply(
    pokemon: Pokemon,
    simulated: boolean,
    statStagesChanged: BattleStat[],
    stagesChanged: number,
    source: Pokemon | null,
    isStickyWeb: boolean,
  ): boolean {
    // Ability does not activate if the stat change was caused by the ability holder or its ally.
    // The only known exception to this rule is Sticky Web.
    const isSourceAllied = [pokemon, pokemon.getAlly()].includes(source as Pokemon);
    if (this.condition(pokemon, statStagesChanged, stagesChanged) && (!isSourceAllied || isStickyWeb)) {
      if (!simulated) {
        globalScene.phaseManager.unshiftPhase(
          new StatStageChangePhase(pokemon.getBattlerIndex(), pokemon, this.statsToChange, this.stages),
        );
      }
      return true;
    }

    return false;
  }
}
