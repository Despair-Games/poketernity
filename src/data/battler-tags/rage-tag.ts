import { BattlerTag } from "#app/data/battler-tags/battler-tag";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { StatStageChangePhase } from "#app/phases/stat-stage-change-phase";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import { Stat } from "#enums/stat";

/**
 * BattlerTag representing the effects of {@link https://bulbapedia.bulbagarden.net/wiki/Rage_(move) | Rage}.
 * The owner gains +1 Attack after receiving an attack as long as
 * Rage is continuously used.
 * @extends BattlerTag
 */
export class RageTag extends BattlerTag {
  constructor() {
    super(BattlerTagType.RAGE, [BattlerTagLapseType.PRE_MOVE, BattlerTagLapseType.AFTER_HIT], 1, MoveId.RAGE);
  }

  /**
   * Grants +1atk to the owner of the tag while damaged while the tag is active and then immediately reapplies the tag
   * @param pokemon the owner of the tag
   * @param lapseType how this tag is lost
   * @returns true if invoked with `AFTER_HIT` lapse type
   */
  override lapse(pokemon: Pokemon, lapseType: BattlerTagLapseType): boolean {
    if (lapseType === BattlerTagLapseType.AFTER_HIT) {
      const lastAttackReceived = pokemon.turnData.attacksReceived[pokemon.turnData.attacksReceived.length - 1];
      const damageReceived = lastAttackReceived?.damage ?? 0;
      if (damageReceived > 0) {
        globalScene.unshiftPhase(new StatStageChangePhase(pokemon.getBattlerIndex(), pokemon, [Stat.ATK], 1));
      }
      pokemon.addTag(BattlerTagType.RAGE, undefined, MoveId.RAGE, pokemon.id);
      return true;
    }
    return super.lapse(pokemon, lapseType);
  }
}
