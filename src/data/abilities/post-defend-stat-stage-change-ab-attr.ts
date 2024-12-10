import type { BattleStat } from "#app/enums/stat";
import { type HitResult, type Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { StatStageChangePhase } from "#app/phases/stat-stage-change-phase";
import { PostDefendAbAttr } from "./post-defend-ab-attr";
import { type PokemonDefendCondition } from "../ability";
import { type Move } from "../move";

export class PostDefendStatStageChangeAbAttr extends PostDefendAbAttr {
  private condition: PokemonDefendCondition;
  private stat: BattleStat;
  private stages: number;
  private selfTarget: boolean;
  private allOthers: boolean;

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
    if (this.condition(pokemon, attacker, move) && !move.hitsSubstitute(attacker, pokemon)) {
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
