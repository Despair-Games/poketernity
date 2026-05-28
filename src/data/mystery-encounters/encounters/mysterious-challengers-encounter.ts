import { globalScene } from "#app/global-scene";
import { CLASSIC_MODE_MYSTERY_ENCOUNTER_WAVES } from "#constants/mystery-encounter-constants";
import { ModifierTier } from "#enums/modifier-tier";
import { MysteryEncounterMode } from "#enums/mystery-encounter-mode";
import { MysteryEncounterTier } from "#enums/mystery-encounter-tier";
import { MysteryEncounterType } from "#enums/mystery-encounter-type";
import { PartyMemberStrength } from "#enums/party-member-strength";
import { type NonDefaultTrainerGender, TrainerGender } from "#enums/trainer-gender";
import { modifierTypes } from "#modifier/modifier-types";
import { initBattleWithEnemyConfig, setEncounterRewards } from "#mystery-encounters/encounter-phase-utils";
import { type MysteryEncounter, MysteryEncounterBuilder } from "#mystery-encounters/mystery-encounter";
import { TrainerPartyCompoundTemplate, TrainerPartyTemplate } from "#trainers/trainer-config";
import { allNewTrainerConfigs, allTrainerConfigs } from "#trainers/trainer-configs/all-trainer-configs";
import { randSeedItem } from "#utils/random-utils";

/** the i18n namespace for the encounter */
const namespace = "mysteryEncounters/mysteriousChallengers";

/**
 * Mysterious Challengers encounter.
 * @see For biome requirements check {@linkcode mysteryEncountersByBiome}
 */
