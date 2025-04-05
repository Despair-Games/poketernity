import type { BattlerIndex } from "#enums/battler-index";
import type { ChargeAnim } from "#enums/charge-anim";
import type { MoveId } from "#enums/move-id";
import type { PhaseId } from "#enums/phase-id";
import { MoveChargeAnim } from "./data/animations/move-charge-anim";
import type { DestinyBondTag } from "./data/battler-tags/destiny-bond-tag";
import type { GrudgeTag } from "./data/battler-tags/grudge-tag";
import type { Pokemon } from "./field/pokemon";
import type { PokemonMove } from "./field/pokemon-move";
import type { Phase } from "./phase";
import { BattleEndPhase } from "./phases/battle-end-phase";
import { FaintPhase } from "./phases/faint-phase";
import { GameOverPhase } from "./phases/game-over-phase";
import { LoginPhase } from "./phases/login-phase";
import { MessagePhase } from "./phases/message-phase";
import { MoveAnimPhase } from "./phases/move-anim-phase";
import { MoveChargePhase } from "./phases/move-charge-phase";
import { MovePhase } from "./phases/move-phase";
import { NewBattlePhase } from "./phases/new-battle-phase";
import { PokemonHealPhase } from "./phases/pokemon-heal-phase";
import { SelectTargetPhase } from "./phases/select-target-phase";
import { TitlePhase } from "./phases/title-phase";
import { TurnInitPhase } from "./phases/turn-init-phase";

interface UseMoveInit {
  pokemon: Pokemon;
  targets: BattlerIndex[];
  move: PokemonMove | MoveId;
  /** Whether to add the {@linkcode MovePhase} to the front of the phase queue or defer it. */
  when: "eager" | "defer" | "before" | "after";
  phaseId?: PhaseId;
  followUp?: boolean;
  ignorePp?: boolean;
  reflected?: boolean;
  snatched?: boolean;
}

interface GameOverInit {
  isVictory?: boolean;
  clearPhaseQueue?: boolean;
}

interface ToTitleScreenInit {
  /** Whether to clear the phase queue before adding the {@linkcode TitlePhase}. */
  clearPhaseQueue?: boolean;
  /** Whether to add the {@linkcode TitlePhase} to the front of the phase queue or defer it. */
  eager?: boolean;
}

interface ToLoginScreenInit {
  /** Whether to show text. @default true*/
  showText?: boolean;
  /** Whether to add the {@linkcode LoginPhase} to the front of the phase queue or defer it. */
  eager?: boolean;
}

interface PokemonFaintInit {
  preventEndure?: boolean;
  destinyTag?: DestinyBondTag | null;
  grudgeTag?: GrudgeTag | null;
  source?: Pokemon;
}

export class PhaseManager {
  /** PhaseQueue: dequeue/remove the first element to get the next phase */
  public phaseQueue: Phase[] = [];
  /** phaseManager.phaseQueuePrepend: is a temp storage of what will be added to PhaseQueue */
  public phaseQueuePrepend: Phase[] = [];
  /** overrides default of inserting phases to end of phaseQueuePrepend array, useful or inserting Phases "out of order" */
  public phaseQueuePrependSpliceIndex: number = -1;
  public conditionalQueue: Array<[() => boolean, Phase]> = [];
  public nextCommandPhaseQueue: Phase[] = [];

  public currentPhase: Phase | null = null;
  public standbyPhase: Phase | null = null;

  public getCurrentPhase<P extends Phase = Phase>(): P | null {
    return this.currentPhase as P;
  }

  public getStandbyPhase(): Phase | null {
    return this.standbyPhase;
  }

  /**
   * Adds a phase to the conditional queue and ensures it is executed only when the specified condition is met.
   *
   * This method allows deferring the execution of a phase until certain conditions are met, which is useful for handling
   * situations like abilities and entry hazards that depend on specific game states.
   *
   * @param phase The {@linkcode Phase} to be added to the conditional queue.
   * @param condition A function that returns a boolean indicating whether the phase should be executed.
   *
   */
  public pushConditionalPhase(phase: Phase, condition: () => boolean): void {
    this.conditionalQueue.push([condition, phase]);
  }

  /**
   * Adds a phase to nextCommandPhaseQueue, as long as boolean passed in is false
   * @param phase {@linkcode Phase} the phase to add
   * @param defer boolean on which queue to add to, defaults to false, and adds to phaseQueue
   */
  public pushPhase(phase: Phase, defer: boolean = false): void {
    (!defer ? this.phaseQueue : this.nextCommandPhaseQueue).push(phase);
  }

  /**
   * Adds Phase to the end of phaseQueuePrepend, or at phaseQueuePrependSpliceIndex
   * @param phase {@linkcode Phase} the phase to add
   */
  public unshiftPhase(phase: Phase): void {
    if (this.phaseQueuePrependSpliceIndex === -1) {
      this.phaseQueuePrepend.push(phase);
    } else {
      this.phaseQueuePrepend.splice(this.phaseQueuePrependSpliceIndex, 0, phase);
    }
  }

