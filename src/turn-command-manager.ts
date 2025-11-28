import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import type { BypassSpeedChanceAbAttr } from "#abilities/bypass-speed-chance-ab-attr";
import { globalScene } from "#app/global-scene";
import type { Phase } from "#app/phase";
import { ShuffledPriorityQueue } from "#app/queues/shuffled-priority-queue";
import { AbilityId } from "#enums/ability-id";
import { BattleCommand } from "#enums/battle-command";
import type { BattlerIndex } from "#enums/battler-index";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { PokeballType } from "#enums/pokeball-type";
import { Stat } from "#enums/stat";
import { SwitchType } from "#enums/switch-type";
import type { Pokemon } from "#field/pokemon";
import { PokemonMove } from "#field/pokemon-move";
import { BypassSpeedChanceModifier } from "#modifier/modifier";
import { MoveHeaderAttr } from "#moves/move-header-attr";
import { PursuitAttr } from "#moves/pursuit-attr";
import type { MovePhase } from "#phases/move-phase";
import type { TurnMove } from "#types/move-types";
import { speedOrderComparator } from "#utils/speed-order-utils";

/** Lower number = lower priority */
const COMMAND_PRIORITY_MAP = {
  [BattleCommand.FIGHT]: 0,
  [BattleCommand.TERA]: 1,
  [BattleCommand.POKEMON]: 2,
  [BattleCommand.BALL]: 3,
  [BattleCommand.RUN]: 4,
} as const;

type TurnCommandFilter = (command: TurnCommand) => boolean;

/**
 * Interface representing an action taken by a Pokemon for the turn.
 * Encompasses both Player and Enemy commands.
 */
export interface TurnCommand {
  /** The {@linkcode Pokemon} carrying out the action */
  pokemon: Pokemon;
  /** The type of action to carry out */
  command: BattleCommand;
  /**
   * The cursor index given by the user.
   * Used for {@linkcode Command.POKEMON | switch commands}.
   */
  cursor?: number;
  /**
   * The move for the Pokemon to use.
   * Used for {@linkcode Command.FIGHT | fight commands}.
   */
  turnMove?: TurnMove;
  /**
   * The {@linkcode Pokemon} to target with the action.
   * Used for {@linkcode Command.FIGHT | fight} and
   * {@linkcode Command.BALL | ball} commands
   */
  targets?: BattlerIndex[];
  /** Any other arguments given with this command */
  args?: any[];
}

/**
 * Processes all commands selected by active Pokemon in a turn
 * of battle, translating them into {@linkcode Phase | Phases} based on their
 * respective command type. Turn commands are dynamically ordered
 * as they are processed.
 */
export class TurnCommandManager {
  private readonly queue: ShuffledPriorityQueue<TurnCommand> = new ShuffledPriorityQueue<TurnCommand>(compareTurnOrder);

  private orderIndex: number = 0;
  private appliedMoveHeaders = false;
  /** Tracks how many pending turn commands are currently in the phase queue */
  public commandsInProgress: number = 0;

  //#region Public Methods

  /**
   * Adds a command to the command queue.
   * After command(s) are added, {@linkcode setTurnOrder} should be called
   * to order them correctly.
   * @param turnCommand the command to add
   */
  public addCommand(turnCommand: TurnCommand) {
    const { pokemon } = turnCommand;
    pokemon.turnData.turnCommand = turnCommand;
    // Remove any existing commands by the Pokemon before adding
    this.queue.remove((tc) => tc.pokemon === pokemon);
    this.queue.push(turnCommand);
  }

  /**
   * Obtains the first command in the turn command queue that
   * meets the given condition
   * @param commandFilter The condition to search the command queue by
   * @returns The first {@linkcode TurnCommand} for which `commandFilter` returns
   * `true`, or `undefined` if no such turn command exists.
   */
  public findCommand(commandFilter: TurnCommandFilter): TurnCommand | undefined {
    return this.queue.find(commandFilter);
  }

  /**
   * Obtains the given Pokemon's turn command from the turn queue
   * @param pokemon The {@linkcode Pokemon} whose turn command is requested
   * @returns the {@linkcode TurnCommand} from the given Pokemon, or `undefined`
   * if no such turn command exists.
   */
  public findCommandFromPokemon(pokemon: Pokemon): TurnCommand | undefined {
    return this.findCommand((tc) => tc.pokemon === pokemon);
  }

