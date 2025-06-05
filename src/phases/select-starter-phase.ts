import { globalScene } from "#app/global-scene";
import Overrides from "#app/overrides";
import { Phase } from "#app/phase";
import { ChallengeType } from "#enums/challenge-type";
import { PhaseId } from "#enums/phase-id";
import { SaveSlotUiMode } from "#enums/save-slot-ui-mode";
import { UiMode } from "#enums/ui-mode";
import { SpeciesFormChangeMoveLearnedTrigger } from "#form-change-triggers/species-form-change-move-learned-trigger";
import { overrideHeldItems, overrideModifiers } from "#modifier/modifier";
import type { StarterConfig } from "#types/starter-config";
import type { SaveSlotSelectUiHandler } from "#ui/save-slot-select-ui-handler";
import type { StarterSelectUiHandler } from "#ui/starter-select-ui-handler";
import { applyChallenges } from "#utils/challenge-utils";
import { isNil } from "#utils/common-utils";
import { getPokemonSpecies } from "#utils/pokemon-utils";
import SoundFade from "phaser3-rex-plugins/plugins/soundfade";

export class SelectStarterPhase extends Phase {
  override readonly id = PhaseId.SELECT_STARTER;

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
   * @param starters {@linkcode Pokemon} with which to start the first battle
   */
  public initBattle(starters: StarterConfig[]): void {
    const { arena, gameMode, gameData, sound, time } = globalScene;
    const { dexData, gameStats, starterData } = gameData;
    const { isClassic } = gameMode;

    const party = globalScene.getPlayerParty();
    const loadPokemonAssets: Promise<void>[] = [];

    starters.forEach((starter: StarterConfig, i: number) => {
      if (!i && Overrides.STARTER_SPECIES_OVERRIDE) {
        starter.species = getPokemonSpecies(Overrides.STARTER_SPECIES_OVERRIDE);
      }

      const { abilityIndex, dexAttr, moveset, nature, nickname, passive, pokerus, species } = starter;
      const { speciesId } = species;

      const starterProps = gameData.getSpeciesDexAttrProps(species, dexAttr);
      let starterFormIndex = Math.min(starterProps.formIndex, Math.max(species.forms.length - 1, 0));

      if (
        speciesId in Overrides.STARTER_FORM_OVERRIDES
        && !isNil(Overrides.STARTER_FORM_OVERRIDES[speciesId])
        && species.forms[Overrides.STARTER_FORM_OVERRIDES[speciesId]]
      ) {
        starterFormIndex = Overrides.STARTER_FORM_OVERRIDES[speciesId];
      }

      const starterGender = Overrides.GENDER_OVERRIDE ?? starterProps.gender;

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

      starterPokemon.luck = gameData.getDexAttrLuck(dexData[speciesId].caughtAttr);

      if (pokerus) {
        starterPokemon.pokerus = true;
      }

      if (nickname) {
        starterPokemon.nickname = nickname;
      }

      if (!isNil(starter.teraType)) {
        starterPokemon.teraType = starter.teraType;
      } else {
        starterPokemon.teraType = starterPokemon.species.type1;
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
      time.delayedCall(500, () => globalScene.audioManager.playBgm());

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
