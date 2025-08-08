import { globalScene } from "#app/global-scene";
import { allMoves } from "#data/data-lists";
import { MoveFlags } from "#enums/move-flags";
import type { MoveId } from "#enums/move-id";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { isNil, toDmgValue } from "#utils/common-utils";
import i18next from "i18next";

/**
 * Wrapper class for the {@linkcode Move} class for Pokemon to interact with.
 * These are the moves assigned to a {@linkcode Pokemon} object.
 * It links to {@linkcode Move} class via the move ID.
 * Compared to {@linkcode Move}, this class also tracks if a move has received
 * PP Ups, amount of PP used, and things like that.
 * @see {@linkcode isUsable} - checks if move is restricted, out of PP, or not implemented.
 * @see {@linkcode getMove} - returns {@linkcode Move} object by looking it up via ID.
 * @see {@linkcode usePp} - removes a point of PP from the move.
 * @see {@linkcode getMovePp} - returns amount of PP a move currently has.
 * @see {@linkcode getPpRatio} - returns the current PP amount / max PP amount.
 * @see {@linkcode getName} - returns name of the {@linkcode Move}.
 **/
export class PokemonMove {
  /** The ID of the {@linkcode Pokemon} whose moveset this move is part of. Used for localization of the move name. */
  private readonly pokemonId: number;
  public moveId: MoveId;
  public ppUsed: number;
  public ppUp: number;
  public virtual: boolean;

  /**
   * If defined and nonzero, overrides the maximum PP of the move (e.g., due to move being copied by Transform).
   * This also nullifies all effects of `ppUp`.
   */
  public maxPpOverride?: number;

  constructor(
    moveId: MoveId,
    {
      pokemonId = 0,
      ppUsed = 0,
      ppUp = 0,
      virtual = false,
      maxPpOverride,
    }: {
      pokemonId?: number;
      ppUsed?: number;
      ppUp?: number;
      virtual?: boolean;
      maxPpOverride?: number;
    } = {},
  ) {
    this.pokemonId = pokemonId;
    this.moveId = moveId;
    this.ppUsed = ppUsed;
    this.ppUp = ppUp;
    this.virtual = virtual;
    this.maxPpOverride = maxPpOverride;
  }

  private get pokemon(): Pokemon | undefined {
    return globalScene.getPokemonById(this.pokemonId) ?? undefined;
  }

  public get name(): string {
    if (isNil(this.pokemon)) {
      return this.getMove().name;
    }
    const moveName = this.getMove().name;
    const isMax = this.getMove().checkFlag(MoveFlags.G_MAX_MOVE, this.pokemon) && this.pokemon.isMax();
    if (isMax) {
      return i18next.t("move:moveFormatWithGMax", { moveName });
    }
    return moveName;
  }

  /**
   * Checks whether the move can be selected or performed by a Pokemon, without consideration for the move's targets.
   * The move is unusable if it is out of PP, restricted by an effect, or unimplemented.
   *
   * @param pokemon {@linkcode Pokemon} that would be using this move
   * @param ignorePp If `true`, skips the PP check
   * @param ignoreRestrictionTags If `true`, skips the check for move restriction tags (see {@link MoveRestrictionBattlerTag})
   * @returns `true` if the move can be selected and used by the Pokemon, otherwise `false`.
   */
  isUsable(pokemon: Pokemon, ignorePp: boolean = false, ignoreRestrictionTags: boolean = false): boolean {
    if (this.moveId && !ignoreRestrictionTags && pokemon.isMoveRestricted(this.moveId, pokemon)) {
      return false;
    }

    if (this.getMove().name.endsWith(" (N)")) {
      return false;
    }

    return ignorePp || this.ppUsed < this.getMovePp() || this.getMove().pp === -1;
  }

  getMove(): Move {
    return allMoves.get(this.moveId);
  }

  /**
   * Sets {@link ppUsed} for this move and ensures the value does not exceed {@link getMovePp}
   * @param count Amount of PP to use
   */
  usePp(count: number = 1) {
    this.ppUsed = Math.min(this.ppUsed + count, this.getMovePp());
  }

  getMovePp(): number {
    return this.maxPpOverride || this.getMove().pp + this.ppUp * toDmgValue(this.getMove().pp / 5);
  }

  getPpRatio(): number {
    return 1 - this.ppUsed / this.getMovePp();
  }

  /**
   * Copies an existing move or creates a valid PokemonMove object from json representing one
   * @param source The data for the {@linkcode PokemonMove | move} to copy
   * @returns A valid {@linkcode PokemonMove} object
   */
  static loadMove(source: PokemonMove | any): PokemonMove {
    const { pokemonId, moveId, ppUsed, ppUp, virtual, maxPpOverride } = source;
    return new PokemonMove(moveId, { pokemonId, ppUsed, ppUp, virtual, maxPpOverride });
  }
}
