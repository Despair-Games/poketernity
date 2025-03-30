import type { PokemonSelectFilter } from "#app/@types/PokemonSelectFilter";
import type Battle from "#app/battle";
import { ME_AVERAGE_ENCOUNTERS_PER_RUN_TARGET, ME_WEIGHT_INCREMENT_ON_SPAWN_MISS } from "#app/constants";
import { biomeLinks } from "#app/data/balance/biomes";
import { allTrainerConfigs } from "#app/data/balance/trainer-configs/all-trainer-configs";
import type { CustomPokemonData } from "#app/data/custom-pokemon-data";
import { Egg, type EggOptions } from "#app/data/egg";
import { initMoveAnim } from "#app/data/init/init-move-anim";
import type MysteryEncounterOption from "#app/data/mystery-encounters/mystery-encounter-option";
import { showEncounterText } from "#app/data/mystery-encounters/utils/encounter-dialogue-utils";
import { getNatureName } from "#app/data/nature";
import type PokemonSpecies from "#app/data/pokemon-species";
import { Status } from "#app/data/status-effect";
import type { TrainerConfig } from "#app/data/trainer-config";
import type { Variant } from "#app/data/variant";
import { type PlayerPokemon, type Pokemon } from "#app/field/pokemon";
import { PokemonMove } from "#app/field/pokemon-move";
import { PokemonSummonData } from "#app/field/pokemon-summon-data";
import Trainer from "#app/field/trainer";
import { globalScene } from "#app/global-scene";
import type HeldModifierConfig from "#app/interfaces/held-modifier-config";
import { getPokemonNameWithAffix } from "#app/messages";
import {
  ModifierTypeGenerator,
  ModifierTypeOption,
  regenerateModifierPoolThresholds,
  type CustomModifierSettings,
  type ModifierType,
} from "#app/modifier/modifier-type";
import { modifierTypes } from "#app/modifier/modifier-types";
import { BattleEndPhase } from "#app/phases/battle-end-phase";
import { EggLapsePhase } from "#app/phases/egg-lapse-phase";
import { MysteryEncounterBattlePhase } from "#app/phases/mystery-encounter-phases/battle-phase";
import { MysteryEncounterBattleStartCleanupPhase } from "#app/phases/mystery-encounter-phases/battle-start-cleanup-phase";
import { MysteryEncounterPhase } from "#app/phases/mystery-encounter-phases/mystery-encounter-phase";
import { MysteryEncounterRewardsPhase } from "#app/phases/mystery-encounter-phases/rewards-phase";
import { PartyExpPhase } from "#app/phases/party-exp-phase";
import { SelectModifierPhase } from "#app/phases/select-modifier-phase";
import { TrainerVictoryPhase } from "#app/phases/trainer-victory-phase";
import type PokemonData from "#app/system/pokemon-data";
import type { UiHandler } from "#app/ui/handlers/abstract-ui-handler";
import type { OptionSelectUiHandler } from "#app/ui/handlers/option-select-ui-handler";
import type { PartyUiHandler } from "#app/ui/handlers/party-ui-handler";
import type { OptionSelectItem, OptionSelectModeConfig } from "#app/ui/interfaces/option-select-config";
import { isNullOrUndefined, randSeedInt, randomString } from "#app/utils";
import { loadMoveAnimAssets } from "#app/utils/move-anim-utils";
import type { AiType } from "#enums/ai-type";
import { BattleType } from "#enums/battle-type";
import { BattlerIndex } from "#enums/battler-index";
import type { BattlerTagType } from "#enums/battler-tag-type";
import { BiomeId } from "#enums/biome-id";
import { BiomePoolTier } from "#enums/biome-pool-tier";
import { FieldPosition } from "#enums/field-position";
import type { Gender } from "#enums/gender";
import { ModifierPoolType } from "#enums/modifier-pool-type";
import type { MoveId } from "#enums/move-id";
import { MysteryEncounterMode } from "#enums/mystery-encounter-mode";
import type { Nature } from "#enums/nature";
import type { PartyOption } from "#enums/party-option";
import { PartyUiMode } from "#enums/party-ui-mode";
import { PhaseId } from "#enums/phase-id";
import { StatusEffect } from "#enums/status-effect";
import { TrainerSlot } from "#enums/trainer-slot";
import type { TrainerType } from "#enums/trainer-type";
import { TrainerVariant } from "#enums/trainer-variant";
import { UiMode } from "#enums/ui-mode";
import i18next from "i18next";

/**
 * Animates exclamation sprite over trainer's head at start of encounter
 */
export function doTrainerExclamation() {
  const exclamationSprite = globalScene.add.sprite(0, 0, "encounter_exclaim");
  exclamationSprite.setName("exclamation");
  globalScene.field.add(exclamationSprite);
  globalScene.field.moveTo(exclamationSprite, globalScene.field.getAll().length - 1);
  exclamationSprite.setVisible(true);
  exclamationSprite.setPosition(110, 68);
  globalScene.tweens.add({
    targets: exclamationSprite,
    y: "-=25",
    ease: "Cubic.easeOut",
    duration: 300,
    yoyo: true,
    onComplete: () => {
      globalScene.time.delayedCall(800, () => {
        globalScene.field.remove(exclamationSprite, true);
      });
    },
  });

  globalScene.audioManager.playSound("battle_anims/GEN8- Exclaim", { volume: 0.7 });
}

export interface EnemyPokemonConfig {
  species: PokemonSpecies;
  isBoss: boolean;
  nickname?: string;
  bossSegments?: number;
  bossSegmentModifier?: number; // Additive to the determined segment number
  customPokemonData?: CustomPokemonData;
  formIndex?: number;
  abilityIndex?: number;
  level?: number;
  gender?: Gender;
  passive?: boolean;
  moveSet?: MoveId[];
  nature?: Nature;
  ivs?: [number, number, number, number, number, number];
  shiny?: boolean;
  /** Is only checked if Pokemon is shiny */
  variant?: Variant;
  /** Can set just the status, or pass a timer on the status turns */
  status?: StatusEffect | [StatusEffect, number];
  mysteryEncounterBattleEffects?: (pokemon: Pokemon) => void;
  modifierConfigs?: HeldModifierConfig[];
  tags?: BattlerTagType[];
  dataSource?: PokemonData;
  aiType?: AiType;
}

