/* biome-ignore-start lint/correctness/noUnusedImports: tsdoc imports */
import type { NewBiomeEncounterPhase } from "#phases/new-biome-encounter-phase";
import type { NextEncounterPhase } from "#phases/next-encounter-phase";
/* biome-ignore-end lint/correctness/noUnusedImports: tsdoc imports */

import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import type { SyncEncounterNatureAbAttr } from "#abilities/sync-encounter-nature-ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { activeOverrides } from "#app/overrides";
import { handleTutorial } from "#app/tutorial";
import { PLAYER_PARTY_MAX_SIZE } from "#constants/game-constants";
import { ME_WEIGHT_INCREMENT_ON_SPAWN_MISS } from "#constants/mystery-encounter-constants";
import { getCharVariantFromDialogue } from "#data/dialogue";
import { getNatureName } from "#data/nature";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { BattleType } from "#enums/battle-type";
import { BattlerIndex } from "#enums/battler-index";
import { BiomeId } from "#enums/biome-id";
import { FieldPosition } from "#enums/field-position";
import { ImagesFolder } from "#enums/images-folder";
import { ModifierPoolType } from "#enums/modifier-pool-type";
import { MysteryEncounterMode } from "#enums/mystery-encounter-mode";
import { PlayerGender } from "#enums/player-gender";
import { SpeciesId } from "#enums/species-id";
import { TrainerSlot } from "#enums/trainer-slot";
import { Tutorial } from "#enums/tutorial";
import { EncounterPhaseEvent } from "#events/battle-scene";
import type { Pokemon } from "#field/pokemon";
import { initEncounterAnims } from "#init/init-encounter-anims";
import {
  BoostBugSpawnModifier,
  IvScannerModifier,
  overrideHeldItems,
  overrideModifiers,
  TurnHeldItemTransferModifier,
} from "#modifier/modifier";
import { regenerateModifierPoolThresholds } from "#modifier/modifier-type";
import { getEncounterText } from "#mystery-encounters/encounter-dialogue-utils";
import { doTrainerExclamation } from "#mystery-encounters/encounter-phase-utils";
import { getGoldenBugNetSpecies } from "#mystery-encounters/encounter-pokemon-utils";
import { BattlePhase } from "#phases/base/battle-phase";
import { achvs } from "#system/achievements";
import { settings } from "#system/settings-manager";
import type { PhaseKey } from "#types/phase-types";
import { loadEncounterAnimAssets } from "#utils/anim-utils";
import { enumValueToKey } from "#utils/common-utils";
import { randSeedInt, randSeedItem } from "#utils/random-utils";
import i18next from "i18next";

/**
 * Starts the first encounter (wave 1) of a new run.
 *
 * Subsequent encounters are handled by
 * {@linkcode NextEncounterPhase} and {@linkcode NewBiomeEncounterPhase},
 * or {@linkcode MysteryEncounterPhase} for Mystery Encounters.
 */
export class EncounterPhase extends BattlePhase {
  public override readonly phaseName: PhaseKey = "EncounterPhase";

  private readonly loaded: boolean;

  constructor(loaded: boolean = false) {
    super();

    this.loaded = loaded;
  }

  public override start(): void {
    const { arena, currentBattle, field, gameData, gameMode, load, phaseManager, ui } = globalScene;
    const { battleType, double, enemyLevels, isClassicFinalBoss, mysteryEncounterType, trainer, waveIndex } =
      currentBattle;

    globalScene.updateGameInfo();

    globalScene.initSession();

    globalScene.eventTarget.dispatchEvent(new EncounterPhaseEvent());

    // Failsafe if players somehow skip floor 200 in classic mode
    if (gameMode.isClassic && waveIndex > 200) {
      phaseManager.queueGameOverPhase({ clearPhaseQueue: false });
    }

    const loadEnemyAssets: Promise<void>[] = [];

    // Generate and Init Mystery Encounter
    if (currentBattle.isBattleMysteryEncounter() && !currentBattle.mysteryEncounter) {
      globalScene.executeWithSeedOffset(() => {
        const currentSessionEncounterType = mysteryEncounterType;
        currentBattle.mysteryEncounter = globalScene.getMysteryEncounter(currentSessionEncounterType);
      }, waveIndex * 16);
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
      }, waveIndex);

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

