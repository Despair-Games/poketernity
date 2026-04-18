import { PostDefendAbAttr } from "#abilities/post-defend-ab-attr";
import { globalScene } from "#app/global-scene";
import type { BattleStat } from "#enums/stat";
import type { PostDefendAbAttrParams } from "#types/ab-attr-param-types";
import type { PokemonDefendCondition } from "#types/move-types";

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
    super();

    this.condition = condition;
    this.hpGate = hpGate;
    this.stats = stats;
    this.stages = stages;
    this.selfTarget = selfTarget;
  }

  public override apply({ pokemon, simulated, attacker }: PostDefendAbAttrParams): void {
    if (!simulated) {
      globalScene.phaseManager.createAndUnshiftPhase(
        "StatStageChangePhase",
        (this.selfTarget ? pokemon : attacker).getBattlerIndex(),
        pokemon,
        this.stats,
        this.stages,
      );
    }
  }

  public override canApply({ pokemon, attacker, move }: Parameters<this["apply"]>[0]): boolean {
    const hpGateFlat = Math.ceil(pokemon.getMaxHp() * this.hpGate);
    const damageReceived = pokemon.turnData.attacksReceived.at(-1)?.damage ?? 0;

    return (
      this.condition(pokemon, attacker, move) && pokemon.hp <= hpGateFlat && pokemon.hp + damageReceived > hpGateFlat
    );
  }
}
