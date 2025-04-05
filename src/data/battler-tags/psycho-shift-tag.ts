import { BattlerTag } from "#app/data/battler-tags/battler-tag";
import { getStatusEffectHealText } from "#app/data/status-effect";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";

/**
 * Tag used to heal the user of Psycho Shift of its status effect if Psycho Shift succeeds in transferring its status effect to the target Pokemon
 * @extends BattlerTag
 */
export class PsychoShiftTag extends BattlerTag {
  constructor() {
    super(BattlerTagType.PSYCHO_SHIFT, BattlerTagLapseType.AFTER_MOVE, 1, MoveId.PSYCHO_SHIFT);
  }

  /**
   * Heals Psycho Shift's user of its status effect after it uses a move
   * @returns `false` to expire the tag immediately
   */
  override lapse(pokemon: Pokemon, _lapseType: BattlerTagLapseType): boolean {
    if (pokemon.hasNonVolatileStatusEffect() && pokemon.isActive(true)) {
      globalScene.phaseManager.queueMessagePhase(
        getStatusEffectHealText(pokemon.getStatusEffect(), getPokemonNameWithAffix(pokemon)),
      );
      pokemon.resetStatus();
      pokemon.updateInfo();
    }
    return false;
  }
}
