import { Abilities } from "#enums/abilities";
import { Stat } from "#enums/stat";
import { SwitchType } from "#enums/switch-type";
import type { BattlerIndex } from "./battle";
import { allMoves } from "./data/all-moves";
import { TrickRoomTag } from "./data/arena-tag";
import { PokemonMove, type Pokemon, type QueuedMove } from "./field/pokemon";
import { globalScene } from "./global-scene";
import { AttemptCapturePhase } from "./phases/attempt-capture-phase";
import { AttemptRunPhase } from "./phases/attempt-run-phase";
import { MoveHeaderPhase } from "./phases/move-header-phase";
import { MovePhase } from "./phases/move-phase";
import { SwitchSummonPhase } from "./phases/switch-summon-phase";
import { Command } from "./ui/command-ui-handler";
import { BooleanHolder, isNullOrUndefined, randSeedShuffle } from "./utils";

/**
 * Interface representing an action taken by a Pokemon for the turn.
 * Encompasses both Player and Enemy commands.
 */
export interface TurnCommand {
  /** The {@linkcode Pokemon} carrying out the action */
  pokemon: Pokemon;
  /** The type of action to carry out */
  command: Command;
  /**
   * The cursor index given by the user.
   * Used for {@linkcode Command.POKEMON | switch commands}.
   */
  cursor?: number;
  /**
   * The move for the Pokemon to use.
   * Used for {@linkcode Command.FIGHT | fight commands}.
   */
  move?: QueuedMove;
  /**
   * The {@linkcode Pokemon} to target with the action.
   * Used for {@linkcode Command.FIGHT | fight} and
   * {@linkcode Command.BALL | ball} commands
   */
  targets?: BattlerIndex[];
  /** Any other arguments given with this command */
  args?: any[];
}

export class TurnCommandManager {
  /**
   * The internal {@linkcode TurnCommand} queue.
   *
   * NOTE: This is only `public` to facilitate unit tests that override turn order.
   * Please use this class's API to access and modify turn commands instead
   * of accessing this array directly.
   */
  public turnCommands: TurnCommand[];
  private orderIndex: number;

  constructor() {
    this.turnCommands = [];
    this.orderIndex = 0;
  }

  // --------------  BEGIN PUBLIC METHODS  -------------- //

  /**
   * @returns the {@linkcode TurnCommand} in the turn sequence
   * for the given {@linkcode Pokemon}.
   */
  public getCommand(pokemon: Pokemon): TurnCommand | undefined {
    return this.turnCommands.find((tc) => tc.pokemon === pokemon);
  }

  /**
   * Adds a command to the command queue.
   * After this is called, turn order should be reset
   * using {@linkcode setTurnOrder}.
   * @param turnCommand the command to add
   */
  public addCommand(turnCommand: TurnCommand) {
    const { pokemon } = turnCommand;
    if (pokemon.turnData) {
      pokemon.turnData.turnCommand = turnCommand;
    }
    this.turnCommands.push(turnCommand);
  }

  /**
   * Sorts the turn command queue by the command's turn order
   * @param quiet if `true`, applies abilities and other field effects silently
   */
  public setTurnOrder(quiet: boolean = true): void {
    this.shuffle();
    this.sortBySpeed();
    this.sortPostSpeed(quiet);
  }

  /**
   * Obtains the first command in the turn command queue that
   * meets the given condition
   * @param commandFilter The condition to search the command queue by
   * @returns The first {@linkcode TurnCommand} for which `commandFilter` returns
   * `true`, or `undefined` if no such turn command exists.
   */
  public findCommand(commandFilter: (command: TurnCommand) => boolean): TurnCommand | undefined {
    return this.turnCommands.find((tc) => commandFilter(tc));
  }

