import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import { globalScene } from "#app/global-scene";
import { BattlerTag } from "#battler-tags/battler-tag";
import { GULP_MISSILE_BATTLER_TAG_TYPES } from "#constants/battler-tag-constants";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { HitResult } from "#enums/hit-result";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { Stat } from "#enums/stat";
import { StatusEffect } from "#enums/status-effect";
import type { Pokemon } from "#field/pokemon";
import { SpeciesFormChangeManualTrigger } from "#form-change-triggers/species-form-change-manual-trigger";
import { toDmgValue, ValueHolder } from "#utils/common-utils";

/** Battler tag for Gulp Missile used by Cramorant. */
export class GulpMissileTag extends BattlerTag {
  constructor(tagType: BattlerTagType, sourceMoveId: MoveId) {
    super(tagType, BattlerTagLapseType.HIT, 0, sourceMoveId);
  }

  override lapse(pokemon: Pokemon, _lapseType: BattlerTagLapseType): boolean {
    if (pokemon.hasTag(BattlerTagType.UNDERWATER)) {
      return true;
    }

    const moveEffectPhase = globalScene.phaseManager.getCurrentPhase();
    if (!moveEffectPhase.is("MoveEffectPhase")) {
      return false;
    }

    const attacker = moveEffectPhase.getUserPokemon();

    if (!attacker) {
      return false;
    }

    if (moveEffectPhase.move.getMove().hitsSubstitute(attacker, pokemon)) {
      return true;
    }

    const cancelled = new ValueHolder(false);
    applyAbAttrs("BlockNonDirectDamageAbAttr", attacker, false, cancelled);

    if (!cancelled.value) {
      attacker.damageAndUpdate(toDmgValue(attacker.getMaxHp() / 4), {
        result: HitResult.OTHER,
      });
    }

    if (this.tagType === BattlerTagType.GULP_MISSILE_ARROKUDA) {
      globalScene.phaseManager.createAndUnshiftPhase(
        "StatStageChangePhase",
        attacker.getBattlerIndex(),
        pokemon,
        [Stat.DEF],
        -1,
      );
    } else {
      attacker.trySetStatus(StatusEffect.PARALYSIS, true, pokemon);
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
    const isNormalForm = pokemon.formIndex === 0 && !pokemon.hasTag(...GULP_MISSILE_BATTLER_TAG_TYPES);
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
