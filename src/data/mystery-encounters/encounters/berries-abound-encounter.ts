import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import i18next from "#app/plugins/i18n";
import { CLASSIC_MODE_MYSTERY_ENCOUNTER_WAVES } from "#constants/mystery-encounter-constants";
import { BattlerTagType } from "#enums/battler-tag-type";
import { BerryType } from "#enums/berry-type";
import { ModifierPoolType } from "#enums/modifier-pool-type";
import { MysteryEncounterOptionMode } from "#enums/mystery-encounter-option-mode";
import { MysteryEncounterTier } from "#enums/mystery-encounter-tier";
import { MysteryEncounterType } from "#enums/mystery-encounter-type";
import { type BattleStat, PERMANENT_STATS, Stat } from "#enums/stat";
import { EnemyPokemon } from "#field/enemy-pokemon";
import type { PlayerPokemon } from "#field/player-pokemon";
import type { Pokemon } from "#field/pokemon";
import type { BerryModifier } from "#modifier/modifier";
import {
  type BerryModifierType,
  getPartyLuckValue,
  type ModifierTypeOption,
  regenerateModifierPoolThresholds,
} from "#modifier/modifier-type";
import { modifierTypes } from "#modifier/modifier-types";
import { queueEncounterMessage, showEncounterText } from "#mystery-encounters/encounter-dialogue-utils";
import {
  type EnemyPartyConfig,
  generateModifierType,
  generateModifierTypeOption,
  initBattleWithEnemyConfig,
  leaveEncounterWithoutBattle,
  setEncounterExp,
  setEncounterRewards,
} from "#mystery-encounters/encounter-phase-utils";
import {
  applyModifierTypeToPlayerPokemon,
  getEncounterPokemonLevelForWave,
  getHighestStatPlayerPokemon,
  getSpriteKeysFromPokemon,
  STANDARD_ENCOUNTER_BOOSTED_LEVEL_MODIFIER,
} from "#mystery-encounters/encounter-pokemon-utils";
import { type MysteryEncounter, MysteryEncounterBuilder } from "#mystery-encounters/mystery-encounter";
import { MysteryEncounterOptionBuilder } from "#mystery-encounters/mystery-encounter-option";
import { PokemonData } from "#system/pokemon-data";
import { randSeedInt } from "#utils/random-utils";

/** the i18n namespace for the encounter */
const namespace = "mysteryEncounters/berriesAbound";

/**
 * Berries Abound encounter.
 * @see For biome requirements check {@linkcode mysteryEncountersByBiome}
 */