  /**
   * Clears the phaseQueue, but does not clear any other phase-related stuff.
   *
   * TODO: Should this function be replaced by {@linkcode clearAllPhases}?
   */
  clearPhaseQueue(): void {
    this.phaseQueue.splice(0, this.phaseQueue.length);
  }

  /**
   * Clears all phase-related stuff, including all phase queues, the current and standby phases, and a splice index.
   */
  public clearAllPhases(): void {
    for (const queue of [this.phaseQueue, this.phaseQueuePrepend, this.conditionalQueue, this.nextCommandPhaseQueue]) {
      queue.splice(0, queue.length);
    }
    this.currentPhase = null;
    this.standbyPhase = null;
    this.clearPhaseQueueSplice();
  }

  /**
   * Used by function unshiftPhase(), sets index to start inserting at current length instead of the end of the array, useful if phaseQueuePrepend gets longer with Phases
   */
  setPhaseQueueSplice(): void {
    this.phaseQueuePrependSpliceIndex = this.phaseQueuePrepend.length;
  }

  /**
   * Resets phaseQueuePrependSpliceIndex to -1, implies that calls to unshiftPhase will insert at end of phaseQueuePrepend
   */
  public clearPhaseQueueSplice(): void {
    this.phaseQueuePrependSpliceIndex = -1;
  }

  /**
   * Is called by each Phase implementations "end()" by default
   * We dump everything from phaseQueuePrepend to the start of of phaseQueue
   * then removes first Phase and starts it
   */
  public shiftPhase(): void {
    if (this.standbyPhase) {
      this.currentPhase = this.standbyPhase;
      this.standbyPhase = null;
      return;
    }

    if (this.phaseQueuePrependSpliceIndex > -1) {
      this.clearPhaseQueueSplice();
    }
    if (this.phaseQueuePrepend.length) {
      while (this.phaseQueuePrepend.length) {
        const poppedPhase = this.phaseQueuePrepend.pop();
        if (poppedPhase) {
          this.phaseQueue.unshift(poppedPhase);
        }
      }
    }
    if (!this.phaseQueue.length) {
      this.populatePhaseQueue();
      // Clear the conditionalQueue if there are no phases left in the phaseQueue
      this.conditionalQueue = [];
    }

    this.currentPhase = this.phaseQueue.shift() ?? null;

    // Check if there are any conditional phases queued
    if (this.conditionalQueue?.length) {
      // Retrieve the first conditional phase from the queue
      const conditionalPhase = this.conditionalQueue.shift();
      // Evaluate the condition associated with the phase
      if (conditionalPhase?.[0]()) {
        // If the condition is met, add the phase to the phase queue
        this.pushPhase(conditionalPhase[1]);
      } else if (conditionalPhase) {
        // If the condition is not met, re-add the phase back to the front of the conditional queue
        this.conditionalQueue.unshift(conditionalPhase);
      } else {
        console.warn("condition phase is undefined/null!", conditionalPhase);
      }
    }

    if (this.currentPhase) {
      console.log(`%cStart Phase ${this.currentPhase.constructor.name}`, "color:green;");
      this.currentPhase.start();
    }
  }

  public overridePhase(phase: Phase): boolean {
    if (this.standbyPhase) {
      return false;
    }

    this.standbyPhase = this.currentPhase;
    this.currentPhase = phase;
    console.log(`%cStart Phase ${phase.constructor.name}`, "color:green;");
    phase.start();

    return true;
  }

  /**
   * Find a specific {@linkcode Phase} in the phase queue.
   *
   * @param phaseFilter filter function to use to find the wanted phase
   * @returns the found phase or undefined if none found
   */
  public findPhase<P extends Phase = Phase>(phaseFilter: (phase: P) => boolean): P | undefined {
    return this.phaseQueue.find(phaseFilter) as P;
  }

  /**
   * @todo this is unused, may be removed?
   * Checks if the phase queue contains a phase that matches the filter function
   *
   * @param phaseFilter filter function to use to check the expected phase
   * @returns `true` if the phase exists, `false` otherwise
   */
  public hasPhase<P extends Phase = Phase>(phaseFilter: (phase: P) => boolean): boolean {
    return this.phaseQueue.some(phaseFilter);
  }

  /**
   * @todo this is unused, may be removed?
   */
  public tryReplacePhase(phaseFilter: (phase: Phase) => boolean, phase: Phase): boolean {
    const phaseIndex = this.phaseQueue.findIndex(phaseFilter);
    if (phaseIndex > -1) {
      this.phaseQueue[phaseIndex] = phase;
      return true;
    }
    return false;
  }

