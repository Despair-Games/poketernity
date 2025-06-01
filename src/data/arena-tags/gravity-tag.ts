import { globalScene } from "#app/global-scene";
import { ArenaTag } from "#arena-tags/arena-tag";
import type { SkyDropTag } from "#battler-tags/sky-drop-tag";
import { ArenaTagType } from "#enums/arena-tag-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import type { Arena } from "#field/arena";
import i18next from "i18next";

/**
 * Arena Tag class for {@link https://bulbapedia.bulbagarden.net/wiki/Gravity_(move) Gravity}.
 * Grounds all Pokémon on the field, including Flying-types and those with
 * {@linkcode AbilityId.LEVITATE} for the duration of the arena tag, usually 5 turns.
 * @extends ArenaTag
 */
export class GravityTag extends ArenaTag {
  constructor(turnCount: number) {
    super(ArenaTagType.GRAVITY, turnCount, MoveId.GRAVITY);
  }

  override onAdd(_arena: Arena): void {
    globalScene.phaseManager.queueMessagePhase(i18next.t("arenaTag:gravityOnAdd"));
    globalScene.getField(true).forEach((pokemon) => {
      if (pokemon) {
        pokemon.removeTag(BattlerTagType.FLOATING);
        pokemon.removeTag(BattlerTagType.TELEKINESIS);
        if (pokemon.getTag(BattlerTagType.MID_AIR)) {
          pokemon.addTag(BattlerTagType.INTERRUPTED);
        }
        pokemon.getTag<SkyDropTag>(BattlerTagType.SKY_DROP)?.clearSkyDropEffects();
      }
    });
  }

  override onRemove(_arena: Arena): void {
    globalScene.phaseManager.queueMessagePhase(i18next.t("arenaTag:gravityOnRemove"));
  }
}
