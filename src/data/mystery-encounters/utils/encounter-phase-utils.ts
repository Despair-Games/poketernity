import { globalScene } from "#app/global-scene";
import {
  ME_AVERAGE_ENCOUNTERS_PER_RUN_TARGET,
  ME_WEIGHT_INCREMENT_ON_SPAWN_MISS,
} from "#constants/mystery-encounter-constants";
import { biomeLinks } from "#data/biome-links";
import { Egg, type EggOptions } from "#data/egg";
import { BiomeId } from "#enums/biome-id";
import { BiomePoolTier } from "#enums/biome-pool-tier";
import { FieldPosition } from "#enums/field-position";
import { ModifierPoolType } from "#enums/modifier-pool-type";
import type { MoveId } from "#enums/move-id";
import { MysteryEncounterMode } from "#enums/mystery-encounter-mode";
import { PartyMemberStrength } from "#enums/party-member-strength";
import type { PartyOption } from "#enums/party-option";
import { PartyUiMode } from "#enums/party-ui-mode";
import type { SpeciesId } from "#enums/species-id";
import type { NonDefaultTrainerGender } from "#enums/trainer-gender";
import { TrainerSlot } from "#enums/trainer-slot";
import { UiMode } from "#enums/ui-mode";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { PlayerPokemon } from "#field/player-pokemon";
import type { Pokemon } from "#field/pokemon";
import { initMoveAnim } from "#init/init-move-anim";
import {
  type CustomModifierSettings,
  type ModifierType,
  ModifierTypeGenerator,
  ModifierTypeOption,
} from "#modifier/modifier-type";
import { modifierTypes } from "#modifier/modifier-types";
import { showEncounterText } from "#mystery-encounters/encounter-dialogue-utils";
import type { IMysteryEncounter } from "#mystery-encounters/mystery-encounter";
import type { MysteryEncounterOption } from "#mystery-encounters/mystery-encounter-option";
import {
  type CompoundTrainerConfig,
  type ConfigurableEnemyPokemonOptions,
  isCompoundConfig,
  type NewTrainerConfig,
} from "#trainers/new-trainer-config";
import { levelByStrength } from "#trainers/trainer-config-builder";
import { TrainerDataSet } from "#trainers/trainer-data";
import type { PokemonSelectFilter } from "#types/ui-types";
import type { NonEmptyArray } from "#types/utility-types";
import type { OptionSelectItem, OptionSelectModeConfig } from "#ui/option-select-config";
import type { OptionSelectUiHandler } from "#ui/option-select-ui-handler";
import type { PartyUiHandler } from "#ui/party-ui-handler";
import type { UiHandler } from "#ui/ui-handler";
import { coerceArray, enumValueToKey } from "#utils/common-utils";
import { loadMoveAnimAssets } from "#utils/move-anim-utils";
import { getPokemonSpecies } from "#utils/pokemon-utils";
import { randomString, randSeedInt, randSeedItem } from "#utils/random-utils";
import i18next from "i18next";

/**
 * Animates exclamation sprite over trainer's head at start of encounter
 */
