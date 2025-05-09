import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import type { BlockNonDirectDamageAbAttr } from "#abilities/block-non-direct-damage-ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BattlerTag } from "#battler-tags/battler-tag";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { CommonAnim } from "#enums/common-anim";
import { ElementalType } from "#enums/elemental-type";
import { HitResult } from "#enums/hit-result";
import { PhaseId } from "#enums/phase-id";
import { WeatherType } from "#enums/weather-type";
import type { Pokemon } from "#field/pokemon";
import { CommonAnimPhase } from "#phases/common-anim-phase";
import type { MovePhase } from "#phases/move-phase";
import { BooleanHolder } from "#utils/common-utils";
import i18next from "i18next";

/**
 * Tag representing the effects of {@link https://bulbapedia.bulbagarden.net/wiki/Powder_(move) | Powder}.
 * When the afflicted Pokemon uses a Fire-type move, the move is cancelled, and the
 * Pokemon takes damage equal to 1/4 of it's maximum HP (rounded down).
 * @extends BattlerTag
 */
export class PowderTag extends BattlerTag {
  constructor() {
    super(BattlerTagType.POWDER, [BattlerTagLapseType.PRE_MOVE, BattlerTagLapseType.TURN_END], 1);
  }

  override onAdd(pokemon: Pokemon): void {
    super.onAdd(pokemon);

    // "{Pokemon} is covered in powder!"
    globalScene.phaseManager.queueMessagePhase(
      i18next.t("battlerTags:powderOnAdd", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
    );
  }

  /**
   * Applies Powder's effects before the tag owner uses a Fire-type move.
   * Also causes the tag to expire at the end of turn.
   * @param pokemon {@linkcode Pokemon} the owner of this tag
   * @param lapseType {@linkcode BattlerTagLapseType} the type of lapse functionality to carry out
   * @returns `true` if the tag should not expire after this lapse; `false` otherwise.
   */
  override lapse(pokemon: Pokemon, lapseType: BattlerTagLapseType): boolean {
    if (lapseType === BattlerTagLapseType.PRE_MOVE) {
      const currPhase = globalScene.phaseManager.getCurrentPhase();
      if (currPhase?.is<MovePhase>(PhaseId.MOVE)) {
        const move = currPhase.move.getMove();
        const weather = globalScene.arena.weather;
        if (
          pokemon.getMoveType(move) === ElementalType.FIRE
          && !(weather && weather.weatherType === WeatherType.HEAVY_RAIN && !weather.isEffectSuppressed())
        ) {
          currPhase.fail();
          currPhase.showMoveText();

          globalScene.phaseManager.unshiftPhase(new CommonAnimPhase(CommonAnim.POWDER, pokemon.getBattlerIndex()));

          const cancelDamage = new BooleanHolder(false);
          applyAbAttrs<BlockNonDirectDamageAbAttr>(AbAttrFlag.BLOCK_NON_DIRECT_DAMAGE, pokemon, false, cancelDamage);
          if (!cancelDamage.value) {
            pokemon.damageAndUpdate(Math.floor(pokemon.getMaxHp() / 4), {
              result: HitResult.OTHER,
            });
          }

          // "When the flame touched the powder\non the Pokémon, it exploded!"
          globalScene.phaseManager.queueMessagePhase(i18next.t("battlerTags:powderLapse", { moveName: move.name }));
        }
      }
      return true;
    } else {
      return super.lapse(pokemon, lapseType);
    }
  }
}