  public tryRemovePhase(phaseFilter: (phase: Phase) => boolean): boolean {
    const phaseIndex = this.phaseQueue.findIndex(phaseFilter);
    if (phaseIndex > -1) {
      this.phaseQueue.splice(phaseIndex, 1);
      return true;
    }
    return false;
  }

  /**
   * @todo this is unused, may be removed?
   * Will search for a specific phase in {@linkcode phaseQueuePrepend} via filter, and remove the first result if a match is found.
   * @param phaseFilter filter function
   */
  public tryRemoveUnshiftedPhase(phaseFilter: (phase: Phase) => boolean): boolean {
    const phaseIndex = this.phaseQueuePrepend.findIndex(phaseFilter);
    if (phaseIndex > -1) {
      this.phaseQueuePrepend.splice(phaseIndex, 1);
      return true;
    }
    return false;
  }

  /**
   * Tries to add the input phase to index before target phase in the phaseQueue, else simply calls unshiftPhase()
   * @param phase {@linkcode Phase} the phase to be added
   * @param targetPhaseId {@linkcode PhaseId} of phase to search for in phaseQueue
   * @returns boolean if a targetPhase was found and added
   */
  public prependToPhase(phase: Phase, targetPhaseId: PhaseId): boolean {
    const targetIndex = this.phaseQueue.findIndex(({ id }) => id === targetPhaseId);

    if (targetIndex !== -1) {
      this.phaseQueue.splice(targetIndex, 0, phase);
      return true;
    } else {
      this.unshiftPhase(phase);
      return false;
    }
  }

  /**
   * Tries to add the input phase to index after target phase in the {@linkcode phaseQueue}, else simply calls {@linkcode unshiftPhase}
   * @param phase {@linkcode Phase} the phase to be added
   * @param targetPhaseId {@linkcode PhaseId} the type of phase to search for in {@linkcode phaseQueue}
   * @returns `true` if a `targetPhase` was found to append to
   */
  public appendToPhase(phase: Phase, targetPhaseId: PhaseId): boolean {
    const targetIndex = this.phaseQueue.findIndex(({ id }) => id === targetPhaseId);

    if (targetIndex !== -1 && this.phaseQueue.length > targetIndex) {
      this.phaseQueue.splice(targetIndex + 1, 0, phase);
      return true;
    } else {
      this.unshiftPhase(phase);
      return false;
    }
  }

  /**
   * @todo this is unused, may be removed?
   * Moves everything from nextCommandPhaseQueue to phaseQueue (keeping order)
   */
  public populatePhaseQueue(): void {
    if (this.nextCommandPhaseQueue.length) {
      this.phaseQueue.push(...this.nextCommandPhaseQueue);
      this.nextCommandPhaseQueue.splice(0, this.nextCommandPhaseQueue.length);
    }
    this.phaseQueue.push(new TurnInitPhase());
  }

  /**
   * Adds a MessagePhase, either to PhaseQueuePrepend or nextCommandPhaseQueue
   * @param message string for MessagePhase
   * @param callbackDelay optional param for MessagePhase constructor
   * @param prompt optional param for MessagePhase constructor
   * @param promptDelay optional param for MessagePhase constructor
   * @param defer boolean for which queue to add it to, false -> add to PhaseQueuePrepend, true -> nextCommandPhaseQueue
   */
  public queueMessagePhase(
    message: string,
    callbackDelay?: number | null,
    prompt?: boolean | null,
    promptDelay?: number | null,
    defer?: boolean | null,
  ) {
    const phase = new MessagePhase(message, callbackDelay, prompt, promptDelay);
    if (!defer) {
      // adds to the end of PhaseQueuePrepend
      this.unshiftPhase(phase);
    } else {
      //remember that pushPhase adds it to nextCommandPhaseQueue
      this.pushPhase(phase);
    }
  }

  /**
   * Queues a new {@linkcode PokemonHealPhase} for the given {@linkcode BattlerIndex}.
   * @param eager - Whether to add the {@linkcode PokemonHealPhase} to the front of the phase queue or defer it
   * @param battlerIndex - The {@linkcode BattlerIndex} of the pokemon to heal
   * @param hpHealed - The amount of HP to heal
   * @param params_2 - The various {@linkcode PokemonHealPhaseOptions | optional parameters} of `PokemonHealPhase`
   */
  public queuePokemonHealPhase(eager: boolean, ...params: ConstructorParameters<typeof PokemonHealPhase>) {
    const pokemonHealPhase = new PokemonHealPhase(...params);

    if (eager) {
      this.unshiftPhase(pokemonHealPhase);
    } else {
      this.pushPhase(pokemonHealPhase, true);
    }
  }

