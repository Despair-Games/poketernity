import { AbAttrFlag } from "#enums/ab-attr-flag";
import { Abilities } from "#enums/abilities";
import { ArenaTagType } from "#enums/arena-tag-type";
import { BattleCommand } from "#enums/battle-command";
import type { BattlerIndex } from "#enums/battler-index";
import { BattlerTagType } from "#enums/battler-tag-type";
import { PhaseId } from "#enums/phase-id";
import { Stat } from "#enums/stat";
import { SwitchType } from "#enums/switch-type";
import type { TurnCommandFilter } from "./@types/TurnCommandFilter";
import type { TurnMove } from "./@types/TurnMove";
import type { BypassSpeedChanceAbAttr } from "./data/ab-attrs/bypass-speed-chance-ab-attr";
import { applyAbAttrs } from "./data/apply-ab-attrs";
import { MoveHeaderAttr } from "./data/move-attrs/move-header-attr";
import type { Pokemon } from "./field/pokemon";
import { PokemonMove } from "./field/pokemon-move";
import { globalScene } from "./global-scene";
import { BypassSpeedChanceModifier } from "./modifier/modifier";
import { AttemptCapturePhase } from "./phases/attempt-capture-phase";
import { AttemptRunPhase } from "./phases/attempt-run-phase";
import { MoveHeaderPhase } from "./phases/move-header-phase";
import { MovePhase } from "./phases/move-phase";
import { SwitchSummonPhase } from "./phases/switch-summon-phase";
import { BooleanHolder, isNullOrUndefined, randSeedShuffle } from "./utils";

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
  /**
   * The internal {@linkcode TurnCommand} queue.
   *
   * NOTE: This is only `public` to facilitate unit tests that override turn order.
   * Please use this class's API to access and modify turn commands instead
   * of accessing this array directly.
   */
  public turnCommands: TurnCommand[] = [];
  private orderIndex: number = 0;

  // #region Public Methods

  /**
   * Adds a command to the command queue.
   * After command(s) are added, {@linkcode setTurnOrder} should be called
   * to order them correctly.
   * @param turnCommand the command to add
   */
  public addCommand(turnCommand: TurnCommand) {
    const { pokemon } = turnCommand;
    if (pokemon.turnData) {
      pokemon.turnData.turnCommand = turnCommand;
    }
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
      case BattleCommand.FIGHT:
        return this.handleFightCommand(nextCommand);
      case BattleCommand.BALL:
        return this.handleBallCommand(nextCommand);
      case BattleCommand.POKEMON:
        return this.handlePokemonCommand(nextCommand);
      case BattleCommand.RUN:
        return this.handleRunCommand(nextCommand);
    }
  }

  /**
   * Schedules the next valid turn command, unshifting a {@linkcode Phase}
   * based on that commmand. This is usually preferred over
   * {@linkcode shiftNextCommand} when phases need to be scheduled in-turn
   * since it skips over invalid commands in the queue.
   */
  public scheduleNextValidCommand(): void {
    while (!this.isEmpty() && !this.shiftNextCommand());
  }

  /**
   * Schedules the execution of a {@linkcode Command.FIGHT | FIGHT} command
   * immediately, possibly out of turn order.
   * This should not be used when command types other than `FIGHT`
   * are present in the turn command queue.
   * @param commandFilter
   * @returns `true` if a command is found and scheduled for execution
   */
  public preemptFightCommand(commandFilter: TurnCommandFilter): boolean {
    if (this.turnCommands.some((tc) => tc.command !== BattleCommand.FIGHT)) {
      console.warn("Found non-FIGHT commands in the turn command queue when trying to preempt a FIGHT command");
      return false;
    }

    const turnCommand = this.tryRemoveCommand((tc) => tc.command === BattleCommand.FIGHT && commandFilter(tc));

    if (turnCommand) {
      const { pokemon, cursor, turnMove: turnMove, targets } = turnCommand;
      if (!pokemon.isActive(true) || !turnMove) {
        return false;
      }

      pokemon.turnData.order = this.orderIndex++;

      const move =
        pokemon.getMoveset().find((m) => m.moveId === turnMove.move.id && m.ppUsed < m.getMovePp())
        ?? new PokemonMove(turnMove.move.id);

      globalScene.appendToPhase(
        new MovePhase(pokemon, targets ?? turnMove.targets, move, false, cursor !== -1 && turnMove.ignorePP),
        PhaseId.MOVE_END,
      );

      return true;
    }
    return false;
  }

  /** Schedules all turn commands to be run at the start of the turn. */
  public startTurn(): void {
    // Apply speed-bypassing effects for all remaining Pokemon
    /** @todo Find a way to apply this after non-FIGHT commands are processed */
    this.applyBypassSpeedEffects();
    // Shuffle and sort turn commands by speed, command type, priority, etc.
    this.setTurnOrder(false);
    // Add all commands that aren't using moves to the phase queue
    this.shiftNonFightCommands();
    // Add all move header effects to the phase queue
    this.applyMoveHeaderAttrs();
    // Add the first valid move command to the phase queue.
    // This loop ensures that skipped and invalid commands do not
    // freeze the turn sequence.
    this.scheduleNextValidCommand();
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
    globalScene.arena.applyTags(ArenaTagType.TRICK_ROOM, false, speedReversed);

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
        if (a.command === BattleCommand.FIGHT) {
          return 1;
        } else if (b.command === BattleCommand.FIGHT) {
          return -1;
        }
      } else if (a.command === BattleCommand.FIGHT) {
        const [aQuashed, bQuashed] = [a, b].map((tc) => !!tc.pokemon.getTag(BattlerTagType.QUASHED));
        if ((aQuashed || bQuashed) && aQuashed !== bQuashed) {
          return aQuashed ? 1 : -1;
        }

        const priority = [a, b].map((tc) => {
          const move = tc.turnMove!.move;
          return move.getPriority(tc.pokemon, quiet);
        });

        const priorityBrackets = priority.map((p) => Math.ceil(p));
        const bypassSpeed = [a, b].map((tc) => !!tc.pokemon.getTag(BattlerTagType.BYPASS_SPEED));

        if (priority[0] !== priority[1]) {
          if (priorityBrackets[0] !== priorityBrackets[1] || bypassSpeed[0] === bypassSpeed[1]) {
            return priority[1] - priority[0];
          }
        }

        if (bypassSpeed[0] !== bypassSpeed[1]) {
          return bypassSpeed[0] ? -1 : 1;
        }
      }
      return 0;
    });
  }

  private handleFightCommand(turnCommand: TurnCommand): boolean {
    const { pokemon, cursor, turnMove, targets } = turnCommand;
    if (!pokemon.isActive(true) || !turnMove) {
      console.warn(`FIGHT command from ${pokemon?.name} is invalid`);
      return false;
    }

    pokemon.turnData.order = this.orderIndex++;

    const move =
      pokemon.getMoveset().find((m) => m.moveId === turnMove.move.id && m.ppUsed < m.getMovePp())
      ?? new PokemonMove(turnMove.move.id);

    globalScene.unshiftPhase(
      new MovePhase(pokemon, targets ?? turnMove.targets, move, false, cursor !== -1 && turnMove.ignorePP),
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
   * Shifts all {@linkcode BattleCommand.BALL | BALL}, {@linkcode BattleCommand.POKEMON | POKEMON},
   * and {@linkcode BattleCommand.RUN | RUN} commands in the queue.
   * Turn commands in the queue should be sorted with {@linkcode setTurnOrder}
   * before this function is called.
   */
  private shiftNonFightCommands(): void {
    while (this.turnCommands[0] && this.turnCommands[0].command !== BattleCommand.FIGHT) {
      this.shiftNextCommand();
    }
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
        pokemon.getMoveset().find((mv) => mv.moveId === turnMove.move.id) ?? new PokemonMove(turnMove.move.id);

      if (pokemonMove.getMove().hasAttr(MoveHeaderAttr)) {
        globalScene.unshiftPhase(new MoveHeaderPhase(pokemon, pokemonMove));
      }
    });
  }
}
