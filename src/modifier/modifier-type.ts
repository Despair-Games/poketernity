import type { PokemonMoveSelectFilter } from "#app/@types/PokemonMoveSelectFilter";
import type { PokemonSelectFilter } from "#app/@types/PokemonSelectFilter";
import { PARTY_UI_NO_EFFECT_MSG_i18N_KEY } from "#app/constants";
import { allMoves } from "#app/data/data-lists";
import { pokemonEvolutions } from "#app/data/balance/pokemon-evolutions/init-pokemon-evolutions";
import { tmPoolTiers, tmSpecies } from "#app/data/balance/tms";
import { getNatureName, getNatureStatMultiplier } from "#app/data/nature";
import { getPokeballCatchMultiplier, getPokeballName } from "#app/data/pokeball";
import { pokemonFormChanges, SpeciesFormChangeCondition } from "#app/data/pokemon-forms";
import { SpeciesFormChangeItemTrigger } from "#app/data/species-form-change-triggers/species-form-change-item-trigger";
import type { EnemyPokemon, PlayerPokemon, Pokemon } from "#app/field/pokemon";
import type { PokemonMove } from "#app/field/pokemon-move";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import {
  AddPokeballModifier,
  AddVoucherModifier,
  AttackTypeBoosterModifier,
  BaseStatModifier,
  BerryModifier,
  ContactHeldItemTransferChanceModifier,
  DoubleBattleChanceBoosterModifier,
  EvolutionItemModifier,
  ExpBoosterModifier,
  GigantamaxAccessModifier,
  LevelIncrementBoosterModifier,
  MegaEvolutionAccessModifier,
  MoneyMultiplierModifier,
  MoneyRewardModifier,
  PokemonAllMovePpRestoreModifier,
  PokemonBaseStatFlatModifier,
  PokemonBaseStatTotalModifier,
  PokemonExpBoosterModifier,
  PokemonFormChangeItemModifier,
  PokemonFriendshipBoosterModifier,
  PokemonHpRestoreModifier,
  PokemonLevelIncrementModifier,
  PokemonNatureChangeModifier,
  PokemonPpRestoreModifier,
  PokemonPpUpModifier,
  PokemonStatusHealModifier,
  RememberMoveModifier,
  SpeciesStatBoosterModifier,
  TempStatStageBoosterModifier,
  TerastallizeModifier,
  TmModifier,
  TurnHeldItemTransferModifier,
  type Modifier,
  type PokemonHeldItemModifier,
} from "#app/modifier/modifier";
import { modifierPool } from "#app/modifier/modifier-pools";
import { modifierTypes } from "#app/modifier/modifier-types";
import Overrides from "#app/overrides";
import { settings } from "#app/system/settings/settings-manager";
import { getVoucherTypeIcon, getVoucherTypeName } from "#app/system/voucher";
import { getModifierTierTextTint } from "#app/ui/text";
import {
  formatMoney,
  getEnumKeys,
  getEnumValues,
  isNullOrUndefined,
  leftPad,
  NumberHolder,
  randSeedInt,
} from "#app/utils";
import { getBerryEffectDescription, getBerryName } from "#app/utils/berry-utils";
import { getModifierPoolForType } from "#app/utils/modifier-pool-utils";
import { getModifierType } from "#app/utils/modifier-type-utils";
import { BattlerTagType } from "#enums/battler-tag-type";
import { BerryType } from "#enums/berry-type";
import { ElementalType } from "#enums/elemental-type";
import { EvolutionItem } from "#enums/evolution-item";
import { FormChangeItem } from "#enums/form-change-item";
import { ModifierPoolType } from "#enums/modifier-pool-type";
import { ModifierTier } from "#enums/modifier-tier";
import { MoveId } from "#enums/move-id";
import { type Nature } from "#enums/nature";
import { type PokeballType } from "#enums/pokeball";
import { Species } from "#enums/species";
import { SpeciesFormKey } from "#enums/species-form-key";
import type { PermanentStat, TempBattleStat } from "#enums/stat";
import { getStatKey, Stat, TEMP_BATTLE_STATS } from "#enums/stat";
import { type VoucherType } from "#enums/voucher-type";
import i18next from "i18next";

const outputModifierData = false;
const useMaxWeightForOutput = false;

type NewModifierFunc = (type: ModifierType, args: any[]) => Modifier;

export class ModifierType {
  public id: string;
  public localeKey: string;
  public iconImage: string;
  public group: string;
  public soundName: string;
  public tier: ModifierTier;
  protected newModifierFunc: NewModifierFunc | null;

  constructor(
    localeKey: string | null,
    iconImage: string | null,
    newModifierFunc: NewModifierFunc | null,
    group?: string,
    soundName?: string,
  ) {
    this.localeKey = localeKey!; // TODO: is this bang correct?
    this.iconImage = iconImage!; // TODO: is this bang correct?
    this.group = group!; // TODO: is this bang correct?
    this.soundName = soundName ?? "se/restore";
    this.newModifierFunc = newModifierFunc;
  }

  get name(): string {
    return i18next.t(`${this.localeKey}.name` as any);
  }

  getDescription(): string {
    return i18next.t(`${this.localeKey}.description` as any);
  }

  setTier(tier: ModifierTier): void {
    this.tier = tier;
  }

  getOrInferTier(poolType: ModifierPoolType = ModifierPoolType.PLAYER): ModifierTier | null {
    if (this.tier) {
      return this.tier;
    }
    if (!this.id) {
      return null;
    }
    let poolTypes: ModifierPoolType[];
    switch (poolType) {
      case ModifierPoolType.PLAYER:
        poolTypes = [poolType, ModifierPoolType.TRAINER, ModifierPoolType.WILD];
        break;
      case ModifierPoolType.WILD:
        poolTypes = [poolType, ModifierPoolType.PLAYER, ModifierPoolType.TRAINER];
        break;
      case ModifierPoolType.TRAINER:
        poolTypes = [poolType, ModifierPoolType.PLAYER, ModifierPoolType.WILD];
        break;
      default:
        poolTypes = [poolType];
        break;
    }
    // Try multiple pool types in case of stolen items
    for (const type of poolTypes) {
      const pool = getModifierPoolForType(type);
      for (const tier of getEnumValues(ModifierTier)) {
        if (!pool.hasOwnProperty(tier)) {
          continue;
        }
        if (pool[tier].find((m) => (m as WeightedModifierType).modifierType.id === this.id)) {
          return (this.tier = tier);
        }
      }
    }
    return null;
  }

  /**
   * Populates item id for ModifierType instance
   * @param func
   */
  withIdFromFunc(func: ModifierTypeFunc): ModifierType {
    this.id = Object.keys(modifierTypes).find((k) => modifierTypes[k] === func)!; // TODO: is this bang correct?
    return this;
  }

  /**
   * Populates item tier for ModifierType instance
   * Tier is a necessary field for items that appear in player shop (determines the Pokeball visual they use)
   * To find the tier, this function performs a reverse lookup of the item type in modifier pools
   * It checks the weight of the item and will use the first tier for which the weight is greater than 0
   * This is to allow items to be in multiple item pools depending on the conditions, for example for events
   * If all tiers have a weight of 0 for the item, the first tier where the item was found is used
   * @param poolType Default 'ModifierPoolType.PLAYER'. Which pool to lookup item tier from
   * @param party optional. Needed to check the weight of modifiers with conditional weight (see {@linkcode WeightedModifierTypeWeightFunc})
   *  if not provided or empty, the weight check will be ignored
   * @param rerollCount Default `0`. Used to check the weight of modifiers with conditional weight (see {@linkcode WeightedModifierTypeWeightFunc})
   */
  withTierFromPool(
    poolType: ModifierPoolType = ModifierPoolType.PLAYER,
    party?: PlayerPokemon[],
    rerollCount: number = 0,
  ): ModifierType {
    let defaultTier: undefined | ModifierTier;
    for (const tier of Object.values(getModifierPoolForType(poolType))) {
      for (const modifier of tier) {
        if (this.id === modifier.modifierType.id) {
          let weight: number;
          if (modifier.weight instanceof Function) {
            weight = party ? modifier.weight(party, rerollCount) : 0;
          } else {
            weight = modifier.weight;
          }
          if (weight > 0) {
            this.tier = modifier.modifierType.tier;
            return this;
          } else if (isNullOrUndefined(defaultTier)) {
            // If weight is 0, keep track of the first tier where the item was found
            defaultTier = modifier.modifierType.tier;
          }
        }
      }
    }

    // Didn't find a pool with weight > 0, fallback to first tier where the item was found, if any
    if (defaultTier) {
      this.tier = defaultTier;
    }

    return this;
  }

  newModifier(...args: any[]): Modifier | null {
    return this.newModifierFunc && this.newModifierFunc(this, args);
  }

  isPokemonHeldItemModifierType(): this is PokemonHeldItemModifierType {
    return false;
  }

  isModifierTypeGenerator(): this is ModifierTypeGenerator {
    return false;
  }
}

type ModifierTypeGeneratorFunc = (party: Pokemon[], pregenArgs?: any[]) => ModifierType | null;

export class ModifierTypeGenerator extends ModifierType {
  private genTypeFunc: ModifierTypeGeneratorFunc;

  constructor(genTypeFunc: ModifierTypeGeneratorFunc) {
    super(null, null, null);
    this.genTypeFunc = genTypeFunc;
  }

  generateType(party: Pokemon[], pregenArgs?: any[]) {
    const ret = this.genTypeFunc(party, pregenArgs);
    if (ret) {
      ret.id = this.id;
      ret.setTier(this.tier);
    }
    return ret;
  }

  override isModifierTypeGenerator(): this is this {
    return true;
  }
}

export interface GeneratedPersistentModifierType {
  getPregenArgs(): any[];
}

export class AddPokeballModifierType extends ModifierType {
  private pokeballType: PokeballType;
  private count: number;

