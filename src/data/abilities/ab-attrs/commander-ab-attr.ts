import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import { PokemonAnimType } from "#enums/pokemon-anim-type";
import { SpeciesId } from "#enums/species-id";
import { AbAttr } from "./ab-attr";
import { type SkyDropTag } from "#app/data/battler-tags/sky-drop-tag";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { MovePhase } from "#app/phases/move-phase";
import { PhaseId } from "#enums/phase-id";

/**
 * Attribute implementing the effects of {@link https://bulbapedia.bulbagarden.net/wiki/Commander_(Ability) | Commander}.
 * When the source of an ability with this attribute detects a Dondozo as their active ally, the source "jumps
 * into the Dondozo's mouth," sharply boosting the Dondozo's stats, cancelling the source's moves, and
 * causing attacks that target the source to always miss.
 */
export class CommanderAbAttr extends AbAttr {
  constructor(showAbility: boolean = true, showAbilityInstant: boolean = false) {
    super(showAbility, showAbilityInstant);
    this._flags.add(AbAttrFlag.COMMANDER);
  }

  override apply(pokemon: Pokemon, simulated: boolean): boolean {
    if (globalScene.currentBattle?.double && pokemon.getAlly()?.species.speciesId === SpeciesId.DONDOZO) {
      // If the ally Dondozo is fainted or was previously "commanded" by
      // another Pokemon, this effect cannot apply.
      if (pokemon.getAlly()?.isFainted() || pokemon.getAlly()?.getTag(BattlerTagType.COMMANDED)) {
        return false;
      }

      if (!simulated) {
        // Lapse the source's semi-invulnerable tags (to avoid visual inconsistencies)
        pokemon.lapseTags(BattlerTagLapseType.MOVE_EFFECT);
        // Remove Sky Drop's effect from the source and whoever else is affected.
        pokemon.getTag<SkyDropTag>(BattlerTagType.SKY_DROP)?.clearSkyDropEffects();
        // Play an animation of the source jumping into the ally Dondozo's mouth
        globalScene.triggerPokemonBattleAnim(pokemon, PokemonAnimType.COMMANDER_APPLY);
        // Apply boosts from this effect to the ally Dondozo
        pokemon.getAlly()?.addTag(BattlerTagType.COMMANDED, 0, MoveId.NONE, pokemon.id);
        // Cancel the source Pokemon's next move (if a move is queued)
        this.cancelQueuedMove(pokemon);
      }
      return true;
    }
    return false;
  }

  /**
   * Cancels all commands from the given Pokemon for the current turn
   * @param pokemon The {@linkcode Pokemon} with this ability
   */
  private cancelQueuedMove(pokemon: Pokemon): void {
    const { turnManager } = globalScene.currentBattle;
    turnManager.tryRemoveCommand((tc) => tc.pokemon === pokemon);
    // The first move in the turn is already added to the phase queue at this point.
    // If this move is from the source Pokemon, the turn manager needs to queue the next valid move command.
    if (
      globalScene.phaseManager.tryRemovePhase((phase) => phase.is<MovePhase>(PhaseId.MOVE) && phase.pokemon === pokemon)
    ) {
      turnManager.scheduleNextValidCommand();
    }
  }
}