export const BerriesAboundEncounter: MysteryEncounter = MysteryEncounterBuilder.withEncounterType(
  MysteryEncounterType.BERRIES_ABOUND,
)
  .withEncounterTier(MysteryEncounterTier.COMMON)
  .withSceneWaveRangeRequirement(...CLASSIC_MODE_MYSTERY_ENCOUNTER_WAVES)
  .withCatchAllowed(true)
  .withHideWildIntroMessage(true)
  .withFleeAllowed(false)
  .withIntroSpriteConfigs([]) // Set in onInit()
  .withIntroDialogue([
    {
      text: `${namespace}:intro`,
    },
  ])
  .withOnInit(() => {
    const encounter = globalScene.currentBattle.mysteryEncounter!;
    const { waveIndex } = globalScene.currentBattle;

    // Calculate boss mon
    const level = getEncounterPokemonLevelForWave(STANDARD_ENCOUNTER_BOOSTED_LEVEL_MODIFIER);
    const bossSpecies = globalScene.arena.randomSpecies(
      waveIndex,
      level,
      0,
      getPartyLuckValue(globalScene.getPlayerParty()),
    );
    const bossPokemon = new EnemyPokemon(bossSpecies, level, { boss: true });
    encounter.setDialogueToken("enemyPokemon", getPokemonNameWithAffix(bossPokemon));
    const config: EnemyPartyConfig = {
      pokemonConfigs: [
        {
          level,
          species: bossSpecies,
          dataSource: new PokemonData(bossPokemon),
          isBoss: true,
        },
      ],
    };
    encounter.enemyPartyConfigs = [config];

    // Calculate the number of extra berries that player receives
    // <=40: 2, 41-120: 4, 121-160: 5, 161+: 7
    let numBerries = 2;
    if (waveIndex > 160) {
      numBerries = 7;
    } else if (waveIndex > 120) {
      numBerries = 5;
    } else if (waveIndex > 40) {
      numBerries = 4;
    }
    regenerateModifierPoolThresholds(globalScene.getPlayerParty(), ModifierPoolType.PLAYER, 0);
    encounter.misc = { numBerries };

    const { spriteKey, fileRoot } = getSpriteKeysFromPokemon(bossPokemon);
    encounter.spriteConfigs = [
      {
        spriteKey: "berries_abound_bush",
        fileRoot: "mystery-encounters",
        x: 25,
        y: -6,
        yShadow: -7,
        disableAnimation: true,
        hasShadow: true,
      },
      {
        spriteKey,
        fileRoot,
        hasShadow: true,
        tint: 0.25,
        x: -5,
        repeat: true,
        isPokemon: true,
        isShiny: bossPokemon.shiny,
        variant: bossPokemon.variant,
      },
    ];

    // Get fastest party pokemon for option 2
    const fastestPokemon = getHighestStatPlayerPokemon(PERMANENT_STATS[Stat.SPD], true, false);
    encounter.misc.fastestPokemon = fastestPokemon;
    encounter.misc.enemySpeed = bossPokemon.getStat(Stat.SPD);
    encounter.setDialogueToken("fastestPokemon", fastestPokemon.getNameToRender());

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
      const numBerries = encounter.misc.numBerries;

      const doBerryRewards = () => {
        const berryText = i18next.t(`${namespace}:berries`);

        globalScene.audioManager.playSound("item_fanfare");
        queueEncounterMessage(i18next.t("battle:rewardGainCount", { modifierName: berryText, count: numBerries }));

        // Generate a random berry and give it to the first Pokemon with room for it
        for (let i = 0; i < numBerries; i++) {
          tryGiveBerry();
        }
      };

      const shopOptions: ModifierTypeOption[] = [];
      for (let i = 0; i < 5; i++) {
        // Generate shop berries
        const mod = generateModifierTypeOption(modifierTypes.BERRY);
        if (mod) {
          shopOptions.push(mod);
        }
      }

      setEncounterRewards(
        { guaranteedModifierTypeOptions: shopOptions, fillRemaining: false },
        undefined,
        doBerryRewards,
      );
      await initBattleWithEnemyConfig(globalScene.currentBattle.mysteryEncounter!.enemyPartyConfigs[0]);
    },
  )
  .withOption(
    MysteryEncounterOptionBuilder.newOptionWithMode(MysteryEncounterOptionMode.DEFAULT)
      .withDialogue({
        buttonLabel: `${namespace}:option.2.label`,
        buttonTooltip: `${namespace}:option.2.tooltip`,
      })
      .withOptionPhase(async () => {
        // Pick race for berries
        const encounter = globalScene.currentBattle.mysteryEncounter!;
        const fastestPokemon: PlayerPokemon = encounter.misc.fastestPokemon;
        const enemySpeed: number = encounter.misc.enemySpeed;
        const speedDiff = fastestPokemon.getStat(Stat.SPD) / (enemySpeed * 1.1);
        const numBerries: number = encounter.misc.numBerries;

        const shopOptions: ModifierTypeOption[] = [];
        for (let i = 0; i < 5; i++) {
          // Generate shop berries
          const mod = generateModifierTypeOption(modifierTypes.BERRY);
          if (mod) {
            shopOptions.push(mod);
          }
        }

        if (speedDiff < 1) {
          // Caught and attacked by boss, gets +1 to all stats at start of fight
          const doBerryRewards = () => {
            const berryText = i18next.t(`${namespace}:berries`);

            globalScene.audioManager.playSound("item_fanfare");
            queueEncounterMessage(i18next.t("battle:rewardGainCount", { modifierName: berryText, count: numBerries }));

            // Generate a random berry and give it to the first Pokemon with room for it
            for (let i = 0; i < numBerries; i++) {
              tryGiveBerry();
            }
          };

          // Defense/Spd buffs below wave 50, +1 to all stats otherwise
          const statChangesForBattle: BattleStat[] =
            globalScene.currentBattle.waveIndex < 50
              ? [Stat.DEF, Stat.SPDEF, Stat.SPD]
              : [Stat.ATK, Stat.DEF, Stat.SPATK, Stat.SPDEF, Stat.SPD];

          const config = globalScene.currentBattle.mysteryEncounter!.enemyPartyConfigs[0];
          config.pokemonConfigs![0].tags = [BattlerTagType.MYSTERY_ENCOUNTER_POST_SUMMON];
          config.pokemonConfigs![0].mysteryEncounterBattleEffects = (pokemon: Pokemon) => {
            queueEncounterMessage(`${namespace}:option.2.boss_enraged`);
            globalScene.phaseManager.createAndUnshiftPhase(
              "StatStageChangePhase",
              pokemon.getBattlerIndex(),
              pokemon,
              statChangesForBattle,
              1,
            );
          };
          setEncounterRewards(
            { guaranteedModifierTypeOptions: shopOptions, fillRemaining: false },
            undefined,
            doBerryRewards,
          );
          await showEncounterText(`${namespace}:option.2.selected_bad`);
          await initBattleWithEnemyConfig(config);
          return;
        }
        // Gains 1 berry for every 10% faster the player's pokemon is than the enemy, up to a max of numBerries, minimum of 2
        const numBerriesGrabbed = Math.max(Math.min(Math.round((speedDiff - 1) / 0.08), numBerries), 2);
        encounter.setDialogueToken("numBerries", String(numBerriesGrabbed));
        const doFasterBerryRewards = () => {
          const berryText = i18next.t(`${namespace}:berries`);

          globalScene.audioManager.playSound("item_fanfare");
          queueEncounterMessage(
            i18next.t("battle:rewardGainCount", { modifierName: berryText, count: numBerriesGrabbed }),
          );

          // Generate a random berry and give it to the first Pokemon with room for it (trying to give to fastest first)
          for (let i = 0; i < numBerriesGrabbed; i++) {
            tryGiveBerry(fastestPokemon);
          }
        };

        setEncounterExp(fastestPokemon.id, encounter.enemyPartyConfigs[0].pokemonConfigs![0].species.baseExp);
        setEncounterRewards(
          { guaranteedModifierTypeOptions: shopOptions, fillRemaining: false },
          undefined,
          doFasterBerryRewards,
        );
        await showEncounterText(`${namespace}:option.2.selected`);
        leaveEncounterWithoutBattle();
      })
      .build(),
  )
  .withSimpleOption(
    {
      buttonLabel: `${namespace}:option.3.label`,
      buttonTooltip: `${namespace}:option.3.tooltip`,
      selected: [
        {
          text: `${namespace}:option.3.selected`,
        },
      ],
    },
    async () => {
      // Leave encounter with no rewards or exp
      leaveEncounterWithoutBattle(true);
      return true;
    },
  )
  .build();