  constructor(iconImage: string, pokeballType: PokeballType, count: number) {
    super("", iconImage, (_type, _args) => new AddPokeballModifier(this, pokeballType, count), "pb", "se/pb_bounce_1");
    this.pokeballType = pokeballType;
    this.count = count;
  }

  override get name(): string {
    return i18next.t("modifierType:ModifierType.AddPokeballModifierType.name", {
      modifierCount: this.count,
      pokeballName: getPokeballName(this.pokeballType),
    });
  }

  override getDescription(): string {
    return i18next.t("modifierType:ModifierType.AddPokeballModifierType.description", {
      modifierCount: this.count,
      pokeballName: getPokeballName(this.pokeballType),
      catchRate:
        getPokeballCatchMultiplier(this.pokeballType) > -1
          ? `${getPokeballCatchMultiplier(this.pokeballType)}x`
          : "100%",
      pokeballAmount: `${globalScene.pokeballCounts[this.pokeballType]}`,
    });
  }
}

export class AddVoucherModifierType extends ModifierType {
  private voucherType: VoucherType;
  private count: number;

  constructor(voucherType: VoucherType, count: number) {
    super(
      "",
      getVoucherTypeIcon(voucherType),
      (_type, _args) => new AddVoucherModifier(this, voucherType, count),
      "voucher",
    );
    this.count = count;
    this.voucherType = voucherType;
  }

  override get name(): string {
    return i18next.t("modifierType:ModifierType.AddVoucherModifierType.name", {
      modifierCount: this.count,
      voucherTypeName: getVoucherTypeName(this.voucherType),
    });
  }

  override getDescription(): string {
    return i18next.t("modifierType:ModifierType.AddVoucherModifierType.description", {
      modifierCount: this.count,
      voucherTypeName: getVoucherTypeName(this.voucherType),
    });
  }
}

export class PokemonModifierType extends ModifierType {
  public selectFilter: PokemonSelectFilter | undefined;

  constructor(
    localeKey: string,
    iconImage: string,
    newModifierFunc: NewModifierFunc,
    selectFilter?: PokemonSelectFilter,
    group?: string,
    soundName?: string,
  ) {
    super(localeKey, iconImage, newModifierFunc, group, soundName);

    this.selectFilter = selectFilter;
  }
}

export class PokemonHeldItemModifierType extends PokemonModifierType {
  constructor(
    localeKey: string,
    iconImage: string,
    newModifierFunc: NewModifierFunc,
    group?: string,
    soundName?: string,
  ) {
    super(
      localeKey,
      iconImage,
      newModifierFunc,
      (pokemon: PlayerPokemon) => {
        const dummyModifier = this.newModifier(pokemon);
        const matchingModifier = globalScene.findModifier(
          (m) => m.isPokemonHeldItemModifier() && m.pokemonId === pokemon.id && m.matchType(dummyModifier),
        ) as PokemonHeldItemModifier;
        const maxStackCount = dummyModifier.getMaxStackCount();
        if (!maxStackCount) {
          return i18next.t("modifierType:ModifierType.PokemonHeldItemModifierType.extra.inoperable", {
            pokemonName: getPokemonNameWithAffix(pokemon),
          });
        }
        if (matchingModifier && matchingModifier.stackCount === maxStackCount) {
          return i18next.t("modifierType:ModifierType.PokemonHeldItemModifierType.extra.tooMany", {
            pokemonName: getPokemonNameWithAffix(pokemon),
          });
        }
        return null;
      },
      group,
      soundName,
    );
  }

  override newModifier(...args: any[]): PokemonHeldItemModifier {
    return super.newModifier(...args) as PokemonHeldItemModifier;
  }

  override isPokemonHeldItemModifierType(): this is this {
    return true;
  }
}

export class PokemonHpRestoreModifierType extends PokemonModifierType {
  protected restorePoints: number;
  protected restorePercent: number;
  protected healStatus: boolean;

  constructor(
    localeKey: string,
    iconImage: string,
    restorePoints: number,
    restorePercent: number,
    healStatus: boolean = false,
    newModifierFunc?: NewModifierFunc,
    selectFilter?: PokemonSelectFilter,
    group?: string,
  ) {
    super(
      localeKey,
      iconImage,
      newModifierFunc
        || ((_type, args) =>
          new PokemonHpRestoreModifier(
            this,
            (args[0] as PlayerPokemon).id,
            this.restorePoints,
            this.restorePercent,
            this.healStatus,
            false,
          )),
      selectFilter
        || ((pokemon: PlayerPokemon) => {
          if (
            !pokemon.hp
            || (pokemon.isFullHp()
              && (!this.healStatus || (!pokemon.status && !pokemon.getTag(BattlerTagType.CONFUSED))))
          ) {
            return i18next.t(PARTY_UI_NO_EFFECT_MSG_i18N_KEY);
          }
          return null;
        }),
      group || "potion",
    );

    this.restorePoints = restorePoints;
    this.restorePercent = restorePercent;
    this.healStatus = healStatus;
  }

  override getDescription(): string {
    return this.restorePoints
      ? i18next.t("modifierType:ModifierType.PokemonHpRestoreModifierType.description", {
          restorePoints: this.restorePoints,
          restorePercent: this.restorePercent,
        })
      : this.healStatus
        ? i18next.t("modifierType:ModifierType.PokemonHpRestoreModifierType.extra.fullyWithStatus")
        : i18next.t("modifierType:ModifierType.PokemonHpRestoreModifierType.extra.fully");
  }
}

export class PokemonReviveModifierType extends PokemonHpRestoreModifierType {
  constructor(localeKey: string, iconImage: string, restorePercent: number) {
    super(
      localeKey,
      iconImage,
      0,
      restorePercent,
      false,
      (_type, args) =>
        new PokemonHpRestoreModifier(this, (args[0] as PlayerPokemon).id, 0, this.restorePercent, false, true),
      (pokemon: PlayerPokemon) => {
        if (!pokemon.isFainted()) {
          return i18next.t(PARTY_UI_NO_EFFECT_MSG_i18N_KEY);
        }
        return null;
      },
      "revive",
    );

    this.selectFilter = (pokemon: PlayerPokemon) => {
      if (pokemon.hp) {
        return i18next.t(PARTY_UI_NO_EFFECT_MSG_i18N_KEY);
      }
      return null;
    };
  }

  override getDescription(): string {
    return i18next.t("modifierType:ModifierType.PokemonReviveModifierType.description", {
      restorePercent: this.restorePercent,
    });
  }
}

export class PokemonStatusHealModifierType extends PokemonModifierType {
  constructor(localeKey: string, iconImage: string) {
    super(
      localeKey,
      iconImage,
      (_type, args) => new PokemonStatusHealModifier(this, (args[0] as PlayerPokemon).id),
      (pokemon: PlayerPokemon) => {
        if (!pokemon.hp || (!pokemon.status && !pokemon.getTag(BattlerTagType.CONFUSED))) {
          return i18next.t(PARTY_UI_NO_EFFECT_MSG_i18N_KEY);
        }
        return null;
      },
    );
  }

  override getDescription(): string {
    return i18next.t("modifierType:ModifierType.PokemonStatusHealModifierType.description");
  }
}

export abstract class PokemonMoveModifierType extends PokemonModifierType {
  public moveSelectFilter: PokemonMoveSelectFilter | undefined;

  constructor(
    localeKey: string,
    iconImage: string,
    newModifierFunc: NewModifierFunc,
    selectFilter?: PokemonSelectFilter,
    moveSelectFilter?: PokemonMoveSelectFilter,
    group?: string,
  ) {
    super(localeKey, iconImage, newModifierFunc, selectFilter, group);

    this.moveSelectFilter = moveSelectFilter;
  }
}

export class PokemonPpRestoreModifierType extends PokemonMoveModifierType {
  protected restorePoints: number;

  constructor(localeKey: string, iconImage: string, restorePoints: number) {
    super(
      localeKey,
      iconImage,
      (_type, args) =>
        new PokemonPpRestoreModifier(this, (args[0] as PlayerPokemon).id, args[1] as number, this.restorePoints),
      (_pokemon: PlayerPokemon) => {
        return null;
      },
      (pokemonMove: PokemonMove) => {
        if (!pokemonMove.ppUsed) {
          return i18next.t(PARTY_UI_NO_EFFECT_MSG_i18N_KEY);
        }
        return null;
      },
      "ether",
    );

    this.restorePoints = restorePoints;
  }

  override getDescription(): string {
    return this.restorePoints > -1
      ? i18next.t("modifierType:ModifierType.PokemonPpRestoreModifierType.description", {
          restorePoints: this.restorePoints,
        })
      : i18next.t("modifierType:ModifierType.PokemonPpRestoreModifierType.extra.fully");
  }
}

export class PokemonAllMovePpRestoreModifierType extends PokemonModifierType {
  protected restorePoints: number;

  constructor(localeKey: string, iconImage: string, restorePoints: number) {
    super(
      localeKey,
      iconImage,
      (_type, args) => new PokemonAllMovePpRestoreModifier(this, (args[0] as PlayerPokemon).id, this.restorePoints),
      (pokemon: PlayerPokemon) => {
        if (!pokemon.getMoveset().filter((m) => m.ppUsed).length) {
          return i18next.t(PARTY_UI_NO_EFFECT_MSG_i18N_KEY);
        }
        return null;
      },
      "elixir",
    );

    this.restorePoints = restorePoints;
  }

  override getDescription(): string {
    return this.restorePoints > -1
      ? i18next.t("modifierType:ModifierType.PokemonAllMovePpRestoreModifierType.description", {
          restorePoints: this.restorePoints,
        })
      : i18next.t("modifierType:ModifierType.PokemonAllMovePpRestoreModifierType.extra.fully");
  }
}

export class PokemonPpUpModifierType extends PokemonMoveModifierType {
  protected upPoints: number;

