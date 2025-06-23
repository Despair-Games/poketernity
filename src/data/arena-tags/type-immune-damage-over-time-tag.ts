import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import type { BlockNonDirectDamageAbAttr } from "#abilities/block-non-direct-damage-ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { ArenaTag } from "#arena-tags/arena-tag";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { ArenaTagSide } from "#enums/arena-tag-side";
import { CommonAnim } from "#enums/common-anim";
import { ElementalType } from "#enums/elemental-type";
import type { MoveId } from "#enums/move-id";
import type { Arena } from "#field/arena";
import type { Pokemon } from "#field/pokemon";
import { BooleanHolder, enumValueToKey, toDmgValue } from "#utils/common-utils";
import i18next from "i18next";

/**
 * Class to describe the field effect of G-Max moves that damage all Pokemon that
 * are not immune by 1/6th of their health
 *
 * Used in:
 * - G-Max Vine Lash: Grass
 * - G-Max Wildfire: Fire
 * - G-Max Cannonade: Water
 * - G-Max Volcalith: Rock
 */
export class TypeImmuneDamageOverTimeTag extends ArenaTag {
  private immuneType: ElementalType;

  constructor(tagType, sourceMoveId: MoveId, sourceId: number, side: ArenaTagSide, immuneType: ElementalType) {
    super(tagType, 4, sourceMoveId, sourceId, side);
    this.immuneType = immuneType;
  }

  private getAnimationForType() {
    switch (this.immuneType) {
      case ElementalType.GRASS:
        return CommonAnim.WRAP;
      case ElementalType.FIRE:
        return CommonAnim.FIRE_SPIN;
      case ElementalType.WATER:
        return CommonAnim.WHIRLPOOL;
      case ElementalType.ROCK:
        return CommonAnim.SALT_CURE;
      default:
        return CommonAnim.WRAP;
    }
  }

  override onAdd(_arena: Arena) {
    globalScene.phaseManager.createAndUnshiftPhase(
      "MessagePhase",
      i18next.t(
        `arenaTag:TypeImmuneDamageOverTimeOnAdd${this.i18nSideKey}${enumValueToKey(ElementalType, this.immuneType)}`,
      ),
    );
  }

  override lapse(arena: Arena): boolean {
    const field: Pokemon[] =
      this.side === ArenaTagSide.PLAYER ? globalScene.getPlayerField() : globalScene.getEnemyField();

    field
      .filter((pokemon) => pokemon.isActive(true) && !pokemon.isOfType(this.immuneType) && !pokemon.switchOutStatus)
      .forEach((pokemon) => {
        const cancelled = new BooleanHolder(false);
        applyAbAttrs<BlockNonDirectDamageAbAttr>(AbAttrFlag.BLOCK_NON_DIRECT_DAMAGE, pokemon, false, cancelled);
        if (cancelled.value) {
          return;
        }

        globalScene.phaseManager.createAndUnshiftPhase(
          "MessagePhase",
          i18next.t(`arenaTag:TypeImmuneDamageOverTimeLapse${enumValueToKey(ElementalType, this.immuneType)}`, {
            pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
          }),
        );
        // TODO: Replace this with a proper animation
        globalScene.phaseManager.createAndUnshiftPhase(
          "CommonAnimPhase",
          this.getAnimationForType(),
          pokemon.getBattlerIndex(),
          pokemon.getBattlerIndex(),
        );
        pokemon.damageAndUpdate(toDmgValue(pokemon.getMaxHp() / 6));
      });

    return super.lapse(arena);
  }
}
