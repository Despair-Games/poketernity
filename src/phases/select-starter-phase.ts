import { eventBus } from "#app/event-bus";
import { globalScene, mpSession } from "#app/global-scene";
import { activeOverrides } from "#app/overrides";
import { Phase } from "#app/phase";
import { ChallengeType } from "#enums/challenge-type";
import { SaveSlotUiMode } from "#enums/save-slot-ui-mode";
import { UiMode } from "#enums/ui-mode";
import { SpeciesFormChangeMoveLearnedTrigger } from "#form-change-triggers/species-form-change-move-learned-trigger";
import { overrideHeldItems, overrideModifiers } from "#modifier/modifier";
import type { StartersResolvedMessage } from "#multiplayer/mp-protocol";
import { createPokemonFromSerializedStarters, serializeStarters } from "#multiplayer/mp-starter-serialization";
import type { StarterConfig } from "#types/starter-data";
import type { SaveSlotSelectUiHandler } from "#ui/save-slot-select-ui-handler";
import type { StarterSelectUiHandler } from "#ui/starter-select-ui-handler";
import { applyChallenges } from "#utils/challenge-utils";
import { getPokemonSpecies } from "#utils/pokemon-utils";
import SoundFade from "phaser3-rex-plugins/plugins/soundfade";

export class SelectStarterPhase extends Phase {
  public override readonly phaseName = "SelectStarterPhase";

  public override start(): void {
    globalScene.audioManager.playBgm("menu");

    globalScene.ui.setMode<StarterSelectUiHandler>(UiMode.STARTER_SELECT, (starters: StarterConfig[]) => {
      globalScene.ui.clearText();

      // In multiplayer, skip save slot and submit starters to server
      if (mpSession?.isActive) {
        this.submitStartersAndWait(starters);
        return;
      }

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
   * In multiplayer mode, serialize starters and submit to the server.
   * Waits for all players' starters to be resolved before building the merged party.
   */
  private submitStartersAndWait(starters: StarterConfig[]): void {
    const starterDataJson = serializeStarters(starters);

    const onStartersResolved = (msg: StartersResolvedMessage) => {
      eventBus.off("mp:starters-resolved" as any, onStartersResolved);
      this.initMpBattle(msg);
    };
    eventBus.on("mp:starters-resolved" as any, onStartersResolved);

    const client = mpSession?.client;
    if (client) {
      client.submitStarters({ starterDataJson }).catch((err) => {
        console.error("[MP] Failed to submit starters:", err);
        eventBus.off("mp:starters-resolved" as any, onStartersResolved);
      });
    }
  }

  /**
   * Build the merged party from all players' resolved starters.
   * Interleaves Pokemon so field positions alternate between players:
   * [P1-slot0, P2-slot0, P1-slot1, P2-slot1, ...]
   */
  private initMpBattle(msg: StartersResolvedMessage): void {
    const { arena, audioManager, gameMode, gameData, sound, time } = globalScene;
    const { gameStats } = gameData;
    const { isClassic } = gameMode;

    console.log(`[MP] Building merged party from ${msg.playerStarters.length} players`);

    // Create Pokemon from all players' starters (returns arrays, not pushed to party yet)
    const loadPromises = msg.playerStarters.map((ps) =>
      createPokemonFromSerializedStarters(ps.starterDataJson, ps.userId),
    );

    Promise.all(loadPromises).then((playerPokemonArrays) => {
      const party = globalScene.getPlayerParty();

      // Interleave: [P1-slot0, P2-slot0, P1-slot1, P2-slot1, ...]
      // This ensures field positions 0 and 1 map to different players in double battles
      const maxSlots = Math.max(...playerPokemonArrays.map((arr) => arr.length));
      for (let slot = 0; slot < maxSlots; slot++) {
        for (const playerPokemons of playerPokemonArrays) {
          if (slot < playerPokemons.length) {
            party.push(playerPokemons[slot]);
          }
        }
      }

      console.log(
        `[MP] Party built: ${party.map((p) => `${p.species.name} (owner: ${p.mpOwnerUserId?.slice(0, 8)})`).join(", ")}`,
      );

      overrideModifiers();
      if (party.length > 0) {
        overrideHeldItems(party[0]);
      }

      SoundFade.fadeOut(globalScene, sound.get("menu"), 500, true);
      time.delayedCall(500, () => audioManager.playBgm());

      if (isClassic) {
        gameStats.classicSessionsPlayed++;
      }

      // Use slot 0 for MP runs (no save slot selection)
      globalScene.sessionSlotId = 0;

      // Apply the shared MP seed BEFORE newBattle() so both clients
      // generate identical encounters, enemy Pokemon, etc.
      if (mpSession?.seed) {
        globalScene.setSeed(mpSession.seed);
      }

      globalScene.newBattle();
      arena.init();
      globalScene.sessionPlayTime = 0;
      globalScene.lastSavePlayTime = 0;

      globalScene.getPlayerParty().forEach((p) => {
        globalScene.triggerPokemonFormChange(p, SpeciesFormChangeMoveLearnedTrigger);
      });

      this.end();
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
      const { shiny, variant } = starterProps;
      let formIndex = Math.min(starterProps.formIndex, Math.max(species.forms.length - 1, 0));

      const { STARTER_FORM_OVERRIDES } = activeOverrides;
      if (
        speciesId in STARTER_FORM_OVERRIDES
        && STARTER_FORM_OVERRIDES[speciesId] != null
        && species.forms[STARTER_FORM_OVERRIDES[speciesId]]
      ) {
        formIndex = STARTER_FORM_OVERRIDES[speciesId];
      }

      const gender = activeOverrides.GENDER_OVERRIDE ?? starterProps.gender;

      // Get ivs from the root species in case of an override to a non starter species
      const starterSpeciesId = species.getRootSpeciesId(true);
      const ivs = starterData[starterSpeciesId].ivs.slice(0);

      const starterPokemon = globalScene.addPlayerPokemon(species, gameMode.getStartingLevel(), {
        abilityIndex,
        formIndex,
        gender,
        shiny,
        variant,
        ivs,
        nature,
      });

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