  constructor(localeKey: string, iconImage: string, upPoints: number) {
    super(
      localeKey,
      iconImage,
      (_type, args) => new PokemonPpUpModifier(this, (args[0] as PlayerPokemon).id, args[1] as number, this.upPoints),
      (_pokemon: PlayerPokemon) => {
        return null;
      },
      (pokemonMove: PokemonMove) => {
        if (pokemonMove.getMove().pp < 5 || pokemonMove.ppUp >= 3 || pokemonMove.maxPpOverride) {
          return i18next.t(PARTY_UI_NO_EFFECT_MSG_i18N_KEY);
        }
        return null;
      },
      "ppUp",
    );

    this.upPoints = upPoints;
  }

  override getDescription(): string {
    return i18next.t("modifierType:ModifierType.PokemonPpUpModifierType.description", { upPoints: this.upPoints });
  }
}

export class PokemonNatureChangeModifierType extends PokemonModifierType {
  protected nature: Nature;

  constructor(nature: Nature) {
    super(
      "",
      `mint_${
        getEnumKeys(Stat)
          .find((s) => getNatureStatMultiplier(nature, Stat[s]) > 1)
          ?.toLowerCase() || "neutral"
      }`,
      (_type, args) => new PokemonNatureChangeModifier(this, (args[0] as PlayerPokemon).id, this.nature),
      (pokemon: PlayerPokemon) => {
        if (pokemon.getNature() === this.nature) {
          return i18next.t(PARTY_UI_NO_EFFECT_MSG_i18N_KEY);
        }
        return null;
      },
      "mint",
    );

    this.nature = nature;
  }

  override get name(): string {
    return i18next.t("modifierType:ModifierType.PokemonNatureChangeModifierType.name", {
      natureName: getNatureName(this.nature),
    });
  }

  override getDescription(): string {
    return i18next.t("modifierType:ModifierType.PokemonNatureChangeModifierType.description", {
      natureName: getNatureName(this.nature, true, true, true),
    });
  }
}

export class RememberMoveModifierType extends PokemonModifierType {
  constructor(localeKey: string, iconImage: string, group?: string) {
    super(
      localeKey,
      iconImage,
      (type, args) => new RememberMoveModifier(type, (args[0] as PlayerPokemon).id, args[1] as number),
      (pokemon: PlayerPokemon) => {
        if (!pokemon.getLearnableLevelMoves().length) {
          return i18next.t(PARTY_UI_NO_EFFECT_MSG_i18N_KEY);
        }
        return null;
      },
      group,
    );
  }
}

export class DoubleBattleChanceBoosterModifierType extends ModifierType {
  private maxBattles: number;

  constructor(localeKey: string, iconImage: string, maxBattles: number) {
    super(localeKey, iconImage, (_type, _args) => new DoubleBattleChanceBoosterModifier(this, maxBattles), "lure");

    this.maxBattles = maxBattles;
  }

  override getDescription(): string {
    return i18next.t("modifierType:ModifierType.DoubleBattleChanceBoosterModifierType.description", {
      battleCount: this.maxBattles,
    });
  }
}

export class TempStatStageBoosterModifierType extends ModifierType implements GeneratedPersistentModifierType {
  private stat: TempBattleStat;
  private nameKey: string;
  private quantityKey: string;

  constructor(stat: TempBattleStat) {
    const nameKey = TempStatStageBoosterModifierTypeGenerator.items[stat];
    super("", nameKey, (_type, _args) => new TempStatStageBoosterModifier(this, this.stat, 5));

    this.stat = stat;
    this.nameKey = nameKey;
    this.quantityKey = stat !== Stat.ACC ? "percentage" : "stage";
  }

  override get name(): string {
    return i18next.t(`modifierType:TempStatStageBoosterItem.${this.nameKey}`);
  }

  override getDescription(): string {
    return i18next.t("modifierType:ModifierType.TempStatStageBoosterModifierType.description", {
      stat: i18next.t(getStatKey(this.stat)),
      amount: i18next.t(`modifierType:ModifierType.TempStatStageBoosterModifierType.extra.${this.quantityKey}`),
    });
  }

  getPregenArgs(): any[] {
    return [this.stat];
  }
}

export class BerryModifierType extends PokemonHeldItemModifierType implements GeneratedPersistentModifierType {
  private berryType: BerryType;

  constructor(berryType: BerryType) {
    super(
      "",
      `${BerryType[berryType].toLowerCase()}_berry`,
      (type, args) => new BerryModifier(type, (args[0] as Pokemon).id, berryType),
      "berry",
    );

    this.berryType = berryType;
  }

  override get name(): string {
    return getBerryName(this.berryType);
  }

  override getDescription(): string {
    return getBerryEffectDescription(this.berryType);
  }

  getPregenArgs(): any[] {
    return [this.berryType];
  }
}

enum AttackTypeBoosterItem {
  SILK_SCARF,
  BLACK_BELT,
  SHARP_BEAK,
  POISON_BARB,
  SOFT_SAND,
  HARD_STONE,
  SILVER_POWDER,
  SPELL_TAG,
  METAL_COAT,
  CHARCOAL,
  MYSTIC_WATER,
  MIRACLE_SEED,
  MAGNET,
  TWISTED_SPOON,
  NEVER_MELT_ICE,
  DRAGON_FANG,
  BLACK_GLASSES,
  FAIRY_FEATHER,
}

export class AttackTypeBoosterModifierType
  extends PokemonHeldItemModifierType
  implements GeneratedPersistentModifierType {
  public moveType: ElementalType;
  public boostPercent: number;

  constructor(moveType: ElementalType, boostPercent: number) {
    super(
      "",
      `${AttackTypeBoosterItem[moveType]?.toLowerCase()}`,
      (_type, args) => new AttackTypeBoosterModifier(this, (args[0] as Pokemon).id, moveType, boostPercent),
    );

    this.moveType = moveType;
    this.boostPercent = boostPercent;
  }

  override get name(): string {
    return i18next.t(`modifierType:AttackTypeBoosterItem.${AttackTypeBoosterItem[this.moveType]?.toLowerCase()}`);
  }

  override getDescription(): string {
    // TODO: Need getTypeName?
    return i18next.t("modifierType:ModifierType.AttackTypeBoosterModifierType.description", {
      moveType: i18next.t(`pokemonInfo:Type.${ElementalType[this.moveType]}`),
    });
  }

  getPregenArgs(): any[] {
    return [this.moveType];
  }
}

export type SpeciesStatBoosterItem = keyof typeof SpeciesStatBoosterModifierTypeGenerator.items;

/**
 * Modifier type for {@linkcode SpeciesStatBoosterModifier}
 * @extends PokemonHeldItemModifierType
 * @implements GeneratedPersistentModifierType
 */
export class SpeciesStatBoosterModifierType
  extends PokemonHeldItemModifierType
  implements GeneratedPersistentModifierType {
  private key: SpeciesStatBoosterItem;

  constructor(key: SpeciesStatBoosterItem) {
    const item = SpeciesStatBoosterModifierTypeGenerator.items[key];
    super(
      `modifierType:SpeciesBoosterItem.${key}`,
      key.toLowerCase(),
      (type, args) =>
        new SpeciesStatBoosterModifier(type, (args[0] as Pokemon).id, item.stats, item.multiplier, item.species),
    );

    this.key = key;
  }

  getPregenArgs(): any[] {
    return [this.key];
  }
}

export class PokemonLevelIncrementModifierType extends PokemonModifierType {
  constructor(localeKey: string, iconImage: string) {
    super(
      localeKey,
      iconImage,
      (_type, args) => new PokemonLevelIncrementModifier(this, (args[0] as PlayerPokemon).id),
      (_pokemon: PlayerPokemon) => null,
    );
  }

  override getDescription(): string {
    let levels = 1;
    const hasCandyJar = globalScene.modifiers.find((modifier) => modifier instanceof LevelIncrementBoosterModifier);
    if (hasCandyJar) {
      levels += hasCandyJar.stackCount;
    }
    return i18next.t("modifierType:ModifierType.PokemonLevelIncrementModifierType.description", { levels });
  }
}

export class AllPokemonLevelIncrementModifierType extends ModifierType {
  constructor(localeKey: string, iconImage: string) {
    super(localeKey, iconImage, (_type, _args) => new PokemonLevelIncrementModifier(this, -1));
  }

  override getDescription(): string {
    let levels = 1;
    const hasCandyJar = globalScene.modifiers.find((modifier) => modifier instanceof LevelIncrementBoosterModifier);
    if (hasCandyJar) {
      levels += hasCandyJar.stackCount;
    }
    return i18next.t("modifierType:ModifierType.AllPokemonLevelIncrementModifierType.description", { levels });
  }
}

export class BaseStatBoosterModifierType
  extends PokemonHeldItemModifierType
  implements GeneratedPersistentModifierType {
  private stat: PermanentStat;
  private key: string;

  constructor(stat: PermanentStat) {
    const key = BaseStatBoosterModifierTypeGenerator.items[stat];
    super("", key, (_type, args) => new BaseStatModifier(this, (args[0] as Pokemon).id, this.stat));

    this.stat = stat;
    this.key = key;
  }

  override get name(): string {
    return i18next.t(`modifierType:BaseStatBoosterItem.${this.key}`);
  }

  override getDescription(): string {
    return i18next.t("modifierType:ModifierType.BaseStatBoosterModifierType.description", {
      stat: i18next.t(getStatKey(this.stat)),
    });
  }

  getPregenArgs(): any[] {
    return [this.stat];
  }
}

/**
 * Shuckle Juice item
 */
