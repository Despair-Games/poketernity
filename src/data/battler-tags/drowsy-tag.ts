import { BattlerTag } from "#app/data/battler-tags/battler-tag";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import { StatusEffect } from "#enums/status-effect";
import { TerrainType } from "#enums/terrain-type";
import i18next from "i18next";

/**
 * Tag representing the effects of drowsiness set by {@link https://bulbapedia.bulbagarden.net/wiki/Yawn_(move) | Yawn}.
 * Puts the tag's owner to sleep after one turn.
 * @extends BattlerTag
 */
export class DrowsyTag extends BattlerTag {
  constructor() {
    super(BattlerTagType.DROWSY, BattlerTagLapseType.TURN_END, 2, MoveId.YAWN);
  }

  override canAdd(pokemon: Pokemon): boolean {
    return !globalScene.arena.hasTerrain(TerrainType.ELECTRIC) || !pokemon.isGrounded();
  }

  override onAdd(pokemon: Pokemon): void {
    super.onAdd(pokemon);

    globalScene.queueMessage(
      i18next.t("battlerTags:drowsyOnAdd", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
    );
  }

  override lapse(pokemon: Pokemon, lapseType: BattlerTagLapseType): boolean {
    if (!super.lapse(pokemon, lapseType)) {
      pokemon.trySetStatus(StatusEffect.SLEEP, true);
      return false;
    }

    return true;
  }

  override getDescriptor(): string {
    return i18next.t("battlerTags:drowsyDesc");
  }
}
