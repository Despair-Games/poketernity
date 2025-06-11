import { globalScene } from "#app/global-scene";
import i18next from "#app/plugins/i18n";
import { CLASSIC_MODE_MYSTERY_ENCOUNTER_WAVES } from "#constants/mystery-encounter-constants";
import { MysteryEncounterOptionMode } from "#enums/mystery-encounter-option-mode";
import { MysteryEncounterTier } from "#enums/mystery-encounter-tier";
import { MysteryEncounterType } from "#enums/mystery-encounter-type";
import { SpeciesId } from "#enums/species-id";
import type { PlayerPokemon } from "#field/player-pokemon";
import type { Pokemon } from "#field/pokemon";
import type { PokemonHeldItemModifier, PokemonInstantReviveModifier } from "#modifier/modifier";
import {
  type BerryModifier,
  HealingBoosterModifier,
  LevelIncrementBoosterModifier,
  MoneyMultiplierModifier,
} from "#modifier/modifier";
import type { PokemonHeldItemModifierType } from "#modifier/modifier-type";
import { modifierTypes } from "#modifier/modifier-types";
import { getEncounterText, showEncounterText } from "#mystery-encounters/encounter-dialogue-utils";
import {
  generateModifierType,
  leaveEncounterWithoutBattle,
  selectPokemonForOption,
  updatePlayerMoney,
} from "#mystery-encounters/encounter-phase-utils";
import { applyModifierTypeToPlayerPokemon } from "#mystery-encounters/encounter-pokemon-utils";
import type MysteryEncounter from "#mystery-encounters/mystery-encounter";
import { MysteryEncounterBuilder } from "#mystery-encounters/mystery-encounter";
import { MysteryEncounterOptionBuilder } from "#mystery-encounters/mystery-encounter-option";
import {
  CombinationPokemonRequirement,
  HeldItemRequirement,
  MoneyRequirement,
} from "#mystery-encounters/mystery-encounter-requirements";
import type { OptionSelectItem } from "#ui/option-select-config";
import { getPokemonSpecies } from "#utils/pokemon-utils";

/** the i18n namespace for this encounter */
const namespace = "mysteryEncounters/delibirdy";

/** Berries only */
const OPTION_2_ALLOWED_MODIFIERS = ["BerryModifier", "PokemonInstantReviveModifier"];

/** Disallowed items are berries, Reviver Seeds, Vitamins, and non-transferable held items (checked elsewhere) */
const OPTION_3_DISALLOWED_MODIFIERS = [
  "BerryModifier",
  "PokemonInstantReviveModifier",
  "TerastallizeModifier",
  "PokemonBaseStatModifier",
  "PokemonBaseStatTotalModifier",
];

const DELIBIRDY_MONEY_PRICE_MULTIPLIER = 2;

/**
 * Delibird-y encounter.
 * @see For biome requirements check {@linkcode mysteryEncountersByBiome}
 */
