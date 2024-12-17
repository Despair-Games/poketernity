import { BattlerTagLapseType } from "#app/data/battler-tags";
import type Pokemon from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { MovePhase } from "#app/phases/move-phase";
import { BattlerTagType } from "#enums/battler-tag-type";
import { Moves } from "#enums/moves";
import { PokemonAnimType } from "#enums/pokemon-anim-type";
import { Species } from "#enums/species";
import { AbAttr } from "./ab-attr";

/**
 * Attribute implementing the effects of {@link https://bulbapedia.bulbagarden.net/wiki/Commander_(Ability) | Commander}.
 * When the source of an ability with this attribute detects a Dondozo as their active ally, the source "jumps
 * into the Dondozo's mouth," sharply boosting the Dondozo's stats, cancelling the source's moves, and
 * causing attacks that target the source to always miss.
 */
export class CommanderAbAttr extends AbAttr {
  constructor() {
    super(true);
  }

  override apply(pokemon: Pokemon, _passive: boolean, simulated: boolean, _cancelled: null, _args: any[]): boolean {
    // TODO: Should this work with X + Dondozo fusions?
    if (globalScene.currentBattle?.double && pokemon.getAlly()?.species.speciesId === Species.DONDOZO) {
      // If the ally Dondozo is fainted or was previously "commanded" by
      // another Pokemon, this effect cannot apply.
      if (pokemon.getAlly().isFainted() || pokemon.getAlly().getTag(BattlerTagType.COMMANDED)) {
        return false;
      }

      if (!simulated) {
        // Lapse the source's semi-invulnerable tags (to avoid visual inconsistencies)
        pokemon.lapseTags(BattlerTagLapseType.MOVE_EFFECT);
        // Remove Sky Drop's effect from the source and whoever else is affected.
        const skyDropTagId = pokemon.getTag(BattlerTagType.SKY_DROP)?.sourceId;
        if (skyDropTagId) {
          globalScene.getField(true).forEach((p) => {
            if (p.getTag(BattlerTagType.SKY_DROP)?.sourceId === skyDropTagId) {
              // Cancel the Sky Drop user's next use of Sky Drop
              if (p.getTag(BattlerTagType.SKY_DROP)?.sourceId === p.id) {
                globalScene.tryRemovePhase((phase) => phase instanceof MovePhase && phase.pokemon === p);
                p.getMoveQueue().shift();
              }
              p.removeTag(BattlerTagType.SKY_DROP);
            }
          });
        }
        // Play an animation of the source jumping into the ally Dondozo's mouth
        globalScene.triggerPokemonBattleAnim(pokemon, PokemonAnimType.COMMANDER_APPLY);
        // Apply boosts from this effect to the ally Dondozo
        pokemon.getAlly().addTag(BattlerTagType.COMMANDED, 0, Moves.NONE, pokemon.id);
        // Cancel the source Pokemon's next move (if a move is queued)
        globalScene.tryRemovePhase((phase) => phase instanceof MovePhase && phase.pokemon === pokemon);
      }
      return true;
    }
    return false;
  }
}
