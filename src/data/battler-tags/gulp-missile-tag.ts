import type { BlockNonDirectDamageAbAttr } from "#app/data/abilities/ab-attrs/block-non-direct-damage-ab-attr";
import { applyAbAttrs } from "#app/data/abilities/apply-ab-attrs";
import { BattlerTag } from "#app/data/battler-tags/battler-tag";
import { SpeciesFormChangeManualTrigger } from "#app/data/species-form-change-triggers/species-form-change-manual-trigger";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { MoveEffectPhase } from "#app/phases/move-effect-phase";
import { StatStageChangePhase } from "#app/phases/stat-stage-change-phase";
import { BooleanHolder, toDmgValue } from "#app/utils";
import { GulpMissileBattlerTagTypes } from "#app/utils/battler-tag-type-utils";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { HitResult } from "#enums/hit-result";
import { MoveId } from "#enums/move-id";
import { PhaseId } from "#enums/phase-id";
import { SpeciesId } from "#enums/species-id";
import { Stat } from "#enums/stat";
import { StatusEffect } from "#enums/status-effect";

/**
 * Battler tag for Gulp Missile used by Cramorant.
 * @extends BattlerTag
 */
export class GulpMissileTag extends BattlerTag {
  constructor(tagType: BattlerTagType, sourceMoveId: MoveId) {
    super(tagType, BattlerTagLapseType.HIT, 0, sourceMoveId);
  }

  override lapse(pokemon: Pokemon, _lapseType: BattlerTagLapseType): boolean {
    if (pokemon.getTag(BattlerTagType.UNDERWATER)) {
      return true;
    }

    const moveEffectPhase = globalScene.getCurrentPhase();
    if (moveEffectPhase?.is<MoveEffectPhase>(PhaseId.MOVE_EFFECT)) {
      const attacker = moveEffectPhase.getUserPokemon();

      if (!attacker) {
        return false;
      }

      if (moveEffectPhase.move.getMove().hitsSubstitute(attacker, pokemon)) {
        return true;
      }

      const cancelled = new BooleanHolder(false);
      applyAbAttrs<BlockNonDirectDamageAbAttr>(AbAttrFlag.BLOCK_NON_DIRECT_DAMAGE, attacker, false, cancelled);

      if (!cancelled.value) {
        attacker.damageAndUpdate(toDmgValue(attacker.getMaxHp() / 4), {
          result: HitResult.OTHER,
          ignoreDynamaxReduction: true,
        });
      }

      if (this.tagType === BattlerTagType.GULP_MISSILE_ARROKUDA) {
        globalScene.unshiftPhase(new StatStageChangePhase(attacker.getBattlerIndex(), pokemon, [Stat.DEF], -1));
      } else {
        attacker.trySetStatus(StatusEffect.PARALYSIS, true, pokemon);
      }
    }
    return false;
  }

  /**
   * Gulp Missile's initial form changes are triggered by using Surf and Dive.
   * @param pokemon The Pokemon with Gulp Missile ability.
   * @returns Whether the BattlerTag can be added.
   */
  override canAdd(pokemon: Pokemon): boolean {
    const isSurfOrDive = [MoveId.SURF, MoveId.DIVE].includes(this.sourceMoveId);
    const isNormalForm = pokemon.formIndex === 0 && !pokemon.getTag(...GulpMissileBattlerTagTypes);
    const isCramorant = pokemon.species.speciesId === SpeciesId.CRAMORANT;

    return isSurfOrDive && isNormalForm && isCramorant;
  }

  override onAdd(pokemon: Pokemon): void {
    super.onAdd(pokemon);
    globalScene.triggerPokemonFormChange(pokemon, SpeciesFormChangeManualTrigger);
  }

  override onRemove(pokemon: Pokemon): void {
    super.onRemove(pokemon);
    globalScene.triggerPokemonFormChange(pokemon, SpeciesFormChangeManualTrigger);
  }
}
