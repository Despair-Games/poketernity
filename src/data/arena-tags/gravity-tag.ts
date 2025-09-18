import { globalScene } from "#app/global-scene";
import { SerializableArenaTag } from "#arena-tags/arena-tag";
import type { SkyDropTag } from "#battler-tags/sky-drop-tag";
import { ArenaTagType } from "#enums/arena-tag-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import i18next from "i18next";

/**
 * Arena Tag class for {@link https://bulbapedia.bulbagarden.net/wiki/Gravity_(move) Gravity}.
 *
 * Grounds all Pokémon on the field, including Flying-types and those with
 * {@linkcode AbilityId.LEVITATE} for the duration of the arena tag, usually 5 turns.
 */
export class GravityTag extends SerializableArenaTag {
  public override readonly tagType = ArenaTagType.GRAVITY;

  constructor(turnCount: number, sourceId?: number) {
    super(turnCount, MoveId.GRAVITY, sourceId);
  }

  override onAdd(): void {
    globalScene.phaseManager.createAndUnshiftPhase("MessagePhase", i18next.t("arenaTag:gravityOnAdd"));
    globalScene.getField(true).forEach((pokemon) => {
      if (pokemon) {
        pokemon.removeTag(BattlerTagType.FLOATING);
        pokemon.removeTag(BattlerTagType.TELEKINESIS);
        if (pokemon.hasTag(BattlerTagType.MID_AIR)) {
          pokemon.addTag(BattlerTagType.INTERRUPTED);
        }
        pokemon.getTag<SkyDropTag>(BattlerTagType.SKY_DROP)?.clearSkyDropEffects();
      }
    });
  }

  override onRemove(): void {
    globalScene.phaseManager.createAndUnshiftPhase("MessagePhase", i18next.t("arenaTag:gravityOnRemove"));
  }
}
