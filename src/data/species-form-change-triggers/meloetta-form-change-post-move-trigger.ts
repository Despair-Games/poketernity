import { SpeciesFormChangePostMoveTrigger } from "#app/data/species-form-change-triggers/species-form-change-post-move-trigger";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { Abilities } from "#enums/abilities";
import { Challenges } from "#enums/challenges";

export class MeloettaFormChangePostMoveTrigger extends SpeciesFormChangePostMoveTrigger {
  override canChange(pokemon: Pokemon): boolean {
    // TODO: improve this (should only block the form change in Psychic or Fighting mono-type, not Normal)
    if (globalScene.gameMode.hasChallenge(Challenges.SINGLE_TYPE)) {
      return false;
    } else {
      // Meloetta will not transform if it has the ability Sheer Force when using Relic Song
      if (pokemon.hasAbility(Abilities.SHEER_FORCE)) {
        return false;
      }
      return super.canChange(pokemon);
    }
  }
}