export interface EnemyPartyConfig {
  /** Formula for enemy level: level += waveIndex / 10 * levelAdditiveModifier */
  levelAdditiveModifier?: number;
  doubleBattle?: boolean;
  /** Generates trainer battle solely off trainer type */
  trainerType?: TrainerType;
  /** More customizable option for configuring trainer battle */
  trainerConfig?: TrainerConfig;
  pokemonConfigs?: EnemyPokemonConfig[];
  /** `true` for female trainer, false for male */
  female?: boolean;
  /** `true` will prevent player from switching */
  disableSwitch?: boolean;
  /** `true` or leaving undefined will increment dex seen count for the encounter battle, `false` will not */
  countAsSeen?: boolean;
}

/**
 * Generates an enemy party for a mystery encounter battle
 * This will override and replace any standard encounter generation logic
 * Useful for tailoring specific battles to mystery encounters
 * @param partyConfig Can pass various customizable attributes for the enemy party, see EnemyPartyConfig
 */
export async function initBattleWithEnemyConfig(partyConfig: EnemyPartyConfig): Promise<void> {
  const loaded: boolean = false;
  const loadEnemyAssets: Promise<void>[] = [];

  const battle: Battle = globalScene.currentBattle;

  let doubleBattle: boolean = partyConfig?.doubleBattle ?? false;

  // Trainer
  const trainerType = partyConfig?.trainerType;
  const partyTrainerConfig = partyConfig?.trainerConfig;
  let trainerConfig: TrainerConfig;
  if (!isNullOrUndefined(trainerType) || partyTrainerConfig) {
    globalScene.currentBattle.mysteryEncounter!.encounterMode = MysteryEncounterMode.TRAINER_BATTLE;
    if (globalScene.currentBattle.trainer) {
      globalScene.currentBattle.trainer.setVisible(false);
      globalScene.currentBattle.trainer.destroy();
    }

    trainerConfig = partyTrainerConfig ? partyTrainerConfig : allTrainerConfigs[trainerType!];

    const doubleTrainer = trainerConfig.doubleOnly || (trainerConfig.hasDouble && !!partyConfig.doubleBattle);
    doubleBattle = doubleTrainer;
    const trainerFemale = isNullOrUndefined(partyConfig.female) ? !!randSeedInt(2) : partyConfig.female;
    const newTrainer = new Trainer(
      trainerConfig.trainerType,
      doubleTrainer ? TrainerVariant.DOUBLE : trainerFemale ? TrainerVariant.FEMALE : TrainerVariant.DEFAULT,
      undefined,
      undefined,
      undefined,
      trainerConfig,
    );
    newTrainer.x += 300;
    newTrainer.setVisible(false);
    globalScene.field.add(newTrainer);
    globalScene.currentBattle.trainer = newTrainer;
    loadEnemyAssets.push(newTrainer.loadAssets().then(() => newTrainer.initSprite()));

    battle.enemyLevels = globalScene.currentBattle.trainer.getPartyLevels(globalScene.currentBattle.waveIndex);
  } else {
    // Wild
    globalScene.currentBattle.mysteryEncounter!.encounterMode = MysteryEncounterMode.WILD_BATTLE;

    const numEnemies =
      partyConfig?.pokemonConfigs && partyConfig.pokemonConfigs.length > 0
        ? partyConfig?.pokemonConfigs?.length
        : doubleBattle
          ? 2
          : 1;
    battle.enemyLevels = new Array(numEnemies).fill(null).map(() => globalScene.currentBattle.getLevelForWave());
  }

  globalScene.getEnemyParty().forEach((enemyPokemon) => {
    globalScene.field.remove(enemyPokemon, true);
  });
  battle.enemyParty = [];
  battle.double = doubleBattle;

  // ME levels are modified by an additive value that scales with wave index
  // Base scaling: Every 10 waves, modifier gets +1 level
  // This can be amplified or counteracted by setting levelAdditiveModifier in config
  // levelAdditiveModifier value of 0.5 will halve the modifier scaling, 2 will double it, etc.
  // Leaving null/undefined will disable level scaling
  const mult: number = !isNullOrUndefined(partyConfig.levelAdditiveModifier) ? partyConfig.levelAdditiveModifier : 0;
  const additive = Math.max(Math.round((globalScene.currentBattle.waveIndex / 10) * mult), 0);
  battle.enemyLevels = battle.enemyLevels.map((level) => level + additive);

  battle.enemyLevels.forEach((level, e) => {
    let enemySpecies;
    let dataSource;
    let isBoss = false;
    if (!loaded) {
      if ((!isNullOrUndefined(trainerType) || trainerConfig) && battle.trainer) {
        // Allows overriding a trainer's pokemon to use specific species/data
        if (partyConfig?.pokemonConfigs && e < partyConfig.pokemonConfigs.length) {
          const config = partyConfig.pokemonConfigs[e];
          level = config.level ? config.level : level;
          dataSource = config.dataSource;
          enemySpecies = config.species;
          isBoss = config.isBoss;
          battle.enemyParty[e] = globalScene.addEnemyPokemon(
            enemySpecies,
            level,
            TrainerSlot.TRAINER,
            isBoss,
            false,
            dataSource,
          );
        } else {
          battle.enemyParty[e] = battle.trainer.genPartyMember(e);
        }
      } else {
        if (partyConfig?.pokemonConfigs && e < partyConfig.pokemonConfigs.length) {
          const config = partyConfig.pokemonConfigs[e];
          level = config.level ? config.level : level;
          dataSource = config.dataSource;
          enemySpecies = config.species;
          isBoss = config.isBoss;
          if (isBoss) {
            globalScene.currentBattle.mysteryEncounter!.encounterMode = MysteryEncounterMode.BOSS_BATTLE;
          }
        } else {
          enemySpecies = globalScene.randomSpecies(battle.waveIndex, level, true);
        }

        battle.enemyParty[e] = globalScene.addEnemyPokemon(
          enemySpecies,
          level,
          TrainerSlot.NONE,
          isBoss,
          false,
          dataSource,
        );
      }
    }

    const enemyPokemon = globalScene.getEnemyParty()[e];

    // Make sure basic data is clean
    enemyPokemon.hp = enemyPokemon.getMaxHp();
    enemyPokemon.status = null;
    enemyPokemon.passive = false;

    if (e < (doubleBattle ? 2 : 1)) {
      enemyPokemon.setX(-66 + enemyPokemon.getFieldPositionOffset()[0]);
      enemyPokemon.resetSummonData();
    }

    if ((!loaded && isNullOrUndefined(partyConfig.countAsSeen)) || partyConfig.countAsSeen) {
      globalScene.gameData.setPokemonSeen(enemyPokemon, true, !!(trainerType || trainerConfig));
    }

    if (partyConfig?.pokemonConfigs && e < partyConfig.pokemonConfigs.length) {
      const config = partyConfig.pokemonConfigs[e];

      // Set form
      if (!isNullOrUndefined(config.nickname)) {
        enemyPokemon.nickname = btoa(unescape(encodeURIComponent(config.nickname)));
      }

      // Generate new id, reset status and HP in case using data source
      if (config.dataSource) {
        enemyPokemon.generateId();
      }

      // Set form
      if (!isNullOrUndefined(config.formIndex)) {
        enemyPokemon.formIndex = config.formIndex;
      }

      // Set shiny
      if (!isNullOrUndefined(config.shiny)) {
        enemyPokemon.shiny = config.shiny;
      }

      // Set Variant
      if (enemyPokemon.shiny && !isNullOrUndefined(config.variant)) {
        enemyPokemon.variant = config.variant;
      }

      // Set custom mystery encounter data fields (such as sprite scale, custom abilities, types, etc.)
      if (!isNullOrUndefined(config.customPokemonData)) {
        enemyPokemon.customPokemonData = config.customPokemonData;
      }

      // Set Boss
      if (config.isBoss) {
        let segments = !isNullOrUndefined(config.bossSegments)
          ? config.bossSegments!
          : globalScene.getEncounterBossSegments(globalScene.currentBattle.waveIndex, level, enemySpecies, true);
        if (!isNullOrUndefined(config.bossSegmentModifier)) {
          segments += config.bossSegmentModifier;
        }
        enemyPokemon.setBoss(true, segments);
      }

      // Set Passive
      if (config.passive) {
        enemyPokemon.passive = true;
      }

      // Set Nature
      if (config.nature) {
        enemyPokemon.nature = config.nature;
      }

      // Set IVs
      if (config.ivs) {
        enemyPokemon.ivs = config.ivs;
      }

      // Set Status
      const statusEffects = config.status;
      if (statusEffects) {
        // Default to cureturn 3 for sleep
        const status = Array.isArray(statusEffects) ? statusEffects[0] : statusEffects;
        const cureTurn = Array.isArray(statusEffects)
          ? statusEffects[1]
          : statusEffects === StatusEffect.SLEEP
            ? 3
            : undefined;
        enemyPokemon.status = new Status(status, 0, cureTurn);
      }

      // Set summon data fields
      if (!enemyPokemon.summonData) {
        enemyPokemon.summonData = new PokemonSummonData();
      }

      // Set ability
      if (!isNullOrUndefined(config.abilityIndex)) {
        enemyPokemon.abilityIndex = config.abilityIndex;
      }

      // Set gender
      if (!isNullOrUndefined(config.gender)) {
        enemyPokemon.gender = config.gender!;
        enemyPokemon.summonData.gender = config.gender;
      }

      // Set AI type
      if (!isNullOrUndefined(config.aiType)) {
        enemyPokemon.aiType = config.aiType;
      }

      // Set moves
      if (config?.moveSet && config.moveSet.length > 0) {
        const moves = config.moveSet.map((m) => new PokemonMove(m));
        enemyPokemon.moveset = moves;
        enemyPokemon.summonData.moveset = moves;
      }

      // Set tags
      if (config.tags && config.tags.length > 0) {
        const tags = config.tags;
        tags.forEach((tag) => enemyPokemon.addTag(tag));
      }

      // mysteryEncounterBattleEffects will only be used IFF MYSTERY_ENCOUNTER_POST_SUMMON tag is applied
      if (config.mysteryEncounterBattleEffects) {
        enemyPokemon.mysteryEncounterBattleEffects = config.mysteryEncounterBattleEffects;
      }

      // Requires re-priming summon data to update everything properly
      enemyPokemon.primeSummonData(enemyPokemon.summonData);

      if (enemyPokemon.isShiny() && !enemyPokemon["shinySparkle"]) {
        enemyPokemon.initShinySparkle();
      }
      enemyPokemon.initBattleInfo();
      enemyPokemon.getBattleInfo().initInfo(enemyPokemon);
      enemyPokemon.generateName();
    }

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
      moveset.push(move.getName());
    });

    console.log(
      `Pokemon: ${getPokemonNameWithAffix(enemyPokemon)}`,
      `| Species ID: ${enemyPokemon.species.speciesId}`,
      `| Nature: ${getNatureName(enemyPokemon.nature, true, true, true)}`,
    );
    console.log(`Stats (IVs): ${stats}`);
    console.log(
      `Ability: ${enemyPokemon.getAbility().name}`,
      `| Passive Ability${enemyPokemon.hasPassive() ? "" : " (inactive)"}: ${enemyPokemon.getPassiveAbility().name}`,
      `${enemyPokemon.isBoss() ? `| Boss Bars: ${enemyPokemon.bossSegments}` : ""}`,
    );
    console.log("Moveset:", moveset);
  });

  globalScene.pushPhase(new MysteryEncounterBattlePhase(partyConfig.disableSwitch));

  await Promise.all(loadEnemyAssets);
  battle.enemyParty.forEach((enemyPokemon_2, e_1) => {
    if (e_1 < (doubleBattle ? 2 : 1)) {
      enemyPokemon_2.setVisible(false);
      if (battle.double) {
        enemyPokemon_2.setFieldPosition(e_1 ? FieldPosition.RIGHT : FieldPosition.LEFT);
      }
      // Spawns at current visible field instead of on "next encounter" field (off screen to the left)
      enemyPokemon_2.x += 300;
    }
  });
  if (!loaded) {
    regenerateModifierPoolThresholds(
      globalScene.getEnemyField(),
      battle.battleType === BattleType.TRAINER ? ModifierPoolType.TRAINER : ModifierPoolType.WILD,
    );
    const customModifierTypes = partyConfig?.pokemonConfigs
      ?.filter((config) => config?.modifierConfigs)
      .map((config) => config.modifierConfigs!);
    globalScene.generateEnemyModifiers(customModifierTypes);
  }
}

