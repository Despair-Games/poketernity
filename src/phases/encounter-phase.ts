import { BattlerIndex, BattleType } from "#app/battle";
import { PLAYER_PARTY_MAX_SIZE } from "#app/constants";
import { SyncEncounterNatureAbAttr } from "#app/data/ab-attrs/sync-encounter-nature-ab-attr";
import { applyAbAttrs } from "#app/data/ability";
import { initEncounterAnims, loadEncounterAnimAssets } from "#app/data/battle-anims";
import { getCharVariantFromDialogue } from "#app/data/dialogue";
import { WEIGHT_INCREMENT_ON_SPAWN_MISS } from "#app/data/mystery-encounters/mystery-encounters";
import { getEncounterText } from "#app/data/mystery-encounters/utils/encounter-dialogue-utils";
import { doTrainerExclamation } from "#app/data/mystery-encounters/utils/encounter-phase-utils";
import { getGoldenBugNetSpecies } from "#app/data/mystery-encounters/utils/encounter-pokemon-utils";
import { TrainerSlot } from "#app/data/trainer-config";
import { getRandomWeatherType } from "#app/data/weather";
import { EncounterPhaseEvent } from "#app/events/battle-scene";
import type { Pokemon } from "#app/field/pokemon";
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
import { BattlePhase } from "#app/phases/abstract-battle-phase";
import { CheckSwitchPhase } from "#app/phases/check-switch-phase";
import { GameOverPhase } from "#app/phases/game-over-phase";
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
import { MysteryEncounterPhase } from "./mystery-encounter-phases/mystery-encounter-phase";

export class EncounterPhase extends BattlePhase {
  private readonly loaded: boolean;

  constructor(loaded: boolean = false) {
    super();

    this.loaded = loaded;
  }

