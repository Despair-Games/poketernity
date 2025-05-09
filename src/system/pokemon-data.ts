import type { Status } from "#app/@types/Status";
import { loadBattlerTag } from "#app/data/battler-tags/utils/load-battler-tag";
import { CustomPokemonData } from "#app/data/custom-pokemon-data";
import type { Variant } from "#app/data/variant";
import type { Pokemon } from "#app/field/pokemon";
import { PokemonMove } from "#app/field/pokemon-move";
import { PokemonSummonData } from "#app/field/pokemon-summon-data";
import { globalScene } from "#app/global-scene";
import { isPokemon } from "#app/utils/common-utils";
import { getPokemonSpecies } from "#app/utils/pokemon-utils";
import { BattleType } from "#enums/battle-type";
import type { BiomeId } from "#enums/biome-id";
import type { ElementalType } from "#enums/elemental-type";
import type { Gender } from "#enums/gender";
import { MoveId } from "#enums/move-id";
import { Nature } from "#enums/nature";
import type { PokeballType } from "#enums/pokeball-type";
import type { SpeciesId } from "#enums/species-id";
import { TrainerSlot } from "#enums/trainer-slot";

export default class PokemonData {
  public id: number;
  public player: boolean;
  public speciesId: SpeciesId;
  public nickname: string;
  public formIndex: number;
  public abilityIndex: number;
  public passive: boolean;
  public shiny: boolean;
  public variant: Variant;
  public pokeball: PokeballType;
  public level: number;
  public exp: number;
  public levelExp: number;
  public gender: Gender;
  public hp: number;
  public stats: number[];
  public ivs: number[];
  public nature: Nature;
  public moveset: PokemonMove[];
  public status: Status | null = null;
  public friendship: number;
  public metLevel: number;
  public metBiome: BiomeId | -1; // -1 for starters
  public metSpecies: SpeciesId;
  public metWave: number; // 0 for unknown (previous saves), -1 for starters
  public luck: number;
  public pauseEvolutions: boolean;
  public pokerus: boolean;
  public usedTMs: MoveId[];
  public evoCounter: number;
  public teraType: ElementalType;
  public isTerastallized: boolean;
  public stellarTypesBoosted: ElementalType[];

  public boss: boolean = false;
  public bossSegments?: number;

  public summonData: PokemonSummonData;

  /** Data that can customize a Pokemon in non-standard ways from its Species */
  public customPokemonData: CustomPokemonData;

  /**
   * @param source - The typing of `source` as `PokemonData` (approximately?) matches the typing of
   * the `json` object passed in to it in `GameData#parseSessionData`
   */
  constructor(source: Pokemon | PokemonData) {
    this.id = source.id;
    this.player = isPokemon(source) ? source.isPlayer() : source.player;
    this.speciesId = isPokemon(source) ? source.species.speciesId : source.speciesId;
    this.nickname = source.nickname;
    this.formIndex = Phaser.Math.Clamp(source.formIndex, 0, getPokemonSpecies(this.speciesId).forms.length - 1);
    this.abilityIndex = source.abilityIndex;
    this.passive = source.passive;
    this.shiny = source.shiny;
    this.variant = source.variant;
    this.pokeball = source.pokeball;
    this.level = source.level;
    this.exp = source.exp;
    this.levelExp = source.levelExp;
    this.gender = source.gender;
    this.hp = source.hp;
    this.stats = source.stats;
    this.ivs = source.ivs;
    this.nature = source.nature ?? Nature.HARDY;
    this.friendship = source.friendship ?? getPokemonSpecies(this.speciesId).baseFriendship;
    this.metLevel = source.metLevel || 5;
    this.metBiome = source.metBiome ?? -1;
    this.metSpecies = source.metSpecies;
    this.metWave = source.metWave ?? (this.metBiome === -1 ? -1 : 0);
    this.luck = (source.luck ?? source.shiny) ? source.variant + 1 : 0;
    this.pauseEvolutions = source.pauseEvolutions;
    this.evoCounter = source.evoCounter ?? 0;
    this.pokerus = source.pokerus;
    this.usedTMs = source.usedTMs ?? [];
    this.teraType = source.teraType;
    this.isTerastallized = source.isTerastallized ?? false;
    this.stellarTypesBoosted = source.stellarTypesBoosted ?? [];
    // @ts-expect-error - `Pokemon#status` is protected
    this.status = source.status;

    this.customPokemonData = new CustomPokemonData(source.customPokemonData);

    if (source.hasOwnProperty("bossSegments")) {
      // @ts-expect-error - The `if` statement doesn't tell TS that this isn't a `Pokemon` object
      this.boss = source.bossSegments > 0;
      // @ts-expect-error - The `if` statement doesn't tell TS that this isn't a `Pokemon` object
      this.bossSegments = source.bossSegments;
    }

    if (isPokemon(source)) {
      this.moveset = source.moveset;
      if (this.player) {
        this.summonData = source.summonData;
      }
      return;
    }

    this.moveset = (source.moveset || [new PokemonMove(MoveId.TACKLE), new PokemonMove(MoveId.GROWL)]).map(
      (m) => new PokemonMove(m.moveId, m.ppUsed, m.ppUp, m.virtual, m.maxPpOverride),
    );

    this.summonData = new PokemonSummonData();
    if (!source.summonData) {
      return;
    }
    this.summonData.stats = source.summonData.stats;
    this.summonData.statStages = source.summonData.statStages;
    this.summonData.moveQueue = source.summonData.moveQueue;
    this.summonData.abilitySuppressed = source.summonData.abilitySuppressed;
    this.summonData.abilitiesApplied = source.summonData.abilitiesApplied;
    this.summonData.ability = source.summonData.ability;
    this.summonData.types = source.summonData.types;

    this.summonData.moveset = source.summonData.moveset?.map((m) => PokemonMove.loadMove(m)) ?? [];
    this.summonData.tags = source.summonData.tags?.map((t) => loadBattlerTag(t)) ?? [];
  }

  toPokemon(battleType?: BattleType, partyMemberIndex: number = 0, double: boolean = false): Pokemon {
    const species = getPokemonSpecies(this.speciesId);
    const ret: Pokemon = this.player
      ? globalScene.addPlayerPokemon(
          species,
          this.level,
          this.abilityIndex,
          this.formIndex,
          this.gender,
          this.shiny,
          this.variant,
          this.ivs,
          this.nature,
          this,
          (playerPokemon) => {
            if (this.nickname) {
              playerPokemon.nickname = this.nickname;
            }
          },
        )
      : globalScene.addEnemyPokemon(
          species,
          this.level,
          battleType === BattleType.TRAINER
            ? !double || !(partyMemberIndex % 2)
              ? TrainerSlot.TRAINER
              : TrainerSlot.TRAINER_PARTNER
            : TrainerSlot.NONE,
          this.boss,
          false,
          this,
        );
    if (this.summonData) {
      ret.primeSummonData(this.summonData);
    }
    return ret;
  }
}