export const MysteriousChallengersEncounter: MysteryEncounter = MysteryEncounterBuilder.withEncounterType(
  MysteryEncounterType.MYSTERIOUS_CHALLENGERS,
)
  .withEncounterTier(MysteryEncounterTier.GREAT)
  .withSceneWaveRangeRequirement(...CLASSIC_MODE_MYSTERY_ENCOUNTER_WAVES)
  .withIntroSpriteConfigs([]) // These are set in onInit()
  .withIntroDialogue([
    {
      text: `${namespace}:intro`,
    },
  ])
  .withOnInit(() => {
    const encounter = globalScene.currentBattle.mysteryEncounter!;
    // Calculates what trainers are available for battle in the encounter

    // Normal difficulty trainer is randomly pulled from biome
    const normalTrainerType = globalScene.arena.randomTrainerType(globalScene.currentBattle.waveIndex);
    const normalConfig = allTrainerConfigs[normalTrainerType].clone();
    const normalTrainerGender = randSeedItem([TrainerGender.MALE, TrainerGender.FEMALE]);
    const normalSpriteKey = normalConfig.getSpriteKey(
      normalTrainerGender === TrainerGender.FEMALE,
      normalConfig.doubleOnly,
    );
    encounter.battleConfigs.push({
      battleType: MysteryEncounterMode.TRAINER_BATTLE,
      trainerConfig: allNewTrainerConfigs[normalTrainerType]!,
      trainerGender: normalTrainerGender,
    });

    // Hard difficulty trainer is another random trainer, but with AVERAGE_BALANCED config
    // Number of mons is based off wave: 1-20 is 2, 20-40 is 3, etc. capping at 6 after wave 100
    let retries = 0;
    let hardTrainerType = globalScene.arena.randomTrainerType(globalScene.currentBattle.waveIndex);
    while (retries < 5 && hardTrainerType === normalTrainerType) {
      // Will try to use a different trainer from the normal trainer type
      hardTrainerType = globalScene.arena.randomTrainerType(globalScene.currentBattle.waveIndex);
      retries++;
    }
    const hardTemplate = new TrainerPartyCompoundTemplate(
      new TrainerPartyTemplate(1, PartyMemberStrength.STRONGER, false, true),
      new TrainerPartyTemplate(
        Math.min(Math.ceil(globalScene.currentBattle.waveIndex / 20), 5),
        PartyMemberStrength.AVERAGE,
        false,
        true,
      ),
    );
    const hardConfig = allTrainerConfigs[hardTrainerType].clone();
    hardConfig.setPartyTemplates(hardTemplate);
    const hardTrainerGender = randSeedItem([TrainerGender.MALE, TrainerGender.FEMALE]);
    const hardSpriteKey = hardConfig.getSpriteKey(hardTrainerGender === TrainerGender.FEMALE, hardConfig.doubleOnly);
    encounter.battleConfigs.push({
      battleType: MysteryEncounterMode.TRAINER_BATTLE,
      trainerConfig: allNewTrainerConfigs[hardTrainerType]!,
      trainerGender: hardTrainerGender,
    });

    // Brutal trainer is pulled from pool of boss trainers (gym leaders) for the biome
    const brutalTrainerType = globalScene.arena.randomTrainerType(globalScene.currentBattle.waveIndex, true);
    const brutalTrainerCfg = allNewTrainerConfigs[brutalTrainerType]!;
    // TODO: This is awkward but required to display sprites before battle
    const brutalTrainerGender = Number(Object.keys(brutalTrainerCfg.name)[0]) as NonDefaultTrainerGender;

    const brutalSpriteKey = brutalTrainerCfg.spriteKey[brutalTrainerGender]!();
    // TODO: Edit the config to match the E4 template from the old version
    encounter.battleConfigs.push({
      battleType: MysteryEncounterMode.TRAINER_BATTLE,
      trainerConfig: allNewTrainerConfigs[brutalTrainerType]!,
      levelBoostMultiplier: 1.5,
    });

    encounter.spriteConfigs = [
      {
        spriteKey: normalSpriteKey,
        fileRoot: "trainer",
        hasShadow: true,
        tint: 1,
      },
      {
        spriteKey: hardSpriteKey,
        fileRoot: "trainer",
        hasShadow: true,
        tint: 1,
      },
      {
        spriteKey: brutalSpriteKey,
        fileRoot: "trainer",
        hasShadow: true,
        tint: 1,
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
          text: `${namespace}:option.selected`,
        },
      ],
    },
    async () => {
      const encounter = globalScene.currentBattle.mysteryEncounter!;
      // Spawn standard trainer battle with memory mushroom reward
      const config = encounter.battleConfigs[0];

      setEncounterRewards({
        guaranteedModifierTypeFuncs: [modifierTypes.TM_COMMON, modifierTypes.TM_GREAT, modifierTypes.MEMORY_MUSHROOM],
        fillRemaining: true,
      });

      // Seed offsets to remove possibility of different trainers having exact same teams
      let initBattlePromise: Promise<void>;
      globalScene.executeWithSeedOffset(() => {
        initBattlePromise = initBattleWithEnemyConfig(config);
      }, globalScene.currentBattle.waveIndex * 10);
      await initBattlePromise!;
    },
  )
  .withSimpleOption(
    {
      buttonLabel: `${namespace}:option.2.label`,
      buttonTooltip: `${namespace}:option.2.tooltip`,
      selected: [
        {
          text: `${namespace}:option.selected`,
        },
      ],
    },
    async () => {
      const encounter = globalScene.currentBattle.mysteryEncounter!;
      // Spawn hard fight
      const config = encounter.battleConfigs[1];

      setEncounterRewards({
        guaranteedModifierTiers: [ModifierTier.ULTRA, ModifierTier.ULTRA, ModifierTier.GREAT, ModifierTier.GREAT],
        fillRemaining: true,
      });

      // Seed offsets to remove possibility of different trainers having exact same teams
      let initBattlePromise: Promise<void>;
      globalScene.executeWithSeedOffset(() => {
        initBattlePromise = initBattleWithEnemyConfig(config);
      }, globalScene.currentBattle.waveIndex * 100);
      await initBattlePromise!;
    },
  )
  .withSimpleOption(
    {
      buttonLabel: `${namespace}:option.3.label`,
      buttonTooltip: `${namespace}:option.3.tooltip`,
      selected: [
        {
          text: `${namespace}:option.selected`,
        },
      ],
    },
    async () => {
      const encounter = globalScene.currentBattle.mysteryEncounter!;
      // Spawn brutal fight
      const config = encounter.battleConfigs[2];

      // To avoid player level snowballing from picking this option
      encounter.expMultiplier = 0.9;

      setEncounterRewards({
        guaranteedModifierTiers: [ModifierTier.EPIC, ModifierTier.EPIC, ModifierTier.ULTRA, ModifierTier.GREAT],
        fillRemaining: true,
      });

      // Seed offsets to remove possibility of different trainers having exact same teams
      let initBattlePromise: Promise<void>;
      globalScene.executeWithSeedOffset(() => {
        initBattlePromise = initBattleWithEnemyConfig(config);
      }, globalScene.currentBattle.waveIndex * 1000);
      await initBattlePromise!;
    },
  )
  .withOutroDialogue([
    {
      text: `${namespace}:outro`,
    },
  ])
  .build();
