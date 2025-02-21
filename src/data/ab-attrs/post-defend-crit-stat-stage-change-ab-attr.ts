import { Stat } from "#enums/stat";
import type { Move } from "#app/data/move";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { StatStageChangePhase } from "#app/phases/stat-stage-change-phase";
import type { BattleStat } from "#enums/stat";
import { PostDefendAbAttr } from "./post-defend-ab-attr";

/**
 * Attribute that prompts a stat stage change after the ability holder received a critical hit
 * Abilities using this attribute are:
 * - Anger Point: Maximizes Attack stat
 */
export class PostDefendCritStatStageChangeAbAttr extends PostDefendAbAttr {
  private readonly stat: BattleStat;
  private readonly stages: number;

  constructor(stat: BattleStat, stages: number) {
    super();

    this.stat = stat;
    this.stages = stages;
  }

  override apply(pokemon: Pokemon, simulated: boolean, attacker: Pokemon, _move: Move): boolean {
    const attacksReceivedEntry = pokemon.turnData.attacksReceived[0];
    if (
      pokemon.turnData.attacksReceived.length !== 0
      && attacksReceivedEntry.isCritical
      && attacksReceivedEntry.sourceId === attacker.id
      && pokemon.getStatStage(Stat.ATK) < 6
    ) {
      if (!simulated) {
        globalScene.unshiftPhase(
          new StatStageChangePhase(pokemon.getBattlerIndex(), pokemon, [this.stat], this.stages),
        );
      }
      return true;
    } else {
      return false;
    }
  }
}