export class PokemonBaseStatTotalModifierType
  extends PokemonHeldItemModifierType
  implements GeneratedPersistentModifierType {
  private readonly statModifier: number;

  constructor(statModifier: number) {
    super(
      "modifierType:ModifierType.MYSTERY_ENCOUNTER_SHUCKLE_JUICE",
      "berry_juice",
      (_type, args) => new PokemonBaseStatTotalModifier(this, (args[0] as Pokemon).id, this.statModifier),
    );
    this.statModifier = statModifier;
  }

  override getDescription(): string {
    return i18next.t("modifierType:ModifierType.PokemonBaseStatTotalModifierType.description", {
      increaseDecrease: i18next.t(
        this.statModifier >= 0
          ? "modifierType:ModifierType.PokemonBaseStatTotalModifierType.extra.increase"
          : "modifierType:ModifierType.PokemonBaseStatTotalModifierType.extra.decrease",
      ),
      blessCurse: i18next.t(
        this.statModifier >= 0
          ? "modifierType:ModifierType.PokemonBaseStatTotalModifierType.extra.blessed"
          : "modifierType:ModifierType.PokemonBaseStatTotalModifierType.extra.cursed",
      ),
      statValue: this.statModifier,
    });
  }

  public getPregenArgs(): any[] {
    return [this.statModifier];
  }
}

/**
 * Old Gateau item
 */
export class PokemonBaseStatFlatModifierType
  extends PokemonHeldItemModifierType
  implements GeneratedPersistentModifierType {
  private readonly statModifier: number;
  private readonly stats: Stat[];

  constructor(statModifier: number, stats: Stat[]) {
    super(
      "modifierType:ModifierType.MYSTERY_ENCOUNTER_OLD_GATEAU",
      "old_gateau",
      (_type, args) => new PokemonBaseStatFlatModifier(this, (args[0] as Pokemon).id, this.statModifier, this.stats),
    );
    this.statModifier = statModifier;
    this.stats = stats;
  }

  override getDescription(): string {
    return i18next.t("modifierType:ModifierType.PokemonBaseStatFlatModifierType.description", {
      stats: this.stats.map((stat) => i18next.t(getStatKey(stat))).join("/"),
      statValue: this.statModifier,
    });
  }

  public getPregenArgs(): any[] {
    return [this.statModifier, this.stats];
  }
}

class AllPokemonFullHpRestoreModifierType extends ModifierType {
  private descriptionKey: string;

  constructor(localeKey: string, iconImage: string, descriptionKey?: string, newModifierFunc?: NewModifierFunc) {
    super(
      localeKey,
      iconImage,
      newModifierFunc || ((_type, _args) => new PokemonHpRestoreModifier(this, -1, 0, 100, false)),
    );

    this.descriptionKey = descriptionKey!; // TODO: is this bang correct?
  }

  override getDescription(): string {
    return i18next.t(
      `${this.descriptionKey || "modifierType:ModifierType.AllPokemonFullHpRestoreModifierType"}.description` as any,
    );
  }
}

export class AllPokemonFullReviveModifierType extends AllPokemonFullHpRestoreModifierType {
  constructor(localeKey: string, iconImage: string) {
    super(
      localeKey,
      iconImage,
      "modifierType:ModifierType.AllPokemonFullReviveModifierType",
      (_type, _args) => new PokemonHpRestoreModifier(this, -1, 0, 100, false, true),
    );
  }
}

export class MoneyRewardModifierType extends ModifierType {
  private moneyMultiplier: number;
  private moneyMultiplierDescriptorKey: string;

  constructor(localeKey: string, iconImage: string, moneyMultiplier: number, moneyMultiplierDescriptorKey: string) {
    super(localeKey, iconImage, (_type, _args) => new MoneyRewardModifier(this, moneyMultiplier), "money", "se/buy");

    this.moneyMultiplier = moneyMultiplier;
    this.moneyMultiplierDescriptorKey = moneyMultiplierDescriptorKey;
  }

  override getDescription(): string {
    const moneyAmount = new NumberHolder(globalScene.getWaveMoneyAmount(this.moneyMultiplier));
    globalScene.applyModifiers(MoneyMultiplierModifier, true, moneyAmount);
    const formattedMoney = formatMoney(settings.display.moneyFormat, moneyAmount.value);

    return i18next.t("modifierType:ModifierType.MoneyRewardModifierType.description", {
      moneyMultiplier: i18next.t(this.moneyMultiplierDescriptorKey as any),
      moneyAmount: formattedMoney,
    });
  }
}

export class ExpBoosterModifierType extends ModifierType {
  private boostPercent: number;

  constructor(localeKey: string, iconImage: string, boostPercent: number) {
    super(localeKey, iconImage, () => new ExpBoosterModifier(this, boostPercent));

    this.boostPercent = boostPercent;
  }

  override getDescription(): string {
    return i18next.t("modifierType:ModifierType.ExpBoosterModifierType.description", {
      boostPercent: this.boostPercent,
    });
  }
}

export class PokemonExpBoosterModifierType extends PokemonHeldItemModifierType {
  private boostPercent: number;

  constructor(localeKey: string, iconImage: string, boostPercent: number) {
    super(
      localeKey,
      iconImage,
      (_type, args) => new PokemonExpBoosterModifier(this, (args[0] as Pokemon).id, boostPercent),
    );

    this.boostPercent = boostPercent;
  }

  override getDescription(): string {
    return i18next.t("modifierType:ModifierType.PokemonExpBoosterModifierType.description", {
      boostPercent: this.boostPercent,
    });
  }
}

export class PokemonFriendshipBoosterModifierType extends PokemonHeldItemModifierType {
  constructor(localeKey: string, iconImage: string) {
    super(localeKey, iconImage, (_type, args) => new PokemonFriendshipBoosterModifier(this, (args[0] as Pokemon).id));
  }

  override getDescription(): string {
    return i18next.t("modifierType:ModifierType.PokemonFriendshipBoosterModifierType.description");
  }
}

export class TmModifierType extends PokemonModifierType {
  public moveId: MoveId;

  constructor(moveId: MoveId) {
    super(
      "",
      `tm_${ElementalType[allMoves.get(moveId).type].toLowerCase()}`,
      (_type, args) => new TmModifier(this, (args[0] as PlayerPokemon).id),
      (pokemon: PlayerPokemon) => {
        if (
          pokemon.compatibleTms.indexOf(moveId) === -1
          || pokemon.getMoveset().filter((m) => m.moveId === moveId).length
        ) {
          return i18next.t(PARTY_UI_NO_EFFECT_MSG_i18N_KEY);
        }
        return null;
      },
      "tm",
    );

    this.moveId = moveId;
  }

  override get name(): string {
    return i18next.t("modifierType:ModifierType.TmModifierType.name", {
      moveId: leftPad(Object.keys(tmSpecies).indexOf(this.moveId.toString()) + 1, 3),
      moveName: allMoves.get(this.moveId).name,
    });
  }

  override getDescription(): string {
    return i18next.t(
      settings.display.enableMoveInfo
        ? "modifierType:ModifierType.TmModifierTypeWithInfo.description"
        : "modifierType:ModifierType.TmModifierType.description",
      { moveName: allMoves.get(this.moveId).name },
    );
  }
}

export class EvolutionItemModifierType extends PokemonModifierType implements GeneratedPersistentModifierType {
  public evolutionItem: EvolutionItem;

  constructor(evolutionItem: EvolutionItem) {
    super(
      "",
      EvolutionItem[evolutionItem].toLowerCase(),
      (_type, args) => new EvolutionItemModifier(this, (args[0] as PlayerPokemon).id),
      (pokemon: PlayerPokemon) => {
        if (
          pokemonEvolutions.hasOwnProperty(pokemon.species.speciesId)
          && pokemonEvolutions[pokemon.species.speciesId].filter(
            (e) =>
              e.item === this.evolutionItem
              && (!e.condition || e.condition.predicate(pokemon))
              && (e.preFormKey === null || e.preFormKey === pokemon.getFormKey()),
          ).length
          && pokemon.getFormKey() !== SpeciesFormKey.GIGANTAMAX
        ) {
          return null;
        }

        return i18next.t(PARTY_UI_NO_EFFECT_MSG_i18N_KEY);
      },
    );

    this.evolutionItem = evolutionItem;
  }

  override get name(): string {
    return i18next.t(`modifierType:EvolutionItem.${EvolutionItem[this.evolutionItem]}`);
  }

  override getDescription(): string {
    return i18next.t("modifierType:ModifierType.EvolutionItemModifierType.description");
  }

  getPregenArgs(): any[] {
    return [this.evolutionItem];
  }
}

/**
 * Class that represents form changing items
 */
export class FormChangeItemModifierType extends PokemonModifierType implements GeneratedPersistentModifierType {
  public formChangeItem: FormChangeItem;

  constructor(formChangeItem: FormChangeItem) {
    super(
      "",
      FormChangeItem[formChangeItem].toLowerCase(),
      (_type, args) => new PokemonFormChangeItemModifier(this, (args[0] as PlayerPokemon).id, formChangeItem, true),
      (pokemon: PlayerPokemon) => {
        // Make sure the Pokemon has alternate forms
        if (
          pokemonFormChanges.hasOwnProperty(pokemon.species.speciesId)
          // Get all form changes for this species with an item trigger, including any compound triggers
          && pokemonFormChanges[pokemon.species.speciesId]
            .filter(
              (fc) => fc.trigger.hasTriggerType(SpeciesFormChangeItemTrigger) && fc.preFormKey === pokemon.getFormKey(),
            )
            // Returns true if any form changes match this item
            .map((fc) => fc.findTrigger(SpeciesFormChangeItemTrigger) as SpeciesFormChangeItemTrigger)
            .flat()
            .flatMap((fc) => fc.item)
            .includes(this.formChangeItem)
        ) {
          return null;
        }

        return i18next.t(PARTY_UI_NO_EFFECT_MSG_i18N_KEY);
      },
    );

    this.formChangeItem = formChangeItem;
  }

  override get name(): string {
    return i18next.t(`modifierType:FormChangeItem.${FormChangeItem[this.formChangeItem]}`);
  }

  override getDescription(): string {
    return i18next.t("modifierType:ModifierType.FormChangeItemModifierType.description");
  }

  getPregenArgs(): any[] {
    return [this.formChangeItem];
  }
}

