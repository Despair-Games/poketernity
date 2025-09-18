import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import type { BlockNonDirectDamageAbAttr } from "#abilities/block-non-direct-damage-ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { SerializableArenaTag } from "#arena-tags/arena-tag";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { ArenaTagSide } from "#enums/arena-tag-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import { CommonAnim } from "#enums/common-anim";
import { ElementalType } from "#enums/elemental-type";
import { MoveId } from "#enums/move-id";
import type { Pokemon } from "#field/pokemon";
import { BooleanHolder, toDmgValue } from "#utils/common-utils";
import i18next from "i18next";

/**
 * Arena Tag implementing the "sea of fire" effect from the combination
 * of {@link https://bulbapedia.bulbagarden.net/wiki/Fire_Pledge_(move) | Fire Pledge}
 * and {@link https://bulbapedia.bulbagarden.net/wiki/Grass_Pledge_(move) | Grass Pledge}.
 * Damages all non-Fire-type Pokemon on the given side of the field at the end
 * of each turn for 4 turns.
 */
export class FireGrassPledgeTag extends SerializableArenaTag {
  public override readonly tagType = ArenaTagType.FIRE_GRASS_PLEDGE;

  constructor(sourceId: number | undefined, side: ArenaTagSide) {
    super(4, MoveId.FIRE_PLEDGE, sourceId, side);
  }

  override onAdd(): void {
    // "A sea of fire enveloped your/the opposing team!"
    globalScene.phaseManager.createAndUnshiftPhase(
      "MessagePhase",
      i18next.t(`arenaTag:fireGrassPledgeOnAdd${this.i18nSideKey}`),
    );
  }

  override lapse(): boolean {
    const field: Pokemon[] =
      this.side === ArenaTagSide.PLAYER ? globalScene.getPlayerField() : globalScene.getEnemyField();

    field
      .filter((pokemon) => pokemon.isActive(true) && !pokemon.isOfType(ElementalType.FIRE) && !pokemon.switchOutStatus)
      .forEach((pokemon) => {
        const cancelled = new BooleanHolder(false);
        applyAbAttrs<BlockNonDirectDamageAbAttr>(AbAttrFlag.BLOCK_NON_DIRECT_DAMAGE, pokemon, false, cancelled);
        if (cancelled.value) {
          return;
        }

        // "{pokemonNameWithAffix} was hurt by the sea of fire!"
        globalScene.phaseManager.createAndUnshiftPhase(
          "MessagePhase",
          i18next.t("arenaTag:fireGrassPledgeLapse", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
        );
        // TODO: Replace this with a proper animation
        globalScene.phaseManager.createAndUnshiftPhase(
          "CommonAnimPhase",
          CommonAnim.MAGMA_STORM,
          pokemon.getBattlerIndex(),
          pokemon.getBattlerIndex(),
        );
        pokemon.damageAndUpdate(toDmgValue(pokemon.getMaxHp() / 8));
      });

    return super.lapse();
  }
}
