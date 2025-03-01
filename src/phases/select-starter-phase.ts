import { applyChallenges } from "#app/utils/challenge-utils";
import { ChallengeType } from "#enums/challenge-type";
import { SpeciesFormChangeMoveLearnedTrigger } from "#app/data/species-form-change-triggers/species-form-change-move-learned-trigger";
import { getPokemonSpecies } from "#app/utils/pokemon-species-utils";
import { globalScene } from "#app/global-scene";
import { overrideHeldItems, overrideModifiers } from "#app/modifier/modifier";
import Overrides from "#app/overrides";
import { Phase } from "#app/phase";
import { SaveSlotUiMode } from "#enums/save-slot-ui-mode";
import type { Starter } from "#app/ui/starter-select-ui-handler";
import { UiMode } from "#enums/ui-mode";
import { Gender } from "#enums/gender";
import SoundFade from "phaser3-rex-plugins/plugins/soundfade";
import { PhaseId } from "#enums/phase-id";

export class SelectStarterPhase extends Phase {
  override readonly id = PhaseId.SELECT_STARTER;

  public override start(): void {
    super.start();

    globalScene.audioManager.playBgm("menu");

    globalScene.ui.setMode(UiMode.STARTER_SELECT, (starters: Starter[]) => {
      globalScene.ui.clearText();
      globalScene.ui.setMode(UiMode.SAVE_SLOT, SaveSlotUiMode.SAVE, (slotId: number) => {
        if (slotId === -1) {
          globalScene.toTitleScreen({ clearPhaseQueue: true });
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
  public initBattle(starters: Starter[]): void {
    const { arena, gameMode, gameData, sound, time } = globalScene;
    const { dexData, gameStats } = gameData;
    const { isClassic } = gameMode;

    const party = globalScene.getPlayerParty();
    const loadPokemonAssets: Promise<void>[] = [];

    starters.forEach((starter: Starter, i: number) => {
      if (!i && Overrides.STARTER_SPECIES_OVERRIDE) {
        starter.species = getPokemonSpecies(Overrides.STARTER_SPECIES_OVERRIDE);
      }

      const { abilityIndex, dexAttr, moveset, nature, nickname, passive, pokerus, species } = starter;
      const { speciesId } = species;

      const starterProps = gameData.getSpeciesDexAttrProps(species, dexAttr);
      let starterFormIndex = Math.min(starterProps.formIndex, Math.max(species.forms.length - 1, 0));

      if (
        speciesId in Overrides.STARTER_FORM_OVERRIDES
        && species.forms[Overrides.STARTER_FORM_OVERRIDES[speciesId]!]
      ) {
        starterFormIndex = Overrides.STARTER_FORM_OVERRIDES[speciesId]!;
      }

      let starterGender =
        species.malePercent !== null ? (!starterProps.female ? Gender.MALE : Gender.FEMALE) : Gender.GENDERLESS;
      if (Overrides.GENDER_OVERRIDE !== null) {
        starterGender = Overrides.GENDER_OVERRIDE;
      }

      const starterIvs = dexData[speciesId].ivs.slice(0);
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