export class AttackTypeBoosterModifierTypeGenerator extends ModifierTypeGenerator {
  constructor() {
    super((party: Pokemon[], pregenArgs?: any[]) => {
      if (pregenArgs && pregenArgs.length === 1 && pregenArgs[0] in ElementalType) {
        return new AttackTypeBoosterModifierType(pregenArgs[0] as ElementalType, 20);
      }

      const attackMoveTypes = party
        .map((p) =>
          p
            .getMoveset()
            .map((m) => m.getMove())
            .filter((m) => m.isAttackMove())
            .map((m) => m.type),
        )
        .flat();
      if (!attackMoveTypes.length) {
        return null;
      }

      const attackMoveTypeWeights = new Map<ElementalType, number>();
      let totalWeight = 0;
      for (const t of attackMoveTypes) {
        if (attackMoveTypeWeights.has(t)) {
          if (attackMoveTypeWeights.get(t)! < 3) {
            // attackMoveTypeWeights.has(t) was checked before
            attackMoveTypeWeights.set(t, attackMoveTypeWeights.get(t)! + 1);
          } else {
            continue;
          }
        } else {
          attackMoveTypeWeights.set(t, 1);
        }
        totalWeight++;
      }

      if (!totalWeight) {
        return null;
      }

      let type: ElementalType;

      const randInt = randSeedInt(totalWeight);
      let weight = 0;

      for (const t of attackMoveTypeWeights.keys()) {
        const typeWeight = attackMoveTypeWeights.get(t)!; // guranteed to be defined
        if (randInt <= weight + typeWeight) {
          type = t;
          break;
        }
        weight += typeWeight;
      }

      return new AttackTypeBoosterModifierType(type!, 20);
    });
  }
}

export class BaseStatBoosterModifierTypeGenerator extends ModifierTypeGenerator {
  public static readonly items: Record<PermanentStat, string> = {
    [Stat.HP]: "hp_up",
    [Stat.ATK]: "protein",
    [Stat.DEF]: "iron",
    [Stat.SPATK]: "calcium",
    [Stat.SPDEF]: "zinc",
    [Stat.SPD]: "carbos",
  };

  constructor() {
    super((_party: Pokemon[], pregenArgs?: any[]) => {
      if (pregenArgs) {
        return new BaseStatBoosterModifierType(pregenArgs[0]);
      }
      const randStat: PermanentStat = randSeedInt(Stat.SPD + 1);
      return new BaseStatBoosterModifierType(randStat);
    });
  }
}

export class TempStatStageBoosterModifierTypeGenerator extends ModifierTypeGenerator {
  public static readonly items: Record<TempBattleStat, string> = {
    [Stat.ATK]: "x_attack",
    [Stat.DEF]: "x_defense",
    [Stat.SPATK]: "x_sp_atk",
    [Stat.SPDEF]: "x_sp_def",
    [Stat.SPD]: "x_speed",
    [Stat.ACC]: "x_accuracy",
  };

  constructor() {
    super((_party: Pokemon[], pregenArgs?: any[]) => {
      if (pregenArgs && pregenArgs.length === 1 && TEMP_BATTLE_STATS.includes(pregenArgs[0])) {
        return new TempStatStageBoosterModifierType(pregenArgs[0]);
      }
      const randStat: TempBattleStat = randSeedInt(Stat.ACC, Stat.ATK);
      return new TempStatStageBoosterModifierType(randStat);
    });
  }
}

/**
 * Modifier type generator for {@linkcode SpeciesStatBoosterModifierType}, which
 * encapsulates the logic for weighting the most useful held item from
 * the current list of {@linkcode items}.
 * @extends ModifierTypeGenerator
 */
export class SpeciesStatBoosterModifierTypeGenerator extends ModifierTypeGenerator {
  /** Object comprised of the currently available species-based stat boosting held items */
  public static readonly items = {
    LIGHT_BALL: { stats: [Stat.ATK, Stat.SPATK], multiplier: 2, species: [Species.PIKACHU] },
    THICK_CLUB: { stats: [Stat.ATK], multiplier: 2, species: [Species.CUBONE, Species.MAROWAK, Species.ALOLA_MAROWAK] },
    METAL_POWDER: { stats: [Stat.DEF], multiplier: 2, species: [Species.DITTO] },
    QUICK_POWDER: { stats: [Stat.SPD], multiplier: 2, species: [Species.DITTO] },
  };

  constructor() {
    super((party: Pokemon[], pregenArgs?: any[]) => {
      const items = SpeciesStatBoosterModifierTypeGenerator.items;
      if (pregenArgs && pregenArgs.length === 1 && pregenArgs[0] in items) {
        return new SpeciesStatBoosterModifierType(pregenArgs[0] as SpeciesStatBoosterItem);
      }

      const values = Object.values(items);
      const keys = Object.keys(items);
      const weights = keys.map(() => 0);

      for (const p of party) {
        const speciesId = p.getSpeciesForm(true).speciesId;
        const hasFling = p.getMoveset(true).some((m) => m.moveId === MoveId.FLING);

        for (const i in values) {
          const checkedSpecies = values[i].species;
          const checkedStats = values[i].stats;

          // If party member already has the item being weighted currently, skip to the next item
          const hasItem = p
            .getHeldItems()
            .some(
              (m) =>
                m instanceof SpeciesStatBoosterModifier
                && (m as SpeciesStatBoosterModifier).contains(checkedSpecies[0], checkedStats[0]),
            );

          if (!hasItem) {
            if (checkedSpecies.includes(speciesId)) {
              // Add weight if party member has a matching species
              weights[i]++;
            } else if (checkedSpecies.includes(Species.PIKACHU) && hasFling) {
              // Add weight to Light Ball if party member has Fling
              weights[i]++;
            }
          }
        }
      }

      let totalWeight = 0;
      for (const weight of weights) {
        totalWeight += weight;
      }

      if (totalWeight !== 0) {
        const randInt = randSeedInt(totalWeight, 1);
        let weight = 0;

        for (const i in weights) {
          if (weights[i] !== 0) {
            const curWeight = weight + weights[i];
            if (randInt <= weight + weights[i]) {
              return new SpeciesStatBoosterModifierType(keys[i] as SpeciesStatBoosterItem);
            }
            weight = curWeight;
          }
        }
      }

      return null;
    });
  }
}

export class TmModifierTypeGenerator extends ModifierTypeGenerator {
  constructor(tier: ModifierTier) {
    super((party: Pokemon[], pregenArgs?: any[]) => {
      if (pregenArgs && pregenArgs.length === 1 && pregenArgs[0] in MoveId) {
        return new TmModifierType(pregenArgs[0] as MoveId);
      }
      const partyMemberCompatibleTms = party.map((p) =>
        (p as PlayerPokemon).compatibleTms.filter((tm) => !p.moveset.find((m) => m.moveId === tm)),
      );
      const tierUniqueCompatibleTms = partyMemberCompatibleTms
        .flat()
        .filter((tm) => tmPoolTiers[tm] === tier)
        .filter((tm) => !allMoves.get(tm).name.endsWith(" (N)"))
        .filter((tm, i, array) => array.indexOf(tm) === i);
      if (!tierUniqueCompatibleTms.length) {
        return null;
      }
      const randTmIndex = randSeedInt(tierUniqueCompatibleTms.length);
      return new TmModifierType(tierUniqueCompatibleTms[randTmIndex]);
    });
  }
}

export class EvolutionItemModifierTypeGenerator extends ModifierTypeGenerator {
  constructor(rare: boolean) {
    super((party: Pokemon[], pregenArgs?: any[]) => {
      if (pregenArgs && pregenArgs.length === 1 && pregenArgs[0] in EvolutionItem) {
        return new EvolutionItemModifierType(pregenArgs[0] as EvolutionItem);
      }

      const evolutionItemPool = party
        .filter(
          (p) =>
            pokemonEvolutions.hasOwnProperty(p.species.speciesId)
            && (!p.pauseEvolutions
              || p.species.speciesId === Species.SLOWPOKE
              || p.species.speciesId === Species.EEVEE),
        )
        .flatMap((p) => {
          const evolutions = pokemonEvolutions[p.species.speciesId];
          return evolutions.filter(
            (e) =>
              e.item !== EvolutionItem.NONE
              && (e.evoFormKey === null || (e.preFormKey || "") === p.getFormKey())
              && (!e.condition || e.condition.predicate(p)),
          );
        })
        .flatMap((e) => e.item)
        .filter((i) => i !== null)
        .filter((i) => i > 50 === rare);

      if (evolutionItemPool.length === 0) {
        return null;
      }

      return new EvolutionItemModifierType(evolutionItemPool[randSeedInt(evolutionItemPool.length)]);
    });
  }
}

