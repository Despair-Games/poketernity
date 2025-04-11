import { STEALING_MOVES } from "#app/data/mystery-encounters/requirements/requirement-groups";
import type { PokemonHeldItemModifierType } from "#app/modifier/modifier-type";
import { modifierTypes } from "#app/modifier/modifier-types";
import { MysteryEncounterType } from "#enums/mystery-encounter-type";
import { SpeciesId } from "#enums/species-id";
import { globalScene } from "#app/global-scene";
import { StatusEffect } from "#enums/status-effect";
import type MysteryEncounter from "#app/data/mystery-encounters/mystery-encounter";
import { MysteryEncounterBuilder } from "#app/data/mystery-encounters/mystery-encounter";
import { MysteryEncounterOptionBuilder } from "#app/data/mystery-encounters/mystery-encounter-option";
import { MoveRequirement } from "#app/data/mystery-encounters/mystery-encounter-requirements";
import type { EnemyPartyConfig, EnemyPokemonConfig } from "../utils/encounter-phase-utils";
import {
  generateModifierType,
  initBattleWithEnemyConfig,
  leaveEncounterWithoutBattle,
  loadCustomMovesForEncounter,
  setEncounterExp,
  setEncounterRewards,
} from "../utils/encounter-phase-utils";
import { queueEncounterMessage } from "#app/data/mystery-encounters/utils/encounter-dialogue-utils";
import { MoveId } from "#enums/move-id";
import { BattlerIndex } from "#enums/battler-index";
import { PokemonMove } from "#app/field/pokemon-move";
import { AiType } from "#enums/ai-type";
import { getPokemonSpecies } from "#app/utils/pokemon-species-utils";
import { MysteryEncounterTier } from "#enums/mystery-encounter-tier";
import { MysteryEncounterOptionMode } from "#enums/mystery-encounter-option-mode";
import { PartyHealPhase } from "#app/phases/party-heal-phase";
import { CLASSIC_MODE_MYSTERY_ENCOUNTER_WAVES } from "#app/constants";
import { BerryType } from "#enums/berry-type";
import { CustomPokemonData } from "#app/data/custom-pokemon-data";

/** i18n namespace for the encounter */
const namespace = "mysteryEncounters/slumberingSnorlax";

/**
 * Sleeping Snorlax encounter.
 * @see For biome requirements check {@linkcode mysteryEncountersByBiome}
 */
