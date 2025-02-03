import type { FixedBattleConfig } from "#app/battle";
import type PokemonSpecies from "#app/data/pokemon-species";
import type { Pokemon } from "#app/field/pokemon";
import type { GameMode } from "#app/game-mode";
import type { DexAttrProps } from "#app/system/game-data";
import type { BooleanHolder, NumberHolder } from "#app/utils";
import { ChallengeType } from "#enums/challenge-type";
import type { MoveId } from "#enums/move-id";
import type { MoveSourceType } from "#enums/move-source-type";
import type { Species } from "#enums/species";

/**
 * Apply all challenges that modify starter choice.
 * @param gameMode The current {@linkcode GameMode}
 * @param challengeType {@linkcode ChallengeType.STARTER_CHOICE}
 * @param pokemon The {@linkcode PokemonSpecies} to check the validity of.
 * @param valid {@link BooleanHolder} `false` if the pokemon isn't allowed.
 * @param dexAttr {@linkcode DexAttrProps} The dex attributes of the pokemon.
 * @param soft If `true`, allow it if it could become a valid pokemon.
 * @returns `true` if any challenge was successfully applied.
 */
export function applyChallenges(
  gameMode: GameMode,
  challengeType: ChallengeType.STARTER_CHOICE,
  pokemon: PokemonSpecies,
  valid: BooleanHolder,
  dexAttr: DexAttrProps,
  soft: boolean,
): boolean;

/**
 * Apply all challenges that modify available total starter points.
 * @param gameMode The current {@linkcode GameMode}
 * @param challengeType {@linkcode ChallengeType.STARTER_POINTS}
 * @param points {@link NumberHolder} The amount of points you have available.
 * @returns `true` if any challenge was successfully applied.
 */
export function applyChallenges(
  gameMode: GameMode,
  challengeType: ChallengeType.STARTER_POINTS,
  points: NumberHolder,
): boolean;

/**
 * Apply all challenges that modify the cost of a starter.
 * @param gameMode The current {@linkcode GameMode}
 * @param challengeType {@linkcode ChallengeType.STARTER_COST}
 * @param species The pokemon {@linkcode Species} to change the cost of.
 * @param points {@linkcode NumberHolder} The cost of the pokemon.
 * @returns `true` if any challenge was successfully applied.
 */
export function applyChallenges(
  gameMode: GameMode,
  challengeType: ChallengeType.STARTER_COST,
  species: Species,
  cost: NumberHolder,
): boolean;

/**
 * Apply all challenges that modify a starter after selection.
 * @param gameMode The current {@linkcode GameMode}
 * @param challengeType {@linkcode ChallengeType.STARTER_MODIFY}
 * @param pokemon The starter {@linkcode Pokemon} to modify.
 * @returns `true` if any challenge was successfully applied.
 */
export function applyChallenges(
  gameMode: GameMode,
  challengeType: ChallengeType.STARTER_MODIFY,
  pokemon: Pokemon,
): boolean;

/**
 * Apply all challenges that what pokemon you can have in battle.
 * @param gameMode The current {@linkcode GameMode}
 * @param challengeType {@linkcode ChallengeType.POKEMON_IN_BATTLE}
 * @param pokemon The {@linkcode Pokemon} Tcheck the validity of.
 * @param valid {@link BooleanHolder} `false` if the pokemon isn't allowed.
 * @returns `true` if any challenge was successfully applied.
 */
export function applyChallenges(
  gameMode: GameMode,
  challengeType: ChallengeType.POKEMON_IN_BATTLE,
  pokemon: Pokemon,
  valid: BooleanHolder,
): boolean;

/**
 * Apply all challenges that modify what fixed battles there are.
 * @param gameMode The current {@linkcode GameMode}
 * @param challengeType {@linkcode ChallengeType.FIXED_BATTLES}
 * @param waveIndex The current wave index.
 * @param battleConfig The {@link FixedBattleConfig} to modify.
 * @returns `true` if any challenge was successfully applied.
 */
export function applyChallenges(
  gameMode: GameMode,
  challengeType: ChallengeType.FIXED_BATTLES,
  waveIndex: number,
  battleConfig: FixedBattleConfig,
): boolean;

/**
 * Apply all challenges that modify type effectiveness.
 * @param gameMode The current {@linkcode GameMode}
 * @param challengeType {@linkcode ChallengeType.TYPE_EFFECTIVENESS}
 * @param effectiveness {@linkcode NumberHolder} The current effectiveness of the move.
 * @returns `true` if any challenge was successfully applied.
 */
export function applyChallenges(
  gameMode: GameMode,
  challengeType: ChallengeType.TYPE_EFFECTIVENESS,
  effectiveness: NumberHolder,
): boolean;

/**
 * Apply all challenges that modify what level AI are.
 * @param gameMode The current {@linkcode GameMode}
 * @param challengeType {@linkcode ChallengeType.AI_LEVEL}
 * @param level {@link NumberHolder} The generated level of the pokemon.
 * @param levelCap The maximum level cap for the current wave.
 * @param isTrainer Whether this is a trainer pokemon.
 * @param isBoss Whether this is a non-trainer boss pokemon.
 * @returns `true` if any challenge was successfully applied.
 */
export function applyChallenges(
  gameMode: GameMode,
  challengeType: ChallengeType.AI_LEVEL,
  level: NumberHolder,
  levelCap: number,
  isTrainer: boolean,
  isBoss: boolean,
): boolean;