  /**
   * Adds a new {@linkcode MoveChargePhase} to the phase queue.
   * @param battlerIndex The users {@linkcode BattlerIndex}
   * @param targets The targets {@linkcode BattlerIndex}
   * @param move The {@linkcode PokemonMove} being used
   */
  public queueMoveChargePhase(battlerIndex: BattlerIndex, targets: BattlerIndex[], move: PokemonMove): void {
    this.unshiftPhase(new MoveChargePhase(battlerIndex, targets, move));
  }

  /**
   * Inserts a new {@linkcode SelectTargetPhase} to the phase queue.
   * @param battlerIndex The selected targets {@linkcode BattlerIndex}
   */
  public queueSelectTargetPhase(battlerIndex: BattlerIndex): void {
    this.unshiftPhase(new SelectTargetPhase(battlerIndex));
  }

  /**
   * Adds a new {@linkcode MoveAnimPhase} to the phase queue.
   * @param chargeAnim The {@linkcode ChargeAnim} to be used
   * @param moveId The {@linkcode MoveId} to be used
   * @param user The {@linkcode Pokemon} using the move
   */
  public queueMoveAnimPhase(chargeAnim: ChargeAnim, moveId: MoveId, user: Pokemon) {
    this.unshiftPhase(new MoveAnimPhase(new MoveChargeAnim(chargeAnim, moveId, user)));
  }

  /**
   * Unshifts a new {@linkcode FaintPhase} for the given {@linkcode BattlerIndex} to faint.
   *
   * @param battlerIndex The {@linkcode BattlerIndex} to faint
   * @param init Optional {@linkcode PokemonFaintInit} arguments
   *
   * **Regarding {@linkcode PhaseManager.setPhaseQueueSplice} call:**\
   * _When adding the FaintPhase, want to toggle future phaseManager.unshiftPhase() and queueMessage() calls
   * to appear before the FaintPhase (as FaintPhase will potentially end the encounter and add Phases such as
   * GameOverPhase, VictoryPhase, etc.. that will interfere with anything else that happens during this MoveEffectPhase).
   * Once the MoveEffectPhase is over (and calls it's .end() function, shiftPhase() will reset the PhaseQueueSplice via clearPhaseQueueSplice() )_
   */
  public queueBattlerFaintPhase(
    battlerIndex: BattlerIndex,
    { preventEndure = false, destinyTag = null, grudgeTag = null, source }: PokemonFaintInit,
  ): void {
    this.setPhaseQueueSplice();
    this.unshiftPhase(new FaintPhase(battlerIndex, preventEndure, destinyTag, grudgeTag, source));
  }

  public queueMovePhase({
    pokemon,
    targets,
    move,
    followUp = false,
    ignorePp = false,
    reflected = false,
    snatched = false,
    when,
    phaseId,
  }: UseMoveInit) {
    const movePhase = new MovePhase(pokemon, targets, move, followUp, ignorePp, reflected, snatched);

    if ((when === "before" || when === "after") && !phaseId) {
      throw new Error("phaseId is required for useMove.when === 'before' or 'after'");
    }

    switch (when) {
      case "eager":
        this.unshiftPhase(movePhase);
        break;
      case "defer":
        this.pushPhase(movePhase);
        break;
      case "before":
        this.prependToPhase(movePhase, phaseId!);
        break;
      case "after":
        this.appendToPhase(movePhase, phaseId!);
        break;
      default:
        throw new Error(`Unknown useMove.when: ${when}`);
    }
  }

  /**
   * Ends the current battle and starts a new one.
   * @param isVictory Whether the player won the battle
   */
  public queueNextBattle(isVictory: boolean): void {
    this.pushPhase(new BattleEndPhase(isVictory));
    this.pushPhase(new NewBattlePhase());
  }

  /**
   * Ends the game.
   * @param isVictory Whether the player won the game
   * @param clearPhaseQueue Whether to clear the phase queue
   */
  public queueGameOverPhase({ isVictory, clearPhaseQueue }: GameOverInit = {}): void {
    if (clearPhaseQueue) {
      this.clearPhaseQueue();
    }
    this.pushPhase(new GameOverPhase(isVictory));
  }

  /**
   * Returns the game to the title screen(/phase).
   * @param init Optional {@linkcode ToTitleScreenInit} arguments
   */
  public toTitleScreen({ eager, clearPhaseQueue }: ToTitleScreenInit = {}): void {
    if (clearPhaseQueue) {
      this.clearPhaseQueue();
    }

    if (eager) {
      this.unshiftPhase(new TitlePhase());
    } else {
      this.pushPhase(new TitlePhase());
    }
  }

  /**
   * Sends the player to the login screen.
   * @param showText Whether to show text
   */
  public toLoginScreen({ eager, showText = true }: ToLoginScreenInit = {}): void {
    const loginPhase = new LoginPhase(showText);

    if (eager) {
      this.unshiftPhase(loginPhase);
    } else {
      this.pushPhase(loginPhase);
    }
  }
}