export const SlumberingSnorlaxEncounter: MysteryEncounter = MysteryEncounterBuilder.withEncounterType(
  MysteryEncounterType.SLUMBERING_SNORLAX,
)
  .withEncounterTier(MysteryEncounterTier.GREAT)
  .withSceneWaveRangeRequirement(...CLASSIC_MODE_MYSTERY_ENCOUNTER_WAVES)
  .withCatchAllowed(true)
  .withHideWildIntroMessage(true)
  .withFleeAllowed(false)
  .withIntroSpriteConfigs([
    {
      spriteKey: SpeciesId.SNORLAX.toString(),
      fileRoot: "pokemon",
      hasShadow: true,
      tint: 0.25,
      scale: 1.25,
      repeat: true,
      y: 5,
    },
  ])
  .withIntroDialogue([
    {
      text: `${namespace}:intro`,
    },
  ])
  .withOnInit(() => {
    const encounter = globalScene.currentBattle.mysteryEncounter!;
    console.log(encounter);

    // Calculate boss mon
    const bossSpecies = getPokemonSpecies(SpeciesId.SNORLAX);
    const pokemonConfig: EnemyPokemonConfig = {
      species: bossSpecies,
      isBoss: true,
      shiny: false, // Shiny lock because shiny is rolled only if the battle option is picked
      status: [StatusEffect.SLEEP, 5], // Extra turns on timer for Snorlax's start of fight moves
      moveSet: [MoveId.REST, MoveId.SLEEP_TALK, MoveId.CRUNCH, MoveId.GIGA_IMPACT],
      modifierConfigs: [
        {
          modifier: generateModifierType(modifierTypes.BERRY, [BerryType.SITRUS]) as PokemonHeldItemModifierType,
          stackCount: 2,
        },
        {
          modifier: generateModifierType(modifierTypes.BERRY, [BerryType.ENIGMA]) as PokemonHeldItemModifierType,
          stackCount: 2,
        },
      ],
      customPokemonData: new CustomPokemonData({ spriteScale: 1.25 }),
      aiType: AiType.SMART, // Required to ensure Snorlax uses Sleep Talk while it is asleep
    };
    const config: EnemyPartyConfig = {
      levelAdditiveModifier: 0.5,
      pokemonConfigs: [pokemonConfig],
    };
    encounter.enemyPartyConfigs = [config];

    // Load animations/sfx for Snorlax fight start moves
    loadCustomMovesForEncounter([MoveId.SNORE]);

    encounter.setDialogueToken("snorlaxName", getPokemonSpecies(SpeciesId.SNORLAX).getName());

    return true;
  })
  .setLocalizationKey(`${namespace}`)
  .withTitle(`${namespace}:title`)
  .withDescription(`${namespace}:description`)
  .withQuery(`${namespace}:query`)
  .withSimpleOption(
    {
      buttonLabel: `${namespace}:option.1.label`,
      buttonTooltip: `${namespace}:option.1.tooltip`,
      selected: [
        {
          text: `${namespace}:option.1.selected`,
        },
      ],
    },
    async () => {
      // Pick battle
      const encounter = globalScene.currentBattle.mysteryEncounter!;
      setEncounterRewards({ guaranteedModifierTypeFuncs: [modifierTypes.LEFTOVERS], fillRemaining: true });
      encounter.startOfBattleEffects.push(
        {
          sourceBattlerIndex: BattlerIndex.ENEMY,
          targets: [BattlerIndex.PLAYER],
          move: new PokemonMove(MoveId.SNORE),
          ignorePp: true,
        },
        {
          sourceBattlerIndex: BattlerIndex.ENEMY,
          targets: [BattlerIndex.PLAYER],
          move: new PokemonMove(MoveId.SNORE),
          ignorePp: true,
        },
      );
      await initBattleWithEnemyConfig(encounter.enemyPartyConfigs[0]);
    },
  )
  .withSimpleOption(
    {
      buttonLabel: `${namespace}:option.2.label`,
      buttonTooltip: `${namespace}:option.2.tooltip`,
      selected: [
        {
          text: `${namespace}:option.2.selected`,
        },
      ],
    },
    async () => {
      // Fall asleep waiting for Snorlax
      // Full heal party
      globalScene.phaseManager.unshiftPhase(new PartyHealPhase(true));
      queueEncounterMessage(`${namespace}:option.2.rest_result`);
      leaveEncounterWithoutBattle();
    },
  )
  .withOption(
    MysteryEncounterOptionBuilder.newOptionWithMode(MysteryEncounterOptionMode.DISABLED_OR_SPECIAL)
      .withPrimaryPokemonRequirement(new MoveRequirement(STEALING_MOVES, true))
      .withDialogue({
        buttonLabel: `${namespace}:option.3.label`,
        buttonTooltip: `${namespace}:option.3.tooltip`,
        disabledButtonTooltip: `${namespace}:option.3.disabled_tooltip`,
        selected: [
          {
            text: `${namespace}:option.3.selected`,
          },
        ],
      })
      .withOptionPhase(async () => {
        // Steal the Snorlax's Leftovers
        const instance = globalScene.currentBattle.mysteryEncounter!;
        setEncounterRewards({ guaranteedModifierTypeFuncs: [modifierTypes.LEFTOVERS], fillRemaining: false });
        // Snorlax exp to Pokemon that did the stealing
        setEncounterExp(instance.primaryPokemon!.id, getPokemonSpecies(SpeciesId.SNORLAX).baseExp);
        leaveEncounterWithoutBattle();
      })
      .build(),
  )
  .build();