  /**
   * Removes the first command in the turn command queue that
   * meets the given condition.
   * @param commandFilter Signifies the command should be removed from the queue
   * if evaluated to be `true`.
   * @returns the {@linkcode TurnCommand} that was removed, or `undefined` if no command is removed
   */
  public tryRemoveCommand(commandFilter: TurnCommandFilter): TurnCommand | undefined {
    return this.queue.remove(commandFilter);
  }

  /**
   * Changes the target of a given Pokemon's move command in-place.
   * @param pokemon the Pokemon whose turn command should be modified.
   * @returns `true` if a command was modified
   */
  public tryAdjustMoveCommandTarget(pokemon: Pokemon, newTargets: BattlerIndex[]): boolean {
    const turnCommand = this.findCommandFromPokemon(pokemon);
    if (turnCommand) {
      turnCommand.targets = newTargets;
      return true;
    }
    return false;
  }

  /**
   * Redirects single target move commands from opposing Pokemon from
   * a removed Pokemon to the removed Pokemon's ally.
   * Should only be used during a double battle
   * @param removedPokemon the {@linkcode Pokemon} removed from battle
   */
  public redirectMoveCommandTargetsToAlly(removedPokemon: Pokemon): void {
    const allyPokemon = removedPokemon.getAlly();
    if (!allyPokemon?.isActive(true)) {
      return;
    }

    this.queue.forEach((tc) => {
      if (
        tc.command === BattleCommand.FIGHT
        && tc.pokemon.isPlayer() !== removedPokemon.isPlayer()
        && tc.targets?.length === 1
        && tc.targets[0] === removedPokemon.getBattlerIndex()
      ) {
        tc.targets[0] = allyPokemon.getBattlerIndex();
      }
    });
  }

  /**
   * Schedules the next valid {@linkcode TurnCommand}, adding the command's
   * corresponding phases to {@linkcode globalScene}'s phase queue.
   * If no valid command is found, this ends the current turn.
   */
  public scheduleNextValidCommand(): void {
    while (!this.queue.isEmpty()) {
      if (!this.appliedMoveHeaders && this.queue.every((tc) => tc.command === BattleCommand.FIGHT)) {
        this.applyMoveHeaderAttrs();
      }

      if (this.shiftNextCommand()) {
        return;
      }
    }
    this.endTurn();
  }

  /**
   * Schedules the execution of a {@linkcode TurnCommand}
   * immediately, possibly out of turn order.
   * @param commandFilter the {@linkcode TurnCommandFilter} to determine
   * which command to schedule
   * @returns `true` if a command is found and scheduled for execution
   */
  public preemptCommand(commandFilter: TurnCommandFilter): boolean {
    const turnCommand = this.queue.remove(commandFilter);
    if (turnCommand && this.handleCommand(turnCommand)) {
      turnCommand.pokemon.turnData.order = this.orderIndex++;
      this.commandsInProgress++;
      return true;
    }
    return false;
  }

  /**
   * Schedules the execution of a {@linkcode BattleCommand.FIGHT | FIGHT} command
   * immediately, possibly out of turn order.
   * @param commandFilter the {@linkcode TurnCommandFilter} to determine
   * which command to schedule
   * @returns `true` if a command is found and scheduled for execution
   */
  public preemptFightCommand(commandFilter: TurnCommandFilter): boolean {
    return this.preemptCommand((tc) => tc.command === BattleCommand.FIGHT && commandFilter(tc));
  }

  /**
   * Prepares the start-of-turn sequence after all {@linkcode TurnCommand}s
   * are collected for the turn, then schedules the first turn action.
   */
  public startTurn(): void {
    // Reset the flag indicating move header attributes have been checked and applied this turn
    this.appliedMoveHeaders = false;
    // Apply speed-bypassing effects for all remaining Pokemon
    this.applyBypassSpeedEffects();
    // Add the first valid command to the phase queue.
    this.scheduleNextValidCommand();
  }

  /** Schedules all phases for the game's end-of-turn sequence */
  public endTurn(): void {
    const { phaseManager } = globalScene;
    phaseManager.unshiftPhase(
      phaseManager.createPhase("WeatherEffectPhase"),
      phaseManager.createPhase("BerryPhase"),
      phaseManager.createPhase("CheckStatusEffectPhase"),
      phaseManager.createPhase("TurnEndPhase"),
    );
  }