export class FormChangeItemModifierTypeGenerator extends ModifierTypeGenerator {
  constructor(isRareFormChangeItem: boolean) {
    super((party: Pokemon[], pregenArgs?: any[]) => {
      if (pregenArgs && pregenArgs.length === 1 && pregenArgs[0] in FormChangeItem) {
        return new FormChangeItemModifierType(pregenArgs[0] as FormChangeItem);
      }

      const formChangeItemPool = [
        ...new Set(
          party
            .filter((p) => pokemonFormChanges.hasOwnProperty(p.species.speciesId))
            .map((p) => {
              const formChanges = pokemonFormChanges[p.species.speciesId];
              let formChangeItemTriggers = formChanges
                .filter(
                  (fc) =>
                    ((fc.formKey.indexOf(SpeciesFormKey.MEGA) === -1
                      && fc.formKey.indexOf(SpeciesFormKey.PRIMAL) === -1)
                      || globalScene.getModifiers(MegaEvolutionAccessModifier).length)
                    && ((fc.formKey.indexOf(SpeciesFormKey.GIGANTAMAX) === -1
                      && fc.formKey.indexOf(SpeciesFormKey.ETERNAMAX) === -1)
                      || globalScene.getModifiers(GigantamaxAccessModifier).length)
                    && (!fc.conditions.length
                      || fc.conditions.filter((cond) => cond instanceof SpeciesFormChangeCondition && cond.predicate(p))
                        .length)
                    && fc.preFormKey === p.getFormKey(),
                )
                .map((fc) => fc.findTrigger(SpeciesFormChangeItemTrigger) as SpeciesFormChangeItemTrigger)
                .filter(
                  (t) =>
                    t
                    && t.active
                    && !globalScene.findModifier(
                      (m) => m.isPokemonFormChangeItemModifier() && m.pokemonId === p.id && m.formChangeItem === t.item,
                    ),
                );

              if (p.species.speciesId === Species.NECROZMA) {
                // technically we could use a simplified version and check for formChanges.length > 3, but in case any code changes later, this might break...

                let foundULTRA_Z = false,
                  foundN_LUNA = false,
                  foundN_SOLAR = false;
                formChangeItemTriggers.forEach((fc, _i) => {
                  switch (fc.item) {
                    case FormChangeItem.ULTRANECROZIUM_Z:
                      foundULTRA_Z = true;
                      break;
                    case FormChangeItem.N_LUNARIZER:
                      foundN_LUNA = true;
                      break;
                    case FormChangeItem.N_SOLARIZER:
                      foundN_SOLAR = true;
                      break;
                  }
                });
                if (foundULTRA_Z && foundN_LUNA && foundN_SOLAR) {
                  // all three items are present -> user hasn't acquired any of the N_*ARIZERs -> block ULTRANECROZIUM_Z acquisition.
                  formChangeItemTriggers = formChangeItemTriggers.filter(
                    (fc) => fc.item !== FormChangeItem.ULTRANECROZIUM_Z,
                  );
                }
              }
              return formChangeItemTriggers;
            })
            .flat(),
        ),
      ]
        .flat()
        .flatMap((fc) => fc.item)
        .filter((i) => (i && i < 100) === isRareFormChangeItem);
      // convert it into a set to remove duplicate values, which can appear when the same species with a potential form change is in the party.

      if (!formChangeItemPool.length) {
        return null;
      }

      return new FormChangeItemModifierType(formChangeItemPool[randSeedInt(formChangeItemPool.length)]);
    });
  }
}

export class TerastallizeModifierType extends PokemonHeldItemModifierType implements GeneratedPersistentModifierType {
  private teraType: ElementalType;

  constructor(teraType: ElementalType) {
    super(
      "",
      `${ElementalType[teraType].toLowerCase()}_tera_shard`,
      (type, args) => new TerastallizeModifier(type as TerastallizeModifierType, (args[0] as Pokemon).id, teraType),
      "tera_shard",
    );

    this.teraType = teraType;
  }

  override get name(): string {
    return i18next.t("modifierType:ModifierType.TerastallizeModifierType.name", {
      teraType: i18next.t(`pokemonInfo:Type.${ElementalType[this.teraType]}`),
    });
  }

  override getDescription(): string {
    return i18next.t("modifierType:ModifierType.TerastallizeModifierType.description", {
      teraType: i18next.t(`pokemonInfo:Type.${ElementalType[this.teraType]}`),
    });
  }

  getPregenArgs(): any[] {
    return [this.teraType];
  }
}

export class ContactHeldItemTransferChanceModifierType extends PokemonHeldItemModifierType {
  private chancePercent: number;

  constructor(localeKey: string, iconImage: string, chancePercent: number, group?: string, soundName?: string) {
    super(
      localeKey,
      iconImage,
      (type, args) => new ContactHeldItemTransferChanceModifier(type, (args[0] as Pokemon).id, chancePercent),
      group,
      soundName,
    );

    this.chancePercent = chancePercent;
  }

  override getDescription(): string {
    return i18next.t("modifierType:ModifierType.ContactHeldItemTransferChanceModifierType.description", {
      chancePercent: this.chancePercent,
    });
  }
}

export class TurnHeldItemTransferModifierType extends PokemonHeldItemModifierType {
  constructor(localeKey: string, iconImage: string, group?: string, soundName?: string) {
    super(
      localeKey,
      iconImage,
      (type, args) => new TurnHeldItemTransferModifier(type, (args[0] as Pokemon).id),
      group,
      soundName,
    );
  }

  override getDescription(): string {
    return i18next.t("modifierType:ModifierType.TurnHeldItemTransferModifierType.description");
  }
}

export type ModifierTypeFunc = () => ModifierType;
export type WeightedModifierTypeWeightFunc = (party: Pokemon[], rerollCount?: number) => number;

export class WeightedModifierType {
  public modifierType: ModifierType;
  public weight: number | WeightedModifierTypeWeightFunc;
  public maxWeight: number | WeightedModifierTypeWeightFunc;

  constructor(
    modifierTypeFunc: ModifierTypeFunc,
    weight: number | WeightedModifierTypeWeightFunc,
    maxWeight?: number | WeightedModifierTypeWeightFunc,
  ) {
    this.modifierType = modifierTypeFunc();
    this.modifierType.id = Object.keys(modifierTypes).find((k) => modifierTypes[k] === modifierTypeFunc)!; // TODO: is this bang correct?
    this.weight = weight;
    this.maxWeight = maxWeight || (!(weight instanceof Function) ? weight : 0);
  }

  setTier(tier: ModifierTier) {
    this.modifierType.setTier(tier);
  }
}

type BaseModifierOverride = {
  name: Exclude<ModifierTypeKeys, GeneratorModifierOverride["name"]>;
  count?: number;
};

/** Type for modifiers and held items that are constructed via {@linkcode ModifierTypeGenerator}. */
export type GeneratorModifierOverride = {
  count?: number;
} & (
  | {
      name: keyof Pick<typeof modifierTypes, "SPECIES_STAT_BOOSTER">;
      type?: SpeciesStatBoosterItem;
    }
  | {
      name: keyof Pick<typeof modifierTypes, "TEMP_STAT_STAGE_BOOSTER">;
      type?: TempBattleStat;
    }
  | {
      name: keyof Pick<typeof modifierTypes, "BASE_STAT_BOOSTER">;
      type?: Stat;
    }
  | {
      name: keyof Pick<typeof modifierTypes, "MINT">;
      type?: Nature;
    }
  | {
      name: keyof Pick<typeof modifierTypes, "ATTACK_TYPE_BOOSTER" | "TERA_SHARD">;
      type?: ElementalType;
    }
  | {
      name: keyof Pick<typeof modifierTypes, "BERRY">;
      type?: BerryType;
    }
  | {
      name: keyof Pick<typeof modifierTypes, "EVOLUTION_ITEM" | "RARE_EVOLUTION_ITEM">;
      type?: EvolutionItem;
    }
  | {
      name: keyof Pick<typeof modifierTypes, "FORM_CHANGE_ITEM">;
      type?: FormChangeItem;
    }
  | {
      name: keyof Pick<typeof modifierTypes, "TM_COMMON" | "TM_GREAT" | "TM_ULTRA">;
      type?: MoveId;
    }
);

/** Type used to construct modifiers and held items for overriding purposes. */
export type ModifierOverride = GeneratorModifierOverride | BaseModifierOverride;

export type ModifierTypeKeys = keyof typeof modifierTypes;

let modifierPoolThresholds = {};
let ignoredPoolIndexes = {};

let dailyStarterModifierPoolThresholds = {};
let ignoredDailyStarterPoolIndexes = {}; // eslint-disable-line @typescript-eslint/no-unused-vars

let enemyModifierPoolThresholds = {};
let enemyIgnoredPoolIndexes = {}; // eslint-disable-line @typescript-eslint/no-unused-vars

let enemyBuffModifierPoolThresholds = {};
let enemyBuffIgnoredPoolIndexes = {}; // eslint-disable-line @typescript-eslint/no-unused-vars

const tierWeights = [768 / 1024, 195 / 1024, 48 / 1024, 12 / 1024, 1 / 1024];
/**
 * Allows a unit test to check if an item exists in the Modifier Pool. Checks the pool directly, rather than attempting to reroll for the item.
 */
export const itemPoolChecks: Map<ModifierTypeKeys, boolean | undefined> = new Map();

export function regenerateModifierPoolThresholds(
  party: Pokemon[],
  poolType: ModifierPoolType,
  rerollCount: number = 0,
) {
  const pool = getModifierPoolForType(poolType);
  itemPoolChecks.forEach((_v, k) => {
    itemPoolChecks.set(k, false);
  });

  const ignoredIndexes = {};
  const modifierTableData = {};
  const thresholds = Object.fromEntries(
    new Map(
      Object.keys(pool).map((t) => {
        ignoredIndexes[t] = [];
        const thresholds = new Map();
        const tierModifierIds: string[] = [];
        let tierMaxWeight = 0;
        let i = 0;
        pool[t].reduce((total: number, modifierType: WeightedModifierType) => {
          const weightedModifierType = modifierType as WeightedModifierType;
          const existingModifiers = globalScene.findModifiers(
            (m) => m.type.id === weightedModifierType.modifierType.id,
            poolType === ModifierPoolType.PLAYER,
          );
          const itemModifierType =
            weightedModifierType.modifierType instanceof ModifierTypeGenerator
              ? weightedModifierType.modifierType.generateType(party)
              : weightedModifierType.modifierType;
          const weight =
            !existingModifiers.length
            || itemModifierType instanceof PokemonHeldItemModifierType
            || itemModifierType instanceof FormChangeItemModifierType
            || existingModifiers.find((m) => m.stackCount < m.getMaxStackCount(true))
              ? weightedModifierType.weight instanceof Function
                ? (weightedModifierType.weight as Function)(party, rerollCount)
                : (weightedModifierType.weight as number)
              : 0;
          if (weightedModifierType.maxWeight) {
            const modifierId = weightedModifierType.modifierType.id;
            tierModifierIds.push(modifierId);
            const outputWeight = useMaxWeightForOutput ? weightedModifierType.maxWeight : weight;
            modifierTableData[modifierId] = {
              weight: outputWeight,
              tier: parseInt(t),
              tierPercent: 0,
              totalPercent: 0,
            };
            tierMaxWeight += outputWeight;
          }
          if (weight) {
            total += weight;
          } else {
            ignoredIndexes[t].push(i++);
            return total;
          }
          if (itemPoolChecks.has(modifierType.modifierType.id as ModifierTypeKeys)) {
            itemPoolChecks.set(modifierType.modifierType.id as ModifierTypeKeys, true);
          }
          thresholds.set(total, i++);
          return total;
        }, 0);
        for (const id of tierModifierIds) {
          modifierTableData[id].tierPercent = Math.floor((modifierTableData[id].weight / tierMaxWeight) * 10000) / 100;
        }
        return [t, Object.fromEntries(thresholds)];
      }),
    ),
  );
  for (const id of Object.keys(modifierTableData)) {
    modifierTableData[id].totalPercent =
      Math.floor(modifierTableData[id].tierPercent * tierWeights[modifierTableData[id].tier] * 100) / 100;
    modifierTableData[id].tier = ModifierTier[modifierTableData[id].tier];
  }
  if (outputModifierData) {
    console.table(modifierTableData);
  }
  switch (poolType) {
    case ModifierPoolType.PLAYER:
      modifierPoolThresholds = thresholds;
      ignoredPoolIndexes = ignoredIndexes;
      break;
    case ModifierPoolType.WILD:
    case ModifierPoolType.TRAINER:
      enemyModifierPoolThresholds = thresholds;
      enemyIgnoredPoolIndexes = ignoredIndexes;
      break;
    case ModifierPoolType.ENEMY_BUFF:
      enemyBuffModifierPoolThresholds = thresholds;
      enemyBuffIgnoredPoolIndexes = ignoredIndexes;
      break;
    case ModifierPoolType.DAILY_STARTER:
      dailyStarterModifierPoolThresholds = thresholds;
      ignoredDailyStarterPoolIndexes = ignoredIndexes;
      break;
  }
}

