import { BattlerIndex, BattleType } from "#app/battle";
import { PLAYER_PARTY_MAX_SIZE } from "#app/constants";
import { applyAbAttrs, SyncEncounterNatureAbAttr } from "#app/data/ability";
import { initEncounterAnims, loadEncounterAnimAssets } from "#app/data/battle-anims";
import { getCharVariantFromDialogue } from "#app/data/dialogue";
import { WEIGHT_INCREMENT_ON_SPAWN_MISS } from "#app/data/mystery-encounters/mystery-encounters";
import { getEncounterText } from "#app/data/mystery-encounters/utils/encounter-dialogue-utils";
import { doTrainerExclamation } from "#app/data/mystery-encounters/utils/encounter-phase-utils";
import { getGoldenBugNetSpecies } from "#app/data/mystery-encounters/utils/encounter-pokemon-utils";
import { TrainerSlot } from "#app/data/trainer-config";
import { getRandomWeatherType } from "#app/data/weather";
import { EncounterPhaseEvent } from "#app/events/battle-scene";
import type Pokemon from "#app/field/pokemon";
import { FieldPosition } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import {
  BoostBugSpawnModifier,
  IvScannerModifier,
  overrideHeldItems,
  overrideModifiers,
  TurnHeldItemTransferModifier,
} from "#app/modifier/modifier";
import { ModifierPoolType, regenerateModifierPoolThresholds } from "#app/modifier/modifier-type";
import Overrides from "#app/overrides";
import { BattlePhase } from "#app/phases/battle-phase";
import { CheckSwitchPhase } from "#app/phases/check-switch-phase";
import { GameOverPhase } from "#app/phases/game-over-phase";
import { MysteryEncounterPhase } from "./mystery-encounter-phases/mystery-encounter-phase";
import { PostSummonPhase } from "#app/phases/post-summon-phase";
import { ReturnPhase } from "#app/phases/return-phase";
import { ScanIvsPhase } from "#app/phases/scan-ivs-phase";
import { ShinySparklePhase } from "#app/phases/shiny-sparkle-phase";
import { SummonPhase } from "#app/phases/summon-phase";
import { ToggleDoublePositionPhase } from "#app/phases/toggle-double-position-phase";
import { achvs } from "#app/system/achv";
import { handleTutorial, Tutorial } from "#app/tutorial";
import { Mode } from "#app/ui/ui";
import { randSeedInt, randSeedItem } from "#app/utils";
import { Biome } from "#enums/biome";
import { MysteryEncounterMode } from "#enums/mystery-encounter-mode";
import { PlayerGender } from "#enums/player-gender";
import { Species } from "#enums/species";
import i18next from "i18next";

export class EncounterPhase extends BattlePhase {
  private loaded: boolean;

  constructor(loaded: boolean = false) {
    super();

    this.loaded = loaded;
  }