export const DelibirdyEncounter: MysteryEncounter = MysteryEncounterBuilder.withEncounterType(
  MysteryEncounterType.DELIBIRDY,
)
  .withEncounterTier(MysteryEncounterTier.GREAT)
  .withSceneWaveRangeRequirement(...CLASSIC_MODE_MYSTERY_ENCOUNTER_WAVES)
  .withSceneRequirement(new MoneyRequirement(0, DELIBIRDY_MONEY_PRICE_MULTIPLIER)) // Must have enough money for it to spawn at the very least
  .withPrimaryPokemonRequirement(
    CombinationPokemonRequirement.Some(
      // Must also have either option 2 or 3 available to spawn
      new HeldItemRequirement(OPTION_2_ALLOWED_MODIFIERS),
      new HeldItemRequirement(OPTION_3_DISALLOWED_MODIFIERS, 1, true),
    ),
  )
  .withIntroSpriteConfigs([
    {
      spriteKey: "",
      fileRoot: "",
      species: SpeciesId.DELIBIRD,
      hasShadow: true,
      repeat: true,
      startFrame: 38,
      scale: 0.94,
    },
    {
      spriteKey: "",
      fileRoot: "",
      species: SpeciesId.DELIBIRD,
      hasShadow: true,
      repeat: true,
      scale: 1.06,
    },
    {
      spriteKey: "",
      fileRoot: "",
      species: SpeciesId.DELIBIRD,
      hasShadow: true,
      repeat: true,
      startFrame: 65,
      x: 1,
      y: 5,
      yShadow: 5,
    },
  ])
  .withIntroDialogue([
    {
      text: `${namespace}:intro`,
    },
  ])
  .setLocalizationKey(`${namespace}`)
  .withTitle(`${namespace}:title`)
  .withDescription(`${namespace}:description`)
  .withQuery(`${namespace}:query`)
  .withOutroDialogue([
    {
      text: `${namespace}:outro`,
    },
  ])
  .withOnInit(() => {
    const encounter = globalScene.currentBattle.mysteryEncounter!;
    encounter.setDialogueToken("delibirdName", getPokemonSpecies(SpeciesId.DELIBIRD).getName());

    globalScene.loadBgm("mystery_encounter_fun_and_games", "mystery_encounter_fun_and_games.mp3");
    return true;
  })
  .withOnVisualsStart(() => {
    globalScene.audioManager.fadeAndSwitchBgm("mystery_encounter_fun_and_games");
    return true;
  })
  .withOption(
    MysteryEncounterOptionBuilder.newOptionWithMode(MysteryEncounterOptionMode.DISABLED_OR_DEFAULT)
      .withSceneMoneyRequirement(0, DELIBIRDY_MONEY_PRICE_MULTIPLIER) // Must have money to spawn
      .withDialogue({
        buttonLabel: `${namespace}:option.1.label`,
        buttonTooltip: `${namespace}:option.1.tooltip`,
        selected: [
          {
            text: `${namespace}:option.1.selected`,
          },
        ],
      })
      .withPreOptionPhase(async (): Promise<boolean> => {
        const encounter = globalScene.currentBattle.mysteryEncounter!;
        updatePlayerMoney(-(encounter.options[0].requirements[0] as MoneyRequirement).requiredMoney, true, false);
        return true;
      })
      .withOptionPhase(async () => {
        // Give the player an Amulet Coin
        // Check if the player has max stacks of that item already
        const existing = globalScene.findModifier(
          (m) => m instanceof MoneyMultiplierModifier,
        ) as MoneyMultiplierModifier;

        if (existing && existing.getStackCount() >= existing.getMaxStackCount()) {
          // At max stacks, give the first party pokemon a Shell Bell instead
          const shellBell = generateModifierType(modifierTypes.SHELL_BELL) as PokemonHeldItemModifierType;
          await applyModifierTypeToPlayerPokemon(globalScene.getPlayerPokemon()!, shellBell);
          globalScene.audioManager.playSound("item_fanfare");
          await showEncounterText(
            i18next.t("battle:rewardGain", { modifierName: shellBell.name }),
            null,
            undefined,
            true,
          );
        } else {
          globalScene.phaseManager.createAndUnshiftPhase("ModifierRewardPhase", modifierTypes.AMULET_COIN);
        }

        leaveEncounterWithoutBattle(true);
      })
      .build(),
  )
  .withOption(
    MysteryEncounterOptionBuilder.newOptionWithMode(MysteryEncounterOptionMode.DISABLED_OR_DEFAULT)
      .withPrimaryPokemonRequirement(new HeldItemRequirement(OPTION_2_ALLOWED_MODIFIERS))
      .withDialogue({
        buttonLabel: `${namespace}:option.2.label`,
        buttonTooltip: `${namespace}:option.2.tooltip`,
        secondOptionPrompt: `${namespace}:option.2.select_prompt`,
        selected: [
          {
            text: `${namespace}:option.2.selected`,
          },
        ],
      })
      .withPreOptionPhase(async (): Promise<boolean> => {
        const encounter = globalScene.currentBattle.mysteryEncounter!;
        const onPokemonSelected = (pokemon: PlayerPokemon) => {
          // Get Pokemon held items and filter for valid ones
          const validItems = pokemon.getHeldItems().filter((it) => {
            return OPTION_2_ALLOWED_MODIFIERS.some((heldItem) => it.constructor.name === heldItem) && it.isTransferable;
          });

          return validItems.map((modifier: PokemonHeldItemModifier) => {
            const option: OptionSelectItem = {
              label: modifier.type.name,
              handler: () => {
                // Pokemon and item selected
                encounter.setDialogueToken("chosenItem", modifier.type.name);
                encounter.misc = {
                  chosenPokemon: pokemon,
                  chosenModifier: modifier,
                };
                return true;
              },
            };
            return option;
          });
        };

        const selectableFilter = (pokemon: Pokemon) => {
          // If pokemon has valid item, it can be selected
          const meetsReqs = encounter.options[1].pokemonMeetsPrimaryRequirements(pokemon);
          if (!meetsReqs) {
            return getEncounterText(`${namespace}:invalid_selection`) ?? null;
          }

          return null;
        };

        return selectPokemonForOption(onPokemonSelected, undefined, selectableFilter);
      })
      .withOptionPhase(async () => {
        const encounter = globalScene.currentBattle.mysteryEncounter!;
        const modifier: BerryModifier | PokemonInstantReviveModifier = encounter.misc.chosenModifier;
        const chosenPokemon: PlayerPokemon = encounter.misc.chosenPokemon;

        // Give the player a Candy Jar if they gave a Berry, and a Berry Pouch for Reviver Seed
        if (modifier.isBerryModifier()) {
          // Check if the player has max stacks of that Candy Jar already
          const existing = globalScene.findModifier(
            (m) => m instanceof LevelIncrementBoosterModifier,
          ) as LevelIncrementBoosterModifier;

          if (existing && existing.getStackCount() >= existing.getMaxStackCount()) {
            // At max stacks, give the first party pokemon a Shell Bell instead
            const shellBell = generateModifierType(modifierTypes.SHELL_BELL) as PokemonHeldItemModifierType;
            await applyModifierTypeToPlayerPokemon(globalScene.getPlayerPokemon()!, shellBell);
            globalScene.audioManager.playSound("item_fanfare");
            await showEncounterText(
              i18next.t("battle:rewardGain", { modifierName: shellBell.name }),
              null,
              undefined,
              true,
            );
          } else {
            globalScene.phaseManager.createAndUnshiftPhase("ModifierRewardPhase", modifierTypes.CANDY_JAR);
          }
        } else {
          // Check if the player has max stacks of that Berry Pouch already
          const existing = globalScene.findModifier((m) => m.isPreserveBerryModifier());

          if (existing && existing.getStackCount() >= existing.getMaxStackCount()) {
            // At max stacks, give the first party pokemon a Shell Bell instead
            const shellBell = generateModifierType(modifierTypes.SHELL_BELL) as PokemonHeldItemModifierType;
            await applyModifierTypeToPlayerPokemon(globalScene.getPlayerPokemon()!, shellBell);
            globalScene.audioManager.playSound("item_fanfare");
            await showEncounterText(
              i18next.t("battle:rewardGain", { modifierName: shellBell.name }),
              null,
              undefined,
              true,
            );
          } else {
            globalScene.phaseManager.createAndUnshiftPhase("ModifierRewardPhase", modifierTypes.BERRY_POUCH);
          }
        }

        chosenPokemon.loseHeldItem(modifier, false);

        leaveEncounterWithoutBattle(true);
      })
      .build(),
  )
  .withOption(
    MysteryEncounterOptionBuilder.newOptionWithMode(MysteryEncounterOptionMode.DISABLED_OR_DEFAULT)
      .withPrimaryPokemonRequirement(new HeldItemRequirement(OPTION_3_DISALLOWED_MODIFIERS, 1, true))
      .withDialogue({
        buttonLabel: `${namespace}:option.3.label`,
        buttonTooltip: `${namespace}:option.3.tooltip`,
        secondOptionPrompt: `${namespace}:option.3.select_prompt`,
        selected: [
          {
            text: `${namespace}:option.3.selected`,
          },
        ],
      })
      .withPreOptionPhase(async (): Promise<boolean> => {
        const encounter = globalScene.currentBattle.mysteryEncounter!;
        const onPokemonSelected = (pokemon: PlayerPokemon) => {
          // Get Pokemon held items and filter for valid ones
          const validItems = pokemon.getHeldItems().filter((it) => {
            return (
              !OPTION_3_DISALLOWED_MODIFIERS.some((heldItem) => it.constructor.name === heldItem) && it.isTransferable
            );
          });

          return validItems.map((modifier: PokemonHeldItemModifier) => {
            const option: OptionSelectItem = {
              label: modifier.type.name,
              handler: () => {
                // Pokemon and item selected
                encounter.setDialogueToken("chosenItem", modifier.type.name);
                encounter.misc = {
                  chosenPokemon: pokemon,
                  chosenModifier: modifier,
                };
                return true;
              },
            };
            return option;
          });
        };

        const selectableFilter = (pokemon: Pokemon) => {
          // If pokemon has valid item, it can be selected
          const meetsReqs = encounter.options[2].pokemonMeetsPrimaryRequirements(pokemon);
          if (!meetsReqs) {
            return getEncounterText(`${namespace}:invalid_selection`) ?? null;
          }

          return null;
        };

        return selectPokemonForOption(onPokemonSelected, undefined, selectableFilter);
      })
      .withOptionPhase(async () => {
        const encounter = globalScene.currentBattle.mysteryEncounter!;
        const modifier = encounter.misc.chosenModifier;
        const chosenPokemon: PlayerPokemon = encounter.misc.chosenPokemon;

        // Check if the player has max stacks of Healing Charm already
        const existing = globalScene.findModifier((m) => m instanceof HealingBoosterModifier) as HealingBoosterModifier;

        if (existing && existing.getStackCount() >= existing.getMaxStackCount()) {
          // At max stacks, give the first party pokemon a Shell Bell instead
          const shellBell = generateModifierType(modifierTypes.SHELL_BELL) as PokemonHeldItemModifierType;
          await applyModifierTypeToPlayerPokemon(globalScene.getPlayerParty()[0], shellBell);
          globalScene.audioManager.playSound("item_fanfare");
          await showEncounterText(
            i18next.t("battle:rewardGain", { modifierName: shellBell.name }),
            null,
            undefined,
            true,
          );
        } else {
          globalScene.phaseManager.createAndUnshiftPhase("ModifierRewardPhase", modifierTypes.HEALING_CHARM);
        }

        chosenPokemon.loseHeldItem(modifier, false);

        leaveEncounterWithoutBattle(true);
      })
      .build(),
  )
  .build();
