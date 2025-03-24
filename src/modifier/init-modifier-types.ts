import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import {
  BoostBugSpawnModifier,
  BypassSpeedChanceModifier,
  CriticalCatchChanceBoosterModifier,
  DamageMoneyRewardModifier,
  EvolutionStatBoosterModifier,
  EvoTrackerModifier,
  ExpBalanceModifier,
  ExpShareModifier,
  ExtraModifierModifier,
  FlinchChanceModifier,
  GigantamaxAccessModifier,
  HealingBoosterModifier,
  HealShopCostModifier,
  HiddenAbilityRateBoosterModifier,
  HitHealModifier,
  IvScannerModifier,
  LevelIncrementBoosterModifier,
  LockModifierTiersModifier,
  MapModifier,
  MegaEvolutionAccessModifier,
  MoneyInterestModifier,
  MoneyMultiplierModifier,
  MultipleParticipantExpBonusModifier,
  PokemonIncrementingStatModifier,
  PokemonInstantReviveModifier,
  PokemonNatureWeightModifier,
  PreserveBerryModifier,
  ResetNegativeStatStageModifier,
  ShinyRateBoosterModifier,
  SurviveDamageModifier,
  SwitchEffectTransferModifier,
  TempCritBoosterModifier,
  TempExtraModifierModifier,
  TerastallizeAccessModifier,
  TurnHealModifier,
  TurnStatusEffectModifier,
} from "#app/modifier/modifier";
import {
  AddPokeballModifierType,
  AddVoucherModifierType,
  AllPokemonFullReviveModifierType,
  AllPokemonLevelIncrementModifierType,
  AttackTypeBoosterModifierTypeGenerator,
  BaseStatBoosterModifierTypeGenerator,
  BerryModifierType,
  ContactHeldItemTransferChanceModifierType,
  DoubleBattleChanceBoosterModifierType,
  EvolutionItemModifierTypeGenerator,
  ExpBoosterModifierType,
  FormChangeItemModifierTypeGenerator,
  ModifierType,
  ModifierTypeGenerator,
  MoneyRewardModifierType,
  PokemonAllMovePpRestoreModifierType,
  PokemonBaseStatFlatModifierType,
  PokemonBaseStatTotalModifierType,
  PokemonExpBoosterModifierType,
  PokemonFriendshipBoosterModifierType,
  PokemonHeldItemModifierType,
  PokemonHpRestoreModifierType,
  PokemonLevelIncrementModifierType,
  PokemonNatureChangeModifierType,
  PokemonPpRestoreModifierType,
  PokemonPpUpModifierType,
  PokemonReviveModifierType,
  PokemonStatusHealModifierType,
  RememberMoveModifierType,
  SpeciesStatBoosterModifierTypeGenerator,
  TempStatStageBoosterModifierTypeGenerator,
  TerastallizeModifierType,
  TmModifierTypeGenerator,
  TurnHeldItemTransferModifierType,
} from "#app/modifier/modifier-type";
import { modifierTypes } from "./modifier-types";
import { getEnumValues, randSeedInt, randSeedItem } from "#app/utils";
import { BerryType } from "#enums/berry-type";
import { ElementalType } from "#enums/elemental-type";
import { ModifierTier } from "#enums/modifier-tier";
import { Nature } from "#enums/nature";
import { PokeballType } from "#enums/pokeball-type";
import { SpeciesId } from "#enums/species-id";
import { Stat } from "#enums/stat";
import { VoucherType } from "#enums/voucher-type";
import { t } from "i18next";