  public override start(): void {
    super.start();

    const { currentBattle, field, gameData, gameMode } = globalScene;

    globalScene.updateGameInfo();

    globalScene.initSession();

    globalScene.eventTarget.dispatchEvent(new EncounterPhaseEvent());

    // Failsafe if players somehow skip floor 200 in classic mode
    if (gameMode.isClassic && currentBattle.waveIndex > 200) {
      globalScene.unshiftPhase(new GameOverPhase());
    }

    const loadEnemyAssets: Promise<void>[] = [];

    // Generate and Init Mystery Encounter
    if (currentBattle.isBattleMysteryEncounter() && !currentBattle.mysteryEncounter) {
      globalScene.executeWithSeedOffset(() => {
        const currentSessionEncounterType = currentBattle.mysteryEncounterType;
        currentBattle.mysteryEncounter = globalScene.getMysteryEncounter(currentSessionEncounterType);
      }, currentBattle.waveIndex * 16);
    }
    const mysteryEncounter = currentBattle.mysteryEncounter;
    if (mysteryEncounter) {
      // If ME has an onInit() function, call it
      // Usually used for calculating rand data before initializing anything visual
      // Also prepopulates any dialogue tokens from encounter/option requirements
      globalScene.executeWithSeedOffset(() => {
        if (mysteryEncounter.onInit) {
          mysteryEncounter.onInit();
        }
        mysteryEncounter.populateDialogueTokensFromRequirements();
      }, currentBattle.waveIndex);

      // Add any special encounter animations to load
      if (mysteryEncounter.encounterAnimations && mysteryEncounter.encounterAnimations.length > 0) {
        loadEnemyAssets.push(
          initEncounterAnims(mysteryEncounter.encounterAnimations).then(() => loadEncounterAnimAssets(true)),
        );
      }

      // Add intro visuals for mystery encounter
      mysteryEncounter.initIntroVisuals();
      field.add(mysteryEncounter.introVisuals!);
    }

    let totalBst = 0;

    currentBattle.enemyLevels?.every((level, e) => {
      if (currentBattle.isBattleMysteryEncounter()) {
        // Skip enemy loading for MEs, those are loaded elsewhere
        return false;
      }
      if (!this.loaded) {
        if (currentBattle.battleType === BattleType.TRAINER && currentBattle.trainer) {
          currentBattle.enemyParty[e] = currentBattle.trainer.genPartyMember(e);
        } else {
          let enemySpecies = globalScene.randomSpecies(currentBattle.waveIndex, level, true);
          // If player has golden bug net, rolls 10% chance to replace non-boss wave wild species from the golden bug net bug pool
          if (
            globalScene.findModifier((m) => m instanceof BoostBugSpawnModifier)
            && !gameMode.isBoss(currentBattle.waveIndex)
            && globalScene.arena.biomeType !== Biome.END
            && randSeedInt(10) === 0
          ) {
            enemySpecies = getGoldenBugNetSpecies(level);
          }
          currentBattle.enemyParty[e] = globalScene.addEnemyPokemon(
            enemySpecies,
            level,
            TrainerSlot.NONE,
            !!globalScene.getEncounterBossSegments(currentBattle.waveIndex, level, enemySpecies),
          );
          if (currentBattle.isClassicFinalBoss) {
            currentBattle.enemyParty[e].ivs = new Array(6).fill(31);
          }
          globalScene
            .getPlayerParty()
            .slice(0, !currentBattle.double ? 1 : 2)
            .reverse()
            .forEach((playerPokemon) => {
              applyAbAttrs(SyncEncounterNatureAbAttr, playerPokemon, null, false, currentBattle.enemyParty[e]);
            });
        }
      }
      const enemyPokemon = globalScene.getEnemyParty()[e];
      if (e < (currentBattle.double ? 2 : 1)) {
        enemyPokemon.setX(-66 + enemyPokemon.getFieldPositionOffset()[0]);
        enemyPokemon.resetSummonData();
      }

      if (!this.loaded) {
        gameData.setPokemonSeen(
          enemyPokemon,
          true,
          currentBattle?.battleType === BattleType.TRAINER
            || currentBattle?.mysteryEncounter?.encounterMode === MysteryEncounterMode.TRAINER_BATTLE,
        );
      }

      if (enemyPokemon.species.speciesId === Species.ETERNATUS) {
        if (currentBattle.isClassicFinalBoss) {
          enemyPokemon.setBoss();
        } else if (!(currentBattle.waveIndex % 1000)) {
          enemyPokemon.formIndex = 1;
          enemyPokemon.updateScale();
        }
      }

      totalBst += enemyPokemon.getSpeciesForm().baseTotal;

      loadEnemyAssets.push(enemyPokemon.loadAssets());

      console.log(
        `Pokemon: ${getPokemonNameWithAffix(enemyPokemon)}`,
        `Species ID: ${enemyPokemon.species.speciesId}`,
        `Stats: ${enemyPokemon.stats}`,
        `Ability: ${enemyPokemon.getAbility().name}`,
        `Passive Ability: ${enemyPokemon.getPassiveAbility().name}`,
      );
      return true;
    });

    if (globalScene.getPlayerParty().filter((p) => p.isShiny()).length === PLAYER_PARTY_MAX_SIZE) {
      globalScene.validateAchv(achvs.SHINY_PARTY);
    }

    if (currentBattle.battleType === BattleType.TRAINER && currentBattle.trainer) {
      loadEnemyAssets.push(currentBattle.trainer.loadAssets().then(() => currentBattle.trainer!.initSprite()));
    } else if (currentBattle.isBattleMysteryEncounter()) {
      if (currentBattle.mysteryEncounter?.introVisuals) {
        loadEnemyAssets.push(
          currentBattle.mysteryEncounter.introVisuals
            .loadAssets()
            .then(() => currentBattle.mysteryEncounter!.introVisuals!.initSprite()),
        );
      }
      if (currentBattle.mysteryEncounter?.loadAssets && currentBattle.mysteryEncounter.loadAssets.length > 0) {
        loadEnemyAssets.push(...currentBattle.mysteryEncounter.loadAssets);
      }
      // Load Mystery Encounter Exclamation bubble and sfx
      loadEnemyAssets.push(
        new Promise<void>((resolve) => {
          globalScene.loadSe("GEN8- Exclaim", "battle_anims", "GEN8- Exclaim.wav");
          globalScene.loadImage("encounter_exclaim", "mystery-encounters");
          globalScene.load.once(Phaser.Loader.Events.COMPLETE, () => resolve());
          if (!globalScene.load.isLoading()) {
            globalScene.load.start();
          }
        }),
      );
    } else {
      const overridedBossSegments = Overrides.OPP_HEALTH_SEGMENTS_OVERRIDE > 1;
      // for double battles, reduce the health segments for boss Pokemon unless there is an override
      if (!overridedBossSegments && currentBattle.enemyParty.filter((p) => p.isBoss()).length > 1) {
        for (const enemyPokemon of currentBattle.enemyParty) {
          // If the enemy pokemon is a boss and wasn't populated from data source, then update the number of segments
          if (enemyPokemon.isBoss() && !enemyPokemon.isPopulatedFromDataSource) {
            enemyPokemon.setBoss(
              true,
              Math.ceil(enemyPokemon.bossSegments * (enemyPokemon.getSpeciesForm().baseTotal / totalBst)),
            );
            enemyPokemon.initBattleInfo();
          }
        }
      }
    }

    Promise.all(loadEnemyAssets).then(() => {
      currentBattle.enemyParty.every((enemyPokemon, index) => {
        if (currentBattle.isBattleMysteryEncounter()) {
          return false;
        }
        if (index < (currentBattle.double ? 2 : 1)) {
          if (currentBattle.battleType === BattleType.WILD) {
            field.add(enemyPokemon);
            currentBattle.seenEnemyPartyMemberIds.add(enemyPokemon.id);
            const playerPokemon = globalScene.getPlayerPokemon();
            if (playerPokemon?.isOnField()) {
              field.moveBelow(enemyPokemon as Pokemon, playerPokemon);
            }
            enemyPokemon.tint(0, 0.5);
          } else if (currentBattle.battleType === BattleType.TRAINER) {
            enemyPokemon.setVisible(false);
            currentBattle.trainer?.tint(0, 0.5);
          }
          if (currentBattle.double) {
            enemyPokemon.setFieldPosition(index ? FieldPosition.RIGHT : FieldPosition.LEFT);
          }
        }
        return true;
      });

      if (!this.loaded && currentBattle.battleType !== BattleType.MYSTERY_ENCOUNTER) {
        regenerateModifierPoolThresholds(
          globalScene.getEnemyField(),
          currentBattle.battleType === BattleType.TRAINER ? ModifierPoolType.TRAINER : ModifierPoolType.WILD,
        );
        globalScene.generateEnemyModifiers();
        overrideModifiers(false);
        globalScene.getEnemyField().forEach((enemy) => {
          overrideHeldItems(enemy, false);
        });
      }

      globalScene.ui.setMode(Mode.MESSAGE).then(() => {
        if (!this.loaded) {
          // Set weather before session gets saved to ensure it's properly added to session data
          this.trySetWeatherIfNewBiome();
          // Game currently syncs to server on waves X1 and X6, or after 5 minutes have passed without a save
          gameData
            .saveAll(true, currentBattle.waveIndex % 5 === 1 || (globalScene.lastSavePlayTime ?? 0) >= 300)
            .then((success) => {
              globalScene.disableMenu = false;
              if (!success) {
                return globalScene.reset(true);
              }
              this.doEncounter();
              globalScene.resetSeed();
            });
        } else {
          this.doEncounter();
          globalScene.resetSeed();
        }
      });
    });
  }

