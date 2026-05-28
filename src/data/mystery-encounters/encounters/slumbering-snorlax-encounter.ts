import { globalScene } from "#app/global-scene";
import { CLASSIC_MODE_MYSTERY_ENCOUNTER_WAVES } from "#constants/mystery-encounter-constants";
import { BattlerIndex } from "#enums/battler-index";
import { MoveId } from "#enums/move-id";
import { MysteryEncounterMode } from "#enums/mystery-encounter-mode";
import { MysteryEncounterOptionMode } from "#enums/mystery-encounter-option-mode";
import { MysteryEncounterTier } from "#enums/mystery-encounter-tier";
import { MysteryEncounterType } from "#enums/mystery-encounter-type";
import { SpeciesId } from "#enums/species-id";
import { StatusEffect } from "#enums/status-effect";
import { PokemonMove } from "#field/pokemon-move";
import { modifierTypes } from "#modifier/modifier-types";
import { queueEncounterMessage } from "#mystery-encounters/encounter-dialogue-utils";
import {
  initBattleWithEnemyConfig,
  leaveEncounterWithoutBattle,
  loadCustomMovesForEncounter,
  type MysteryEncounterBattleConfig,
  setEncounterExp,
  setEncounterRewards,
} from "#mystery-encounters/encounter-phase-utils";
import { type MysteryEncounter, MysteryEncounterBuilder } from "#mystery-encounters/mystery-encounter";
import { MysteryEncounterOptionBuilder } from "#mystery-encounters/mystery-encounter-option";
import { MoveRequirement } from "#mystery-encounters/mystery-encounter-requirements";
import { STEALING_MOVES } from "#mystery-encounters/requirement-groups";
import { getPokemonSpecies } from "#utils/pokemon-utils";

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

    const config: MysteryEncounterBattleConfig = {
      battleType: MysteryEncounterMode.WILD_BATTLE,
      levelBoostMultiplier: 0.5,
      pokemonConfigs: [
        {
          speciesPool: [SpeciesId.SNORLAX],
          boss: true,
          shiny: false, // Shiny lock because shiny is rolled only if the battle option is picked
          status: {
            effect: StatusEffect.SLEEP,
            sleepTurnsRemaining: 5,
            toxicTurnCount: 0,
          },
          moveset: [MoveId.REST, MoveId.SLEEP_TALK, MoveId.CRUNCH, MoveId.GIGA_IMPACT],
          customPokemonData: {
            spriteScale: 1.25,
          },
          // TODO: Re-add item configs (2x Sitrus Berry, 2x Enigma Berry)
        },
      ],
    };
    encounter.battleConfigs = [config];

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
      await initBattleWithEnemyConfig(encounter.battleConfigs[0]);
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
      globalScene.phaseManager.createAndUnshiftPhase("PartyHealPhase", true);
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
