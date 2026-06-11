import { globalScene } from "#app/global-scene";
import {
  BTS_WAVE_LEVEL_BREAKPOINTS,
  CLASSIC_MODE_MYSTERY_ENCOUNTER_WAVES,
} from "#constants/mystery-encounter-constants";
import { GAME_WIDTH } from "#constants/ui-constants";
import { allMoves } from "#data/data-lists";
import { ElementalType } from "#enums/elemental-type";
import { ModifierTier } from "#enums/modifier-tier";
import { MoveId } from "#enums/move-id";
import { MysteryEncounterMode } from "#enums/mystery-encounter-mode";
import { MysteryEncounterOptionMode } from "#enums/mystery-encounter-option-mode";
import { MysteryEncounterTier } from "#enums/mystery-encounter-tier";
import { MysteryEncounterType } from "#enums/mystery-encounter-type";
import { SpeciesId } from "#enums/species-id";
import { TrainerGender } from "#enums/trainer-gender";
import { TrainerType } from "#enums/trainer-type";
import type { PlayerPokemon } from "#field/player-pokemon";
import type { Pokemon } from "#field/pokemon";
import { PokemonMove } from "#field/pokemon-move";
import {
  BypassSpeedChanceModifier,
  ContactHeldItemTransferChanceModifier,
  GigantamaxAccessModifier,
  MegaEvolutionAccessModifier,
  type PokemonHeldItemModifier,
} from "#modifier/modifier";
import type { AttackTypeBoosterModifierType, ModifierTypeOption } from "#modifier/modifier-type";
import { modifierTypes } from "#modifier/modifier-types";
import { getEncounterText, showEncounterDialogue } from "#mystery-encounters/encounter-dialogue-utils";
import {
  generateModifierType,
  generateModifierTypeOption,
  initBattleWithEnemyConfig,
  leaveEncounterWithoutBattle,
  type MysteryEncounterBattleConfig,
  selectOptionThenPokemon,
  selectPokemonForOption,
  setEncounterRewards,
} from "#mystery-encounters/encounter-phase-utils";
import { getSpriteKeysFromSpecies } from "#mystery-encounters/encounter-pokemon-utils";
import { transitionMysteryEncounterIntroVisuals } from "#mystery-encounters/encounter-visuals-utils";
import { type MysteryEncounter, MysteryEncounterBuilder } from "#mystery-encounters/mystery-encounter";
import { MysteryEncounterOptionBuilder } from "#mystery-encounters/mystery-encounter-option";
import {
  AttackTypeBoosterHeldItemTypeRequirement,
  CombinationPokemonRequirement,
  HeldItemRequirement,
  TypeRequirement,
} from "#mystery-encounters/mystery-encounter-requirements";
import { allTrainerConfigs } from "#trainers/trainer-configs/all-trainer-configs";
import { MoveInfoOverlay } from "#ui/move-info-overlay";
import type { OptionSelectItem } from "#ui/option-select-config";
import { randSeedInt } from "#utils/random-utils";
import i18next from "i18next";

/** the i18n namespace for the encounter */
const namespace = "mysteryEncounters/bugTypeSuperfan";

const PHYSICAL_TUTOR_MOVES = [
  MoveId.MEGAHORN,
  MoveId.X_SCISSOR,
  MoveId.ATTACK_ORDER,
  MoveId.PIN_MISSILE,
  MoveId.FIRST_IMPRESSION,
];

const SPECIAL_TUTOR_MOVES = [MoveId.SILVER_WIND, MoveId.BUG_BUZZ, MoveId.SIGNAL_BEAM, MoveId.POLLEN_PUFF];

const STATUS_TUTOR_MOVES = [
  MoveId.STRING_SHOT,
  MoveId.STICKY_WEB,
  MoveId.SILK_TRAP,
  MoveId.RAGE_POWDER,
  MoveId.HEAL_ORDER,
];