  protected doEncounter(): void {
    globalScene.playBgm(undefined, true);
    globalScene.updateModifiers(false);
    globalScene.setFieldScale(1);

    const { currentBattle } = globalScene;
    const { battleType, waveIndex } = currentBattle;
    if (
      globalScene.isMysteryEncounterValidForWave(battleType, waveIndex)
      && !currentBattle.isBattleMysteryEncounter()
    ) {
      // Increment ME spawn chance if an ME could have spawned but did not
      // Only do this AFTER session has been saved to avoid duplicating increments
      globalScene.mysteryEncounterSaveData.encounterSpawnChance += WEIGHT_INCREMENT_ON_SPAWN_MISS;
    }

    for (const pokemon of globalScene.getPlayerParty()) {
      if (pokemon) {
        pokemon.resetBattleData();
      }
    }

    const enemyField = globalScene.getEnemyField();
    globalScene.tweens.add({
      targets: [
        globalScene.arenaEnemy,
        currentBattle.trainer,
        enemyField,
        globalScene.arenaPlayer,
        globalScene.trainer,
      ].flat(),
      x: (_target, _key, value, fieldIndex: number) => (fieldIndex < 2 + enemyField.length ? value + 300 : value - 300),
      duration: 2000,
      onComplete: () => {
        if (globalScene.currentBattle.isClassicFinalBoss) {
          this.displayFinalBossDialogue();
        } else {
          this.doEncounterCommon();
        }
      },
    });

    const encounterIntroVisuals = currentBattle?.mysteryEncounter?.introVisuals;
    if (encounterIntroVisuals) {
      const enterFromRight = encounterIntroVisuals.enterFromRight;
      if (enterFromRight) {
        encounterIntroVisuals.x += 500;
      }
      globalScene.tweens.add({
        targets: encounterIntroVisuals,
        x: enterFromRight ? "-=200" : "+=300",
        duration: 2000,
      });
    }
  }

