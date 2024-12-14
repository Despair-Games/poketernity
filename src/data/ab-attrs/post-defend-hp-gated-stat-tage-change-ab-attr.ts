import type { PokemonDefendCondition } from "#app/@types/PokemonDefendCondition";
import type Move from "#app/data/move";
import type Pokemon from "#app/field/pokemon";
import type { HitResult } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { StatStageChangePhase } from "#app/phases/stat-stage-change-phase";
import type { BattleStat } from "#enums/stat";
import { PostDefendAbAttr } from "./post-defend-ab-attr";

export class PostDefendHpGatedStatStageChangeAbAttr extends PostDefendAbAttr {
  private condition: PokemonDefendCondition;
  private hpGate: number;
  private stats: BattleStat[];
  private stages: number;
  private selfTarget: boolean;

  constructor(
    condition: PokemonDefendCondition,
    hpGate: number,
    stats: BattleStat[],
    stages: number,
    selfTarget: boolean = true,
  ) {
    super(true);

    this.condition = condition;
    this.hpGate = hpGate;
    this.stats = stats;
    this.stages = stages;
    this.selfTarget = selfTarget;
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
    const hpGateFlat: number = Math.ceil(pokemon.getMaxHp() * this.hpGate);
    const lastAttackReceived = pokemon.turnData.attacksReceived[pokemon.turnData.attacksReceived.length - 1];
    const damageReceived = lastAttackReceived?.damage || 0;

    if (
      this.condition(pokemon, attacker, move)
      && pokemon.hp <= hpGateFlat
      && pokemon.hp + damageReceived > hpGateFlat
    ) {
      if (!simulated) {
        globalScene.unshiftPhase(
          new StatStageChangePhase(
            (this.selfTarget ? pokemon : attacker).getBattlerIndex(),
            true,
            this.stats,
            this.stages,
          ),
        );
      }
      return true;
    }

    return false;
  }
}
