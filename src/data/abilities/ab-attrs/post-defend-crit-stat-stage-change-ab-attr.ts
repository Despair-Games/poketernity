import { PostDefendAbAttr } from "#abilities/post-defend-ab-attr";
import { globalScene } from "#app/global-scene";
import type { BattleStat } from "#enums/stat";
import { Stat } from "#enums/stat";
import type { PostDefendAbAttrParams } from "#types/ab-attr-param-types";

/**
 * Attribute that prompts a stat stage change after the ability holder received a critical hit.
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Anger_Point_(Ability)}
 */
export class PostDefendCritStatStageChangeAbAttr extends PostDefendAbAttr {
  private readonly stat: BattleStat;
  private readonly stages: number;

  constructor(stat: BattleStat, stages: number) {
    super();

    this.stat = stat;
    this.stages = stages;
  }

  public override apply({ pokemon, simulated }: PostDefendAbAttrParams): void {
    if (!simulated) {
      globalScene.phaseManager.createAndUnshiftPhase(
        "StatStageChangePhase",
        pokemon.getBattlerIndex(),
        pokemon,
        [this.stat],
        this.stages,
      );
    }
  }

  public override canApply({ pokemon, attacker }: Parameters<this["apply"]>[0]): boolean {
    const attacksReceivedEntry = pokemon.turnData.attacksReceived.at(-1);

    return (
      !!attacksReceivedEntry?.isCritical
      && attacksReceivedEntry.sourceId === attacker.id
      && pokemon.getStatStage(Stat.ATK) < 6
    );
  }
}
