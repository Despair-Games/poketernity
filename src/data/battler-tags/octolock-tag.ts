import { TrappedTag } from "#app/data/battler-tags/trapped-tag";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { StatStageChangePhase } from "#app/phases/stat-stage-change-phase";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import { Stat } from "#enums/stat";

/**
 * Octolock traps the target pokemon and reduces its DEF and SPDEF by one stage at the
 * end of each turn.
 * @extends TrappedTag
 */
export class OctolockTag extends TrappedTag {
  constructor(sourceId: number) {
    super(BattlerTagType.OCTOLOCK, BattlerTagLapseType.TURN_END, 1, MoveId.OCTOLOCK, sourceId);
  }

  override lapse(pokemon: Pokemon, lapseType: BattlerTagLapseType): boolean {
    const shouldLapse = lapseType !== BattlerTagLapseType.CUSTOM || super.lapse(pokemon, lapseType);

    if (shouldLapse) {
      globalScene.phaseManager.unshiftPhase(
        new StatStageChangePhase(pokemon.getBattlerIndex(), null, [Stat.DEF, Stat.SPDEF], -1, { bypassReflect: true }),
      );
      return true;
    }

    return false;
  }
}