  /**
   * Removes the first command in the turn command queue that
   * meets the given condition.
   * @param commandFilter Signifies the command should be removed from the queue
   * if evaluated to be `true`.
   * @returns `true` if a command was removed
   */
  public tryRemoveCommand(commandFilter: (command: TurnCommand) => boolean): boolean {
    const cmdIndex = this.turnCommands.findIndex((tc) => commandFilter(tc));
    if (cmdIndex > -1) {
      this.turnCommands.splice(cmdIndex, 1);
      return true;
    }
    return false;
  }

  /**
   * Changes the target of a given Pokemon's move command in-place.
   * @param pokemon the Pokemon whose turn command should be modified.
   */
  public tryAdjustMoveCommandTarget(pokemon: Pokemon, newTargets: BattlerIndex[]): boolean {
    const turnCommand = this.findCommand((tc) => tc.pokemon === pokemon);
    if (turnCommand) {
      turnCommand.targets = newTargets;
      return true;
    }
    return false;
  }

  /**
   * Dequeues the next turn command and unshifts a {@linkcode Phase} based on
   * that command.
   * @returns `true` if a phase was queued as a result of this call.
   */
  public shiftNextCommand(): boolean {
    const nextCommand = this.turnCommands.shift();
    if (!nextCommand) {
      return false;
    }

    switch (nextCommand.command) {
      case Command.FIGHT:
        return this.handleFightCommand(nextCommand);
      case Command.BALL:
        return this.handleBallCommand(nextCommand);
      case Command.POKEMON:
        return this.handlePokemonCommand(nextCommand);
      case Command.RUN:
        return this.handleRunCommand(nextCommand);
    }
  }

  /** Schedules all turn commands to be run at the start of the turn. */
  public startTurn(): void {
    // Shuffle and sort turn commands by speed, command type, priority, etc.
    this.setTurnOrder(false);
    // Add all commands that aren't using moves to the phase queue
    this.shiftNonFightCommands();
    // Add all move header effects to the phase queue
    this.applyMoveHeaderAttrs();
    // Add the first valid move command to the phase queue.
    // This loop ensures that skipped and invalid commands do not
    // freeze the turn sequence.
    while (!this.empty() && this.shiftNextCommand());
  }

  public empty(): boolean {
    return !this.turnCommands.length;
  }

  // ---------------  END PUBLIC METHODS  --------------- //

  /** Randomly shuffles the turn command queue. */
  private shuffle(): void {
    // This is seeded with the current turn to prevent an inconsistency where it
    // was varying based on how long since you last reloaded
    globalScene.executeWithSeedOffset(
      () => {
        this.turnCommands = randSeedShuffle(this.turnCommands);
      },
      globalScene.currentBattle.turn,
      globalScene.waveSeed,
    );
  }

  /**
   * Sorts turn commands in decreasing order of their Pokemon's Speed
   * stat. If Trick Room is active, this sorts commands in increasing
   * order of Speed instead.
   * @param turnStart - if `true`, applies start-of-turn effects that may
   * change speed order.
   */
  private sortBySpeed(): void {
    /** 'true' if Trick Room is on the field. */
    const speedReversed = new BooleanHolder(false);
    globalScene.arena.applyTags(TrickRoomTag, false, speedReversed);

    this.turnCommands.sort((a, b) => {
      const [aSpeed, bSpeed] = [a, b].map((command) => command.pokemon.getEffectiveStat(Stat.SPD) ?? 0);

      return speedReversed.value ? aSpeed - bSpeed : bSpeed - aSpeed;
    });
  }

  /**
   * Comparison function used to sort turn commands by
   * command type, move priority, and other factors.
   * A negative number implies that command `a` should precede `b`.
   * @param quiet if `true`, applies abilities and other field effects silently
   */
  private sortPostSpeed(quiet: boolean = true): void {
    this.turnCommands.sort((a: TurnCommand, b: TurnCommand) => {
      if (a.command !== b.command) {
        if (a.command === Command.FIGHT) {
          return 1;
        } else if (b.command === Command.FIGHT) {
          return -1;
        }
      } else if (a.command === Command.FIGHT) {
        const [aPriority, bPriority] = [a, b].map((tc) => {
          const move = allMoves[tc.move!.move];
          return move.getPriority(tc.pokemon, quiet);
        });

        if (aPriority !== bPriority) {
          return aPriority < bPriority ? 1 : -1;
        }
      }
      return 0;
    });
  }

