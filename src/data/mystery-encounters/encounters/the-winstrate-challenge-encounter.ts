import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import { globalScene } from "#app/global-scene";
import { CLASSIC_MODE_MYSTERY_ENCOUNTER_WAVES } from "#constants/mystery-encounter-constants";
import { AbilityId } from "#enums/ability-id";
import { BattlerTagType } from "#enums/battler-tag-type";
import { ModifierTier } from "#enums/modifier-tier";
import { MysteryEncounterMode } from "#enums/mystery-encounter-mode";
import { MysteryEncounterTier } from "#enums/mystery-encounter-tier";
import { MysteryEncounterType } from "#enums/mystery-encounter-type";
import { SpeciesId } from "#enums/species-id";
import { TrainerType } from "#enums/trainer-type";
import { SpeciesFormChangeManualTrigger } from "#form-change-triggers/species-form-change-manual-trigger";
import { modifierTypes } from "#modifier/modifier-types";
import { showEncounterDialogue, showEncounterText } from "#mystery-encounters/encounter-dialogue-utils";
import {
  generateModifierTypeOption,
  initBattleWithEnemyConfig,
  leaveEncounterWithoutBattle,
  setEncounterRewards,
} from "#mystery-encounters/encounter-phase-utils";
import { transitionMysteryEncounterIntroVisuals } from "#mystery-encounters/encounter-visuals-utils";
import { type MysteryEncounter, MysteryEncounterBuilder } from "#mystery-encounters/mystery-encounter";
import { allTrainerConfigs } from "#trainers/trainer-configs/all-trainer-configs";
import i18next from "i18next";

/** the i18n namespace for the encounter */
const namespace = "mysteryEncounters/theWinstrateChallenge";

/**
 * The Winstrate Challenge encounter.
 * @see For biome requirements check {@linkcode mysteryEncountersByBiome}
 */
export const TheWinstrateChallengeEncounter: MysteryEncounter = MysteryEncounterBuilder.withEncounterType(
  MysteryEncounterType.THE_WINSTRATE_CHALLENGE,
)
  .withEncounterTier(MysteryEncounterTier.EPIC)
  .withSceneWaveRangeRequirement(100, CLASSIC_MODE_MYSTERY_ENCOUNTER_WAVES[1])
  .withIntroSpriteConfigs([
    {
      spriteKey: "vito",
      fileRoot: "trainer",
      hasShadow: false,
      x: 16,
      y: -4,
    },
    {
      spriteKey: "vivi",
      fileRoot: "trainer",
      hasShadow: false,
      x: -14,
      y: -4,
    },
    {
      spriteKey: "victor",
      fileRoot: "trainer",
      hasShadow: true,
      x: -32,
    },
    {
      spriteKey: "victoria",
      fileRoot: "trainer",
      hasShadow: true,
      x: 40,
    },
    {
      spriteKey: "vicky",
      fileRoot: "trainer",
      hasShadow: true,
      x: 3,
      y: 5,
      yShadow: 5,
    },
  ])
  .withIntroDialogue([
    {
      text: `${namespace}:intro`,
    },
    {
      speaker: `${namespace}:speaker`,
      text: `${namespace}:intro_dialogue`,
    },
  ])
  .withAutoHideIntroVisuals(false)
  .withOnInit(() => {
    const encounter = globalScene.currentBattle.mysteryEncounter!;
    // Encounter battles will occur in pop order
    encounter.battleConfigs = [
      {
        battleType: MysteryEncounterMode.TRAINER_BATTLE,
        trainerConfig: allTrainerConfigs[TrainerType.VITO]!,
      },
      {
        battleType: MysteryEncounterMode.TRAINER_BATTLE,
        trainerConfig: allTrainerConfigs[TrainerType.VICKY]!,
      },
      {
        battleType: MysteryEncounterMode.TRAINER_BATTLE,
        trainerConfig: allTrainerConfigs[TrainerType.VIVI]!,
      },
      {
        battleType: MysteryEncounterMode.TRAINER_BATTLE,
        trainerConfig: allTrainerConfigs[TrainerType.VICTORIA]!,
      },
      {
        battleType: MysteryEncounterMode.TRAINER_BATTLE,
        trainerConfig: allTrainerConfigs[TrainerType.VICTOR]!,
      },
    ];
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
      // Spawn 5 trainer battles back to back with Macho Brace in rewards
      globalScene.currentBattle.mysteryEncounter!.doContinueEncounter = async () => {
        await endTrainerBattleAndShowDialogue();
      };
      await transitionMysteryEncounterIntroVisuals(true, false);
      await spawnNextTrainerOrEndEncounter();
    },
  )
  .withSimpleOption(
    {
      buttonLabel: `${namespace}:option.2.label`,
      buttonTooltip: `${namespace}:option.2.tooltip`,
      selected: [
        {
          speaker: `${namespace}:speaker`,
          text: `${namespace}:option.2.selected`,
        },
      ],
    },
    async () => {
      // Refuse the challenge, they full heal the party and give the player a Rarer Candy
      globalScene.phaseManager.createAndUnshiftPhase("PartyHealPhase", true);
      setEncounterRewards({ guaranteedModifierTypeFuncs: [modifierTypes.RARER_CANDY], fillRemaining: false });
      leaveEncounterWithoutBattle();
    },
  )
  .build();