  /**
   * Changes the given Pokemon's queued command to instead use the given move
   * against the given target(s).
   * @param pokemon the {@linkcode Pokemon} whose command is modified
   * @param move the {@linkcode PokemonMove} replacing the current command's move
   * @param targets the {@linkcode BattlerIndex | targets} for the replacement move
   * @returns `true` if a turn command was modified
   */
  public tryReplaceMove(pokemon: Pokemon, move: PokemonMove, targets: BattlerIndex[]): boolean {
    const turnCommand = this.findCommandFromPokemon(pokemon);
    if (turnCommand?.command !== BattleCommand.FIGHT) {
      return false;
    }

    const newMove: TurnMove = {
      move: move.getMove(),
      targets,
      type: pokemon.getMoveType(move.getMove()),
    };

    turnCommand.turnMove = newMove;
    turnCommand.targets = targets;

    return true;
  }

  /**
   * Forces the first opposing Pokemon in turn order that is intending to use the move Pursuit
   * to immediately Terastallize (if applicable), then attack the target.
   * @param target - The {@linkcode Pokemon} attempting to switch out or retreat
   * @returns `true` if a turn command was scheduled by this call
   */
  public tryPursueTarget(target: Pokemon): boolean {
    const pursuitCommand = this.tryRemoveCommand(
      (tc) => tc.pokemon.isOpponent(target) && !!tc.turnMove?.move.hasAttr(PursuitAttr),
    );
    if (pursuitCommand == null) {
      return false;
    }

    const { command, pokemon, cursor } = pursuitCommand;
    // we know this is defined from the filter above, but TS doesn't
    const turnMove = pursuitCommand.turnMove!;
    const { phaseManager } = globalScene;

    // Pursuing Pokemon that intend to Terastallize do so immediately before attacking.
    // TODO: Terastallizing pursuing Pokemon will always act before non-Tera pursuing
    // Pokemon, regardless of their Speed order.
    if (command === BattleCommand.TERA) {
      phaseManager.createAndUnshiftPhase("TerastallizationPhase", pokemon);
    }

    pokemon.addTag(BattlerTagType.PURSUING);

    const move =
      pokemon.getMoveset().find((m) => m.moveId === turnMove.move.id && m.ppUsed < m.getMovePp())
      ?? new PokemonMove(turnMove.move.id, { pokemonId: pokemon.id });

    phaseManager.unshiftPhase(
      phaseManager.createPhase("MovePhase", pokemon, [target.getBattlerIndex()], move, {
        ignorePp: cursor !== -1 && turnMove.ignorePP,
      }),
      phaseManager.createPhase("PostActionPhase", pokemon.getBattlerIndex(), true),
    );

    pokemon.turnData.order = this.orderIndex++;
    this.commandsInProgress++;
    return true;
  }

  /** @returns `true` if the turn command queue is empty */
  public isEmpty(): boolean {
    return this.queue.isEmpty();
  }

  //#region Private Methods

  /**
   * Dequeues the next turn command and pushes a {@linkcode Phase} based on
   * that command.
   * @returns `true` if a phase was queued as a result of this call.
   */
  private shiftNextCommand(): boolean {
    const nextCommand = this.queue.pop();
    if (nextCommand && this.handleCommand(nextCommand)) {
      nextCommand.pokemon.turnData.order = this.orderIndex++;
      this.commandsInProgress++;
      return true;
    }
    return false;
  }

  /**
   * Validates the given {@linkcode TurnCommand}, then schedules its
   * corresponding phases in {@linkcode globalScene}'s phase queue
   * if the command is valid.
   * @param turnCommand the {@linkcode TurnCommand} to schedule
   * @returns `true` if the turn command is scheduled successfully
   */
  private handleCommand(turnCommand: TurnCommand): boolean {
    switch (turnCommand.command) {
      case BattleCommand.TERA:
        return this.handleTeraCommand(turnCommand);
      case BattleCommand.FIGHT:
        return this.handleFightCommand(turnCommand);
      case BattleCommand.BALL:
        return this.handleBallCommand(turnCommand);
      case BattleCommand.POKEMON:
        return this.handlePokemonCommand(turnCommand);
      case BattleCommand.RUN:
        return this.handleRunCommand(turnCommand);
    }
  }

  /**
   * Validates a given {@linkcode BattleCommand.TERA | Tera} command and
   * schedules a {@linkcode TerastallizationPhase} if valid.
   * Then queues a new {@linkcode BattleCommand.FIGHT | Fight} command.
   * @param turnCommand - The {@linkcode TurnCommand} to validate
   * @returns Whether the command was successful
   */
  private handleTeraCommand(turnCommand: TurnCommand): boolean {
    const { pokemon } = turnCommand;
    const { phaseManager } = globalScene;
    if (!pokemon.isActive(true)) {
      return false;
    }

    phaseManager.appendToPhase(
      "PostActionPhase",
      phaseManager.createPhase("TerastallizationPhase", pokemon),
      phaseManager.createPhase("PostActionPhase", pokemon.getBattlerIndex()),
    );

    const newCommand = turnCommand;
    newCommand.command = BattleCommand.FIGHT;

    this.addCommand(newCommand);
    return true;
  }