export function initModifierTypes() {
  modifierTypes.POKEBALL = () => new AddPokeballModifierType("pb", PokeballType.POKEBALL, 5);
  modifierTypes.GREAT_BALL = () => new AddPokeballModifierType("gb", PokeballType.GREAT_BALL, 5);
  modifierTypes.ULTRA_BALL = () => new AddPokeballModifierType("ub", PokeballType.ULTRA_BALL, 5);
  modifierTypes.MASTER_BALL = () => new AddPokeballModifierType("mb", PokeballType.MASTER_BALL, 1);

  modifierTypes.RARE_CANDY = () =>
    new PokemonLevelIncrementModifierType("modifierType:ModifierType.RARE_CANDY", "rare_candy");
  modifierTypes.RARER_CANDY = () =>
    new AllPokemonLevelIncrementModifierType("modifierType:ModifierType.RARER_CANDY", "rarer_candy");

  modifierTypes.EVOLUTION_ITEM = () => new EvolutionItemModifierTypeGenerator(false);
  modifierTypes.RARE_EVOLUTION_ITEM = () => new EvolutionItemModifierTypeGenerator(true);
  modifierTypes.FORM_CHANGE_ITEM = () => new FormChangeItemModifierTypeGenerator(false);
  modifierTypes.RARE_FORM_CHANGE_ITEM = () => new FormChangeItemModifierTypeGenerator(true);

  modifierTypes.EVOLUTION_TRACKER_GIMMIGHOUL = () =>
    new PokemonHeldItemModifierType(
      "modifierType:ModifierType.EVOLUTION_TRACKER_GIMMIGHOUL",
      "relic_gold",
      (type, args) => new EvoTrackerModifier(type, (args[0] as Pokemon).id, SpeciesId.GIMMIGHOUL, 10),
    );

  modifierTypes.MEGA_BRACELET = () =>
    new ModifierType(
      "modifierType:ModifierType.MEGA_BRACELET",
      "mega_bracelet",
      (type, _args) => new MegaEvolutionAccessModifier(type),
    );
  modifierTypes.DYNAMAX_BAND = () =>
    new ModifierType(
      "modifierType:ModifierType.DYNAMAX_BAND",
      "dynamax_band",
      (type, _args) => new GigantamaxAccessModifier(type),
    );
  modifierTypes.TERA_ORB = () =>
    new ModifierType(
      "modifierType:ModifierType.TERA_ORB",
      "tera_orb",
      (type, _args) => new TerastallizeAccessModifier(type),
    );

  modifierTypes.MAP = () =>
    new ModifierType("modifierType:ModifierType.MAP", "map", (type, _args) => new MapModifier(type));

  modifierTypes.POTION = () => new PokemonHpRestoreModifierType("modifierType:ModifierType.POTION", "potion", 20, 10);
  modifierTypes.SUPER_POTION = () =>
    new PokemonHpRestoreModifierType("modifierType:ModifierType.SUPER_POTION", "super_potion", 50, 25);
  modifierTypes.HYPER_POTION = () =>
    new PokemonHpRestoreModifierType("modifierType:ModifierType.HYPER_POTION", "hyper_potion", 200, 50);
  modifierTypes.MAX_POTION = () =>
    new PokemonHpRestoreModifierType("modifierType:ModifierType.MAX_POTION", "max_potion", 0, 100);
  modifierTypes.FULL_RESTORE = () =>
    new PokemonHpRestoreModifierType("modifierType:ModifierType.FULL_RESTORE", "full_restore", 0, 100, true);

  modifierTypes.REVIVE = () => new PokemonReviveModifierType("modifierType:ModifierType.REVIVE", "revive", 50);
  modifierTypes.MAX_REVIVE = () =>
    new PokemonReviveModifierType("modifierType:ModifierType.MAX_REVIVE", "max_revive", 100);

  modifierTypes.FULL_HEAL = () => new PokemonStatusHealModifierType("modifierType:ModifierType.FULL_HEAL", "full_heal");

  modifierTypes.SACRED_ASH = () =>
    new AllPokemonFullReviveModifierType("modifierType:ModifierType.SACRED_ASH", "sacred_ash");

  modifierTypes.REVIVER_SEED = () =>
    new PokemonHeldItemModifierType(
      "modifierType:ModifierType.REVIVER_SEED",
      "reviver_seed",
      (type, args) => new PokemonInstantReviveModifier(type, (args[0] as Pokemon).id),
    );
  modifierTypes.WHITE_HERB = () =>
    new PokemonHeldItemModifierType(
      "modifierType:ModifierType.WHITE_HERB",
      "white_herb",
      (type, args) => new ResetNegativeStatStageModifier(type, (args[0] as Pokemon).id),
    );

  modifierTypes.ETHER = () => new PokemonPpRestoreModifierType("modifierType:ModifierType.ETHER", "ether", 10);
  modifierTypes.MAX_ETHER = () =>
    new PokemonPpRestoreModifierType("modifierType:ModifierType.MAX_ETHER", "max_ether", -1);

  modifierTypes.ELIXIR = () =>
    new PokemonAllMovePpRestoreModifierType("modifierType:ModifierType.ELIXIR", "elixir", 10);
  modifierTypes.MAX_ELIXIR = () =>
    new PokemonAllMovePpRestoreModifierType("modifierType:ModifierType.MAX_ELIXIR", "max_elixir", -1);

  modifierTypes.PP_UP = () => new PokemonPpUpModifierType("modifierType:ModifierType.PP_UP", "pp_up", 1);
  modifierTypes.PP_MAX = () => new PokemonPpUpModifierType("modifierType:ModifierType.PP_MAX", "pp_max", 3);

  /*modifierTypes.REPEL = () => new DoubleBattleChanceBoosterModifierType('Repel', 5);
  modifierTypes.SUPER_REPEL = () => new DoubleBattleChanceBoosterModifierType('Super Repel', 10);
  modifierTypes.MAX_REPEL = () => new DoubleBattleChanceBoosterModifierType('Max Repel', 25);*/

  modifierTypes.LURE = () => new DoubleBattleChanceBoosterModifierType("modifierType:ModifierType.LURE", "lure", 10);
  modifierTypes.SUPER_LURE = () =>
    new DoubleBattleChanceBoosterModifierType("modifierType:ModifierType.SUPER_LURE", "super_lure", 15);
  modifierTypes.MAX_LURE = () =>
    new DoubleBattleChanceBoosterModifierType("modifierType:ModifierType.MAX_LURE", "max_lure", 30);

  modifierTypes.SPECIES_STAT_BOOSTER = () => new SpeciesStatBoosterModifierTypeGenerator();

  modifierTypes.TEMP_STAT_STAGE_BOOSTER = () => new TempStatStageBoosterModifierTypeGenerator();

  modifierTypes.DIRE_HIT = () =>
    new (class extends ModifierType {
      override getDescription(): string {
        return t("modifierType:ModifierType.TempStatStageBoosterModifierType.description", {
          stat: t("modifierType:ModifierType.DIRE_HIT.extra.raises"),
          amount: t("modifierType:ModifierType.TempStatStageBoosterModifierType.extra.stage"),
        });
      }
    })("modifierType:ModifierType.DIRE_HIT", "dire_hit", (type, _args) => new TempCritBoosterModifier(type, 5));

  modifierTypes.BASE_STAT_BOOSTER = () => new BaseStatBoosterModifierTypeGenerator();

  modifierTypes.ATTACK_TYPE_BOOSTER = () => new AttackTypeBoosterModifierTypeGenerator();

  modifierTypes.MINT = () =>
    new ModifierTypeGenerator((_party: Pokemon[], pregenArgs?: any[]) => {
      if (pregenArgs && pregenArgs.length === 1 && pregenArgs[0] in Nature) {
        return new PokemonNatureChangeModifierType(pregenArgs[0] as Nature);
      }
      return new PokemonNatureChangeModifierType(randSeedInt(getEnumValues(Nature).length) as Nature);
    });

  modifierTypes.TERA_SHARD = () =>
    new ModifierTypeGenerator((party: Pokemon[], pregenArgs?: any[]) => {
      if (pregenArgs && pregenArgs.length === 1 && pregenArgs[0] in ElementalType) {
        return new TerastallizeModifierType(pregenArgs[0] as ElementalType);
      }
      if (!globalScene.getModifiers(TerastallizeAccessModifier).length) {
        return null;
      }
      let type: ElementalType;
      if (!randSeedInt(3)) {
        const partyMemberTypes = party.map((p) => p.getTypes(false, false, true)).flat();
        type = randSeedItem(partyMemberTypes);
      } else {
        type = randSeedInt(64) ? (randSeedInt(18) as ElementalType) : ElementalType.STELLAR;
      }
      return new TerastallizeModifierType(type);
    });

  modifierTypes.BERRY = () =>
    new ModifierTypeGenerator((_party: Pokemon[], pregenArgs?: any[]) => {
      if (pregenArgs && pregenArgs.length === 1 && pregenArgs[0] in BerryType) {
        return new BerryModifierType(pregenArgs[0] as BerryType);
      }
      const berryTypes = getEnumValues(BerryType);
      let randBerryType: BerryType;
      const rand = randSeedInt(12);
      if (rand < 2) {
        randBerryType = BerryType.SITRUS;
      } else if (rand < 4) {
        randBerryType = BerryType.LUM;
      } else if (rand < 6) {
        randBerryType = BerryType.LEPPA;
      } else {
        randBerryType = berryTypes[randSeedInt(berryTypes.length - 3) + 2];
      }
      return new BerryModifierType(randBerryType);
    });

  modifierTypes.TM_COMMON = () => new TmModifierTypeGenerator(ModifierTier.COMMON);
  modifierTypes.TM_GREAT = () => new TmModifierTypeGenerator(ModifierTier.GREAT);
  modifierTypes.TM_ULTRA = () => new TmModifierTypeGenerator(ModifierTier.ULTRA);

  modifierTypes.MEMORY_MUSHROOM = () =>
    new RememberMoveModifierType("modifierType:ModifierType.MEMORY_MUSHROOM", "big_mushroom");

  modifierTypes.EXP_SHARE = () =>
    new ModifierType("modifierType:ModifierType.EXP_SHARE", "exp_share", (type, _args) => new ExpShareModifier(type));
  modifierTypes.EXP_BALANCE = () =>
    new ModifierType(
      "modifierType:ModifierType.EXP_BALANCE",
      "exp_balance",
      (type, _args) => new ExpBalanceModifier(type),
    );

  modifierTypes.OVAL_CHARM = () =>
    new ModifierType(
      "modifierType:ModifierType.OVAL_CHARM",
      "oval_charm",
      (type, _args) => new MultipleParticipantExpBonusModifier(type),
    );

  modifierTypes.EXP_CHARM = () => new ExpBoosterModifierType("modifierType:ModifierType.EXP_CHARM", "exp_charm", 25);
  modifierTypes.SUPER_EXP_CHARM = () =>
    new ExpBoosterModifierType("modifierType:ModifierType.SUPER_EXP_CHARM", "super_exp_charm", 60);
  modifierTypes.GOLDEN_EXP_CHARM = () =>
    new ExpBoosterModifierType("modifierType:ModifierType.GOLDEN_EXP_CHARM", "golden_exp_charm", 100);

  modifierTypes.LUCKY_EGG = () =>
    new PokemonExpBoosterModifierType("modifierType:ModifierType.LUCKY_EGG", "lucky_egg", 40);
  modifierTypes.GOLDEN_EGG = () =>
    new PokemonExpBoosterModifierType("modifierType:ModifierType.GOLDEN_EGG", "golden_egg", 100);

  modifierTypes.SOOTHE_BELL = () =>
    new PokemonFriendshipBoosterModifierType("modifierType:ModifierType.SOOTHE_BELL", "soothe_bell");

  modifierTypes.EVIOLITE = () =>
    new PokemonHeldItemModifierType(
      "modifierType:ModifierType.EVIOLITE",
      "eviolite",
      (type, args) => new EvolutionStatBoosterModifier(type, (args[0] as Pokemon).id, [Stat.DEF, Stat.SPDEF], 1.5),
    );

  modifierTypes.SOUL_DEW = () =>
    new PokemonHeldItemModifierType(
      "modifierType:ModifierType.SOUL_DEW",
      "soul_dew",
      (type, args) => new PokemonNatureWeightModifier(type, (args[0] as Pokemon).id),
    );

  modifierTypes.NUGGET = () =>
    new MoneyRewardModifierType(
      "modifierType:ModifierType.NUGGET",
      "nugget",
      1,
      "modifierType:ModifierType.MoneyRewardModifierType.extra.small",
    );
  modifierTypes.BIG_NUGGET = () =>
    new MoneyRewardModifierType(
      "modifierType:ModifierType.BIG_NUGGET",
      "big_nugget",
      2.5,
      "modifierType:ModifierType.MoneyRewardModifierType.extra.moderate",
    );
  modifierTypes.RELIC_GOLD = () =>
    new MoneyRewardModifierType(
      "modifierType:ModifierType.RELIC_GOLD",
      "relic_gold",
      10,
      "modifierType:ModifierType.MoneyRewardModifierType.extra.large",
    );

  modifierTypes.AMULET_COIN = () =>
    new ModifierType(
      "modifierType:ModifierType.AMULET_COIN",
      "amulet_coin",
      (type, _args) => new MoneyMultiplierModifier(type),
    );
  modifierTypes.GOLDEN_PUNCH = () =>
    new PokemonHeldItemModifierType(
      "modifierType:ModifierType.GOLDEN_PUNCH",
      "golden_punch",
      (type, args) => new DamageMoneyRewardModifier(type, (args[0] as Pokemon).id),
    );
  modifierTypes.COIN_CASE = () =>
    new ModifierType(
      "modifierType:ModifierType.COIN_CASE",
      "coin_case",
      (type, _args) => new MoneyInterestModifier(type),
    );

  modifierTypes.LOCK_CAPSULE = () =>
    new ModifierType(
      "modifierType:ModifierType.LOCK_CAPSULE",
      "lock_capsule",
      (type, _args) => new LockModifierTiersModifier(type),
    );

  modifierTypes.GRIP_CLAW = () =>
    new ContactHeldItemTransferChanceModifierType("modifierType:ModifierType.GRIP_CLAW", "grip_claw", 10);

  modifierTypes.HEALING_CHARM = () =>
    new ModifierType(
      "modifierType:ModifierType.HEALING_CHARM",
      "healing_charm",
      (type, _args) => new HealingBoosterModifier(type, 1.1),
    );
  modifierTypes.CANDY_JAR = () =>
    new ModifierType(
      "modifierType:ModifierType.CANDY_JAR",
      "candy_jar",
      (type, _args) => new LevelIncrementBoosterModifier(type),
    );

  modifierTypes.BERRY_POUCH = () =>
    new ModifierType(
      "modifierType:ModifierType.BERRY_POUCH",
      "berry_pouch",
      (type, _args) => new PreserveBerryModifier(type),
    );

  modifierTypes.FOCUS_BAND = () =>
    new PokemonHeldItemModifierType(
      "modifierType:ModifierType.FOCUS_BAND",
      "focus_band",
      (type, args) => new SurviveDamageModifier(type, (args[0] as Pokemon).id),
    );

  modifierTypes.QUICK_CLAW = () =>
    new PokemonHeldItemModifierType(
      "modifierType:ModifierType.QUICK_CLAW",
      "quick_claw",
      (type, args) => new BypassSpeedChanceModifier(type, (args[0] as Pokemon).id),
    );

  modifierTypes.KINGS_ROCK = () =>
    new PokemonHeldItemModifierType(
      "modifierType:ModifierType.KINGS_ROCK",
      "kings_rock",
      (type, args) => new FlinchChanceModifier(type, (args[0] as Pokemon).id),
    );

  modifierTypes.LEFTOVERS = () =>
    new PokemonHeldItemModifierType(
      "modifierType:ModifierType.LEFTOVERS",
      "leftovers",
      (type, args) => new TurnHealModifier(type, (args[0] as Pokemon).id),
    );
  modifierTypes.SHELL_BELL = () =>
    new PokemonHeldItemModifierType(
      "modifierType:ModifierType.SHELL_BELL",
      "shell_bell",
      (type, args) => new HitHealModifier(type, (args[0] as Pokemon).id),
    );

  modifierTypes.TOXIC_ORB = () =>
    new PokemonHeldItemModifierType(
      "modifierType:ModifierType.TOXIC_ORB",
      "toxic_orb",
      (type, args) => new TurnStatusEffectModifier(type, (args[0] as Pokemon).id),
    );
  modifierTypes.FLAME_ORB = () =>
    new PokemonHeldItemModifierType(
      "modifierType:ModifierType.FLAME_ORB",
      "flame_orb",
      (type, args) => new TurnStatusEffectModifier(type, (args[0] as Pokemon).id),
    );

  modifierTypes.BATON = () =>
    new PokemonHeldItemModifierType(
      "modifierType:ModifierType.BATON",
      "baton",
      (type, args) => new SwitchEffectTransferModifier(type, (args[0] as Pokemon).id),
    );

  modifierTypes.SHINY_CHARM = () =>
    new ModifierType(
      "modifierType:ModifierType.SHINY_CHARM",
      "shiny_charm",
      (type, _args) => new ShinyRateBoosterModifier(type),
    );
  modifierTypes.ABILITY_CHARM = () =>
    new ModifierType(
      "modifierType:ModifierType.ABILITY_CHARM",
      "ability_charm",
      (type, _args) => new HiddenAbilityRateBoosterModifier(type),
    );
  modifierTypes.CATCHING_CHARM = () =>
    new ModifierType(
      "modifierType:ModifierType.CATCHING_CHARM",
      "catching_charm",
      (type, _args) => new CriticalCatchChanceBoosterModifier(type),
    );

  modifierTypes.IV_SCANNER = () =>
    new ModifierType("modifierType:ModifierType.IV_SCANNER", "scanner", (type, _args) => new IvScannerModifier(type));

  modifierTypes.MINI_BLACK_HOLE = () =>
    new TurnHeldItemTransferModifierType("modifierType:ModifierType.MINI_BLACK_HOLE", "mini_black_hole");

  modifierTypes.VOUCHER = () => new AddVoucherModifierType(VoucherType.REGULAR, 1);
  modifierTypes.VOUCHER_PLUS = () => new AddVoucherModifierType(VoucherType.PLUS, 1);
  modifierTypes.VOUCHER_PREMIUM = () => new AddVoucherModifierType(VoucherType.PREMIUM, 1);

  modifierTypes.GOLDEN_POKEBALL = () =>
    new ModifierType(
      "modifierType:ModifierType.GOLDEN_POKEBALL",
      "pb_gold",
      (type, _args) => new ExtraModifierModifier(type),
      undefined,
      "se/pb_bounce_1",
    );
  modifierTypes.SILVER_POKEBALL = () =>
    new ModifierType(
      "modifierType:ModifierType.SILVER_POKEBALL",
      "pb_silver",
      (type, _args) => new TempExtraModifierModifier(type, 100),
      undefined,
      "se/pb_bounce_1",
    );

  modifierTypes.MYSTERY_ENCOUNTER_SHUCKLE_JUICE = () =>
    new ModifierTypeGenerator((_party: Pokemon[], pregenArgs?: any[]) => {
      if (pregenArgs) {
        return new PokemonBaseStatTotalModifierType(pregenArgs[0] as number);
      }
      return new PokemonBaseStatTotalModifierType(randSeedInt(20, 1));
    });
  modifierTypes.MYSTERY_ENCOUNTER_OLD_GATEAU = () =>
    new ModifierTypeGenerator((_party: Pokemon[], pregenArgs?: any[]) => {
      if (pregenArgs) {
        return new PokemonBaseStatFlatModifierType(pregenArgs[0] as number, pregenArgs[1] as Stat[]);
      }
      return new PokemonBaseStatFlatModifierType(randSeedInt(20, 1), [Stat.HP, Stat.ATK, Stat.DEF]);
    });
  modifierTypes.MYSTERY_ENCOUNTER_BLACK_SLUDGE = () =>
    new ModifierTypeGenerator((_party: Pokemon[], pregenArgs?: any[]) => {
      if (pregenArgs) {
        return new ModifierType(
          "modifierType:ModifierType.MYSTERY_ENCOUNTER_BLACK_SLUDGE",
          "black_sludge",
          (type, _args) => new HealShopCostModifier(type, pregenArgs[0] as number),
        );
      }
      return new ModifierType(
        "modifierType:ModifierType.MYSTERY_ENCOUNTER_BLACK_SLUDGE",
        "black_sludge",
        (type, _args) => new HealShopCostModifier(type, 2.5),
      );
    });
  modifierTypes.MYSTERY_ENCOUNTER_MACHO_BRACE = () =>
    new PokemonHeldItemModifierType(
      "modifierType:ModifierType.MYSTERY_ENCOUNTER_MACHO_BRACE",
      "macho_brace",
      (type, args) => new PokemonIncrementingStatModifier(type, (args[0] as Pokemon).id),
    );
  modifierTypes.MYSTERY_ENCOUNTER_GOLDEN_BUG_NET = () =>
    new ModifierType(
      "modifierType:ModifierType.MYSTERY_ENCOUNTER_GOLDEN_BUG_NET",
      "golden_net",
      (type, _args) => new BoostBugSpawnModifier(type),
    );
}