export function doTrainerExclamation(): void {
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

/** Generic configurable properties that may apply to all ME battles. */
interface MysteryEncounterBattleSpec {
  /**
   * Enemy Pokemon may be given additional levels in Mystery Encounter battles for added difficulty.
   * This acts as an optional multiplier for the base level boost (`floor(waveIndex / 10)`).
   */
  levelBoostMultiplier?: number;
  /** `true` will prevent player from switching */
  disableSwitch?: boolean;
  /** `true` or leaving undefined will increment dex seen count for the encounter battle, `false` will not */
  countAsSeen?: boolean;
}

/** Configurable properties that may only apply to Trainer battles. */
interface MysteryEncounterTrainerSpec extends MysteryEncounterBattleSpec {
  battleType: typeof MysteryEncounterMode.TRAINER_BATTLE;
  /** The config to generate Trainer(s) for the battle. */
  trainerConfig: NewTrainerConfig | CompoundTrainerConfig;
  /**
   * The {@linkcode TrainerGender gender} of the Trainer in this battle
   * @todo Change data structure to support double battles
   */
  trainerGender?: NonDefaultTrainerGender | NonDefaultTrainerGender[];
}

/**
 * Config to generate a custom {@linkcode EnemyPokemon} for wild ME battles.
 */
interface WildPartyPokemonConfig extends ConfigurableEnemyPokemonOptions {
  /**
   * A pre-built {@linkcode EnemyPokemon}. If defined, this Pokemon is forwarded
   * to the battle instead of generating a new Pokemon.
   */
  pokemon?: EnemyPokemon;
  /**
   * The species pool from which a new Pokemon may be generated.
   * Each species in this pool has an equal chance of being selected.
   */
  speciesPool?: NonEmptyArray<SpeciesId>;
  /**
   * (Optional) A function to determine the level of enemy Pokemon generated via
   * {@linkcode speciesPool}. This should not include the level bonus
   * granted via {@linkcode MysteryEncounterBattleSpec.levelBoostMultiplier}
   * @param waveIndex - The scaled wave index for the current game mode
   * @returns The generated Pokemon's level *prior to the level bonus from*
   * `levelBoostMultiplier`
   */
  levelFunc?: (waveIndex: number) => number;
  /**
   * (Optional) A function to execute on this config's Pokemon after it is
   * forwarded into battle (via {@linkcode pokemon}) or generated (via {@linkcode speciesPool})
   * @param pokemon - The {@linkcode EnemyPokemon} represented by this config
   */
  postProcess?: (pokemon: EnemyPokemon) => void;
}

/** Configurable properties that may only apply to Wild (or trainerless) Battles */
interface MysteryEncounterWildSpec extends MysteryEncounterBattleSpec {
  battleType: typeof MysteryEncounterMode.WILD_BATTLE | typeof MysteryEncounterMode.BOSS_BATTLE;
  /** Whether or not this config is for a double battle */
  double?: boolean;
  /**
   * Config(s) to generate custom Pokemon for wild battles.
   * This should be limited to 1-2 configs for single or double battles, respectively.
   */
  pokemonConfigs: WildPartyPokemonConfig[];
  /**
   * If `true` and the battle involves multiple {@linkcode pokemonConfigs}, the
   * same seed offset will be used for species pool selection across all party
   * slots (i.e. the same index in each pool will be selected).
   */
  useSameSeedForSpecies?: boolean;
}

export type MysteryEncounterBattleConfig = MysteryEncounterTrainerSpec | MysteryEncounterWildSpec;

/**
 * Generates an enemy party for a mystery encounter battle
 * This will override and replace any standard encounter generation logic
 * Useful for tailoring specific battles to mystery encounters
 * @param partyConfig Can pass various customizable attributes for the enemy party, see EnemyPartyConfig
 */
export async function initBattleWithEnemyConfig(config: MysteryEncounterBattleConfig): Promise<void> {
  // Remove and destroy all enemy Pokemon that may still be on the field
  for (const enemyPokemon of globalScene.getEnemyParty()) {
    enemyPokemon.leaveField(false, true, true);
  }

  const { currentBattle, gameData } = globalScene;
  currentBattle.mysteryEncounter!.encounterMode = config.battleType;

  if (config.battleType === MysteryEncounterMode.TRAINER_BATTLE) {
    await initMysteryEncounterTrainerPokemon(config);
  } else {
    await initMysteryEncounterWildPokemon(config);
  }

  if (config.countAsSeen ?? true) {
    currentBattle.enemyParty.forEach((e) =>
      gameData.setPokemonSeen(e, true, config.battleType === MysteryEncounterMode.TRAINER_BATTLE),
    );
  }

  globalScene.phaseManager.createAndPushPhase("MysteryEncounterBattlePhase", config.disableSwitch);
  currentBattle.enemyParty.forEach((enemyPokemon_2, e_1) => {
    if (e_1 < (currentBattle.double ? 2 : 1)) {
      enemyPokemon_2.setVisible(false);
      if (currentBattle.double) {
        enemyPokemon_2.setFieldPosition(e_1 ? FieldPosition.RIGHT : FieldPosition.LEFT);
      }
      // Spawns at current visible field instead of on "next encounter" field (off screen to the left)
      enemyPokemon_2.x += 300;
    }
  });

  // TODO: Re-add custom item (modifier) config logic
}

async function initMysteryEncounterTrainerPokemon(trainerSpec: MysteryEncounterTrainerSpec): Promise<void> {
  const { trainerConfig, trainerGender, levelBoostMultiplier } = trainerSpec;
  const { currentBattle } = globalScene;
  const trainerGenderArr = coerceArray(trainerGender);
  const trainerGenders = {
    [TrainerSlot.TRAINER]: trainerGenderArr[0],
    [TrainerSlot.TRAINER_PARTNER]: trainerGenderArr[1],
  };

  globalScene.enemyTrainers?.setVisible(false);

  const scaledWaveIndex = globalScene.gameMode.getWaveForDifficulty(currentBattle.waveIndex);
  const levelBonus = Math.max(Math.floor((scaledWaveIndex / 10) * (levelBoostMultiplier ?? 0)), 0);

  if (isCompoundConfig(trainerConfig)) {
    const configCopy = { ...trainerConfig };
    for (const cfg of Object.values(configCopy.configs)) {
      const adjPartyConfigs = cfg.partyConfigs.map((pkmCfg) => {
        return {
          ...pkmCfg,
          levelFunc: coerceArray(pkmCfg.levelFunc).map((lf) => (waveIndex: number) => lf(waveIndex) + levelBonus),
        };
      });
      cfg.partyConfigs = adjPartyConfigs;
    }

    currentBattle.trainerData = TrainerDataSet.fromCompoundConfig(configCopy, trainerGenders);
  } else {
    const adjPartyConfigs = trainerConfig.partyConfigs.map((cfg) => {
      return {
        ...cfg,
        levelFunc: coerceArray(cfg.levelFunc).map((lf) => (waveIndex: number) => lf(waveIndex) + levelBonus),
      };
    });
    const finalTrainerCfg: NewTrainerConfig = {
      ...trainerConfig,
      partyConfigs: adjPartyConfigs,
    };

    currentBattle.trainerData = TrainerDataSet.fromConfig(finalTrainerCfg, trainerGenders[TrainerSlot.TRAINER]);
  }

  currentBattle.enemyParty = currentBattle.trainerData.combinedParty;
  currentBattle.double = currentBattle.trainerData.double;
  await globalScene.initEnemyTrainers(currentBattle.trainerData);

  const enemyTrainers = globalScene.enemyTrainers!;
  enemyTrainers.x += 300;
  enemyTrainers.setVisible(false);
}

async function initMysteryEncounterWildPokemon(wildSpec: MysteryEncounterWildSpec): Promise<void> {
  const { double, pokemonConfigs, levelBoostMultiplier, useSameSeedForSpecies } = wildSpec;
  const { currentBattle } = globalScene;
  const maxPartySize = double ? 2 : 1;

  if (pokemonConfigs.length !== maxPartySize) {
    throw new Error("Invalid party size for Wild Mystery Encounter battle");
  }

  const scaledWaveIndex = globalScene.gameMode.getWaveForDifficulty(currentBattle.waveIndex);
  const levelBonus = Math.max(Math.floor((scaledWaveIndex / 10) * (levelBoostMultiplier ?? 0)), 0);

  const party: EnemyPokemon[] = [];
  for (const config of pokemonConfigs) {
    if (config.pokemon != null) {
      party.push(config.pokemon);
      config.postProcess?.(config.pokemon);
    } else if (config.speciesPool && config.speciesPool.length > 0) {
      const levelFunc = config.levelFunc ?? levelByStrength(PartyMemberStrength.WEAK)[0];
      const seedOffset = (scaledWaveIndex + (useSameSeedForSpecies ? 0 : party.length) + 1) << 8;

      globalScene.executeWithSeedOffset(() => {
        const level = levelFunc(scaledWaveIndex) + levelBonus;
        const speciesId = getPokemonSpecies(randSeedItem(config.speciesPool!)).getEnemySpeciesForLevel(level);
        const species = getPokemonSpecies(speciesId);

        party.push(globalScene.addEnemyPokemon(species, level, config, config.postProcess));
      }, seedOffset);
    } else {
      throw new Error("Invalid Pokemon config; `pokemon` and `speciesPool` are both undefined");
    }
  }

  currentBattle.enemyParty = party;
  currentBattle.double = double ?? false;
}

/**
 * Load special move animations/sfx for hard-coded encounter-specific moves that a pokemon uses at the start of an encounter \
 * See: {@linkcode IMysteryEncounter | IMysteryEncounter.startOfBattleEffects} for more details
 *
 * This promise does not need to be awaited on if called in an encounter onInit (will just load lazily)
 * @param moveIds - The move or moves the Pokemon uses at the start of the encounter
 */
export async function loadCustomMovesForEncounter(moveIds: MoveId | MoveId[]): Promise<void> {
  const movesArray: MoveId[] = coerceArray(moveIds);
  return Promise.all(movesArray.map((move: MoveId) => initMoveAnim(move))).then(() => loadMoveAnimAssets(movesArray));
}

/**
 * Will update player money, and animate change (sound optional)
 * @param changeValue the amount by how much the player's money value changes by
 * @param playSound whether or not to play the buying sound effect
 * @param showMessage whether or not to display a message about paying or receiving money
 */
export function updatePlayerMoney(changeValue: number, playSound: boolean = true, showMessage: boolean = true): void {
  globalScene.money = Math.min(Math.max(globalScene.money + changeValue, 0), Number.MAX_SAFE_INTEGER);
  globalScene.updateMoneyText();
  globalScene.animateMoneyChanged(false);
  if (playSound) {
    globalScene.audioManager.playSound("se/buy");
  }
  if (showMessage) {
    if (changeValue < 0) {
      globalScene.phaseManager.createAndUnshiftPhase(
        "MessagePhase",
        i18next.t("mysteryEncounterMessages:paid_money", { amount: -changeValue }),
        undefined,
        true,
      );
    } else {
      globalScene.phaseManager.createAndUnshiftPhase(
        "MessagePhase",
        i18next.t("mysteryEncounterMessages:receive_money", { amount: changeValue }),
        undefined,
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
  // biome-ignore lint/suspicious/noConfusingVoidType: TODO: refactor this?
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
                      showEncounterText(i18next.t("mysteryEncounterMessages:cancel_option"), {
                        delay: 0,
                        prompt: false,
                      });
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
              if (textPromptKey) {
                showEncounterText(textPromptKey).then(() => displayOptions());
              } else {
                displayOptions();
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

    const displayOptions = (cfg: OptionSelectModeConfig) => {
      globalScene.ui.setMessageMode().then(() => {
        if (optionSelectPromptKey) {
          showEncounterText(optionSelectPromptKey).then(() => {
            // Do hover over the starting selection option
            if (fullOptions[0].onHover) {
              fullOptions[0].onHover();
            }
            globalScene.ui.setMode<OptionSelectUiHandler>(UiMode.OPTION_SELECT, cfg);
          });
        } else {
          // Do hover over the starting selection option
          if (fullOptions[0].onHover) {
            fullOptions[0].onHover();
          }
          globalScene.ui.setMode<OptionSelectUiHandler>(UiMode.OPTION_SELECT, cfg);
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
                selectedOptionIndex,
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
          showEncounterText(i18next.t("mysteryEncounterMessages:cancel_option"), {
            delay: 0,
            prompt: false,
          });
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
  preRewardsCallback?: VoidFunction,
): void {
  globalScene.currentBattle.mysteryEncounter!.doEncounterRewards = () => {
    if (preRewardsCallback) {
      preRewardsCallback();
    }

    if (customShopRewards) {
      globalScene.phaseManager.createAndUnshiftPhase("SelectModifierPhase", {
        customModifierSettings: customShopRewards,
      });
    } else {
      globalScene.phaseManager.removePhase("SelectModifierPhase");
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
  const participantIds = coerceArray(participantId);

  globalScene.currentBattle.mysteryEncounter!.doEncounterExp = () => {
    globalScene.phaseManager.createAndUnshiftPhase(
      "PartyExpPhase",
      baseExpValue,
      useWaveIndex,
      new Set(participantIds),
    );

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
export function initSubsequentOptionSelect(optionSelectSettings: OptionSelectSettings): void {
  globalScene.phaseManager.createAndPushPhase("MysteryEncounterPhase", optionSelectSettings);
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
): void {
  globalScene.currentBattle.mysteryEncounter!.encounterMode = encounterMode;
  handleMysteryEncounterVictory(addHealPhase);
}

/**
 * Function to handle the player winning a ME battle
 * @param addHealPhase - Adds an empty shop phase to allow player to purchase healing items
 * @param doNotContinue - default `false`. If set to true, will not end the battle and continue to next wave
 */
export function handleMysteryEncounterVictory(addHealPhase: boolean = false, doNotContinue: boolean = false): void {
  const allowedPkm = globalScene.getPlayerParty().filter((pkm) => pkm.isAllowedInBattle());
  const { phaseManager } = globalScene;

  if (allowedPkm.length === 0) {
    phaseManager.queueGameOverPhase({ clearPhaseQueue: true });
    return;
  }

  // If in repeated encounter variant, do nothing
  // Variant must eventually be swapped in order to handle "true" end of the encounter
  const encounter = globalScene.currentBattle.mysteryEncounter!;
  if (encounter.continuousEncounter || doNotContinue) {
    return;
  }
  if (encounter.encounterMode === MysteryEncounterMode.NO_BATTLE) {
    phaseManager.pushPhase(
      phaseManager.createPhase("MysteryEncounterRewardsPhase", addHealPhase),
      phaseManager.createPhase("EggLapsePhase"),
    );
  } else if (
    // If any enemy Pokemon are still alive on the field or waiting for its fainting animation, do not advance a wave.
    // Also, if the enemy is a Trainer with other Pokemon alive in their party backline, do not advance a wave.
    !globalScene
      .getEnemyParty()
      .find(
        (p) =>
          p && (p.isOnField() || (encounter.encounterMode === MysteryEncounterMode.TRAINER_BATTLE && !p.isFainted())),
      )
  ) {
    globalScene.phaseManager.createAndPushPhase("BattleEndPhase", true);
    if (encounter.encounterMode === MysteryEncounterMode.TRAINER_BATTLE) {
      globalScene.phaseManager.createAndPushPhase("TrainerVictoryPhase");
    }
    if (!globalScene.gameMode.isWaveFinal(globalScene.currentBattle.waveIndex)) {
      globalScene.phaseManager.createAndPushPhase("MysteryEncounterRewardsPhase", addHealPhase);
      if (!encounter.doContinueEncounter) {
        // Only lapse eggs once for multi-battle encounters
        globalScene.phaseManager.createAndPushPhase("EggLapsePhase");
      }
    }
  }
}

/**
 * Similar to {@linkcode handleMysteryEncounterVictory}, but for cases where the player lost a battle or failed a challenge
 * @param addHealPhase - Adds an empty shop phase to allow player to purchase healing items
 * @param doNotContinue - default `false`. If set to true, will not end the battle and continue to next wave
 */
export function handleMysteryEncounterBattleFailed(
  addHealPhase: boolean = false,
  doNotContinue: boolean = false,
): void {
  const allowedPkm = globalScene.getPlayerParty().filter((pkm) => pkm.isAllowedInBattle());

  if (allowedPkm.length === 0) {
    globalScene.phaseManager.queueGameOverPhase({ clearPhaseQueue: true });
    return;
  }

  // If in repeated encounter variant, do nothing
  // Variant must eventually be swapped in order to handle "true" end of the encounter
  const encounter = globalScene.currentBattle.mysteryEncounter!;
  if (encounter.continuousEncounter || doNotContinue) {
    return;
  }
  if (encounter.encounterMode !== MysteryEncounterMode.NO_BATTLE) {
    globalScene.phaseManager.createAndPushPhase("BattleEndPhase", false);
  }

  globalScene.phaseManager.createAndPushPhase("MysteryEncounterRewardsPhase", addHealPhase);

  if (!encounter.doContinueEncounter) {
    // Only lapse eggs once for multi-battle encounters
    globalScene.phaseManager.createAndPushPhase("EggLapsePhase");
  }
}

/**
 * Will queue moves for any pokemon to use before the first CommandPhase of a battle
 * Mostly useful for allowing {@linkcode MysteryEncounter} enemies to "cheat" and use moves before the first turn
 */
export function handleMysteryEncounterBattleStartEffects(): void {
  const encounter = globalScene.currentBattle.mysteryEncounter;
  if (
    globalScene.currentBattle.isBattleMysteryEncounter()
    && encounter
    && encounter.encounterMode !== MysteryEncounterMode.NO_BATTLE
    && !encounter.startOfBattleEffectsComplete
  ) {
    const effects = encounter.startOfBattleEffects;
    effects.forEach((effect) => {
      let source: Pokemon;
      if (effect.sourcePokemon) {
        source = effect.sourcePokemon;
      } else if (effect.sourceBattlerIndex == null) {
        source = globalScene.getEnemyField()[0];
      } else {
        source = globalScene.getPokemonByBattlerIndex(effect.sourceBattlerIndex) ?? globalScene.getEnemyField()[0];
      }
      const { targets, move, followUp, ignorePp } = effect;
      globalScene.phaseManager.createAndPushPhase("MovePhase", source, targets, move, {
        followUp,
        ignorePp,
      });
    });

    // Pseudo turn end phase to reset flinch states, Endure, etc.
    globalScene.phaseManager.createAndPushPhase("MysteryEncounterBattleStartCleanupPhase");

    encounter.startOfBattleEffectsComplete = true;
  }
}

/**
 * Can queue extra phases or logic during {@linkcode TurnInitPhase}
 * Should mostly just be used for injecting custom phases into the battle system on turn start
 * @returns Whether to skip the remainder of the {@linkcode TurnInitPhase}
 */
export function handleMysteryEncounterTurnStartEffects(): boolean {
  const encounter = globalScene.currentBattle.mysteryEncounter;
  if (globalScene.currentBattle.isBattleMysteryEncounter() && encounter && encounter.onTurnStart) {
    return encounter.onTurnStart();
  }

  return false;
}

/**
 * Debug function used to calculate ME statistics in a Classic run. \
 * UNUSED IN THE GAME. PURELY FOR DEBUGGING.
 * @param baseSpawnWeight - The chance of spawning a ME in %
 */
export function calculateMEAggregateStats(baseSpawnWeight: number): void {
  const numRuns = 1000;
  let run = 0;
  const biomes = Object.keys(BiomeId).filter((key) => Number.isNaN(Number(key)));
  const alwaysPickTheseBiomes: readonly BiomeId[] = [
    BiomeId.ISLAND,
    BiomeId.ABYSS,
    BiomeId.WASTELAND,
    BiomeId.FAIRY_CAVE,
    BiomeId.TEMPLE,
    BiomeId.LABORATORY,
    BiomeId.SPACE,
    BiomeId.WASTELAND,
  ];

  const calculateNumEncounters = (): [
    numEncounters: number[],
    encountersByBiome: Map<string, number>,
    validMEFloorsByBiome: Map<string, number>,
  ] => {
    let encounterRate = baseSpawnWeight; // BASE_MYSTERY_ENCOUNTER_SPAWN_WEIGHT
    const numEncounters = [0, 0, 0, 0];
    let mostRecentEncounterWave = 0;
    const encountersByBiome = new Map<string, number>(biomes.map((b) => [b, 0]));
    const validMEFloorsByBiome = new Map<string, number>(biomes.map((b) => [b, 0]));
    let currentBiome: BiomeId = BiomeId.TOWN;
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
          let biomeIds!: BiomeId[];
          globalScene.executeWithSeedOffset(() => {
            biomeIds = (biomeLinks[currentBiome] as (BiomeId | [BiomeId, number])[])
              .filter((b) => {
                return !Array.isArray(b) || !randSeedInt(b[1]);
              })
              .map((b) => (Array.isArray(b) ? b[0] : b));
          }, i * 100);
          if (biomeIds && biomeIds.length > 0) {
            const specialBiomes = biomeIds.filter((b) => alwaysPickTheseBiomes.includes(b));
            if (specialBiomes.length > 0) {
              currentBiome = specialBiomes[randSeedInt(specialBiomes.length)];
            } else {
              currentBiome = biomeIds[randSeedInt(biomeIds.length)];
            }
          }
        } else if (Object.hasOwn(biomeLinks, currentBiome)) {
          currentBiome = biomeLinks[currentBiome] as BiomeId;
        } else {
          currentBiome = globalScene.generateRandomBiome(i);
        }

        globalScene.newArena(currentBiome);
      }

      // Fixed battle
      if (globalScene.gameMode.isFixedBattle(i)) {
        continue;
      }

      // Trainer
      if (globalScene.gameMode.isWaveTrainer(i)) {
        continue;
      }

      // Otherwise, roll encounter

      const roll = randSeedInt(256);
      const biomeKey = enumValueToKey(BiomeId, currentBiome);
      validMEFloorsByBiome.set(biomeKey, (validMEFloorsByBiome.get(biomeKey) ?? 0) + 1);

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
        tierWeights[0] -= 6 * numEncounters[0];
        tierWeights[1] -= 4 * numEncounters[1];

        const totalWeight = tierWeights.reduce((a, b) => a + b);
        const tierValue = randSeedInt(totalWeight);
        const commonThreshold = totalWeight - tierWeights[0]; // 64 - 32 = 32
        const uncommonThreshold = totalWeight - tierWeights[0] - tierWeights[1]; // 64 - 32 - 16 = 16
        const rareThreshold = totalWeight - tierWeights[0] - tierWeights[1] - tierWeights[2]; // 64 - 32 - 16 - 10 = 6

        if (tierValue > commonThreshold) {
          ++numEncounters[0];
        } else if (tierValue > uncommonThreshold) {
          ++numEncounters[1];
        } else if (tierValue > rareThreshold) {
          ++numEncounters[2];
        } else {
          ++numEncounters[3];
        }
        const biomeName = enumValueToKey(BiomeId, currentBiome);
        encountersByBiome.set(biomeName, (encountersByBiome.get(biomeName) ?? 0) + 1);
      } else {
        encounterRate += ME_WEIGHT_INCREMENT_ON_SPAWN_MISS;
      }
    }

    return [numEncounters, encountersByBiome, validMEFloorsByBiome];
  };

  const encounterRuns: number[][] = [];
  const encountersByBiomeRuns: Map<string, number>[] = [];
  const validFloorsByBiome: Map<string, number>[] = [];
  while (run < numRuns) {
    globalScene.executeWithSeedOffset(() => {
      const [numEncounters, encountersByBiome, validMEFloorsByBiome] = calculateNumEncounters();
      encounterRuns.push(numEncounters);
      encountersByBiomeRuns.push(encountersByBiome);
      validFloorsByBiome.push(validMEFloorsByBiome);
    }, 1000 * run);
    run++;
  }

  const n = encounterRuns.length;
  const totalEncountersInRun = encounterRuns.map((encounterRun) => encounterRun.reduce((a, b) => a + b));
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
      (stats += `${value[0]}: avg valid floors ${meanMEFloorsPerRunPerBiome.get(value[0])}, avg MEs ${value[1]},\n`),
  );

  console.log(stats);
}

/**
 * TODO: remove once encounter spawn rate is finalized \
 * Just a helper function to calculate aggregate stats for MEs in a Classic run
 * @param luckValue - 0 to 14
 */
export function calculateRareSpawnAggregateStats(luckValue: number): void {
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
      if (!Number.isNaN(luckValue)) {
        luckModifier = luckValue * 0.5;
      }
      const tierValue = randSeedInt(64 - luckModifier);
      let tier: BiomePoolTier = BiomePoolTier.BOSS_ULTRA_RARE;
      if (tierValue >= 20) {
        tier = BiomePoolTier.BOSS;
      } else if (tierValue >= 6) {
        tier = BiomePoolTier.BOSS_RARE;
      } else if (tierValue >= 1) {
        tier = BiomePoolTier.BOSS_SUPER_RARE;
      }

      switch (tier) {
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