async function spawnNextTrainerOrEndEncounter() {
  const encounter = globalScene.currentBattle.mysteryEncounter!;
  const nextConfig = encounter.battleConfigs.pop();
  if (nextConfig) {
    await initBattleWithEnemyConfig(nextConfig);
  } else {
    await transitionMysteryEncounterIntroVisuals(false, false);
    await showEncounterDialogue(`${namespace}:victory`, `${namespace}:speaker`);

    // Give 10x Voucher
    const newModifier = modifierTypes.VOUCHER_PREMIUM().newModifier();
    globalScene.addModifier(newModifier);
    globalScene.audioManager.playSound("item_fanfare");
    await showEncounterText(i18next.t("battle:rewardGain", { modifierName: newModifier?.type.name }));

    await showEncounterDialogue(`${namespace}:victory_2`, `${namespace}:speaker`);
    globalScene.ui.clearText(); // Clears "Winstrate" title from screen as rewards get animated in
    const machoBrace = generateModifierTypeOption(modifierTypes.MYSTERY_ENCOUNTER_MACHO_BRACE)!;
    machoBrace.type.tier = ModifierTier.MASTER;
    setEncounterRewards({ guaranteedModifierTypeOptions: [machoBrace], fillRemaining: false });
    encounter.doContinueEncounter = undefined;
    leaveEncounterWithoutBattle(false, MysteryEncounterMode.NO_BATTLE);
  }
}

async function endTrainerBattleAndShowDialogue(): Promise<void> {
  if (globalScene.currentBattle.mysteryEncounter!.battleConfigs.length === 0) {
    await globalScene.enemyTrainers?.hide();
    globalScene.enemyTrainers = null;
    await spawnNextTrainerOrEndEncounter();
    return;
  }

  globalScene.arena.resetArenaEffects();
  const playerField = globalScene.getPlayerField();
  playerField.forEach((pokemon) => pokemon.lapseTag(BattlerTagType.COMMANDED));
  playerField.forEach((_, p) => globalScene.phaseManager.createAndUnshiftPhase("RecallPhase", p));

  for (const pokemon of globalScene.getPlayerParty()) {
    // Only trigger form change when Eiscue is in Noice form
    if (
      pokemon.species.speciesId === SpeciesId.EISCUE
      && pokemon.hasAbility(AbilityId.ICE_FACE)
      && pokemon.formIndex === 1
    ) {
      globalScene.triggerPokemonFormChange(pokemon, SpeciesFormChangeManualTrigger);
    }

    pokemon.resetWaveData();
    applyAbAttrs("PostBattleInitAbAttr", pokemon, false);
  }

  globalScene.phaseManager.createAndUnshiftPhase("ShowTrainerPhase");
  await globalScene.enemyTrainers?.hide();
  globalScene.enemyTrainers = null;
  await spawnNextTrainerOrEndEncounter();
}
