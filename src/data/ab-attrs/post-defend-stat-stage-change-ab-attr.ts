import { type PokemonDefendCondition } from "#app/@types/PokemonDefendCondition";
import { type Move } from "#app/data/move";
import { type HitResult, type Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { StatStageChangePhase } from "#app/phases/stat-stage-change-phase";
import type { BattleStat } from "#enums/stat";
import { PostDefendAbAttr } from "./post-defend-ab-attr";

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

  override applyPostDefend(
    pokemon: Pokemon,
    _passive: boolean,
    simulated: boolean,
    attacker: Pokemon,
    move: Move,
    _hitResult: HitResult,
    _args: any[],
  ): boolean {
    if (this.condition(pokemon, attacker, move)) {
      if (simulated) {
        return true;
      }

      if (this.allOthers) {
        const otherPokemon = pokemon.getAlly()
          ? pokemon.getOpponents().concat([pokemon.getAlly()])
          : pokemon.getOpponents();
        for (const other of otherPokemon) {
          globalScene.unshiftPhase(new StatStageChangePhase(other.getBattlerIndex(), false, [this.stat], this.stages));
        }
        return true;
      }
      globalScene.unshiftPhase(
        new StatStageChangePhase(
          (this.selfTarget ? pokemon : attacker).getBattlerIndex(),
          this.selfTarget,
          [this.stat],
          this.stages,
        ),
      );
      return true;
    }

    return false;
  }
}
