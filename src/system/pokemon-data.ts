import { globalScene } from "#app/global-scene";
import { loadBattlerTag } from "#battler-tags/load-battler-tag";
import { allMoves } from "#data/data-lists";
import type { PokemonSpeciesForm } from "#data/pokemon-species-form";
import type { Variant } from "#data/variant";
import { BattleType } from "#enums/battle-type";
import type { BiomeId } from "#enums/biome-id";
import type { ElementalType } from "#enums/elemental-type";
import type { Gender } from "#enums/gender";
import { MoveId } from "#enums/move-id";
import { Nature } from "#enums/nature";
import type { PokeballType } from "#enums/pokeball-type";
import type { SpeciesId } from "#enums/species-id";
import { TrainerSlot } from "#enums/trainer-slot";
import type { Pokemon } from "#field/pokemon";
import { PokemonMove } from "#field/pokemon-move";
import type { CustomPokemonData, PokemonSummonData, SerializedSpeciesForm, Status } from "#types/pokemon-types";
import { clamp, isNil, isPokemon } from "#utils/common-utils";
import { getPokemonSpecies, getPokemonSpeciesForm, summonDataToJSON } from "#utils/pokemon-utils";

/**
 * Deserialize a pokemon species form from an object containing `speciesId` and `formIndex` properties.
 * @param value - The value to deserialize
 * @returns The `PokemonSpeciesForm`, or `null` if the fields could not be properly discerned
 */
function deserializePokemonSpeciesForm(value: SerializedSpeciesForm | PokemonSpeciesForm): PokemonSpeciesForm | null {
  const { speciesId } = value;
  const formIndex = value.formIndex ?? value["_formIndex"];

  // If for some reason either of these fields are `null`/`undefined`, we cannot reconstruct the species form
  if (isNil(speciesId) || isNil(formIndex)) {
    console.warn(`Error when deserializing Pokemon Species Form\nSpecies ID: ${speciesId} | Form index: ${formIndex}`);
    return null;
  }
  return getPokemonSpeciesForm(speciesId, formIndex);
}

export class PokemonData {
  public id: number;
  public personalityValue: number;
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
   * @todo Improve typing situation
   * @todo Determine if any of the `??` are necessary
   */
  constructor(source: Pokemon | PokemonData) {
    this.id = source.id;
    this.personalityValue = source.personalityValue ?? source.id; // TODO: temporary `??` to handle dev saves from before this was added, remove in the future
    this.player = isPokemon(source) ? source.isPlayer() : source.player;
    this.speciesId = isPokemon(source) ? source.species.speciesId : source.speciesId;
    this.nickname = source.nickname;
    this.formIndex = clamp(source.formIndex, 0, Math.max(getPokemonSpecies(this.speciesId).forms.length - 1, 0));
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
    this.pauseEvolutions = source.pauseEvolutions;
    this.evoCounter = source.evoCounter ?? 0;
    this.pokerus = source.pokerus;
    this.usedTMs = source.usedTMs ?? [];
    this.teraType = source.teraType;
    this.isTerastallized = source.isTerastallized ?? false;
    this.stellarTypesBoosted = source.stellarTypesBoosted ?? [];
    this.status = source["status"];

    this.customPokemonData = source.customPokemonData;

    if (!isPokemon(source) || source.isEnemy()) {
      this.boss = (source.bossSegments ?? 0) > 0;
      this.bossSegments = source.bossSegments;
    }

    if (isPokemon(source)) {
      this.moveset = source["moveset"];
      this.summonData = source.summonData;
      return;
    }

    // This is required because the full class object doesn't exist in save data
    this.moveset = source.moveset.map((m) => PokemonMove.loadMove(m)) ?? [
      new PokemonMove(MoveId.TACKLE),
      new PokemonMove(MoveId.GROWL),
    ];

    this.summonData = source.summonData;
    this.summonData.toJSON = summonDataToJSON;
    // This is required because the full class object doesn't exist in save data
    this.summonData.moveset = source.summonData.moveset?.map((m) => PokemonMove.loadMove(m)) ?? [];
    // This is required because the full class object doesn't exist in save data
    this.summonData.tags = source.summonData.tags?.map((t) => loadBattlerTag(t)) ?? [];
    if (source.summonData.speciesForm) {
      this.summonData.speciesForm = deserializePokemonSpeciesForm(source.summonData.speciesForm);
    }
    for (const turnMove of this.summonData.moveHistory) {
      // This is required because the full class object doesn't exist in save data
      turnMove.move = allMoves.get(turnMove.move.id);
    }
    for (const turnMove of this.summonData.moveQueue) {
      // This is required because the full class object doesn't exist in save data
      turnMove.move = allMoves.get(turnMove.move.id);
    }
  }

  toPokemon(battleType?: BattleType, partyMemberIndex: number = 0, double: boolean = false): Pokemon {
    const species = getPokemonSpecies(this.speciesId);
    let ret: Pokemon;
    if (this.player) {
      ret = globalScene.addPlayerPokemon(
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
      );
    } else {
      let trainerSlot: TrainerSlot = TrainerSlot.NONE;
      if (battleType === BattleType.TRAINER) {
        if (!double || partyMemberIndex % 2 === 0) {
          trainerSlot = TrainerSlot.TRAINER;
        } else {
          trainerSlot = TrainerSlot.TRAINER_PARTNER;
        }
      }
      ret = globalScene.addEnemyPokemon(species, this.level, trainerSlot, this.boss, false, this);
    }
    ret.primeSummonData(this.summonData);
    return ret;
  }
}