    enemyLevels?.every((level, e) => {
      if (currentBattle.isBattleMysteryEncounter()) {
        // Skip enemy loading for MEs, those are loaded elsewhere
        return false;
      }
      if (!this.loaded) {
        if (battleType === BattleType.TRAINER && trainer) {
          currentBattle.enemyParty[e] = trainer.genPartyMember(e);
        } else {
          let enemySpecies = globalScene.randomSpecies(waveIndex, level, true);
          // If player has golden bug net, rolls 10% chance to replace non-boss wave wild species from the golden bug net bug pool
          if (
            globalScene.findModifier((m) => m instanceof BoostBugSpawnModifier)
            && !gameMode.isBoss(waveIndex)
            && arena.biomeId !== BiomeId.END
            && randSeedInt(10) === 0
          ) {
            enemySpecies = getGoldenBugNetSpecies(level);
          }
          currentBattle.enemyParty[e] = globalScene.addEnemyPokemon(
            enemySpecies,
            level,
            TrainerSlot.NONE,
            globalScene.getEncounterBossSegments(waveIndex, level, enemySpecies) > 0,
          );
          if (isClassicFinalBoss) {
            currentBattle.enemyParty[e].ivs = new Array(6).fill(31);
          }
          globalScene
            .getPlayerParty()
            .slice(0, double ? 2 : 1)
            .reverse()
            .forEach((playerPokemon) => {
              applyAbAttrs<SyncEncounterNatureAbAttr>(
                AbAttrFlag.SYNC_ENCOUNTER_NATURE,
                playerPokemon,
                false,
                currentBattle.enemyParty[e],
              );
            });
        }
      }
      const enemyPokemon = globalScene.getEnemyParty()[e];
      if (e < (double ? 2 : 1)) {
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

      if (enemyPokemon.species.speciesId === SpeciesId.ETERNATUS) {
        if (isClassicFinalBoss) {
          enemyPokemon.setBoss();
        } else if (!(waveIndex % 1000)) {
          enemyPokemon.formIndex = 1;
          enemyPokemon.updateScale();
        }
      }

      totalBst += enemyPokemon.getSpeciesForm().baseTotal;

      loadEnemyAssets.push(enemyPokemon.loadAssets());

      const stats: string[] = [
        `HP: ${enemyPokemon.stats[0]} (${enemyPokemon.ivs[0]})`,
        ` Atk: ${enemyPokemon.stats[1]} (${enemyPokemon.ivs[1]})`,
        ` Def: ${enemyPokemon.stats[2]} (${enemyPokemon.ivs[2]})`,
        ` Spatk: ${enemyPokemon.stats[3]} (${enemyPokemon.ivs[3]})`,
        ` Spdef: ${enemyPokemon.stats[4]} (${enemyPokemon.ivs[4]})`,
        ` Spd: ${enemyPokemon.stats[5]} (${enemyPokemon.ivs[5]})`,
      ];
      const moveset: string[] = [];
      enemyPokemon.getMoveset().forEach((move) => {
        moveset.push(move.name);
      });

      console.log(
        `Pokemon: ${getPokemonNameWithAffix(enemyPokemon)}`,
        `| Species ID: ${enemyPokemon.species.speciesId}`,
        `| Level: ${enemyPokemon.level}`,
        `| Nature: ${getNatureName(enemyPokemon.nature, true, true, true)}`,
      );
      console.log(`Stats (IVs): ${stats}`);
      console.log(
        `Ability: ${enemyPokemon.getAbility().name}`,
        `| Passive Ability${enemyPokemon.hasPassive() ? "" : " (inactive)"}: ${enemyPokemon.getPassiveAbility().name}`,
        `${enemyPokemon.isBoss() ? `| Boss Bars: ${enemyPokemon.bossSegments}` : ""}`,
      );
      console.log("Moveset:", moveset);
      return true;
    });

    if (globalScene.getPlayerParty().filter((p) => p.isShiny()).length === PLAYER_PARTY_MAX_SIZE) {
      globalScene.validateAchv(achvs.SHINY_PARTY);
    }

    if (battleType === BattleType.TRAINER && trainer) {
      loadEnemyAssets.push(trainer.loadAssets().then(() => trainer.initSprite()));
    } else if (currentBattle.isBattleMysteryEncounter()) {
      if (mysteryEncounter?.introVisuals) {
        loadEnemyAssets.push(
          mysteryEncounter.introVisuals.loadAssets().then(() => mysteryEncounter.introVisuals?.initSprite()),
        );
      }
      if (mysteryEncounter?.loadAssets && mysteryEncounter.loadAssets.length > 0) {
        loadEnemyAssets.push(...mysteryEncounter.loadAssets);
      }
      // Load Mystery Encounter Exclamation bubble and sfx
      loadEnemyAssets.push(
        new Promise<void>((resolve) => {
          globalScene.loadSe("GEN8- Exclaim", "battle_anims", "GEN8- Exclaim.wav");
          globalScene.loadImage("encounter_exclaim", ImagesFolder.ME);
          load.once(Phaser.Loader.Events.COMPLETE, () => resolve());
          if (!load.isLoading()) {
            load.start();
          }
        }),
      );
    } else {
      const overridedBossSegments = activeOverrides.ENEMY_HEALTH_SEGMENTS_OVERRIDE > 1;
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
        if (index < (double ? 2 : 1)) {
          if (battleType === BattleType.WILD) {
            field.add(enemyPokemon);
            currentBattle.seenEnemyPartyMemberIds.add(enemyPokemon.id);
            const playerPokemon = globalScene.getPlayerPokemon();
            if (playerPokemon?.isOnField()) {
              field.moveBelow(enemyPokemon as Pokemon, playerPokemon);
            }
            enemyPokemon.tint(0, 0.5);
          } else if (battleType === BattleType.TRAINER) {
            enemyPokemon.setVisible(false);
            trainer?.tint(0, 0.5);
          }
          if (double) {
            enemyPokemon.setFieldPosition(index ? FieldPosition.RIGHT : FieldPosition.LEFT);
          }
        }
        return true;
      });