/**
 * Load special move animations/sfx for hard-coded encounter-specific moves that a pokemon uses at the start of an encounter
 * See: [startOfBattleEffects](IMysteryEncounter.startOfBattleEffects) for more details
 *
 * This promise does not need to be awaited on if called in an encounter onInit (will just load lazily)
 * @param moveIds The move or moves the Pokemon uses at the start of the encounter
 */
export function loadCustomMovesForEncounter(moveIds: MoveId | MoveId[]) {
  moveIds = Array.isArray(moveIds) ? moveIds : [moveIds];
  return Promise.all(moveIds.map((moveId) => initMoveAnim(moveId))).then(() => loadMoveAnimAssets(moveIds));
}

/**
 * Will update player money, and animate change (sound optional)
 * @param changeValue the amount by how much the player's money value changes by
 * @param playSound whether or not to play the buying sound effect
 * @param showMessage whether or not to display a message about paying or receiving money
 */
export function updatePlayerMoney(changeValue: number, playSound: boolean = true, showMessage: boolean = true) {
  globalScene.money = Math.min(Math.max(globalScene.money + changeValue, 0), Number.MAX_SAFE_INTEGER);
  globalScene.updateMoneyText();
  globalScene.animateMoneyChanged(false);
  if (playSound) {
    globalScene.audioManager.playSound("se/buy");
  }
  if (showMessage) {
    if (changeValue < 0) {
      globalScene.queueMessage(i18next.t("mysteryEncounterMessages:paid_money", { amount: -changeValue }), null, true);
    } else {
      globalScene.queueMessage(
        i18next.t("mysteryEncounterMessages:receive_money", { amount: changeValue }),
        null,
        true,
      );
    }
  }
}