  /**
   * Validates a given {@linkcode BattleCommand.FIGHT | FIGHT} command
   * and, if valid, schedules a {@linkcode MovePhase} for the command.
   * @param turnCommand the {@linkcode TurnCommand} to schedule
   * @returns `true` if the turn command is scheduled successfully
   */
  private handleFightCommand(turnCommand: TurnCommand): boolean {
    const { pokemon, cursor, turnMove, targets } = turnCommand;
    const { phaseManager } = globalScene;
    if (!pokemon.isActive(true) || !turnMove) {
      return false;
    }

    const move =
      pokemon.getMoveset().find((m) => m.moveId === turnMove.move.id && m.ppUsed < m.getMovePp())
      ?? new PokemonMove(turnMove.move.id, { pokemonId: pokemon.id });

    phaseManager.appendToPhase(
      "PostActionPhase",
      phaseManager.createPhase("MovePhase", pokemon, targets ?? turnMove.targets, move, {
        ignorePp: cursor !== -1 && turnMove.ignorePP,
      }),
      phaseManager.createPhase("PostActionPhase", pokemon.getBattlerIndex(), true),
    );

    return true;
  }

  /**
   * Validates a given {@linkcode BattleCommand.BALL | BALL} command
   * and, if valid, schedules an {@linkcode AttemptCapturePhase} for the command.
   * @param turnCommand the {@linkcode TurnCommand} to schedule
   * @returns `true` if the turn command is scheduled successfully
   */
  private handleBallCommand(turnCommand: TurnCommand): boolean {
    const { pokemon, cursor, targets } = turnCommand;
    const { phaseManager } = globalScene;

    if (cursor == null || targets == null) {
      console.error("Error encountered when trying to throw Pokeball!");
      console.error(turnCommand);
      return false;
    }

    phaseManager.appendToPhase(
      "PostActionPhase",
      phaseManager.createPhase("AttemptCapturePhase", targets[0] % 2, cursor as PokeballType),
      phaseManager.createPhase("PostActionPhase", pokemon.getBattlerIndex()),
    );

    return true;
  }

  /**
   * Validates a given {@linkcode BattleCommand.POKEMON | POKEMON} command
   * and, if valid, schedules a {@linkcode RecallPhase} and {@linkcode SwitchPhase} for the command.
   * @param turnCommand the {@linkcode TurnCommand} to schedule
   * @returns `true` if the turn command is scheduled successfully
   */
  private handlePokemonCommand(turnCommand: TurnCommand): boolean {
    const { pokemon, cursor, args } = turnCommand;
    const { phaseManager } = globalScene;
    if (cursor == null) {
      console.error("Error encountered when trying to switch Pokemon!");
      console.error(turnCommand);
      return false;
    }

    const switchType = args?.[0] ? SwitchType.BATON_PASS : SwitchType.SWITCH;

    phaseManager.appendToPhase(
      "PostActionPhase",
      phaseManager.createPhase("RecallPhase", pokemon.getBattlerIndex(), switchType),
      phaseManager.createPhase("SwitchPhase", pokemon.getBattlerIndex(), switchType, cursor),
      phaseManager.createPhase("PostActionPhase", pokemon.getBattlerIndex()),
    );

    return true;
  }

  /**
   * Validates a given {@linkcode BattleCommand.RUN | RUN} command
   * and, if valid, schedules a {@linkcode AttemptRunPhase} for the command.
   * @param turnCommand the {@linkcode TurnCommand} to schedule
   * @returns `true` if the turn command is scheduled successfully
   */
  private handleRunCommand(turnCommand: TurnCommand): boolean {
    const { phaseManager } = globalScene;

    let runningPokemon = turnCommand.pokemon;
    if (globalScene.currentBattle.double) {
      const playerActivePokemon = globalScene.getField(true).filter((pokemon) => pokemon.isPlayer());

      if (playerActivePokemon.length > 1) {
        const fasterPokemon = playerActivePokemon.sort((a, b) => b.getStat(Stat.SPD) - a.getStat(Stat.SPD))[0];

        const hasRunAway = playerActivePokemon.find((p) => p.hasAbility(AbilityId.RUN_AWAY));
        runningPokemon = hasRunAway ?? fasterPokemon;
      }
    }

    phaseManager.appendToPhase(
      "PostActionPhase",
      phaseManager.createPhase("AttemptRunPhase", runningPokemon.getFieldIndex()),
      phaseManager.createPhase("PostActionPhase", runningPokemon.getBattlerIndex()),
    );

    return true;
  }