      if (!this.loaded && battleType !== BattleType.MYSTERY_ENCOUNTER) {
        regenerateModifierPoolThresholds(
          globalScene.getEnemyField(),
          battleType === BattleType.TRAINER ? ModifierPoolType.TRAINER : ModifierPoolType.WILD,
        );
        globalScene.generateEnemyModifiers();
        overrideModifiers(false);
        globalScene.getEnemyField().forEach((enemy) => {
          overrideHeldItems(enemy, false);
        });
      }

      if (battleType === BattleType.TRAINER) {
        trainer?.genAI(globalScene.getEnemyParty());
      }

      ui.setMessageMode().then(() => {
        if (this.loaded) {
          this.doEncounter();
          globalScene.resetSeed();
        } else {
          // Set weather and terrain before session gets saved to ensure it's properly added to session data
          this.trySetWeatherIfNewBiome();
          this.trySetTerrainIfNewBiome();
          // Game currently syncs to server on waves X1 and X6, or after 5 minutes have passed without a save
          gameData.saveAll(true, waveIndex % 5 === 1 || (globalScene.lastSavePlayTime ?? 0) >= 300).then((success) => {
            globalScene.disableMenu = false;
            if (!success) {
              return globalScene.reset(true);
            }
            this.doEncounter();
            globalScene.resetSeed();
          });
        }
      });
    });
  }

  protected doEncounter(): void {
    globalScene.audioManager.playBgm(undefined, true);
    globalScene.updateModifiers(false);
    globalScene.setFieldScale(1);

    const { arenaEnemy, arenaPlayer, currentBattle, mysteryEncounterSaveData, tweens } = globalScene;
    const { battleType, isClassicFinalBoss, waveIndex } = currentBattle;
    if (
      globalScene.isMysteryEncounterValidForWave(battleType, waveIndex)
      && !currentBattle.isBattleMysteryEncounter()
    ) {
      /**
       * TODO: This does not occur in most cases. See https://github.com/Despair-Games/poketernity/issues/395
       */
      // Increment ME spawn chance if an ME could have spawned but did not
      // Only do this AFTER session has been saved to avoid duplicating increments
      mysteryEncounterSaveData.encounterSpawnChance += ME_WEIGHT_INCREMENT_ON_SPAWN_MISS;
    }

    for (const pokemon of globalScene.getPlayerParty()) {
      if (pokemon) {
        pokemon.resetWaveData();
      }
    }

    const enemyField = globalScene.getEnemyField();
    tweens.add({
      targets: [arenaEnemy, currentBattle.trainer, enemyField, arenaPlayer, globalScene.trainer].flat(),
      x: (_target, _key, value: number, fieldIndex: number) =>
        fieldIndex < 2 + enemyField.length ? value + 300 : value - 300,
      duration: 2000,
      onComplete: () => {
        if (isClassicFinalBoss) {
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
      tweens.add({
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
      }
      return i18next.t("battle:trainerAppeared", {
        trainerName: currentBattle.trainer?.getName(TrainerSlot.NONE, true),
      });
    }

    return enemyField.length === 1
      ? i18next.t("battle:singleWildAppeared", { pokemonName: enemyField[0].getNameToRender() })
      : i18next.t("battle:multiWildAppeared", {
          pokemonName1: enemyField[0].getNameToRender(),
          pokemonName2: enemyField[1].getNameToRender(),
        });
  }

  protected doEncounterCommon(showEncounterMessage: boolean = true): void {
    const { charSprite, currentBattle, pbTray, pbTrayEnemy, phaseManager, ui } = globalScene;
    const { battleType, double, mysteryEncounter, trainer, waveIndex } = currentBattle;

    const enemyField = globalScene.getEnemyField();

    if (battleType === BattleType.WILD) {
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
        ui.showText(this.getEncounterMessage(), { callback: () => this.end(), callbackDelay: 1500 });
      } else {
        this.end();
      }
    } else if (battleType === BattleType.TRAINER && trainer) {
      trainer.untint(100, "Sine.easeOut");
      trainer.playAnim();

      const doSummon = (): void => {
        currentBattle.started = true;
        globalScene.audioManager.playBgm(undefined);
        pbTray.showPbTray(globalScene.getPlayerParty());
        pbTrayEnemy.showPbTray(globalScene.getEnemyParty());
        const doTrainerSummon = (): void => {
          const availablePartyMembers = globalScene.getEnemyParty().filter((p) => !p.isFainted()).length;
          phaseManager.createAndUnshiftPhase("SummonPhase", BattlerIndex.ENEMY, { delayPostSummon: true });
          if (double && availablePartyMembers > 1) {
            phaseManager.createAndUnshiftPhase("SummonPhase", BattlerIndex.ENEMY_2, {
              delayPostSummon: true,
            });
          }
          this.end();
        };
        if (showEncounterMessage) {
          ui.showText(this.getEncounterMessage(), { callback: doTrainerSummon, callbackDelay: 1500, prompt: true });
        } else {
          doTrainerSummon();
        }
      };

      const encounterMessages = trainer.getEncounterMessages();

      if (encounterMessages.length) {
        let message = "";
        globalScene.executeWithSeedOffset(() => {
          message = randSeedItem(encounterMessages);
        }, waveIndex);

        const showDialogueAndSummon = (): void => {
          ui.showDialogue(message, trainer.getName(TrainerSlot.NONE, true), () => {
            charSprite.hide().then(() => globalScene.hideFieldOverlay(250).then(() => doSummon()));
          });
        };

        if (trainer.config.hasCharSprite && !ui.shouldSkipDialogue(message)) {
          globalScene
            .showFieldOverlay(500)
            .then(() =>
              charSprite
                .showCharacter(trainer.getKey(), getCharVariantFromDialogue(encounterMessages[0]))
                .then(() => showDialogueAndSummon()),
            );
        } else {
          showDialogueAndSummon();
        }
      } else {
        doSummon();
      }
    } else if (currentBattle.isBattleMysteryEncounter() && mysteryEncounter) {
      const { introVisuals } = mysteryEncounter;
      introVisuals?.playAnim();

      if (mysteryEncounter.onVisualsStart) {
        mysteryEncounter.onVisualsStart();
      } else if (mysteryEncounter.spriteConfigs && introVisuals) {
        // If the encounter doesn't have any special visual intro, show sparkle for shiny Pokemon
        introVisuals.playShinySparkles();
      }

      const doEncounter = (): void => {
        const doShowEncounterOptions = (): void => {
          ui.clearText();
          ui.getMessageHandler()?.hideNameText();

          phaseManager.createAndUnshiftPhase("MysteryEncounterPhase");
          super.end();
        };

        if (showEncounterMessage) {
          const introDialogue = mysteryEncounter.dialogue.intro;
          if (introDialogue) {
            const FIRST_DIALOGUE_PROMPT_DELAY = 750;
            let i = 0;
            const showNextDialogue = (): void => {
              const nextAction = i === introDialogue.length - 1 ? doShowEncounterOptions : showNextDialogue;
              const dialogue = introDialogue[i];
              const title = getEncounterText(dialogue?.speaker);
              const text = getEncounterText(dialogue.text)!;
              i++;
              if (title) {
                ui.showDialogue(text, title, nextAction, undefined, 0, i === 1 ? FIRST_DIALOGUE_PROMPT_DELAY : 0);
              } else {
                ui.showText(text, {
                  callback: nextAction,
                  callbackDelay: i === 1 ? FIRST_DIALOGUE_PROMPT_DELAY : 0,
                  prompt: true,
                });
              }
            };

            if (introDialogue.length > 0) {
              showNextDialogue();
            }
          } else {
            doShowEncounterOptions();
          }
        } else {
          doShowEncounterOptions();
        }
      };

      const encounterMessage = i18next.t("battle:mysteryEncounterAppeared");

      if (encounterMessage) {
        doTrainerExclamation();
        ui.showDialogue(encounterMessage, "???", () => {
          charSprite.hide().then(() => globalScene.hideFieldOverlay(250).then(() => doEncounter()));
        });
      } else {
        doEncounter();
      }
    }
  }

  public override end(): void {
    const { currentBattle, gameMode, phaseManager } = globalScene;
    const { battleType, double, waveIndex } = currentBattle;
    const enemyField = globalScene.getEnemyField();

    enemyField.forEach((enemyPokemon, e) => {
      if (enemyPokemon.isShiny()) {
        phaseManager.createAndUnshiftPhase("ShinySparklePhase", BattlerIndex.ENEMY + e);
      }
      // This sets Eternatus' held item to be untransferrable, preventing it from being stolen
      if (enemyPokemon.species.speciesId === SpeciesId.ETERNATUS && gameMode.isBattleClassicFinalBoss(waveIndex)) {
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

    if (battleType === BattleType.WILD) {
      const ivScannerModifier = globalScene.findModifier((m) => m instanceof IvScannerModifier);
      if (ivScannerModifier) {
        enemyField.forEach((p) =>
          phaseManager.createAndUnshiftPhase(
            "ScanIvsPhase",
            p.getBattlerIndex(),
            Math.min(ivScannerModifier.getStackCount() * 2, 6),
          ),
        );
      }
    }

    const availablePartyMembers = globalScene.getPokemonAllowedInBattle();

    if (!availablePartyMembers[0].isOnField()) {
      phaseManager.createAndUnshiftPhase("SummonPhase", BattlerIndex.PLAYER, {
        delayPostSummon: true,
        loaded: this.loaded,
      });
    }

    if (double) {
      if (availablePartyMembers.length > 1) {
        phaseManager.createAndUnshiftPhase("ToggleDoublePositionPhase", true);
        if (!availablePartyMembers[1].isOnField()) {
          phaseManager.createAndUnshiftPhase("SummonPhase", BattlerIndex.PLAYER_2, {
            delayPostSummon: true,
            loaded: this.loaded,
          });
        }
      }
    } else {
      if (availablePartyMembers.length > 1 && availablePartyMembers[1].isOnField()) {
        phaseManager.createAndUnshiftPhase("RecallPhase", BattlerIndex.PLAYER_2);
      }
      phaseManager.createAndUnshiftPhase("ToggleDoublePositionPhase", false);
    }

    if (battleType !== BattleType.TRAINER && (waveIndex > 1 || !gameMode.isDaily)) {
      const minPartySize = double ? 2 : 1;
      if (availablePartyMembers.length > minPartySize) {
        phaseManager.createAndUnshiftPhase("CheckSwitchPhase", 0, double);
        if (double) {
          phaseManager.createAndUnshiftPhase("CheckSwitchPhase", 1, double);
        }
      }
    }

    if (battleType === BattleType.WILD) {
      enemyField.forEach((p) => phaseManager.createAndPushPhase("PostSummonPhase", p.getBattlerIndex()));
    }
    handleTutorial(Tutorial.ACCESS_MENU).then(() => super.end());
  }

  // TODO: something different
  public displayFinalBossDialogue(): void {
    const enemy = globalScene.getEnemyPokemon();
    const { gameData, ui } = globalScene;
    ui.showText(this.getEncounterMessage(), {
      callback: () => {
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
              ? i18next.t("battleSpecDialogue:key", { count, ordinal: true })
              : "";
          const cycleCount = count.toLocaleString() + ordinalUsed;
          const genderIndex = settings.display.playerGender ?? PlayerGender.UNSET;
          const genderStr = enumValueToKey(PlayerGender, genderIndex).toLowerCase();
          const encounterDialogue = i18next.t(localizationKey, { context: genderStr, cycleCount });
          if (!gameData.getSeenDialogues()[localizationKey]) {
            gameData.saveSeenDialogue(localizationKey);
          }
          ui.showDialogue(encounterDialogue, enemy?.species.name ?? "MissingNo", () => {
            this.doEncounterCommon(false);
          });
        }
      },
      callbackDelay: 1500,
      prompt: true,
    });
  }

  /*
   * Set biome weather and terrain if and only if this encounter is the start of a new biome.
   *
   * By using function overrides, this should happen if and only if this phase
   * is exactly a `NewBiomeEncounterPhase` or an `EncounterPhase` (to account for
   * Wave 1 of a Daily Run), but NOT `NextEncounterPhase` (which starts the next
   * wave in the same biome).
   */

  /**
   * Set biome weather if this is wave 1 and the game isn't being loaded from save data.
   *
   * @privateRemarks
   * This is overridden in {@linkcode NextEncounterPhase} and {@linkcode NewBiomeEncounterPhase}
   */
  protected trySetWeatherIfNewBiome(): void {
    if (!this.loaded) {
      globalScene.arena.setRandomWeather();
    }
  }

  /**
   * Set biome terrain if this is wave 1 and the game isn't being loaded from save data
   *
   * @privateRemarks
   * This is overridden in {@linkcode NextEncounterPhase} and {@linkcode NewBiomeEncounterPhase}
   */
  protected trySetTerrainIfNewBiome(): void {
    if (!this.loaded) {
      globalScene.arena.setRandomTerrain();
    }
  }
}