  public getEncounterMessage(): string {
    const { currentBattle } = globalScene;
    const enemyField = globalScene.getEnemyField();

    if (globalScene.currentBattle.isClassicFinalBoss) {
      return i18next.t("battle:bossAppeared", { bossName: getPokemonNameWithAffix(enemyField[0]) });
    }

    if (currentBattle.battleType === BattleType.TRAINER) {
      if (currentBattle.double) {
        return i18next.t("battle:trainerAppearedDouble", {
          trainerName: currentBattle.trainer?.getName(TrainerSlot.NONE, true),
        });
      } else {
        return i18next.t("battle:trainerAppeared", {
          trainerName: currentBattle.trainer?.getName(TrainerSlot.NONE, true),
        });
      }
    }

    return enemyField.length === 1
      ? i18next.t("battle:singleWildAppeared", { pokemonName: enemyField[0].getNameToRender() })
      : i18next.t("battle:multiWildAppeared", {
          pokemonName1: enemyField[0].getNameToRender(),
          pokemonName2: enemyField[1].getNameToRender(),
        });
  }

  protected doEncounterCommon(showEncounterMessage: boolean = true): void {
    const { currentBattle, ui } = globalScene;
    const enemyField = globalScene.getEnemyField();

    if (currentBattle.battleType === BattleType.WILD) {
      enemyField.forEach((enemyPokemon) => {
        enemyPokemon.untint(100, "Sine.easeOut");
        enemyPokemon.cry();
        enemyPokemon.showInfo();
        if (enemyPokemon.isShiny()) {
          globalScene.validateAchv(achvs.SEE_SHINY);
        }
      });
      globalScene.updateFieldScale();
      if (showEncounterMessage) {
        ui.showText(this.getEncounterMessage(), null, () => this.end(), 1500);
      } else {
        this.end();
      }
    } else if (currentBattle.battleType === BattleType.TRAINER) {
      const trainer = currentBattle.trainer;
      trainer?.untint(100, "Sine.easeOut");
      trainer?.playAnim();

      const doSummon = (): void => {
        currentBattle.started = true;
        globalScene.playBgm(undefined);
        globalScene.pbTray.showPbTray(globalScene.getPlayerParty());
        globalScene.pbTrayEnemy.showPbTray(globalScene.getEnemyParty());
        const doTrainerSummon = (): void => {
          this.hideEnemyTrainer();
          const availablePartyMembers = globalScene.getEnemyParty().filter((p) => !p.isFainted()).length;
          globalScene.unshiftPhase(new SummonPhase(0, false));
          if (globalScene.currentBattle.double && availablePartyMembers > 1) {
            globalScene.unshiftPhase(new SummonPhase(1, false));
          }
          this.end();
        };
        if (showEncounterMessage) {
          ui.showText(this.getEncounterMessage(), null, doTrainerSummon, 1500, true);
        } else {
          doTrainerSummon();
        }
      };

      const encounterMessages = currentBattle.trainer?.getEncounterMessages();

      if (!encounterMessages?.length) {
        doSummon();
      } else {
        let message: string;
        globalScene.executeWithSeedOffset(() => (message = randSeedItem(encounterMessages)), currentBattle.waveIndex);
        message = message!; // tell TS compiler it's defined now
        const showDialogueAndSummon = (): void => {
          ui.showDialogue(message, trainer?.getName(TrainerSlot.NONE, true), null, () => {
            globalScene.charSprite.hide().then(() => globalScene.hideFieldOverlay(250).then(() => doSummon()));
          });
        };
        if (currentBattle.trainer?.config.hasCharSprite && !ui.shouldSkipDialogue(message)) {
          globalScene
            .showFieldOverlay(500)
            .then(() =>
              globalScene.charSprite
                .showCharacter(trainer?.getKey()!, getCharVariantFromDialogue(encounterMessages[0]))
                .then(() => showDialogueAndSummon()),
            ); // TODO: is this bang correct?
        } else {
          showDialogueAndSummon();
        }
      }
    } else if (currentBattle.isBattleMysteryEncounter() && currentBattle.mysteryEncounter) {
      const encounter = currentBattle.mysteryEncounter;
      const introVisuals = encounter.introVisuals;
      introVisuals?.playAnim();

      if (encounter.onVisualsStart) {
        encounter.onVisualsStart();
      } else if (encounter.spriteConfigs && introVisuals) {
        // If the encounter doesn't have any special visual intro, show sparkle for shiny Pokemon
        introVisuals.playShinySparkles();
      }

      const doEncounter = (): void => {
        const doShowEncounterOptions = (): void => {
          ui.clearText();
          ui.getMessageHandler().hideNameText();

          globalScene.unshiftPhase(new MysteryEncounterPhase());
          this.end();
        };

        if (showEncounterMessage) {
          const introDialogue = encounter.dialogue.intro;
          if (!introDialogue) {
            doShowEncounterOptions();
          } else {
            const FIRST_DIALOGUE_PROMPT_DELAY = 750;
            let i = 0;
            const showNextDialogue = (): void => {
              const nextAction = i === introDialogue.length - 1 ? doShowEncounterOptions : showNextDialogue;
              const dialogue = introDialogue[i];
              const title = getEncounterText(dialogue?.speaker);
              const text = getEncounterText(dialogue.text)!;
              i++;
              if (title) {
                ui.showDialogue(text, title, null, nextAction, 0, i === 1 ? FIRST_DIALOGUE_PROMPT_DELAY : 0);
              } else {
                ui.showText(text, null, nextAction, i === 1 ? FIRST_DIALOGUE_PROMPT_DELAY : 0, true);
              }
            };

            if (introDialogue.length > 0) {
              showNextDialogue();
            }
          }
        } else {
          doShowEncounterOptions();
        }
      };

      const encounterMessage = i18next.t("battle:mysteryEncounterAppeared");

      if (!encounterMessage) {
        doEncounter();
      } else {
        doTrainerExclamation();
        ui.showDialogue(encounterMessage, "???", null, () => {
          globalScene.charSprite.hide().then(() => globalScene.hideFieldOverlay(250).then(() => doEncounter()));
        });
      }
    }
  }