/**
 * Converts modifier bullshit to an actual item
 * @param modifier the modifier being converted
 * @param pregenArgs Can specify BerryType for berries, TM for TMs, AttackBoostType for item, etc.
 */
export function generateModifierType(modifier: () => ModifierType, pregenArgs?: any[]): ModifierType | null {
  const modifierId = Object.keys(modifierTypes).find((k) => modifierTypes[k] === modifier);
  if (!modifierId) {
    return null;
  }

  let result: ModifierType = modifierTypes[modifierId]();

  // Populates item id and tier (order matters)
  result = result
    .withIdFromFunc(modifierTypes[modifierId])
    .withTierFromPool(ModifierPoolType.PLAYER, globalScene.getPlayerParty());

  return result instanceof ModifierTypeGenerator
    ? result.generateType(globalScene.getPlayerParty(), pregenArgs)
    : result;
}

/**
 * Converts modifier bullshit to an actual item
 * @param modifier The modifier being converted
 * @param pregenArgs - can specify BerryType for berries, TM for TMs, AttackBoostType for item, etc.
 */
export function generateModifierTypeOption(
  modifier: () => ModifierType,
  pregenArgs?: any[],
): ModifierTypeOption | null {
  const result = generateModifierType(modifier, pregenArgs);
  if (result) {
    return new ModifierTypeOption(result, 0);
  }
  return result;
}

/**
 * This function is intended for use inside onPreOptionPhase() of an encounter option
 * @param onPokemonSelected - Any logic that needs to be performed when Pokemon is chosen
 * If a second option needs to be selected, onPokemonSelected should return a OptionSelectItem[] object
 * @param onPokemonNotSelected - Any logic that needs to be performed if no Pokemon is chosen
 * @param selectablePokemonFilter - A filter for which Pokemon are allowed
 */
export function selectPokemonForOption(
  onPokemonSelected: (pokemon: PlayerPokemon) => void | OptionSelectItem[],
  onPokemonNotSelected?: () => void,
  selectablePokemonFilter?: PokemonSelectFilter,
): Promise<boolean> {
  return new Promise((resolve) => {
    const modeToSetOnExit = globalScene.ui.getMode();

    // Open party screen to choose pokemon
    globalScene.ui.setMode<PartyUiHandler>(
      UiMode.PARTY,
      PartyUiMode.SELECT,
      -1,
      (slotIndex: number, _option: PartyOption) => {
        if (slotIndex < globalScene.getPlayerParty().length) {
          // TODO: we should make use of ui.revertMode because
          // the mode getting set here does not get the parameters it may expect
          globalScene.ui.setMode<UiHandler>(modeToSetOnExit).then(() => {
            const pokemon = globalScene.getPlayerParty()[slotIndex];
            const secondaryOptions = onPokemonSelected(pokemon);
            if (!secondaryOptions) {
              globalScene.currentBattle.mysteryEncounter!.setDialogueToken(
                "selectedPokemon",
                pokemon.getNameToRender(),
              );
              resolve(true);
              return;
            }

            // There is a second option to choose after selecting the Pokemon
            globalScene.ui.setMessageMode().then(() => {
              const displayOptions = () => {
                // Always appends a cancel option to bottom of options
                const fullOptions = secondaryOptions
                  .map((option) => {
                    // Update handler to resolve promise
                    // TODO: don't update the handler like this
                    const onSelect = option.handler;
                    option.handler = () => {
                      onSelect();
                      globalScene.currentBattle.mysteryEncounter!.setDialogueToken(
                        "selectedPokemon",
                        pokemon.getNameToRender(),
                      );
                      resolve(true);
                      return true;
                    };
                    return option;
                  })
                  .concat({
                    label: i18next.t("menu:cancel"),
                    handler: () => {
                      globalScene.ui.clearText();
                      // TODO: we should make use of ui.revertMode because
                      // the mode getting set here does not get the parameters it may expect
                      globalScene.ui.setMode<UiHandler>(modeToSetOnExit);
                      resolve(false);
                      return true;
                    },
                    onHover: () => {
                      showEncounterText(i18next.t("mysteryEncounterMessages:cancel_option"), 0, 0, false);
                    },
                  });

                const config: OptionSelectModeConfig = {
                  options: fullOptions,
                  maxOptions: 7,
                  yOffset: 48,
                };

                // Do hover over the starting selection option
                if (fullOptions[0].onHover) {
                  fullOptions[0].onHover();
                }
                globalScene.ui.setModeWithoutClear<OptionSelectUiHandler>(UiMode.OPTION_SELECT, config);
              };

              const textPromptKey =
                globalScene.currentBattle.mysteryEncounter?.selectedOption?.dialogue?.secondOptionPrompt;
              if (!textPromptKey) {
                displayOptions();
              } else {
                showEncounterText(textPromptKey).then(() => displayOptions());
              }
            });
          });
        } else {
          // TODO: we should make use of ui.revertMode because
          // the mode getting set here does not get the parameters it may expect
          globalScene.ui.setMode<UiHandler>(modeToSetOnExit).then(() => {
            if (onPokemonNotSelected) {
              onPokemonNotSelected();
            }
            resolve(false);
          });
        }
      },
      selectablePokemonFilter,
    );
  });
}