export interface CustomModifierSettings {
  guaranteedModifierTiers?: ModifierTier[];
  guaranteedModifierTypeOptions?: ModifierTypeOption[];
  guaranteedModifierTypeFuncs?: ModifierTypeFunc[];
  fillRemaining?: boolean;
  /** Set to negative value to disable rerolls completely in shop */
  rerollMultiplier?: number;
  allowLuckUpgrades?: boolean;
}

export function getModifierTypeFuncById(id: string): ModifierTypeFunc {
  return modifierTypes[id];
}

/**
 * Generates modifier options for a {@linkcode SelectModifierPhase}
 * @param count Determines the number of items to generate
 * @param party Party is required for generating proper modifier pools
 * @param modifierTiers (Optional) If specified, rolls items in the specified tiers. Commonly used for tier-locking with Lock Capsule.
 * @param customModifierSettings (Optional) If specified, can customize the item shop rewards further.
 *  - `guaranteedModifierTypeOptions?: ModifierTypeOption[]` If specified, will override the first X items to be specific modifier options (these should be pre-genned).
 *  - `guaranteedModifierTypeFuncs?: ModifierTypeFunc[]` If specified, will override the next X items to be auto-generated from specific modifier functions (these don't have to be pre-genned).
 *  - `guaranteedModifierTiers?: ModifierTier[]` If specified, will override the next X items to be the specified tier. These can upgrade with luck.
 *  - `fillRemaining?: boolean` Default 'false'. If set to true, will fill the remainder of shop items that were not overridden by the 3 options above, up to the 'count' param value.
 *    - Example: `count = 4`, `customModifierSettings = { guaranteedModifierTiers: [ModifierTier.GREAT], fillRemaining: true }`,
 *    - The first item in the shop will be `GREAT` tier, and the remaining 3 items will be generated normally.
 *    - If `fillRemaining = false` in the same scenario, only 1 `GREAT` tier item will appear in the shop (regardless of `count` value).
 *  - `rerollMultiplier?: number` If specified, can adjust the amount of money required for a shop reroll. If set to a negative value, the shop will not allow rerolls at all.
 *  - `allowLuckUpgrades?: boolean` Default `true`, if `false` will prevent set item tiers from upgrading via luck
 */
export function getPlayerModifierTypeOptions(
  count: number,
  party: PlayerPokemon[],
  modifierTiers?: ModifierTier[],
  customModifierSettings?: CustomModifierSettings,
): ModifierTypeOption[] {
  const options: ModifierTypeOption[] = [];
  const retryCount = Math.min(count * 5, 50);
  if (!customModifierSettings) {
    new Array(count).fill(0).map((_, i) => {
      options.push(
        getModifierTypeOptionWithRetry(
          options,
          retryCount,
          party,
          modifierTiers && modifierTiers.length > i ? modifierTiers[i] : undefined,
        ),
      );
    });
  } else {
    // Guaranteed mod options first
    if (
      customModifierSettings?.guaranteedModifierTypeOptions
      && customModifierSettings.guaranteedModifierTypeOptions.length > 0
    ) {
      options.push(...customModifierSettings.guaranteedModifierTypeOptions!);
    }

    // Guaranteed mod functions second
    if (
      customModifierSettings.guaranteedModifierTypeFuncs
      && customModifierSettings.guaranteedModifierTypeFuncs.length > 0
    ) {
      customModifierSettings.guaranteedModifierTypeFuncs!.forEach((mod, _i) => {
        const modifierId = Object.keys(modifierTypes).find((k) => modifierTypes[k] === mod) as string;
        let guaranteedMod: ModifierType = modifierTypes[modifierId]?.();

        // Populates item id and tier
        guaranteedMod = guaranteedMod
          .withIdFromFunc(modifierTypes[modifierId])
          .withTierFromPool(ModifierPoolType.PLAYER, party);

        const modType =
          guaranteedMod instanceof ModifierTypeGenerator ? guaranteedMod.generateType(party) : guaranteedMod;
        if (modType) {
          const option = new ModifierTypeOption(modType, 0);
          options.push(option);
        }
      });
    }

    // Guaranteed tiers third
    if (customModifierSettings.guaranteedModifierTiers && customModifierSettings.guaranteedModifierTiers.length > 0) {
      const allowLuckUpgrades = customModifierSettings.allowLuckUpgrades ?? true;
      customModifierSettings.guaranteedModifierTiers.forEach((tier) => {
        options.push(getModifierTypeOptionWithRetry(options, retryCount, party, tier, allowLuckUpgrades));
      });
    }

    // Fill remaining
    if (options.length < count && customModifierSettings.fillRemaining) {
      while (options.length < count) {
        options.push(getModifierTypeOptionWithRetry(options, retryCount, party, undefined));
      }
    }
  }

  overridePlayerModifierTypeOptions(options, party);

  return options;
}

/**
 * Will generate a {@linkcode ModifierType} from the {@linkcode ModifierPoolType.PLAYER} pool, attempting to retry duplicated items up to retryCount
 * @param existingOptions Currently generated options
 * @param retryCount How many times to retry before allowing a dupe item
 * @param party Current player party, used to calculate items in the pool
 * @param tier If specified will generate item of tier
 * @param allowLuckUpgrades `true` to allow items to upgrade tiers (the little animation that plays and is affected by luck)
 */
function getModifierTypeOptionWithRetry(
  existingOptions: ModifierTypeOption[],
  retryCount: number,
  party: PlayerPokemon[],
  tier?: ModifierTier,
  allowLuckUpgrades?: boolean,
): ModifierTypeOption {
  allowLuckUpgrades = allowLuckUpgrades ?? true;
  let candidate = getNewModifierTypeOption(party, ModifierPoolType.PLAYER, tier, undefined, 0, allowLuckUpgrades);
  let r = 0;
  while (
    existingOptions.length
    && ++r < retryCount
    && existingOptions.filter((o) => o.type.name === candidate?.type.name || o.type.group === candidate?.type.group)
      .length
  ) {
    candidate = getNewModifierTypeOption(
      party,
      ModifierPoolType.PLAYER,
      candidate?.type.tier ?? tier,
      candidate?.upgradeCount,
      0,
      allowLuckUpgrades,
    );
  }
  return candidate!;
}

/**
 * Replaces the {@linkcode ModifierType} of the entries within {@linkcode options} with any
 * {@linkcode ModifierOverride} entries listed in {@linkcode Overrides.ITEM_REWARD_OVERRIDE}
 * up to the smallest amount of entries between {@linkcode options} and the override array.
 * @param options Array of naturally rolled {@linkcode ModifierTypeOption}s
 * @param party Array of the player's current party
 */
export function overridePlayerModifierTypeOptions(options: ModifierTypeOption[], party: PlayerPokemon[]) {
  const minLength = Math.min(options.length, Overrides.ITEM_REWARD_OVERRIDE.length);
  for (let i = 0; i < minLength; i++) {
    const override: ModifierOverride = Overrides.ITEM_REWARD_OVERRIDE[i];
    const modifierFunc = modifierTypes[override.name];
    let modifierType: ModifierType | null = modifierFunc();

    if (modifierType instanceof ModifierTypeGenerator) {
      const pregenArgs = "type" in override && override.type !== null ? [override.type] : undefined;
      modifierType = modifierType.generateType(party, pregenArgs);
    }

    if (modifierType) {
      options[i].type = modifierType.withIdFromFunc(modifierFunc).withTierFromPool(ModifierPoolType.PLAYER, party);
    }
  }
}