  /**
   * Applies the effects of {@linkcode BypassSpeedChanceAbAttr | Quick Draw}
   * and {@linkcode BypassSpeedChanceModifier | Quick Claw} to all commands
   * in the turn command queue. Quick Draw and Quick Claw each
   * have an independent chance of allowing their respective Pokemon
   * to bypass Speed, but if Quick Draw successfully applies, Quick
   * Claw cannot also apply.
   */
  private applyBypassSpeedEffects(): void {
    this.queue.forEach((tc) => {
      const { pokemon, turnMove } = tc;
      // Only apply to fight commands
      if (turnMove == null) {
        return;
      }

      applyAbAttrs("BypassSpeedChanceAbAttr", pokemon, false, turnMove.move);
      globalScene.applyModifiers(BypassSpeedChanceModifier, pokemon.isPlayer(), pokemon);
    });
  }

  /**
   * Runs the move header effects of all move commands in the
   * turn command queue.
   * @see {@linkcode MoveHeaderPhase}
   * @see {@linkcode MoveHeaderAttr}
   */
  private applyMoveHeaderAttrs(): void {
    this.queue.forEach((tc) => {
      if (tc.command !== BattleCommand.FIGHT) {
        return;
      }
      const { pokemon, turnMove } = tc;
      if (!turnMove) {
        return;
      }
      const pokemonMove =
        pokemon.getMoveset().find((mv) => mv.moveId === turnMove.move.id)
        ?? new PokemonMove(turnMove.move.id, { pokemonId: pokemon.id });

      if (pokemonMove.getMove().hasAttr(MoveHeaderAttr)) {
        globalScene.phaseManager.createAndUnshiftPhase("MoveHeaderPhase", pokemon, pokemonMove);
      }
    });

    this.appliedMoveHeaders = true;
  }
}

// #region Comparators

/**
 * The main comparator used to sort turn commands. Consists of two sub-comparators
 * that are sequentially applied:
 * 1. Pre-Speed comparison modifiers, including command type, move priority, etc.
 * 2. Speed comparison between the commands' source Pokemon.
 *
 * @see {@linkcode comparePreSpeed}
 * @see {@linkcode compareSpeed}
 */
function compareTurnOrder(commandA: TurnCommand, commandB: TurnCommand): number {
  return comparePreSpeed(commandA, commandB) || compareSpeed(commandA, commandB);
}

/**
 * Prioritizes commands based on effects unrelated to the source Pokemon's Speed,
 * including command type, move priority, and Speed-bypassing turn order modifiers
 * such as the effects of Quash and Quick Draw.
 */
function comparePreSpeed(commandA: TurnCommand, commandB: TurnCommand): number {
  if (commandA.command !== commandB.command) {
    return COMMAND_PRIORITY_MAP[commandA.command] > COMMAND_PRIORITY_MAP[commandB.command] ? -1 : 1;
  }

  if (commandA.command === BattleCommand.FIGHT) {
    const [aQuashed, bQuashed] = [commandA, commandB].map(({ pokemon }) => pokemon.hasTag(BattlerTagType.QUASHED));
    if (aQuashed !== bQuashed) {
      return aQuashed ? 1 : -1;
    }

    const priority = [commandA, commandB].map(({ pokemon, turnMove }) => {
      const move = turnMove!.move;
      return move.getPriority(pokemon, true);
    });

    const priorityBrackets = priority.map((p) => Math.ceil(p));
    const bypassSpeed = [commandA, commandB].map(({ pokemon }) => pokemon.hasTag(BattlerTagType.BYPASS_SPEED));

    if (
      priority[0] !== priority[1]
      && (priorityBrackets[0] !== priorityBrackets[1] || bypassSpeed[0] === bypassSpeed[1])
    ) {
      return priority[1] - priority[0];
    }

    if (bypassSpeed[0] !== bypassSpeed[1]) {
      return bypassSpeed[0] ? -1 : 1;
    }
  }
  return 0;
}

/** Prioritizes commands based on their source Pokemon's Speed. */
function compareSpeed(commandA: TurnCommand, commandB: TurnCommand): number {
  const [{ pokemon: pokemonA }, { pokemon: pokemonB }] = [commandA, commandB];
  return speedOrderComparator<Pokemon>(pokemonA, pokemonB);
}
