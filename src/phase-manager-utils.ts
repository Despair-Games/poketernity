import {
  type SpeciesFormChangeTrigger,
  pokemonFormChanges,
  type SpeciesFormChange,
  FormChangeItem,
} from "./data/pokemon-forms";
import type { PokemonAnimType } from "./enums/pokemon-anim-type";
import { Species } from "./enums/species";
import type Pokemon from "./field/pokemon";
import { PlayerPokemon } from "./field/pokemon";
import { phaseManager } from "#app/global-phase-manager";
import { PokemonFormChangeItemModifier } from "./modifier/modifier";
import type { Phase } from "./phase";
import { FormChangePhase } from "./phases/form-change-phase";
import { MessagePhase } from "./phases/message-phase";
import { PokemonAnimPhase } from "./phases/pokemon-anim-phase";
import { QuietFormChangePhase } from "./phases/quiet-form-change-phase";
import type { Constructor } from "./utils";

/**
 * Adds a MessagePhase, either to PhaseQueuePrepend or nextCommandPhaseQueue
 * @param message string for MessagePhase
 * @param callbackDelay optional param for MessagePhase constructor
 * @param prompt optional param for MessagePhase constructor
 * @param promptDelay optional param for MessagePhase constructor
 * @param defer boolean for which queue to add it to, false -> add to PhaseQueuePrepend, true -> nextCommandPhaseQueue
 */
export function queueMessage(
  message: string,
  callbackDelay?: integer | null,
  prompt?: boolean | null,
  promptDelay?: integer | null,
  defer?: boolean | null,
) {
  const phase = new MessagePhase(message, callbackDelay, prompt, promptDelay);
  if (!defer) {
    // adds to the end of PhaseQueuePrepend
    phaseManager.unshiftPhase(phase);
  } else {
    //remember that pushPhase adds it to nextCommandPhaseQueue
    phaseManager.pushPhase(phase);
  }
}

export function triggerPokemonFormChange(
  pokemon: Pokemon,
  formChangeTriggerType: Constructor<SpeciesFormChangeTrigger>,
  delayed: boolean = false,
  modal: boolean = false,
): boolean {
  if (pokemonFormChanges.hasOwnProperty(pokemon.species.speciesId)) {
    // in case this is NECROZMA, determine which forms this
    const matchingFormChangeOpts = pokemonFormChanges[pokemon.species.speciesId].filter(
      (fc) => fc.findTrigger(formChangeTriggerType) && fc.canChange(pokemon),
    );
    let matchingFormChange: SpeciesFormChange | null;
    if (pokemon.species.speciesId === Species.NECROZMA && matchingFormChangeOpts.length > 1) {
      // Ultra Necrozma is changing its form back, so we need to figure out into which form it devolves.
      const formChangeItemModifiers = (
        this.findModifiers(
          (m) => m instanceof PokemonFormChangeItemModifier && m.pokemonId === pokemon.id,
        ) as PokemonFormChangeItemModifier[]
      )
        .filter((m) => m.active)
        .map((m) => m.formChangeItem);

      matchingFormChange = formChangeItemModifiers.includes(FormChangeItem.N_LUNARIZER)
        ? matchingFormChangeOpts[0]
        : formChangeItemModifiers.includes(FormChangeItem.N_SOLARIZER)
          ? matchingFormChangeOpts[1]
          : null;
    } else {
      matchingFormChange = matchingFormChangeOpts[0];
    }
    if (matchingFormChange) {
      let phase: Phase;
      if (pokemon instanceof PlayerPokemon && !matchingFormChange.quiet) {
        phase = new FormChangePhase(pokemon, matchingFormChange, modal);
      } else {
        phase = new QuietFormChangePhase(pokemon, matchingFormChange);
      }
      if (pokemon instanceof PlayerPokemon && !matchingFormChange.quiet && modal) {
        phaseManager.overridePhase(phase);
      } else if (delayed) {
        phaseManager.pushPhase(phase);
      } else {
        phaseManager.unshiftPhase(phase);
      }
      return true;
    }
  }

  return false;
}

export function triggerPokemonBattleAnim(
  pokemon: Pokemon,
  battleAnimType: PokemonAnimType,
  fieldAssets?: Phaser.GameObjects.Sprite[],
  delayed: boolean = false,
): boolean {
  const phase: Phase = new PokemonAnimPhase(battleAnimType, pokemon, fieldAssets);
  if (delayed) {
    phaseManager.pushPhase(phase);
  } else {
    phaseManager.unshiftPhase(phase);
  }
  return true;
}