  public override start(): void {
    super.start();

    const { arena, currentBattle, field, gameData, gameMode, load, ui } = globalScene;
    const {
      battleType,
      double,
      enemyLevels,
      enemyParty,
      isClassicFinalBoss,
      mysteryEncounter,
      mysteryEncounterType,
      trainer,
      waveIndex,
    } = currentBattle;

    globalScene.updateGameInfo();

    globalScene.initSession();

    globalScene.eventTarget.dispatchEvent(new EncounterPhaseEvent());

    // Failsafe if players somehow skip floor 200 in classic mode
    if (gameMode.isClassic && waveIndex > 200) {
      globalScene.unshiftPhase(new GameOverPhase());
    }

    const loadEnemyAssets: Promise<void>[] = [];

    // Generate and Init Mystery Encounter
    if (currentBattle.isBattleMysteryEncounter() && !mysteryEncounter) {
      globalScene.executeWithSeedOffset(() => {
        const currentSessionEncounterType = mysteryEncounterType;
        currentBattle.mysteryEncounter = globalScene.getMysteryEncounter(currentSessionEncounterType);
      }, waveIndex * 16);
    }
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
            && arena.biomeType !== Biome.END
            && randSeedInt(10) === 0
          ) {
            enemySpecies = getGoldenBugNetSpecies(level);
          }
          currentBattle.enemyParty[e] = globalScene.addEnemyPokemon(
            enemySpecies,
            level,
            TrainerSlot.NONE,
            !!globalScene.getEncounterBossSegments(waveIndex, level, enemySpecies),
          );
          if (isClassicFinalBoss) {
            currentBattle.enemyParty[e].ivs = new Array(6).fill(31);
          }
          globalScene
            .getPlayerParty()
            .slice(0, !double ? 1 : 2)
            .reverse()
            .forEach((playerPokemon) => {
              applyAbAttrs(SyncEncounterNatureAbAttr, playerPokemon, null, false, enemyParty[e]);
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

      if (enemyPokemon.species.speciesId === Species.ETERNATUS) {
        if (isClassicFinalBoss) {
          enemyPokemon.setBoss();
        } else if (!(waveIndex % 1000)) {
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
          globalScene.loadImage("encounter_exclaim", "mystery-encounters");
          load.once(Phaser.Loader.Events.COMPLETE, () => resolve());
          if (!load.isLoading()) {
            load.start();
          }
        }),
      );
    } else {
      const overridedBossSegments = Overrides.OPP_HEALTH_SEGMENTS_OVERRIDE > 1;
      // for double battles, reduce the health segments for boss Pokemon unless there is an override
      if (!overridedBossSegments && enemyParty.filter((p) => p.isBoss()).length > 1) {
        for (const enemyPokemon of enemyParty) {
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
      enemyParty.every((enemyPokemon, index) => {
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

      ui.setMode(Mode.MESSAGE).then(() => {
        if (!this.loaded) {
          // Set weather before session gets saved to ensure it's properly added to session data
          this.trySetWeatherIfNewBiome();
          // Game currently syncs to server on waves X1 and X6, or after 5 minutes have passed without a save
          gameData.saveAll(true, waveIndex % 5 === 1 || (globalScene.lastSavePlayTime ?? 0) >= 300).then((success) => {
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

    const { arenaEnemy, arenaPlayer, currentBattle, mysteryEncounterSaveData, tweens } = globalScene;
    const { battleType, isClassicFinalBoss, waveIndex } = currentBattle;
    if (
      globalScene.isMysteryEncounterValidForWave(battleType, waveIndex)
      && !currentBattle.isBattleMysteryEncounter()
    ) {
      // Increment ME spawn chance if an ME could have spawned but did not
      // Only do this AFTER session has been saved to avoid duplicating increments
      mysteryEncounterSaveData.encounterSpawnChance += WEIGHT_INCREMENT_ON_SPAWN_MISS;
    }

    for (const pokemon of globalScene.getPlayerParty()) {
      if (pokemon) {
        pokemon.resetBattleData();
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
    const { charSprite, currentBattle, pbTray, pbTrayEnemy, ui } = globalScene;
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
        ui.showText(this.getEncounterMessage(), null, () => this.end(), 1500);
      } else {
        this.end();
      }
    } else if (battleType === BattleType.TRAINER && trainer) {
      trainer.untint(100, "Sine.easeOut");
      trainer.playAnim();

      const doSummon = (): void => {
        currentBattle.started = true;
        globalScene.playBgm(undefined);
        pbTray.showPbTray(globalScene.getPlayerParty());
        pbTrayEnemy.showPbTray(globalScene.getEnemyParty());
        const doTrainerSummon = (): void => {
          this.hideEnemyTrainer();
          const availablePartyMembers = globalScene.getEnemyParty().filter((p) => !p.isFainted()).length;
          globalScene.unshiftPhase(new SummonPhase(0, false));
          if (double && availablePartyMembers > 1) {
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

      const encounterMessages = trainer.getEncounterMessages();

      if (!encounterMessages.length) {
        doSummon();
      } else {
        let message: string;
        globalScene.executeWithSeedOffset(() => (message = randSeedItem(encounterMessages)), waveIndex);
        message = message!; // tell TS compiler it's defined now
        const showDialogueAndSummon = (): void => {
          ui.showDialogue(message, trainer.getName(TrainerSlot.NONE, true), null, () => {
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
          ui.getMessageHandler().hideNameText();

          globalScene.unshiftPhase(new MysteryEncounterPhase());
          this.end();
        };

        if (showEncounterMessage) {
          const introDialogue = mysteryEncounter.dialogue.intro;
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
          charSprite.hide().then(() => globalScene.hideFieldOverlay(250).then(() => doEncounter()));
        });
      }
    }
  }

  public override end(): void {
    const { currentBattle, gameMode } = globalScene;
    const { battleType, double, waveIndex } = currentBattle;
    const enemyField = globalScene.getEnemyField();

    enemyField.forEach((enemyPokemon, e) => {
      if (enemyPokemon.isShiny()) {
        globalScene.unshiftPhase(new ShinySparklePhase(BattlerIndex.ENEMY + e));
      }
      // This sets Eternatus' held item to be untransferrable, preventing it from being stolen
      if (
        enemyPokemon.species.speciesId === Species.ETERNATUS
        && (gameMode.isBattleClassicFinalBoss(waveIndex) || gameMode.isEndlessMajorBoss(waveIndex))
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

    if (![BattleType.TRAINER, BattleType.MYSTERY_ENCOUNTER].includes(battleType)) {
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
          if (double) {
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

      if (double) {
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

      if (battleType !== BattleType.TRAINER && (waveIndex > 1 || !gameMode.isDaily)) {
        const minPartySize = double ? 2 : 1;
        if (availablePartyMembers.length > minPartySize) {
          globalScene.pushPhase(new CheckSwitchPhase(0, double));
          if (double) {
            globalScene.pushPhase(new CheckSwitchPhase(1, double));
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
