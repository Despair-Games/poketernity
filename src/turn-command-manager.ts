/* biome-ignore-start lint/correctness/noUnusedImports: tsdoc imports */
import type { Phase } from "#app/phase";
import type { MovePhase } from "#phases/move-phase";
/* biome-ignore-end lint/correctness/noUnusedImports: tsdoc imports */

import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import type { BypassSpeedChanceAbAttr } from "#abilities/bypass-speed-chance-ab-attr";
import { globalScene } from "#app/global-scene";
import type { TrickRoomTag } from "#arena-tags/trick-room-tag";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { AbilityId } from "#enums/ability-id";
import { ArenaTagSide } from "#enums/arena-tag-side";
import { ArenaTagType } from "#enums/arena-tag-type";
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
import type { TurnMove } from "#types/move-types";
import { BooleanHolder } from "#utils/common-utils";
import { randSeedShuffle } from "#utils/random-utils";

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

export class TurnCommandManager {
  /** The internal {@linkcode TurnCommand} queue. */
  private turnCommands: TurnCommand[] = [];
  // biome-ignore lint/style/useReadonlyClassProperties: false positive
  private orderIndex: number = 0;
  private appliedMoveHeaders = false;
  /** Tracks how many pending turn commands are currently in the phase queue */
  public commandsInProgress: number = 0;

  // #region Public Methods

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
    this.tryRemoveCommand((tc) => tc.pokemon === pokemon);
    this.turnCommands.push(turnCommand);
  }

  /**
   * Sorts the turn command queue by the command's turn order
   * @param quiet if `true`, applies abilities and other field effects silently
   */
  public setTurnOrder(quiet: boolean = true): void {
    this.shuffle(); // shuffle the list before sorting so speed ties produce random results
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
  public findCommand(commandFilter: TurnCommandFilter): TurnCommand | undefined {
    return this.turnCommands.find(commandFilter);
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
    const cmdIndex = this.turnCommands.findIndex(commandFilter);
    if (cmdIndex > -1) {
      return this.turnCommands.splice(cmdIndex, 1)[0];
    }
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

    this.turnCommands.forEach((tc) => {
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
    while (!this.isEmpty()) {
      if (!this.appliedMoveHeaders && this.turnCommands.every((tc) => tc.command === BattleCommand.FIGHT)) {
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
    const turnCommand = this.tryRemoveCommand(commandFilter);
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
    // Shuffle and sort turn commands by speed, command type, priority, etc.
    this.setTurnOrder(false);
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

  public isEmpty(): boolean {
    return !this.turnCommands.length;
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

  // #region Private Methods

  /** Randomly shuffles the turn command queue. */
  private shuffle(): void {
    // This is seeded with the current turn to prevent an inconsistency where it
    // was varying based on how long since you last reloaded
    globalScene.executeWithSeedOffset(
      () => {
        this.turnCommands = randSeedShuffle(this.turnCommands);
      },
      globalScene.currentBattle.turn * 1000 + this.turnCommands.length,
      globalScene.waveSeed,
    );
  }

  /**
   * Sorts turn commands in decreasing order of their Pokemon's Speed
   * stat. If Trick Room is active, this sorts commands in increasing
   * order of Speed instead.
   */
  private sortBySpeed(): void {
    this.turnCommands.sort((a, b) => {
      const [aSpeed, bSpeed] = [a, b].map((command) => command.pokemon.getEffectiveStat(Stat.SPD));
      return bSpeed - aSpeed;
    });

    /** 'true' if Trick Room is on the field. */
    const speedReversed = new BooleanHolder(false);
    globalScene.arena.applyTags<TrickRoomTag>(ArenaTagType.TRICK_ROOM, ArenaTagSide.BOTH, false, speedReversed);

    if (speedReversed.value) {
      this.turnCommands = this.turnCommands.reverse();
    }
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
        return COMMAND_PRIORITY_MAP[a.command] > COMMAND_PRIORITY_MAP[b.command] ? -1 : 1;
      }
      if (a.command === BattleCommand.FIGHT) {
        const [aQuashed, bQuashed] = [a, b].map((tc) => tc.pokemon.hasTag(BattlerTagType.QUASHED));
        if ((aQuashed || bQuashed) && aQuashed !== bQuashed) {
          return aQuashed ? 1 : -1;
        }

        const priority = [a, b].map((tc) => {
          const move = tc.turnMove!.move;
          return move.getPriority(tc.pokemon, quiet);
        });

        const priorityBrackets = priority.map((p) => Math.ceil(p));
        const bypassSpeed = [a, b].map((tc) => tc.pokemon.hasTag(BattlerTagType.BYPASS_SPEED));

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
    });
  }

  /**
   * Dequeues the next turn command and pushes a {@linkcode Phase} based on
   * that command.
   * @returns `true` if a phase was queued as a result of this call.
   */
  private shiftNextCommand(): boolean {
    const nextCommand = this.turnCommands.shift();
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
    this.turnCommands.forEach((tc) => {
      const { pokemon, turnMove } = tc;
      // Only apply to fight commands
      if (!turnMove) {
        return;
      }

      applyAbAttrs<BypassSpeedChanceAbAttr>(AbAttrFlag.BYPASS_SPEED_CHANCE, pokemon, false, turnMove.move);
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
    this.turnCommands.forEach((tc) => {
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
