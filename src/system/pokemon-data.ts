import { BattleType } from "#enums/battle-type";
import { globalScene } from "#app/global-scene";
import type { Gender } from "#enums/gender";
import type { Nature } from "#enums/nature";
import type { PokeballType } from "#enums/pokeball";
import { getPokemonSpecies } from "#app/utils/pokemon-species-utils";
import { Status } from "../data/status-effect";
import { type Pokemon, EnemyPokemon } from "#app/field/pokemon";
import { PokemonSummonData } from "#app/field/pokemon-summon-data";
import { PokemonMove } from "#app/field/pokemon-move";
import { TrainerSlot } from "#enums/trainer-slot";
import type { Variant } from "#app/data/variant";
import { loadBattlerTag } from "#app/data/battler-tags/utils/load-battler-tag";
import type { Biome } from "#enums/biome";
import { MoveId } from "#enums/move-id";
import type { Species } from "#enums/species";
import { CustomPokemonData } from "#app/data/custom-pokemon-data";

export default class PokemonData {
  public id: number;
  public player: boolean;
  public species: Species;
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
  public status: Status | null;
  public friendship: number;
  public metLevel: number;
  public metBiome: Biome | -1; // -1 for starters
  public metSpecies: Species;
  public metWave: number; // 0 for unknown (previous saves), -1 for starters
  public luck: number;
  public pauseEvolutions: boolean;
  public pokerus: boolean;
  public usedTMs: MoveId[];
  public evoCounter: number;

  public boss: boolean;
  public bossSegments?: number;

  public summonData: PokemonSummonData;

  /** Data that can customize a Pokemon in non-standard ways from its Species */
  public customPokemonData: CustomPokemonData;

  constructor(source: Pokemon | any, forHistory: boolean = false) {
    const sourcePokemon = source.type === "Pokemon" ? source : null;
    this.id = source.id;
    this.player = sourcePokemon ? sourcePokemon.isPlayer() : source.player;
    this.species = sourcePokemon ? sourcePokemon.species.speciesId : source.species;
    this.nickname = sourcePokemon ? sourcePokemon.nickname : source.nickname;
    this.formIndex = Math.max(Math.min(source.formIndex, getPokemonSpecies(this.species).forms.length - 1), 0);
    this.abilityIndex = source.abilityIndex;
    this.passive = source.passive;
    this.shiny = source.shiny;
    this.variant = source.variant;
    this.pokeball = source.pokeball;
    this.level = source.level;
    this.exp = source.exp;
    if (!forHistory) {
      this.levelExp = source.levelExp;
    }
    this.gender = source.gender;
    if (!forHistory) {
      this.hp = source.hp;
    }
    this.stats = source.stats;
    this.ivs = source.ivs;
    this.nature = source.nature !== undefined ? source.nature : (0 as Nature);
    this.friendship =
      source.friendship !== undefined ? source.friendship : getPokemonSpecies(this.species).baseFriendship;
    this.metLevel = source.metLevel || 5;
    this.metBiome = source.metBiome !== undefined ? source.metBiome : -1;
    this.metSpecies = source.metSpecies;
    this.metWave = source.metWave ?? (this.metBiome === -1 ? -1 : 0);
    this.luck = source.luck !== undefined ? source.luck : source.shiny ? source.variant + 1 : 0;
    if (!forHistory) {
      this.pauseEvolutions = !!source.pauseEvolutions;
      this.evoCounter = source.evoCounter ?? 0;
    }
    this.pokerus = !!source.pokerus;
    this.usedTMs = source.usedTMs ?? [];

    this.customPokemonData = new CustomPokemonData(source.customPokemonData);

    if (!forHistory) {
      this.boss = (source instanceof EnemyPokemon && !!source.bossSegments) || (!this.player && !!source.boss);
      this.bossSegments = source.bossSegments;
    }

    if (sourcePokemon) {
      this.moveset = sourcePokemon.moveset;
      if (!forHistory) {
        this.status = sourcePokemon.status;
        if (this.player) {
          this.summonData = sourcePokemon.summonData;
        }
      }
    } else {
      this.moveset = (source.moveset || [new PokemonMove(MoveId.TACKLE), new PokemonMove(MoveId.GROWL)])
        .filter((m) => m)
        .map((m: any) => new PokemonMove(m.moveId, m.ppUsed, m.ppUp, m.virtual, m.maxPpOverride));
      if (!forHistory) {
        this.status = source.status
          ? new Status(source.status.effect, source.status.toxicTurnCount, source.status.sleepTurnsRemaining)
          : null;
      }

      this.summonData = new PokemonSummonData();
      if (!forHistory && source.summonData) {
        this.summonData.stats = source.summonData.stats;
        this.summonData.statStages = source.summonData.statStages;
        this.summonData.moveQueue = source.summonData.moveQueue;
        this.summonData.abilitySuppressed = source.summonData.abilitySuppressed;
        this.summonData.abilitiesApplied = source.summonData.abilitiesApplied;

        this.summonData.ability = source.summonData.ability;
        this.summonData.moveset = source.summonData.moveset?.map((m) => PokemonMove.loadMove(m));
        this.summonData.types = source.summonData.types;

        if (source.summonData.tags) {
          this.summonData.tags = source.summonData.tags?.map((t) => loadBattlerTag(t));
        } else {
          this.summonData.tags = [];
        }
      }
    }
  }

  toPokemon(battleType?: BattleType, partyMemberIndex: number = 0, double: boolean = false): Pokemon {
    const species = getPokemonSpecies(this.species);
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