const MISC_TUTOR_MOVES = [
  MoveId.BUG_BITE,
  MoveId.LEECH_LIFE,
  MoveId.DEFEND_ORDER,
  MoveId.QUIVER_DANCE,
  MoveId.TAIL_GLOW,
  MoveId.INFESTATION,
  MoveId.U_TURN,
];

/**
 * Bug Type Superfan encounter.
 * @see For biome requirements check {@linkcode mysteryEncountersByBiome}
 */
export const BugTypeSuperfanEncounter: MysteryEncounter = MysteryEncounterBuilder.withEncounterType(
  MysteryEncounterType.BUG_TYPE_SUPERFAN,
)
  .withEncounterTier(MysteryEncounterTier.GREAT)
  .withPrimaryPokemonRequirement(
    CombinationPokemonRequirement.Some(
      // Must have at least 1 Bug type on team, OR have a bug item somewhere on the team
      new HeldItemRequirement(["BypassSpeedChanceModifier", "ContactHeldItemTransferChanceModifier"], 1),
      new AttackTypeBoosterHeldItemTypeRequirement(ElementalType.BUG, 1),
      new TypeRequirement(ElementalType.BUG, false, 1),
    ),
  )
  .withMaxAllowedEncounters(1)
  .withSceneWaveRangeRequirement(...CLASSIC_MODE_MYSTERY_ENCOUNTER_WAVES)
  .withIntroSpriteConfigs([]) // These are set in onInit()
  .withAutoHideIntroVisuals(false)
  .withIntroDialogue([
    {
      text: `${namespace}:intro`,
    },
    {
      speaker: `${namespace}:speaker`,
      text: `${namespace}:intro_dialogue`,
    },
  ])
  .withOnInit(() => {
    const encounter = globalScene.currentBattle.mysteryEncounter!;
    // Calculates what trainers are available for battle in the encounter

    // Bug type superfan trainer config
    const trainerConfig = allTrainerConfigs[TrainerType.BUG_TYPE_SUPERFAN]!;
    const spriteKey = trainerConfig.spriteKey[TrainerGender.DEFAULT]!();
    encounter.battleConfigs.push({
      battleType: MysteryEncounterMode.TRAINER_BATTLE,
      trainerConfig,
    });

    let beedrillKeys: { spriteKey: string; fileRoot: string };
    let butterfreeKeys: { spriteKey: string; fileRoot: string };
    if (globalScene.currentBattle.waveIndex < BTS_WAVE_LEVEL_BREAKPOINTS[3]) {
      beedrillKeys = getSpriteKeysFromSpecies(SpeciesId.BEEDRILL, false);
      butterfreeKeys = getSpriteKeysFromSpecies(SpeciesId.BUTTERFREE, false);
    } else {
      // Mega Beedrill/Gmax Butterfree
      beedrillKeys = getSpriteKeysFromSpecies(SpeciesId.BEEDRILL, false, 1);
      butterfreeKeys = getSpriteKeysFromSpecies(SpeciesId.BUTTERFREE, false, 1);
    }

    encounter.spriteConfigs = [
      {
        spriteKey: beedrillKeys.spriteKey,
        fileRoot: beedrillKeys.fileRoot,
        hasShadow: true,
        repeat: true,
        isPokemon: true,
        x: -30,
        tint: 0.15,
        y: -4,
        yShadow: -4,
      },
      {
        spriteKey: butterfreeKeys.spriteKey,
        fileRoot: butterfreeKeys.fileRoot,
        hasShadow: true,
        repeat: true,
        isPokemon: true,
        x: 30,
        tint: 0.15,
        y: -4,
        yShadow: -4,
      },
      {
        spriteKey,
        fileRoot: "trainer",
        hasShadow: true,
        x: 4,
        y: 7,
        yShadow: 7,
      },
    ];

    const requiredItems = [
      generateModifierType(modifierTypes.QUICK_CLAW),
      generateModifierType(modifierTypes.GRIP_CLAW),
      generateModifierType(modifierTypes.ATTACK_TYPE_BOOSTER, [ElementalType.BUG]),
    ];

    const requiredItemString = requiredItems.map((m) => m?.name ?? "unknown").join("/");
    encounter.setDialogueToken("requiredBugItems", requiredItemString);

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
          speaker: `${namespace}:speaker`,
          text: `${namespace}:option.1.selected`,
        },
      ],
    },
    async () => {
      // Select battle the bug trainer
      const encounter = globalScene.currentBattle.mysteryEncounter!;
      const config: MysteryEncounterBattleConfig = encounter.battleConfigs[0];

      // Init the moves available for tutor
      const moveTutorOptions: PokemonMove[] = [];
      moveTutorOptions.push(new PokemonMove(PHYSICAL_TUTOR_MOVES[randSeedInt(PHYSICAL_TUTOR_MOVES.length)]));
      moveTutorOptions.push(new PokemonMove(SPECIAL_TUTOR_MOVES[randSeedInt(SPECIAL_TUTOR_MOVES.length)]));
      moveTutorOptions.push(new PokemonMove(STATUS_TUTOR_MOVES[randSeedInt(STATUS_TUTOR_MOVES.length)]));
      moveTutorOptions.push(new PokemonMove(MISC_TUTOR_MOVES[randSeedInt(MISC_TUTOR_MOVES.length)]));
      encounter.misc = {
        moveTutorOptions,
      };

      // Assigns callback that teaches move before continuing to rewards
      encounter.onRewards = doBugTypeMoveTutor;

      setEncounterRewards({ fillRemaining: true });
      await transitionMysteryEncounterIntroVisuals(true, true);
      await initBattleWithEnemyConfig(config);
    },
  )
  .withOption(
    MysteryEncounterOptionBuilder.newOptionWithMode(MysteryEncounterOptionMode.DISABLED_OR_DEFAULT)
      .withPrimaryPokemonRequirement(new TypeRequirement(ElementalType.BUG, false, 1)) // Must have 1 Bug type on team
      .withDialogue({
        buttonLabel: `${namespace}:option.2.label`,
        buttonTooltip: `${namespace}:option.2.tooltip`,
        disabledButtonTooltip: `${namespace}:option.2.disabled_tooltip`,
      })
      .withPreOptionPhase(async () => {
        // Player shows off their bug types
        const encounter = globalScene.currentBattle.mysteryEncounter!;

        // Player gets different rewards depending on the number of bug types they have
        const numBugTypes = globalScene.getPlayerParty().filter((p) => p.isOfType(ElementalType.BUG, true)).length;
        const numBugTypesText = i18next.t(`${namespace}:numBugTypes`, { count: numBugTypes });
        encounter.setDialogueToken("numBugTypes", numBugTypesText);

        if (numBugTypes < 2) {
          setEncounterRewards({
            guaranteedModifierTypeFuncs: [modifierTypes.SUPER_LURE, modifierTypes.GREAT_BALL],
            fillRemaining: false,
          });
          encounter.selectedOption!.dialogue!.selected = [
            {
              speaker: `${namespace}:speaker`,
              text: `${namespace}:option.2.selected_0_to_1`,
            },
          ];
        } else if (numBugTypes < 4) {
          setEncounterRewards({
            guaranteedModifierTypeFuncs: [modifierTypes.QUICK_CLAW, modifierTypes.MAX_LURE, modifierTypes.ULTRA_BALL],
            fillRemaining: false,
          });
          encounter.selectedOption!.dialogue!.selected = [
            {
              speaker: `${namespace}:speaker`,
              text: `${namespace}:option.2.selected_2_to_3`,
            },
          ];
        } else if (numBugTypes < 6) {
          setEncounterRewards({
            guaranteedModifierTypeFuncs: [modifierTypes.GRIP_CLAW, modifierTypes.MAX_LURE, modifierTypes.ULTRA_BALL],
            fillRemaining: false,
          });
          encounter.selectedOption!.dialogue!.selected = [
            {
              speaker: `${namespace}:speaker`,
              text: `${namespace}:option.2.selected_4_to_5`,
            },
          ];
        } else {
          // If the player has any evolution/form change items that are valid for their party,
          // spawn one of those items in addition to Dynamax Band, Mega Band, and Master Ball
          const modifierOptions: ModifierTypeOption[] = [generateModifierTypeOption(modifierTypes.MASTER_BALL)!];
          const specialOptions: ModifierTypeOption[] = [];

          if (!globalScene.findModifier((m) => m instanceof MegaEvolutionAccessModifier)) {
            modifierOptions.push(generateModifierTypeOption(modifierTypes.MEGA_BRACELET)!);
          }
          if (!globalScene.findModifier((m) => m instanceof GigantamaxAccessModifier)) {
            modifierOptions.push(generateModifierTypeOption(modifierTypes.DYNAMAX_BAND)!);
          }
          const nonRareEvolutionModifier = generateModifierTypeOption(modifierTypes.EVOLUTION_ITEM);
          if (nonRareEvolutionModifier) {
            specialOptions.push(nonRareEvolutionModifier);
          }
          const rareEvolutionModifier = generateModifierTypeOption(modifierTypes.RARE_EVOLUTION_ITEM);
          if (rareEvolutionModifier) {
            specialOptions.push(rareEvolutionModifier);
          }
          const formChangeModifier = generateModifierTypeOption(modifierTypes.FORM_CHANGE_ITEM);
          if (formChangeModifier) {
            specialOptions.push(formChangeModifier);
          }
          const rareFormChangeModifier = generateModifierTypeOption(modifierTypes.RARE_FORM_CHANGE_ITEM);
          if (rareFormChangeModifier) {
            specialOptions.push(rareFormChangeModifier);
          }
          if (specialOptions.length > 0) {
            modifierOptions.push(specialOptions[randSeedInt(specialOptions.length)]);
          }

          setEncounterRewards({ guaranteedModifierTypeOptions: modifierOptions, fillRemaining: false });
          encounter.selectedOption!.dialogue!.selected = [
            {
              speaker: `${namespace}:speaker`,
              text: `${namespace}:option.2.selected_6`,
            },
          ];
        }
      })
      .withOptionPhase(async () => {
        // Player shows off their bug types
        leaveEncounterWithoutBattle();
      })
      .build(),
  )
  .withOption(
    MysteryEncounterOptionBuilder.newOptionWithMode(MysteryEncounterOptionMode.DISABLED_OR_DEFAULT)
      .withPrimaryPokemonRequirement(
        CombinationPokemonRequirement.Some(
          // Meets one or both of the below reqs
          new HeldItemRequirement(["BypassSpeedChanceModifier", "ContactHeldItemTransferChanceModifier"], 1),
          new AttackTypeBoosterHeldItemTypeRequirement(ElementalType.BUG, 1),
        ),
      )
      .withDialogue({
        buttonLabel: `${namespace}:option.3.label`,
        buttonTooltip: `${namespace}:option.3.tooltip`,
        disabledButtonTooltip: `${namespace}:option.3.disabled_tooltip`,
        selected: [
          {
            text: `${namespace}:option.3.selected`,
          },
          {
            speaker: `${namespace}:speaker`,
            text: `${namespace}:option.3.selected_dialogue`,
          },
        ],
        secondOptionPrompt: `${namespace}:option.3.select_prompt`,
      })
      .withPreOptionPhase(async (): Promise<boolean> => {
        const encounter = globalScene.currentBattle.mysteryEncounter!;

        const onPokemonSelected = (pokemon: PlayerPokemon) => {
          // Get Pokemon held items and filter for valid ones
          const validItems = pokemon.getHeldItems().filter((item) => {
            return (
              (item instanceof BypassSpeedChanceModifier
                || item instanceof ContactHeldItemTransferChanceModifier
                || (item.isAttackTypeBoosterModifier()
                  && (item.type as AttackTypeBoosterModifierType).moveType === ElementalType.BUG))
              && item.isTransferable
            );
          });

          return validItems.map((modifier: PokemonHeldItemModifier) => {
            const option: OptionSelectItem = {
              label: modifier.type.name,
              handler: () => {
                // Pokemon and item selected
                encounter.setDialogueToken("selectedItem", modifier.type.name);
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
          const hasValidItem = pokemon.getHeldItems().some((item) => {
            return (
              item instanceof BypassSpeedChanceModifier
              || item instanceof ContactHeldItemTransferChanceModifier
              || (item.isAttackTypeBoosterModifier()
                && (item.type as AttackTypeBoosterModifierType).moveType === ElementalType.BUG)
            );
          });
          if (!hasValidItem) {
            return getEncounterText(`${namespace}:option.3.invalid_selection`) ?? null;
          }

          return null;
        };

        return selectPokemonForOption(onPokemonSelected, undefined, selectableFilter);
      })
      .withOptionPhase(async () => {
        const encounter = globalScene.currentBattle.mysteryEncounter!;
        const modifier = encounter.misc.chosenModifier;
        const chosenPokemon: PlayerPokemon = encounter.misc.chosenPokemon;

        chosenPokemon.loseHeldItem(modifier, false);
        globalScene.updateModifiers(true, true);

        const bugNet = generateModifierTypeOption(modifierTypes.MYSTERY_ENCOUNTER_GOLDEN_BUG_NET)!;
        bugNet.type.tier = ModifierTier.EPIC;

        setEncounterRewards({
          guaranteedModifierTypeOptions: [bugNet],
          guaranteedModifierTypeFuncs: [modifierTypes.REVIVER_SEED],
          fillRemaining: false,
        });
        leaveEncounterWithoutBattle(true);
      })
      .build(),
  )
  .withOutroDialogue([
    {
      text: `${namespace}:outro`,
    },
  ])
  .build();

function doBugTypeMoveTutor(): Promise<void> {
  return new Promise<void>(async (resolve) => {
    const moveOptions = globalScene.currentBattle.mysteryEncounter!.misc.moveTutorOptions;
    await showEncounterDialogue(`${namespace}:battle_won`, `${namespace}:speaker`);

    const overlayScale = 1;
    const moveInfoOverlay = new MoveInfoOverlay({
      delayVisibility: false,
      scale: overlayScale,
      onSide: true,
      right: true,
      x: 1,
      y: -MoveInfoOverlay.getHeight(overlayScale, true) - 1,
      width: GAME_WIDTH - 2,
    });
    globalScene.ui.add(moveInfoOverlay);

    const optionSelectItems = moveOptions.map((move: PokemonMove) => {
      const option: OptionSelectItem = {
        label: move.name,
        handler: () => {
          moveInfoOverlay.active = false;
          moveInfoOverlay.setVisible(false);
          return true;
        },
        onHover: () => {
          moveInfoOverlay.active = true;
          moveInfoOverlay.show(allMoves.get(move.moveId));
        },
      };
      return option;
    });

    const onHoverOverCancel = () => {
      moveInfoOverlay.active = false;
      moveInfoOverlay.setVisible(false);
    };

    const result = await selectOptionThenPokemon(
      optionSelectItems,
      `${namespace}:teach_move_prompt`,
      undefined,
      onHoverOverCancel,
    );
    if (!result) {
      moveInfoOverlay.active = false;
      moveInfoOverlay.setVisible(false);
    }

    // TODO: add menu to confirm player doesn't want to teach a move?

    // Option select complete, handle if they are learning a move
    if (result && result.selectedOptionIndex < moveOptions.length) {
      globalScene.phaseManager.createAndUnshiftPhase(
        "LearnMovePhase",
        result.selectedPokemonIndex,
        moveOptions[result.selectedOptionIndex].moveId,
      );
    }

    // Complete battle and go to rewards
    resolve();
  });
}
