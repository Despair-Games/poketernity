import { PostDefendAbAttr } from "#abilities/post-defend-ab-attr";
import { globalScene } from "#app/global-scene";
import type { BattleStat } from "#enums/stat";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { StatStageChangePhase } from "#phases/stat-stage-change-phase";
import type { PokemonDefendCondition } from "#types/PokemonDefendCondition";

export class PostDefendHpGatedStatStageChangeAbAttr extends PostDefendAbAttr {
  private readonly condition: PokemonDefendCondition;
  private readonly hpGate: number;
  private readonly stats: BattleStat[];
  private readonly stages: number;
  private readonly selfTarget: boolean;

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

  override apply(pokemon: Pokemon, simulated: boolean, attacker: Pokemon, move: Move): boolean {
    const hpGateFlat: number = Math.ceil(pokemon.getMaxHp() * this.hpGate);
    // TODO: Normalize `attacksReceived[]` checks
    const lastAttackReceived = pokemon.turnData.attacksReceived[pokemon.turnData.attacksReceived.length - 1];
    const damageReceived = lastAttackReceived?.damage ?? 0;

    if (
      this.condition(pokemon, attacker, move)
      && pokemon.hp <= hpGateFlat
      && pokemon.hp + damageReceived > hpGateFlat
    ) {
      if (!simulated) {
        globalScene.phaseManager.unshiftPhase(
          new StatStageChangePhase(
            (this.selfTarget ? pokemon : attacker).getBattlerIndex(),
            pokemon,
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