interface PokemonAndOptionSelected {
  selectedPokemonIndex: number;
  selectedOptionIndex: number;
}

/**
 * This function is intended for use inside `onPreOptionPhase()` of an encounter option
 *
 * If a second option needs to be selected, `onPokemonSelected` should return a {@linkcode OptionSelectItem}`[]` object
 *
 * Used in the bug type superfan ME
 * @param options - The list of selectable options
 * @param optionSelectPromptKey - The text key for selecting
 * @param selectablePokemonFilter - The filter for selectable Pokemon
 * @param onHoverOverCancelOption - The function that is called when hovering over the cancel option
 */
export function selectOptionThenPokemon(
  options: OptionSelectItem[],
  optionSelectPromptKey: string,
  selectablePokemonFilter?: PokemonSelectFilter,
  onHoverOverCancelOption?: () => void,
): Promise<PokemonAndOptionSelected | null> {
  return new Promise<PokemonAndOptionSelected | null>((resolve) => {
    const modeToSetOnExit = globalScene.ui.getMode();

    const displayOptions = (config: OptionSelectModeConfig) => {
      globalScene.ui.setMessageMode().then(() => {
        if (!optionSelectPromptKey) {
          // Do hover over the starting selection option
          if (fullOptions[0].onHover) {
            fullOptions[0].onHover();
          }
          globalScene.ui.setMode<OptionSelectUiHandler>(UiMode.OPTION_SELECT, config);
        } else {
          showEncounterText(optionSelectPromptKey).then(() => {
            // Do hover over the starting selection option
            if (fullOptions[0].onHover) {
              fullOptions[0].onHover();
            }
            globalScene.ui.setMode<OptionSelectUiHandler>(UiMode.OPTION_SELECT, config);
          });
        }
      });
    };

    const selectPokemonAfterOption = (selectedOptionIndex: number) => {
      // Open party screen to choose a Pokemon
      globalScene.ui.setMode<PartyUiHandler>(
        UiMode.PARTY,
        PartyUiMode.SELECT,
        -1,
        (slotIndex: number, _option: PartyOption) => {
          if (slotIndex < globalScene.getPlayerParty().length) {
            // Pokemon and option selected
            // TODO: we should make use of ui.revertMode because
            // the mode getting set here does not get the parameters it may expect
            globalScene.ui.setMode<UiHandler>(modeToSetOnExit).then(() => {
              const result: PokemonAndOptionSelected = {
                selectedPokemonIndex: slotIndex,
                selectedOptionIndex: selectedOptionIndex,
              };
              resolve(result);
            });
          } else {
            // Back to first option select screen
            displayOptions(config);
          }
        },
        selectablePokemonFilter,
      );
    };

    // Always appends a cancel option to bottom of options
    const fullOptions = options
      .map((option, index) => {
        // Update handler to resolve promise
        // TODO: don't update the handler like this
        const onSelect = option.handler;
        option.handler = () => {
          onSelect();
          selectPokemonAfterOption(index);
          return true;
        };
        return option;
      })
      .concat({
        label: i18next.t("menu:cancel"),
        handler: () => {
          globalScene.ui.clearText();
          // TODO: we should make use of ui.revertMode because
          // the mode getting set here does not get the parameters it may expect
          globalScene.ui.setMode<UiHandler>(modeToSetOnExit);
          resolve(null);
          return true;
        },
        onHover: () => {
          if (onHoverOverCancelOption) {
            onHoverOverCancelOption();
          }
          showEncounterText(i18next.t("mysteryEncounterMessages:cancel_option"), 0, 0, false);
        },
      });

    const config: OptionSelectModeConfig = {
      options: fullOptions,
      maxOptions: 7,
      yOffset: 48,
    };

    displayOptions(config);
  });
}

/**
 * Will initialize reward phases to follow the mystery encounter
 * Can have shop displayed or skipped
 * @param customShopRewards - adds a shop phase with the specified rewards / reward tiers
 * @param eggRewards - an option for custom egg rewards
 * @param preRewardsCallback - can execute an arbitrary callback before the new phases if necessary (useful for updating items/party/injecting new phases before {@linkcode MysteryEncounterRewardsPhase})
 */
export function setEncounterRewards(
  customShopRewards?: CustomModifierSettings,
  eggRewards?: EggOptions[],
  preRewardsCallback?: Function,
) {
  globalScene.currentBattle.mysteryEncounter!.doEncounterRewards = () => {
    if (preRewardsCallback) {
      preRewardsCallback();
    }

    if (customShopRewards) {
      globalScene.unshiftPhase(new SelectModifierPhase({ customModifierSettings: customShopRewards }));
    } else {
      globalScene.tryRemovePhase((p) => p.is<SelectModifierPhase>(PhaseId.SELECT_MODIFIER));
    }

    if (eggRewards) {
      eggRewards.forEach((eggOptions) => {
        const egg = new Egg(eggOptions);
        egg.addEggToGameData();
      });
    }

    return true;
  };
}

/**
 * Will initialize exp phases into the phase queue (these are in addition to any combat or other exp earned)
 * Exp Share and Exp Balance will still function as normal
 * @param participantId - id/s of party pokemon that get full exp value. Other party members will receive Exp Share amounts
 * @param baseExpValue - gives exp equivalent to a pokemon of the wave index's level.
 *
 * Guidelines:
 * ```md
 * 36 - Sunkern (lowest in game)
 * 62-64 - regional starter base evos
 * 100 - Scyther
 * 170 - Spiritomb
 * 250 - Gengar
 * 290 - trio legendaries
 * 340 - box legendaries
 * 608 - Blissey (highest in game)
 * ```
 * https://bulbapedia.bulbagarden.net/wiki/List_of_Pok%C3%A9mon_by_effort_value_yield_(Generation_IX)
 * @param useWaveIndex - set to false when directly passing the the full exp value instead of baseExpValue
 */
