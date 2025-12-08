import { PostDefendAbAttr } from "#abilities/post-defend-ab-attr";
import { globalScene } from "#app/global-scene";
import type { BattleStat } from "#enums/stat";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import type { PokemonDefendCondition } from "#types/move-types";
import { speedOrderComparator } from "#utils/speed-order-utils";

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
    super();

    this.condition = condition;
    this.stat = stat;
    this.stages = stages;
    this.selfTarget = selfTarget;
    this.allOthers = allOthers;
  }

  public override apply(pokemon: Pokemon, simulated: boolean, attacker: Pokemon, _move: Move): void {
    if (simulated) {
      return;
    }

    if (this.allOthers) {
      const otherPokemon = pokemon.getOpponents();
      const allyPokemon = pokemon.getAlly();
      if (allyPokemon) {
        otherPokemon.push(allyPokemon);
      }
      for (const other of otherPokemon.toSorted(speedOrderComparator)) {
        globalScene.phaseManager.createAndUnshiftPhase(
          "StatStageChangePhase",
          other.getBattlerIndex(),
          pokemon,
          [this.stat],
          this.stages,
        );
      }
      return;
    }

    globalScene.phaseManager.createAndUnshiftPhase(
      "StatStageChangePhase",
      (this.selfTarget ? pokemon : attacker).getBattlerIndex(),
      pokemon,
      [this.stat],
      this.stages,
    );
  }

  public override canApply(...[pokemon, , attacker, move]: Parameters<this["apply"]>): boolean {
    return this.condition(pokemon, attacker, move);
  }
}
