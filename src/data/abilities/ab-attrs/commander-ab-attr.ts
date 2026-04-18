import { AbAttr } from "#abilities/ab-attr";
import { globalScene } from "#app/global-scene";
import type { SkyDropTag } from "#battler-tags/sky-drop-tag";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import { PokemonAnimType } from "#enums/pokemon-anim-type";
import { SpeciesId } from "#enums/species-id";
import type { Pokemon } from "#field/pokemon";
import type { BaseAbAttrParams } from "#types/ab-attr-param-types";

/**
 * When the source of an ability with this attribute detects a Dondozo as their active ally, the source \
 * "jumps into the Dondozo's mouth," sharply boosting the Dondozo's stats, cancelling the source's moves, \
 * and causing attacks that target the source to always miss.
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Commander_(Ability)}
 */
export class CommanderAbAttr extends AbAttr {
  protected override readonly abAttrKey = "CommanderAbAttr";

  constructor() {
    super(true);
  }

  public override apply({ pokemon, simulated }: BaseAbAttrParams): void {
    if (simulated) {
      return;
    }

    // Lapse the source's semi-invulnerable tags (to avoid visual inconsistencies)
    pokemon.lapseTags(BattlerTagLapseType.MOVE_EFFECT);

    pokemon.getTag<SkyDropTag>(BattlerTagType.SKY_DROP)?.clearSkyDropEffects();
    globalScene.triggerPokemonBattleAnim(pokemon, PokemonAnimType.COMMANDER_APPLY);
    pokemon.getAlly()?.addTag(BattlerTagType.COMMANDED, 0, MoveId.NONE, pokemon.id);
    this.cancelQueuedMove(pokemon);
  }

  public override canApply({ pokemon }: Parameters<this["apply"]>[0]): boolean {
    const ally = pokemon.getAlly();

    return (
      globalScene.currentBattle.double
      && !!ally?.isActive(true)
      && ally.species.speciesId === SpeciesId.DONDOZO
      && !ally.hasTag(BattlerTagType.COMMANDED)
    );
  }

  /**
   * Cancels all commands from the given Pokemon for the current turn
   * @param pokemon - The {@linkcode Pokemon} with this ability
   */
  private cancelQueuedMove(pokemon: Pokemon): void {
    const { turnManager } = globalScene.currentBattle;
    turnManager.tryRemoveCommand((tc) => tc.pokemon === pokemon);
  }
}