export function setEncounterExp(participantId: number | number[], baseExpValue: number, useWaveIndex: boolean = true) {
  const participantIds = Array.isArray(participantId) ? participantId : [participantId];

  globalScene.currentBattle.mysteryEncounter!.doEncounterExp = () => {
    globalScene.unshiftPhase(new PartyExpPhase(baseExpValue, useWaveIndex, new Set(participantIds)));

    return true;
  };
}

export class OptionSelectSettings {
  hideDescription?: boolean;
  slideInDescription?: boolean;
  overrideTitle?: string;
  overrideDescription?: string;
  overrideQuery?: string;
  overrideOptions?: MysteryEncounterOption[];
  startingCursorIndex?: number;
}

/**
 * Can be used to queue a new series of Options to select for an Encounter
 * MUST be used only in onOptionPhase, will not work in onPreOptionPhase or onPostOptionPhase
 * @param optionSelectSettings - The initial OptionSelectSettings being passed to the new ME
 */
export function initSubsequentOptionSelect(optionSelectSettings: OptionSelectSettings) {
  globalScene.pushPhase(new MysteryEncounterPhase(optionSelectSettings));
}

/**
 * Can be used to exit an encounter without any battles or followup
 * Will skip any shops and rewards, and queue the next encounter phase as normal
 * @param addHealPhase - when true, will add a shop phase to end of encounter with 0 rewards but healing items are available
 * @param encounterMode - Can set custom encounter mode if necessary (may be required for forcing Pokemon to return before next phase)
 */
export function leaveEncounterWithoutBattle(
  addHealPhase: boolean = false,
  encounterMode: MysteryEncounterMode = MysteryEncounterMode.NO_BATTLE,
) {
  globalScene.currentBattle.mysteryEncounter!.encounterMode = encounterMode;
  globalScene.clearPhaseQueue();
  globalScene.clearPhaseQueueSplice();
  handleMysteryEncounterVictory(addHealPhase);
}

/**
 * Function to handle the player winning a ME battle
 * @param addHealPhase - Adds an empty shop phase to allow player to purchase healing items
 * @param doNotContinue - default `false`. If set to true, will not end the battle and continue to next wave
 */
export function handleMysteryEncounterVictory(addHealPhase: boolean = false, doNotContinue: boolean = false) {
  const allowedPkm = globalScene.getPlayerParty().filter((pkm) => pkm.isAllowedInBattle());

  if (allowedPkm.length === 0) {
    globalScene.gameOver({ clearPhaseQueue: true });
    return;
  }

  // If in repeated encounter variant, do nothing
  // Variant must eventually be swapped in order to handle "true" end of the encounter
  const encounter = globalScene.currentBattle.mysteryEncounter!;
  if (encounter.continuousEncounter || doNotContinue) {
    return;
  } else if (encounter.encounterMode === MysteryEncounterMode.NO_BATTLE) {
    globalScene.pushPhase(new MysteryEncounterRewardsPhase(addHealPhase));
    globalScene.pushPhase(new EggLapsePhase());
  } else if (
    !globalScene
      .getEnemyParty()
      .find((p) => (encounter.encounterMode !== MysteryEncounterMode.TRAINER_BATTLE ? p.isOnField() : !p?.isFainted()))
  ) {
    globalScene.pushPhase(new BattleEndPhase(true));
    if (encounter.encounterMode === MysteryEncounterMode.TRAINER_BATTLE) {
      globalScene.pushPhase(new TrainerVictoryPhase());
    }
    if (globalScene.gameMode.isEndless || !globalScene.gameMode.isWaveFinal(globalScene.currentBattle.waveIndex)) {
      globalScene.pushPhase(new MysteryEncounterRewardsPhase(addHealPhase));
      if (!encounter.doContinueEncounter) {
        // Only lapse eggs once for multi-battle encounters
        globalScene.pushPhase(new EggLapsePhase());
      }
    }
  }
}

/**
 * Similar to {@linkcode handleMysteryEncounterVictory}, but for cases where the player lost a battle or failed a challenge
 * @param addHealPhase - Adds an empty shop phase to allow player to purchase healing items
 * @param doNotContinue - default `false`. If set to true, will not end the battle and continue to next wave
 */
export function handleMysteryEncounterBattleFailed(addHealPhase: boolean = false, doNotContinue: boolean = false) {
  const allowedPkm = globalScene.getPlayerParty().filter((pkm) => pkm.isAllowedInBattle());

  if (allowedPkm.length === 0) {
    globalScene.gameOver({ clearPhaseQueue: true });
    return;
  }

  // If in repeated encounter variant, do nothing
  // Variant must eventually be swapped in order to handle "true" end of the encounter
  const encounter = globalScene.currentBattle.mysteryEncounter!;
  if (encounter.continuousEncounter || doNotContinue) {
    return;
  } else if (encounter.encounterMode !== MysteryEncounterMode.NO_BATTLE) {
    globalScene.pushPhase(new BattleEndPhase(false));
  }

  globalScene.pushPhase(new MysteryEncounterRewardsPhase(addHealPhase));

  if (!encounter.doContinueEncounter) {
    // Only lapse eggs once for multi-battle encounters
    globalScene.pushPhase(new EggLapsePhase());
  }
}

/**
 * Will queue moves for any pokemon to use before the first CommandPhase of a battle
 * Mostly useful for allowing {@linkcode MysteryEncounter} enemies to "cheat" and use moves before the first turn
 */
export function handleMysteryEncounterBattleStartEffects() {
  const encounter = globalScene.currentBattle.mysteryEncounter;
  if (
    globalScene.currentBattle.isBattleMysteryEncounter()
    && encounter
    && encounter.encounterMode !== MysteryEncounterMode.NO_BATTLE
    && !encounter.startOfBattleEffectsComplete
  ) {
    const effects = encounter.startOfBattleEffects;
    effects.forEach((effect) => {
      let source;
      if (effect.sourcePokemon) {
        source = effect.sourcePokemon;
      } else if (!isNullOrUndefined(effect.sourceBattlerIndex)) {
        if (effect.sourceBattlerIndex === BattlerIndex.ATTACKER) {
          source = globalScene.getEnemyField()[0];
        } else if (effect.sourceBattlerIndex === BattlerIndex.ENEMY) {
          source = globalScene.getEnemyField()[0];
        } else if (effect.sourceBattlerIndex === BattlerIndex.ENEMY_2) {
          source = globalScene.getEnemyField()[1];
        } else if (effect.sourceBattlerIndex === BattlerIndex.PLAYER) {
          source = globalScene.getPlayerField()[0];
        } else if (effect.sourceBattlerIndex === BattlerIndex.PLAYER_2) {
          source = globalScene.getPlayerField()[1];
        }
      } else {
        source = globalScene.getEnemyField()[0];
      }
      globalScene.useMove({
        pokemon: source,
        targets: effect.targets,
        move: effect.move,
        followUp: effect.followUp,
        ignorePp: effect.ignorePp,
        when: "defer",
      });
    });

    // Pseudo turn end phase to reset flinch states, Endure, etc.
    globalScene.pushPhase(new MysteryEncounterBattleStartCleanupPhase());

    encounter.startOfBattleEffectsComplete = true;
  }
}