  public override end(): void {
    const { currentBattle, gameMode } = globalScene;
    const enemyField = globalScene.getEnemyField();

    enemyField.forEach((enemyPokemon, e) => {
      if (enemyPokemon.isShiny()) {
        globalScene.unshiftPhase(new ShinySparklePhase(BattlerIndex.ENEMY + e));
      }
      // This sets Eternatus' held item to be untransferrable, preventing it from being stolen
      if (
        enemyPokemon.species.speciesId === Species.ETERNATUS
        && (gameMode.isBattleClassicFinalBoss(currentBattle.waveIndex)
          || gameMode.isEndlessMajorBoss(currentBattle.waveIndex))
      ) {
        const enemyMBH = globalScene.findModifier(
          (m) => m instanceof TurnHeldItemTransferModifier,
          false,
        ) as TurnHeldItemTransferModifier;
        if (enemyMBH) {
          globalScene.removeModifier(enemyMBH, true);
          enemyMBH.setTransferrableFalse();
          globalScene.addEnemyModifier(enemyMBH);
        }
      }
    });

    if (![BattleType.TRAINER, BattleType.MYSTERY_ENCOUNTER].includes(currentBattle.battleType)) {
      enemyField.map((p) =>
        globalScene.pushConditionalPhase(new PostSummonPhase(p.getBattlerIndex()), () => {
          if (!globalScene.getPlayerParty().length) {
            return false;
          }
          const pokemonsOnFieldCount = globalScene.getPlayerParty().filter((p) => p.isOnField()).length;
          const requiredPokemonsOnField = Math.min(
            globalScene.getPlayerParty().filter((p) => !p.isFainted()).length,
            2,
          );
          if (currentBattle.double) {
            return pokemonsOnFieldCount === requiredPokemonsOnField;
          }
          return pokemonsOnFieldCount === 1;
        }),
      );
      const ivScannerModifier = globalScene.findModifier((m) => m instanceof IvScannerModifier);
      if (ivScannerModifier) {
        enemyField.map((p) =>
          globalScene.pushPhase(
            new ScanIvsPhase(p.getBattlerIndex(), Math.min(ivScannerModifier.getStackCount() * 2, 6)),
          ),
        );
      }
    }

    if (!this.loaded) {
      const availablePartyMembers = globalScene.getPokemonAllowedInBattle();

      if (!availablePartyMembers[0].isOnField()) {
        globalScene.pushPhase(new SummonPhase(0));
      }

      if (currentBattle.double) {
        if (availablePartyMembers.length > 1) {
          globalScene.pushPhase(new ToggleDoublePositionPhase(true));
          if (!availablePartyMembers[1].isOnField()) {
            globalScene.pushPhase(new SummonPhase(1));
          }
        }
      } else {
        if (availablePartyMembers.length > 1 && availablePartyMembers[1].isOnField()) {
          globalScene.pushPhase(new ReturnPhase(1));
        }
        globalScene.pushPhase(new ToggleDoublePositionPhase(false));
      }

      if (currentBattle.battleType !== BattleType.TRAINER && (currentBattle.waveIndex > 1 || !gameMode.isDaily)) {
        const minPartySize = currentBattle.double ? 2 : 1;
        if (availablePartyMembers.length > minPartySize) {
          globalScene.pushPhase(new CheckSwitchPhase(0, currentBattle.double));
          if (currentBattle.double) {
            globalScene.pushPhase(new CheckSwitchPhase(1, currentBattle.double));
          }
        }
      }
    }
    handleTutorial(Tutorial.Access_Menu).then(() => super.end());
  }

