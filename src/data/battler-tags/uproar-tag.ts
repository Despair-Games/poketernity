import { MoveLockTag } from "#app/data/battler-tags/move-lock-tag";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import type { BooleanHolder } from "#app/utils";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import { StatusEffect } from "#enums/status-effect";
import i18next from "i18next";

/**
 * Puts the source {@linkcode Pokemon} into an uproar, locking them into using
 * Uproar for 2 turns after the initial usage and preventing all
 * Pokemon on the field from sleeping. All Pokemon on the field also
 * wake up when this tag is added.
 * @extends MoveLockTag
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Uproar_(move) Uproar}
 */
export class UproarTag extends MoveLockTag {
  constructor() {
    super(BattlerTagType.UPROAR, 3, MoveId.UPROAR);
  }

  /**
   * Plays a "started an uproar" message, then wakes up all active Pokemon
   * @param pokemon the {@linkcode Pokemon} with this tag
   */
  override onAdd(pokemon: Pokemon): void {
    // "{pokemonNameWithAffix} caused an uproar!"
    globalScene.queueMessage(
      i18next.t("battlerTags:uproarOnAdd", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
    );

    // Wake up all sleeping Pokemon on the field
    globalScene.getField(true).forEach((p) => {
      if (p.hasStatusEffect(StatusEffect.SLEEP, false, true)) {
        p.resetStatus();
        // "The uproar woke {pokemonNameWithAffix}!"
        globalScene.queueMessage(
          i18next.t("battlerTags:uproarOnCureSleep", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
        );
      }
    });
  }

  override onRemove(pokemon: Pokemon): void {
    // "{pokemonNameWithAffix} calmed down."
    globalScene.queueMessage(
      i18next.t("battlerTags:uproarOnRemove", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
    );

    super.onRemove(pokemon);
  }

  /**
   * Prevents Pokemon on the field from falling asleep
   * @param pokemon the {@linkcode Pokemon} with this tag
   * @param simulated if `true`, suppresses changes to game state
   * @param affectedPokemon the {@linkcode Pokemon} to be afflicted with sleep
   * @param preventSleep a {@linkcode BooleanHolder} which, if `true`, cancels attempts to afflict sleep
   * @returns `true`
   */
  override apply(
    _pokemon: Pokemon,
    simulated: boolean,
    affectedPokemon: Pokemon,
    preventSleep: BooleanHolder,
  ): boolean {
    if (!simulated) {
      // "But the uproar kept {pokemonNameWithAffix} awake!"
      globalScene.queueMessage(
        i18next.t("battlerTags:uproarOnPreventSleep", {
          pokemonNameWithAffix: getPokemonNameWithAffix(affectedPokemon),
        }),
      );
    }

    preventSleep.value = true;
    return true;
  }
}
