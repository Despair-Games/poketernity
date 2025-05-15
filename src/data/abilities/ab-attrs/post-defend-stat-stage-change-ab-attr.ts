import { PostDefendAbAttr } from "#abilities/post-defend-ab-attr";
import { globalScene } from "#app/global-scene";
import type { BattleStat } from "#enums/stat";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { StatStageChangePhase } from "#phases/stat-stage-change-phase";
import type { PokemonDefendCondition } from "#types/pokemon-defend-condition";

/**
 * Activates after receiving an attack and if certain conditions are met, changes the effective stats
 * These abilities use this attribute:
 * - Weak Armor
 * - Justified
 * - Rattled
 * - Gooey
 * - Stamina
 * - Water Compaction
 * - Tangling Hair
 * - Cotton Down
 * - Steam Engine
 * - Thermal Exchange
 */
export class PostDefendStatStageChangeAbAttr extends PostDefendAbAttr {
  private readonly condition: PokemonDefendCondition;
  private readonly stat: BattleStat;
  private readonly stages: number;
  private readonly selfTarget: boolean;
  private readonly allOthers: boolean;

  constructor(
    condition: PokemonDefendCondition,
    stat: BattleStat,
    stages: number,
    selfTarget: boolean = true,
    allOthers: boolean = false,
  ) {
    super(true);

    this.condition = condition;
    this.stat = stat;
    this.stages = stages;
    this.selfTarget = selfTarget;
    this.allOthers = allOthers;
  }

  override apply(pokemon: Pokemon, simulated: boolean, attacker: Pokemon, move: Move): boolean {
    if (this.condition(pokemon, attacker, move)) {
      if (simulated) {
        return true;
      }

      if (this.allOthers) {
        const otherPokemon = pokemon.getOpponents();
        const allyPokemon = pokemon.getAlly();
        if (allyPokemon) {
          otherPokemon.push(allyPokemon);
        }
        for (const other of otherPokemon) {
          globalScene.phaseManager.unshiftPhase(
            new StatStageChangePhase(other.getBattlerIndex(), pokemon, [this.stat], this.stages),
          );
        }
        return true;
      }
      globalScene.phaseManager.unshiftPhase(
        new StatStageChangePhase(
          (this.selfTarget ? pokemon : attacker).getBattlerIndex(),
          pokemon,
          [this.stat],
          this.stages,
        ),
      );
      return true;
    }

    return false;
  }
}