function tryGiveBerry(prioritizedPokemon?: PlayerPokemon) {
  const berryType = randSeedInt(Object.keys(BerryType).filter((s) => !Number.isNaN(Number(s))).length) as BerryType;
  const berry = generateModifierType(modifierTypes.BERRY, [berryType]) as BerryModifierType;

  const party = globalScene.getPlayerParty();

  // Will try to apply to prioritized pokemon first, then do normal application method if it fails
  if (prioritizedPokemon) {
    const heldBerriesOfType = globalScene.findModifier(
      (m) => m.isBerryModifier() && m.pokemonId === prioritizedPokemon.id && m.berryType === berryType,
      true,
    ) as BerryModifier;

    if (!heldBerriesOfType || heldBerriesOfType.getStackCount() < heldBerriesOfType.getMaxStackCount()) {
      applyModifierTypeToPlayerPokemon(prioritizedPokemon, berry);
      return;
    }
  }

  // Iterate over the party until berry was successfully given
  for (const pokemon of party) {
    const heldBerriesOfType = globalScene.findModifier(
      (m) => m.isBerryModifier() && m.pokemonId === pokemon.id && m.berryType === berryType,
      true,
    ) as BerryModifier;

    if (!heldBerriesOfType || heldBerriesOfType.getStackCount() < heldBerriesOfType.getMaxStackCount()) {
      applyModifierTypeToPlayerPokemon(pokemon, berry);
      return;
    }
  }
}