export function getPlayerShopModifierTypeOptionsForWave(waveIndex: number, baseCost: number): ModifierTypeOption[] {
  if (!(waveIndex % 10)) {
    return [];
  }

  const options = [
    [
      new ModifierTypeOption(modifierTypes.POTION(), 0, baseCost * 0.2),
      new ModifierTypeOption(modifierTypes.ETHER(), 0, baseCost * 0.4),
      new ModifierTypeOption(modifierTypes.REVIVE(), 0, baseCost * 2),
    ],
    [
      new ModifierTypeOption(modifierTypes.SUPER_POTION(), 0, baseCost * 0.45),
      new ModifierTypeOption(modifierTypes.FULL_HEAL(), 0, baseCost),
    ],
    [
      new ModifierTypeOption(modifierTypes.ELIXIR(), 0, baseCost),
      new ModifierTypeOption(modifierTypes.MAX_ETHER(), 0, baseCost),
    ],
    [
      new ModifierTypeOption(modifierTypes.HYPER_POTION(), 0, baseCost * 0.8),
      new ModifierTypeOption(modifierTypes.MAX_REVIVE(), 0, baseCost * 2.75),
      new ModifierTypeOption(modifierTypes.MEMORY_MUSHROOM(), 0, baseCost * 4),
    ],
    [
      new ModifierTypeOption(modifierTypes.MAX_POTION(), 0, baseCost * 1.5),
      new ModifierTypeOption(modifierTypes.MAX_ELIXIR(), 0, baseCost * 2.5),
    ],
    [new ModifierTypeOption(modifierTypes.FULL_RESTORE(), 0, baseCost * 2.25)],
    [new ModifierTypeOption(modifierTypes.SACRED_ASH(), 0, baseCost * 10)],
  ];
  return options.slice(0, Math.ceil(Math.max(waveIndex + 10, 0) / 30)).flat();
}

export function getEnemyModifierTypesForWave(
  waveIndex: number,
  count: number,
  party: EnemyPokemon[],
  poolType: ModifierPoolType.WILD | ModifierPoolType.TRAINER,
  upgradeChance: number = 0,
): PokemonHeldItemModifierType[] {
  const ret = new Array(count)
    .fill(0)
    .map(
      () =>
        getNewModifierTypeOption(party, poolType, undefined, upgradeChance && !randSeedInt(upgradeChance) ? 1 : 0)
          ?.type as PokemonHeldItemModifierType,
    );
  if (!(waveIndex % 1000)) {
    ret.push(getModifierType(modifierTypes.MINI_BLACK_HOLE) as PokemonHeldItemModifierType);
  }
  return ret;
}

export function getDailyRunStarterModifiers(party: PlayerPokemon[]): PokemonHeldItemModifier[] {
  const ret: PokemonHeldItemModifier[] = [];
  for (const p of party) {
    for (let m = 0; m < 3; m++) {
      const tierValue = randSeedInt(64);

      let tier: ModifierTier;
      if (tierValue > 25) {
        tier = ModifierTier.COMMON;
      } else if (tierValue > 12) {
        tier = ModifierTier.GREAT;
      } else if (tierValue > 4) {
        tier = ModifierTier.ULTRA;
      } else if (tierValue) {
        tier = ModifierTier.EPIC;
      } else {
        tier = ModifierTier.MASTER;
      }

      const modifier = getNewModifierTypeOption(party, ModifierPoolType.DAILY_STARTER, tier)?.type?.newModifier(
        p,
      ) as PokemonHeldItemModifier;
      ret.push(modifier);
    }
  }

  return ret;
}

/**
 * Generates a ModifierType from the specified pool
 * @param party party of the trainer using the item
 * @param poolType PLAYER/WILD/TRAINER
 * @param tier If specified, will override the initial tier of an item (can still upgrade with luck)
 * @param upgradeCount If defined, means that this is a new ModifierType being generated to override another via luck upgrade. Used for recursive logic
 * @param retryCount Max allowed tries before the next tier down is checked for a valid ModifierType
 * @param allowLuckUpgrades Default true. If false, will not allow ModifierType to randomly upgrade to next tier
 */
function getNewModifierTypeOption(
  party: Pokemon[],
  poolType: ModifierPoolType,
  tier?: ModifierTier,
  upgradeCount?: number,
  retryCount: number = 0,
  allowLuckUpgrades: boolean = true,
): ModifierTypeOption | null {
  const player = !poolType;
  const pool = getModifierPoolForType(poolType);
  let thresholds: object;
  switch (poolType) {
    case ModifierPoolType.PLAYER:
      thresholds = modifierPoolThresholds;
      break;
    case ModifierPoolType.WILD:
      thresholds = enemyModifierPoolThresholds;
      break;
    case ModifierPoolType.TRAINER:
      thresholds = enemyModifierPoolThresholds;
      break;
    case ModifierPoolType.ENEMY_BUFF:
      thresholds = enemyBuffModifierPoolThresholds;
      break;
    case ModifierPoolType.DAILY_STARTER:
      thresholds = dailyStarterModifierPoolThresholds;
      break;
  }
  if (tier === undefined) {
    const tierValue = randSeedInt(1024);
    if (!upgradeCount) {
      upgradeCount = 0;
    }
    if (player && tierValue && allowLuckUpgrades) {
      const partyLuckValue = getPartyLuckValue(party);
      const upgradeOdds = Math.floor(128 / ((partyLuckValue + 4) / 4));
      let upgraded = false;
      do {
        upgraded = randSeedInt(upgradeOdds) < 4;
        if (upgraded) {
          upgradeCount++;
        }
      } while (upgraded);
    }

    if (tierValue > 255) {
      tier = ModifierTier.COMMON;
    } else if (tierValue > 60) {
      tier = ModifierTier.GREAT;
    } else if (tierValue > 12) {
      tier = ModifierTier.ULTRA;
    } else if (tierValue) {
      tier = ModifierTier.EPIC;
    } else {
      tier = ModifierTier.MASTER;
    }

    tier += upgradeCount;
    while (tier && (!modifierPool.hasOwnProperty(tier) || !modifierPool[tier].length)) {
      tier--;
      if (upgradeCount) {
        upgradeCount--;
      }
    }
  } else if (upgradeCount === undefined && player) {
    upgradeCount = 0;
    if (tier < ModifierTier.MASTER && allowLuckUpgrades) {
      const partyShinyCount = party.filter((p) => p.isShiny() && !p.isFainted()).length;
      const upgradeOdds = Math.floor(32 / ((partyShinyCount + 2) / 2));
      while (modifierPool.hasOwnProperty(tier + upgradeCount + 1) && modifierPool[tier + upgradeCount + 1].length) {
        if (!randSeedInt(upgradeOdds)) {
          upgradeCount++;
        } else {
          break;
        }
      }
      tier += upgradeCount;
    }
  } else if (retryCount === 10 && tier) {
    retryCount = 0;
    tier--;
  }

  const tierThresholds = Object.keys(thresholds[tier]);
  const totalWeight = parseInt(tierThresholds[tierThresholds.length - 1]);
  const value = randSeedInt(totalWeight);
  let index: number | undefined;
  for (const t of tierThresholds) {
    const threshold = parseInt(t);
    if (value < threshold) {
      index = thresholds[tier][threshold];
      break;
    }
  }

  if (index === undefined) {
    return null;
  }

  if (player) {
    console.log(index, ignoredPoolIndexes[tier].filter((i) => i <= index).length, ignoredPoolIndexes[tier]);
  }
  let modifierType: ModifierType | null = pool[tier][index].modifierType;
  if (modifierType instanceof ModifierTypeGenerator) {
    modifierType = (modifierType as ModifierTypeGenerator).generateType(party);
    if (modifierType === null) {
      if (player) {
        console.log(ModifierTier[tier], upgradeCount);
      }
      return getNewModifierTypeOption(party, poolType, tier, upgradeCount, ++retryCount);
    }
  }

  console.log(modifierType, !player ? "(enemy)" : "");

  return new ModifierTypeOption(modifierType as ModifierType, upgradeCount!); // TODO: is this bang correct?
}

export function getDefaultModifierTypeForTier(tier: ModifierTier): ModifierType {
  let modifierType: ModifierType | WeightedModifierType = modifierPool[tier || ModifierTier.COMMON][0];
  if (modifierType instanceof WeightedModifierType) {
    modifierType = (modifierType as WeightedModifierType).modifierType;
  }
  return modifierType;
}

export class ModifierTypeOption {
  public type: ModifierType;
  public upgradeCount: number;
  public cost: number;

  constructor(type: ModifierType, upgradeCount: number, cost: number = 0) {
    this.type = type;
    this.upgradeCount = upgradeCount;
    this.cost = Math.min(Math.round(cost), Number.MAX_SAFE_INTEGER);
  }
}

/**
 * Calculates the team's luck value.
 * @param party The player's party.
 * @returns A number between 0 and 14 based on the party's total luck value, or a random number between 0 and 14 if the player is in Daily Run mode.
 */
export function getPartyLuckValue(party: Pokemon[]): number {
  if (globalScene.gameMode.isDaily) {
    const DailyLuck = new NumberHolder(0);
    globalScene.executeWithSeedOffset(
      () => {
        DailyLuck.value = randSeedInt(15); // Random number between 0 and 14
      },
      0,
      globalScene.seed,
    );
    return DailyLuck.value;
  }
  const luck = Phaser.Math.Clamp(
    party
      .map((p) => (p.isAllowedInBattle() ? p.getLuck() : 0))
      .reduce((total: number, value: number) => (total += value), 0),
    0,
    14,
  );
  return luck ?? 0;
}

export function getLuckString(luckValue: number): string {
  return ["D", "C", "C+", "B-", "B", "B+", "A-", "A", "A+", "A++", "S", "S+", "SS", "SS+", "SSS"][luckValue];
}

export function getLuckTextTint(luckValue: number): number {
  let modifierTier: ModifierTier;
  if (luckValue > 11) {
    modifierTier = ModifierTier.LUXURY;
  } else if (luckValue > 9) {
    modifierTier = ModifierTier.MASTER;
  } else if (luckValue > 5) {
    modifierTier = ModifierTier.EPIC;
  } else if (luckValue > 2) {
    modifierTier = ModifierTier.ULTRA;
  } else if (luckValue) {
    modifierTier = ModifierTier.GREAT;
  } else {
    modifierTier = ModifierTier.COMMON;
  }
  // todo: this makes D luck appear white on white in light mode
  return getModifierTierTextTint(modifierTier);
}