/**
 * Can queue extra phases or logic during {@linkcode TurnInitPhase}
 * Should mostly just be used for injecting custom phases into the battle system on turn start
 * @return boolean - if true, will skip the remainder of the {@linkcode TurnInitPhase}
 */
export function handleMysteryEncounterTurnStartEffects(): boolean {
  const encounter = globalScene.currentBattle.mysteryEncounter;
  if (globalScene.currentBattle.isBattleMysteryEncounter() && encounter && encounter.onTurnStart) {
    return encounter.onTurnStart();
  }

  return false;
}

/**
 * Debug function used to calculate ME statistics in a Classic run.
 * UNUSED IN THE GAME. PURELY FOR DEBUGGING.
 * @param baseSpawnWeight - The chance of spawning a ME in %
 */
export function calculateMEAggregateStats(baseSpawnWeight: number) {
  const numRuns = 1000;
  let run = 0;
  const biomes = Object.keys(BiomeId).filter((key) => isNaN(Number(key)));
  const alwaysPickTheseBiomes = [
    BiomeId.ISLAND,
    BiomeId.ABYSS,
    BiomeId.WASTELAND,
    BiomeId.FAIRY_CAVE,
    BiomeId.TEMPLE,
    BiomeId.LABORATORY,
    BiomeId.SPACE,
    BiomeId.WASTELAND,
  ];

  const calculateNumEncounters = (): any[] => {
    let encounterRate = baseSpawnWeight; // BASE_MYSTERY_ENCOUNTER_SPAWN_WEIGHT
    const numEncounters = [0, 0, 0, 0];
    let mostRecentEncounterWave = 0;
    const encountersByBiome = new Map<string, number>(biomes.map((b) => [b, 0]));
    const validMEfloorsByBiome = new Map<string, number>(biomes.map((b) => [b, 0]));
    let currentBiome = BiomeId.TOWN;
    let currentArena = globalScene.newArena(currentBiome);
    globalScene.setSeed(randomString(24));
    globalScene.resetSeed();
    for (let i = 10; i < 180; i++) {
      // Boss
      if (i % 10 === 0) {
        continue;
      }

      // New biome
      if (i % 10 === 1) {
        if (Array.isArray(biomeLinks[currentBiome])) {
          let biomes: BiomeId[];
          globalScene.executeWithSeedOffset(() => {
            biomes = (biomeLinks[currentBiome] as (BiomeId | [BiomeId, number])[])
              .filter((b) => {
                return !Array.isArray(b) || !randSeedInt(b[1]);
              })
              .map((b) => (!Array.isArray(b) ? b : b[0]));
          }, i * 100);
          if (biomes! && biomes.length > 0) {
            const specialBiomes = biomes.filter((b) => alwaysPickTheseBiomes.includes(b));
            if (specialBiomes.length > 0) {
              currentBiome = specialBiomes[randSeedInt(specialBiomes.length)];
            } else {
              currentBiome = biomes[randSeedInt(biomes.length)];
            }
          }
        } else if (biomeLinks.hasOwnProperty(currentBiome)) {
          currentBiome = biomeLinks[currentBiome] as BiomeId;
        } else {
          if (!(i % 50)) {
            currentBiome = BiomeId.END;
          } else {
            currentBiome = globalScene.generateRandomBiome(i);
          }
        }

        currentArena = globalScene.newArena(currentBiome);
      }

      // Fixed battle
      if (globalScene.gameMode.isFixedBattle(i)) {
        continue;
      }

      // Trainer
      if (globalScene.gameMode.isWaveTrainer(i, currentArena)) {
        continue;
      }

      // Otherwise, roll encounter

      const roll = randSeedInt(256);
      validMEfloorsByBiome.set(BiomeId[currentBiome], (validMEfloorsByBiome.get(BiomeId[currentBiome]) ?? 0) + 1);

      // If total number of encounters is lower than expected for the run, slightly favor a new encounter
      // Do the reverse as well
      const expectedEncountersByFloor = (ME_AVERAGE_ENCOUNTERS_PER_RUN_TARGET / (180 - 10)) * (i - 10);
      const currentRunDiffFromAvg = expectedEncountersByFloor - numEncounters.reduce((a, b) => a + b);
      const favoredEncounterRate = encounterRate + currentRunDiffFromAvg * 15;

      // If the most recent ME was 3 or fewer waves ago, can never spawn a ME
      const canSpawn = i - mostRecentEncounterWave > 3;

      if (canSpawn && roll < favoredEncounterRate) {
        mostRecentEncounterWave = i;
        encounterRate = baseSpawnWeight;

        // Calculate encounter rarity
        // Common / Uncommon / Rare / Super Rare (base is out of 128)
        const tierWeights = [66, 40, 19, 3];

        // Adjust tier weights by currently encountered events (pity system that lowers odds of multiple Common/Great)
        tierWeights[0] = tierWeights[0] - 6 * numEncounters[0];
        tierWeights[1] = tierWeights[1] - 4 * numEncounters[1];

        const totalWeight = tierWeights.reduce((a, b) => a + b);
        const tierValue = randSeedInt(totalWeight);
        const commonThreshold = totalWeight - tierWeights[0]; // 64 - 32 = 32
        const uncommonThreshold = totalWeight - tierWeights[0] - tierWeights[1]; // 64 - 32 - 16 = 16
        const rareThreshold = totalWeight - tierWeights[0] - tierWeights[1] - tierWeights[2]; // 64 - 32 - 16 - 10 = 6

        tierValue > commonThreshold
          ? ++numEncounters[0]
          : tierValue > uncommonThreshold
            ? ++numEncounters[1]
            : tierValue > rareThreshold
              ? ++numEncounters[2]
              : ++numEncounters[3];
        encountersByBiome.set(BiomeId[currentBiome], (encountersByBiome.get(BiomeId[currentBiome]) ?? 0) + 1);
      } else {
        encounterRate += ME_WEIGHT_INCREMENT_ON_SPAWN_MISS;
      }
    }

    return [numEncounters, encountersByBiome, validMEfloorsByBiome];
  };

  const encounterRuns: number[][] = [];
  const encountersByBiomeRuns: Map<string, number>[] = [];
  const validFloorsByBiome: Map<string, number>[] = [];
  while (run < numRuns) {
    globalScene.executeWithSeedOffset(() => {
      const [numEncounters, encountersByBiome, validMEfloorsByBiome] = calculateNumEncounters();
      encounterRuns.push(numEncounters);
      encountersByBiomeRuns.push(encountersByBiome);
      validFloorsByBiome.push(validMEfloorsByBiome);
    }, 1000 * run);
    run++;
  }

  const n = encounterRuns.length;
  const totalEncountersInRun = encounterRuns.map((run) => run.reduce((a, b) => a + b));
  const totalMean = totalEncountersInRun.reduce((a, b) => a + b) / n;
  const totalStd = Math.sqrt(totalEncountersInRun.map((x) => Math.pow(x - totalMean, 2)).reduce((a, b) => a + b) / n);
  const commonMean = encounterRuns.reduce((a, b) => a + b[0], 0) / n;
  const uncommonMean = encounterRuns.reduce((a, b) => a + b[1], 0) / n;
  const rareMean = encounterRuns.reduce((a, b) => a + b[2], 0) / n;
  const superRareMean = encounterRuns.reduce((a, b) => a + b[3], 0) / n;

  const encountersPerRunPerBiome = encountersByBiomeRuns.reduce((a, b) => {
    for (const biome of a.keys()) {
      a.set(biome, a.get(biome)! + b.get(biome)!);
    }
    return a;
  });
  const meanEncountersPerRunPerBiome: Map<string, number> = new Map<string, number>();
  encountersPerRunPerBiome.forEach((value, key) => {
    meanEncountersPerRunPerBiome.set(key, value / n);
  });

  const validMEFloorsPerRunPerBiome = validFloorsByBiome.reduce((a, b) => {
    for (const biome of a.keys()) {
      a.set(biome, a.get(biome)! + b.get(biome)!);
    }
    return a;
  });
  const meanMEFloorsPerRunPerBiome: Map<string, number> = new Map<string, number>();
  validMEFloorsPerRunPerBiome.forEach((value, key) => {
    meanMEFloorsPerRunPerBiome.set(key, value / n);
  });

  let stats = `Starting weight: ${baseSpawnWeight}\nAverage MEs per run: ${totalMean}\nStandard Deviation: ${totalStd}\nAvg Commons: ${commonMean}\nAvg Greats: ${uncommonMean}\nAvg Ultras: ${rareMean}\nAvg Epics: ${superRareMean}\n`;

  const meanEncountersPerRunPerBiomeSorted = [...meanEncountersPerRunPerBiome.entries()].sort(
    (e1, e2) => e2[1] - e1[1],
  );
  meanEncountersPerRunPerBiomeSorted.forEach(
    (value) =>
      (stats =
        stats + `${value[0]}: avg valid floors ${meanMEFloorsPerRunPerBiome.get(value[0])}, avg MEs ${value[1]},\n`),
  );

  console.log(stats);
}

