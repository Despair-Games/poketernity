import { globalScene } from "#app/global-scene";
import { activeOverrides } from "#app/overrides";
import { Phase } from "#app/phase";
import { ChallengeType } from "#enums/challenge-type";
import { SaveSlotUiMode } from "#enums/save-slot-ui-mode";
import { UiMode } from "#enums/ui-mode";
import { SpeciesFormChangeMoveLearnedTrigger } from "#form-change-triggers/species-form-change-move-learned-trigger";
import { overrideHeldItems, overrideModifiers } from "#modifier/modifier";
import type { StarterConfig } from "#types/starter-data";
import type { SaveSlotSelectUiHandler } from "#ui/save-slot-select-ui-handler";
import type { StarterSelectUiHandler } from "#ui/starter-select-ui-handler";
import { applyChallenges } from "#utils/challenge-utils";
import { getPokemonSpecies } from "#utils/pokemon-utils";
import SoundFade from "phaser3-rex-plugins/plugins/soundfade";

export class SelectStarterPhase extends Phase {
  public override readonly phaseName = "SelectStarterPhase";

  public override start(): void {
    super.start();

    globalScene.audioManager.playBgm("menu");

    globalScene.ui.setMode<StarterSelectUiHandler>(UiMode.STARTER_SELECT, (starters: StarterConfig[]) => {
      globalScene.ui.clearText();
      globalScene.ui.setMode<SaveSlotSelectUiHandler>(UiMode.SAVE_SLOT, SaveSlotUiMode.SAVE, (slotId: number) => {
        if (slotId === -1) {
          globalScene.phaseManager.toTitleScreen({ clearPhaseQueue: true });
          return this.end();
        }
        globalScene.sessionSlotId = slotId;
        this.initBattle(starters);
      });
    });
  }

  /**
   * Initialize starters before starting the first battle
   * @param starters - The {@linkcode Pokemon} to start the first battle with
   */
  public initBattle(starters: StarterConfig[]): void {
    const { arena, audioManager, gameMode, gameData, sound, time } = globalScene;
    const { gameStats, starterData } = gameData;
    const { isClassic } = gameMode;

    const party = globalScene.getPlayerParty();
    const loadPokemonAssets: Promise<void>[] = [];

    starters.forEach((starter: StarterConfig, i: number) => {
      if (!i && activeOverrides.STARTER_SPECIES_OVERRIDE) {
        starter.species = getPokemonSpecies(activeOverrides.STARTER_SPECIES_OVERRIDE);
      }

      const { abilityIndex, dexAttr, moveset, nature, nickname, passive, pokerus, species, teraType } = starter;
      const { speciesId } = species;

      const starterProps = gameData.getSpeciesDexAttrProps(species, dexAttr);
      let starterFormIndex = Math.min(starterProps.formIndex, Math.max(species.forms.length - 1, 0));

      const { STARTER_FORM_OVERRIDES } = activeOverrides;
      if (
        speciesId in STARTER_FORM_OVERRIDES
        && STARTER_FORM_OVERRIDES[speciesId] != null
        && species.forms[STARTER_FORM_OVERRIDES[speciesId]]
      ) {
        starterFormIndex = STARTER_FORM_OVERRIDES[speciesId];
      }

      const starterGender = activeOverrides.GENDER_OVERRIDE ?? starterProps.gender;

      // Get ivs from the root species in case of an override to a non starter species
      const starterSpeciesId = species.getRootSpeciesId(true);
      const starterIvs = starterData[starterSpeciesId].ivs.slice(0);

      const starterPokemon = globalScene.addPlayerPokemon(
        species,
        gameMode.getStartingLevel(),
        abilityIndex,
        starterFormIndex,
        starterGender,
        starterProps.shiny,
        starterProps.variant,
        starterIvs,
        nature,
      );

      moveset && starterPokemon.tryPopulateMoveset(moveset);

      if (passive) {
        starterPokemon.passive = true;
      }

      if (pokerus) {
        starterPokemon.pokerus = true;
      }

      if (nickname) {
        starterPokemon.nickname = nickname;
      }

      if (teraType == null) {
        starterPokemon.teraType = starterPokemon.species.type1;
      } else {
        starterPokemon.teraType = teraType;
      }

      starterPokemon.setVisible(false);
      applyChallenges(gameMode, ChallengeType.STARTER_MODIFY, starterPokemon);
      party.push(starterPokemon);
      loadPokemonAssets.push(starterPokemon.loadAssets());
    });

    overrideModifiers();
    overrideHeldItems(party[0]);

    Promise.all(loadPokemonAssets).then(() => {
      SoundFade.fadeOut(globalScene, sound.get("menu"), 500, true);
      time.delayedCall(500, () => audioManager.playBgm());

      if (isClassic) {
        gameStats.classicSessionsPlayed++;
      } else {
        gameStats.endlessSessionsPlayed++;
      }

      globalScene.newBattle();
      arena.init();
      globalScene.sessionPlayTime = 0;
      globalScene.lastSavePlayTime = 0;

      // Ensures Keldeo (or any future Pokemon that have this type of form change) starts in the correct form
      globalScene.getPlayerParty().forEach((p) => {
        globalScene.triggerPokemonFormChange(p, SpeciesFormChangeMoveLearnedTrigger);
      });

      this.end();
    });
  }
}