/**
 * Apply all challenges that modify how many move slots the AI has.
 * @param gameMode The current {@linkcode GameMode}
 * @param challengeType {@linkcode ChallengeType.AI_MOVE_SLOTS}
 * @param pokemon The {@linkcode Pokemon} being considered.
 * @param moveSlots {@linkcode NumberHolder} The amount of move slots.
 * @returns `true` if any challenge was successfully applied.
 */
export function applyChallenges(
  gameMode: GameMode,
  challengeType: ChallengeType.AI_MOVE_SLOTS,
  pokemon: Pokemon,
  moveSlots: NumberHolder,
): boolean;

/**
 * Apply all challenges that modify whether a pokemon has its passive.
 * @param gameMode The current {@linkcode GameMode}
 * @param challengeType {@linkcode ChallengeType.PASSIVE_ACCESS}
 * @param pokemon The {@linkcode Pokemon} to modify.
 * @param hasPassive {@linkcode BooleanHolder} Whether it has its passive.
 * @returns `true` if any challenge was successfully applied.
 */
export function applyChallenges(
  gameMode: GameMode,
  challengeType: ChallengeType.PASSIVE_ACCESS,
  pokemon: Pokemon,
  hasPassive: BooleanHolder,
): boolean;

/**
 * Apply all challenges that modify the game modes settings.
 * @param gameMode The current {@linkcode GameMode}
 * @param challengeType {@linkcode ChallengeType.GAME_MODE_MODIFY}
 * @returns `true` if any challenge was successfully applied.
 */
export function applyChallenges(gameMode: GameMode, challengeType: ChallengeType.GAME_MODE_MODIFY): boolean;

/**
 * Apply all challenges that modify what level a pokemon can access a move.
 * @param gameMode The current {@linkcode GameMode}
 * @param challengeType {@linkcode ChallengeType.MOVE_ACCESS}
 * @param pokemon What {@linkcode Pokemon} would learn the move.
 * @param moveSource {@linkcode MoveSourceType} What source the pokemon would get the move from.
 * @param moveId {@linkcode MoveId} The move in question.
 * @param level {@linkcode NumberHolder} The level threshold for access.
 * @returns `true` if any challenge was successfully applied.
 */
export function applyChallenges(
  gameMode: GameMode,
  challengeType: ChallengeType.MOVE_ACCESS,
  pokemon: Pokemon,
  moveSource: MoveSourceType,
  moveId: MoveId,
  level: NumberHolder,
): boolean;

/**
 * Apply all challenges that modify what weight a pokemon gives to move generation
 * @param gameMode The current {@linkcode GameMode}
 * @param challengeType {@linkcode ChallengeType.MOVE_WEIGHT}
 * @param pokemon What {@linkcode Pokemon} would learn the move.
 * @param moveSource {@linkcode MoveSourceType} What source the pokemon would get the move from.
 * @param moveId {@linkcode MoveId} The move in question.
 * @param weight {@linkcode NumberHolder} The weight of the move.
 * @returns `true` if any challenge was successfully applied.
 */
export function applyChallenges(
  gameMode: GameMode,
  challengeType: ChallengeType.MOVE_WEIGHT,
  pokemon: Pokemon,
  moveSource: MoveSourceType,
  moveId: MoveId,
  weight: NumberHolder,
): boolean;

export function applyChallenges(gameMode: GameMode, challengeType: ChallengeType, ...args: any[]): boolean {
  let ret = false;
  gameMode.challenges.forEach((c) => {
    if (c.value !== 0) {
      switch (challengeType) {
        case ChallengeType.STARTER_CHOICE:
          ret ||= c.applyStarterChoice(args[0], args[1], args[2], args[3]);
          break;
        case ChallengeType.STARTER_POINTS:
          ret ||= c.applyStarterPoints(args[0]);
          break;
        case ChallengeType.STARTER_COST:
          ret ||= c.applyStarterCost(args[0], args[1]);
          break;
        case ChallengeType.STARTER_MODIFY:
          ret ||= c.applyStarterModify(args[0]);
          break;
        case ChallengeType.POKEMON_IN_BATTLE:
          ret ||= c.applyPokemonInBattle(args[0], args[1]);
          break;
        case ChallengeType.FIXED_BATTLES:
          ret ||= c.applyFixedBattle(args[0], args[1]);
          break;
        case ChallengeType.TYPE_EFFECTIVENESS:
          ret ||= c.applyTypeEffectiveness(args[0]);
          break;
        case ChallengeType.AI_LEVEL:
          ret ||= c.applyLevelChange(args[0], args[1], args[2], args[3]);
          break;
        case ChallengeType.AI_MOVE_SLOTS:
          ret ||= c.applyMoveSlot(args[0], args[1]);
          break;
        case ChallengeType.PASSIVE_ACCESS:
          ret ||= c.applyPassiveAccess(args[0], args[1]);
          break;
        case ChallengeType.GAME_MODE_MODIFY:
          ret ||= c.applyGameModeModify(gameMode);
          break;
        case ChallengeType.MOVE_ACCESS:
          ret ||= c.applyMoveAccessLevel(args[0], args[1], args[2], args[3]);
          break;
        case ChallengeType.MOVE_WEIGHT:
          ret ||= c.applyMoveWeight(args[0], args[1], args[2], args[3]);
          break;
      }
    }
  });
  return ret;
}