  private handleFightCommand(turnCommand: TurnCommand): boolean {
    const { pokemon, cursor, move: queuedMove, targets } = turnCommand;
    pokemon.turnData.order = this.orderIndex++;

    if (!queuedMove) {
      return false;
    }

    const move =
      pokemon.getMoveset().find((m) => m.moveId === queuedMove.move && m.ppUsed < m.getMovePp())
      ?? new PokemonMove(queuedMove.move);

    globalScene.unshiftPhase(
      new MovePhase(pokemon, targets ?? queuedMove.targets, move, false, cursor !== -1 && queuedMove.ignorePP),
    );
    return true;
  }

  private handleBallCommand(turnCommand: TurnCommand): boolean {
    const { cursor, targets } = turnCommand;

    if (isNullOrUndefined(cursor) || isNullOrUndefined(targets)) {
      console.error("Error encountered when trying to throw Pokeball!");
      console.error(turnCommand);
      return false;
    }

    globalScene.unshiftPhase(new AttemptCapturePhase(targets[0] % 2, cursor));
    return true;
  }

  private handlePokemonCommand(turnCommand: TurnCommand): boolean {
    const { pokemon, cursor } = turnCommand;
    if (isNullOrUndefined(cursor)) {
      console.error("Error encountered when trying to switch Pokemon!");
      console.error(turnCommand);
      return false;
    }

    const switchType = turnCommand.args?.[0] ? SwitchType.BATON_PASS : SwitchType.SWITCH;
    globalScene.unshiftPhase(
      new SwitchSummonPhase(switchType, pokemon.getFieldIndex(), cursor, true, pokemon.isPlayer()),
    );
    return true;
  }

  private handleRunCommand(turnCommand: TurnCommand): boolean {
    let runningPokemon = turnCommand.pokemon;
    if (globalScene.currentBattle.double) {
      const playerActivePokemon = globalScene.getField(true).filter((pokemon) => pokemon.isPlayer());

      if (playerActivePokemon.length > 1) {
        const fasterPokemon = playerActivePokemon.sort((a, b) => b.getStat(Stat.SPD) - a.getStat(Stat.SPD))[0];

        const hasRunAway = playerActivePokemon.find((p) => p.hasAbility(Abilities.RUN_AWAY));
        runningPokemon = hasRunAway ?? fasterPokemon;
      }
    }
    globalScene.unshiftPhase(new AttemptRunPhase(runningPokemon.getFieldIndex()));
    return true;
  }

  /**
   * Shifts all {@linkcode Command.BALL | BALL}, {@linkcode Command.POKEMON | POKEMON},
   * and {@linkcode Command.RUN | RUN} commands in the queue.
   * Turn commands in the queue should be sorted with {@linkcode setTurnOrder}
   * before this function is called.
   */
  private shiftNonFightCommands(): void {
    while (this.turnCommands[0] && this.turnCommands[0].command !== Command.FIGHT) {
      this.shiftNextCommand();
    }
  }

  /**
   * Runs the move header effects of all move commands in the
   * turn command queue.
   * @see {@linkcode MoveHeaderPhase}
   * @see {@linkcode MoveHeaderAttr}
   */
  private applyMoveHeaderAttrs(): void {
    this.turnCommands.forEach((tc) => {
      if (tc.command !== Command.FIGHT) {
        return;
      }
      const { pokemon, move: queuedMove } = tc;
      if (!queuedMove) {
        return;
      }
      const pokemonMove =
        pokemon.getMoveset().find((mv) => mv.moveId === queuedMove.move) ?? new PokemonMove(queuedMove.move);

      globalScene.unshiftPhase(new MoveHeaderPhase(pokemon, pokemonMove));
    });
  }
}