  public displayFinalBossDialogue(): void {
    const enemy = globalScene.getEnemyPokemon();
    const { gameData, ui } = globalScene;
    ui.showText(
      this.getEncounterMessage(),
      null,
      () => {
        const localizationKey = "battleSpecDialogue:encounter";
        if (ui.shouldSkipDialogue(localizationKey)) {
          // Logging mirrors logging found in dialogue-ui-handler
          console.log(`Dialogue ${localizationKey} skipped`);
          this.doEncounterCommon(false);
        } else {
          const count = 5643853 + gameData.gameStats.classicSessionsPlayed;
          // The line below checks if an English ordinal is necessary or not based on whether an entry for encounterLocalizationKey exists in the language or not.
          const ordinalUsed =
            !i18next.exists(localizationKey, { fallbackLng: [] }) || i18next.resolvedLanguage === "en"
              ? i18next.t("battleSpecDialogue:key", { count: count, ordinal: true })
              : "";
          const cycleCount = count.toLocaleString() + ordinalUsed;
          const genderIndex = gameData.gender ?? PlayerGender.UNSET;
          const genderStr = PlayerGender[genderIndex].toLowerCase();
          const encounterDialogue = i18next.t(localizationKey, { context: genderStr, cycleCount: cycleCount });
          if (!gameData.getSeenDialogues()[localizationKey]) {
            gameData.saveSeenDialogue(localizationKey);
          }
          ui.showDialogue(encounterDialogue, enemy?.species.name, null, () => {
            this.doEncounterCommon(false);
          });
        }
      },
      1500,
      true,
    );
  }

  /**
   * Set biome weather if and only if this encounter is the start of a new biome.
   *
   * By using function overrides, this should happen if and only if this phase
   * is exactly a NewBiomeEncounterPhase or an EncounterPhase (to account for
   * Wave 1 of a Daily Run), but NOT NextEncounterPhase (which starts the next
   * wave in the same biome).
   */
  protected trySetWeatherIfNewBiome(): void {
    if (!this.loaded) {
      globalScene.arena.trySetWeather(getRandomWeatherType(globalScene.arena), false);
    }
  }
}