/**
 * TODO: remove once encounter spawn rate is finalized
 * Just a helper function to calculate aggregate stats for MEs in a Classic run
 * @param luckValue - 0 to 14
 */
export function calculateRareSpawnAggregateStats(luckValue: number) {
  const numRuns = 1000;
  let run = 0;

  const calculateNumRareEncounters = (): any[] => {
    const bossEncountersByRarity = [0, 0, 0, 0];
    globalScene.setSeed(randomString(24));
    globalScene.resetSeed();
    // There are 12 wild boss floors
    for (let i = 0; i < 12; i++) {
      // Roll boss tier
      // luck influences encounter rarity
      let luckModifier = 0;
      if (!isNaN(luckValue)) {
        luckModifier = luckValue * 0.5;
      }
      const tierValue = randSeedInt(64 - luckModifier);
      const tier =
        tierValue >= 20
          ? BiomePoolTier.BOSS
          : tierValue >= 6
            ? BiomePoolTier.BOSS_RARE
            : tierValue >= 1
              ? BiomePoolTier.BOSS_SUPER_RARE
              : BiomePoolTier.BOSS_ULTRA_RARE;

      switch (tier) {
        default:
        case BiomePoolTier.BOSS:
          ++bossEncountersByRarity[0];
          break;
        case BiomePoolTier.BOSS_RARE:
          ++bossEncountersByRarity[1];
          break;
        case BiomePoolTier.BOSS_SUPER_RARE:
          ++bossEncountersByRarity[2];
          break;
        case BiomePoolTier.BOSS_ULTRA_RARE:
          ++bossEncountersByRarity[3];
          break;
      }
    }

    return bossEncountersByRarity;
  };

  const encounterRuns: number[][] = [];
  while (run < numRuns) {
    globalScene.executeWithSeedOffset(() => {
      const bossEncountersByRarity = calculateNumRareEncounters();
      encounterRuns.push(bossEncountersByRarity);
    }, 1000 * run);
    run++;
  }

  const n = encounterRuns.length;
  // const totalEncountersInRun = encounterRuns.map(run => run.reduce((a, b) => a + b));
  // const totalMean = totalEncountersInRun.reduce((a, b) => a + b) / n;
  // const totalStd = Math.sqrt(totalEncountersInRun.map(x => Math.pow(x - totalMean, 2)).reduce((a, b) => a + b) / n);
  const commonMean = encounterRuns.reduce((a, b) => a + b[0], 0) / n;
  const rareMean = encounterRuns.reduce((a, b) => a + b[1], 0) / n;
  const superRareMean = encounterRuns.reduce((a, b) => a + b[2], 0) / n;
  const ultraRareMean = encounterRuns.reduce((a, b) => a + b[3], 0) / n;

  const stats = `Avg Commons: ${commonMean}\nAvg Rare: ${rareMean}\nAvg Super Rare: ${superRareMean}\nAvg Ultra Rare: ${ultraRareMean}\n`;

  console.log(stats);
}
