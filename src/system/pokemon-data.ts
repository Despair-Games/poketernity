import { globalScene } from "#app/global-scene";
import { loadBattlerTag } from "#battler-tags/load-battler-tag";
import { CustomPokemonData } from "#data/custom-pokemon-data";
import { allMoves } from "#data/data-lists";
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
import type { PokemonSummonData, Status } from "#types/pokemon-types";
import { clamp, isPokemon } from "#utils/common-utils";
import { getPokemonSpecies, getPokemonSpeciesForm } from "#utils/pokemon-utils";

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
    this.luck = source.luck ?? (source.shiny ? source.variant + 1 : 0);
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

    if (!isPokemon(source) || source.isEnemy()) {
      this.boss = (source.bossSegments ?? 0) > 0;
      this.bossSegments = source.bossSegments;
    }

    if (isPokemon(source)) {
      // @ts-expect-error - `Pokemon#moveset` is `protected`
      this.moveset = source.moveset;
      this.summonData = source.summonData;
      return;
    }

    // This is required because the full class object doesn't exist in save data
    this.moveset = source.moveset.map((m) => PokemonMove.loadMove(m)) ?? [
      new PokemonMove(MoveId.TACKLE),
      new PokemonMove(MoveId.GROWL),
    ];

    this.summonData = source.summonData;
    // This is required because the full class object doesn't exist in save data
    this.summonData.moveset = source.summonData.moveset?.map((m) => PokemonMove.loadMove(m)) ?? [];
    // This is required because the full class object doesn't exist in save data
    this.summonData.tags = source.summonData.tags?.map((t) => loadBattlerTag(t)) ?? [];
    if (source.summonData.speciesForm) {
      this.summonData.speciesForm = getPokemonSpeciesForm(
        source.summonData.speciesForm.speciesId,
        // @ts-expect-error - `_formIndex` is protected but we can't use `.formIndex` because it's a getter and the class data is lost
        source.summonData.speciesForm._formIndex,
      );
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
    ret.primeSummonData(this.summonData);
    return ret;
  }
}
