import { BattlerIndex } from "#app/battle";
import { BypassSpeedChanceAbAttr } from "#app/data/ab-attrs/bypass-speed-chance-ab-attr";
import { PreventBypassSpeedChanceAbAttr } from "#app/data/ab-attrs/prevent-bypass-speed-chance-ab-attr";
import { applyAbAttrs } from "#app/data/ability";
import { TrickRoomTag } from "#app/data/arena-tag";
import { allMoves, MoveHeaderAttr } from "#app/data/move";
import { PokemonMove, type Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { BypassSpeedChanceModifier } from "#app/modifier/modifier";
import { CheckStatusEffectPhase } from "#app/phases/check-status-effect-phase";
import { Command } from "#app/ui/command-ui-handler";
import { BooleanHolder, randSeedShuffle } from "#app/utils";
import { Abilities } from "#enums/abilities";
import { Stat } from "#enums/stat";
import { SwitchType } from "#enums/switch-type";
import { AttemptCapturePhase } from "./attempt-capture-phase";
import { AttemptRunPhase } from "./attempt-run-phase";
import { BerryPhase } from "./berry-phase";
import { FieldPhase } from "./field-phase";
import { MoveHeaderPhase } from "./move-header-phase";
import { MovePhase } from "./move-phase";
import { SwitchSummonPhase } from "./switch-summon-phase";
import { TurnEndPhase } from "./turn-end-phase";
import { WeatherEffectPhase } from "./weather-effect-phase";

export class TurnStartPhase extends FieldPhase {
  /**
   * This orders the active Pokemon on the field by speed into an BattlerIndex array and returns that array.
   * It also checks for Trick Room and reverses the array if it is present.
   * @returns the battle indices of all pokemon on the field ordered by speed
   */
  public getSpeedOrder(): BattlerIndex[] {
    const playerField = globalScene.getPlayerField().filter((p) => p.isActive()) as Pokemon[];
    const enemyField = globalScene.getEnemyField().filter((p) => p.isActive()) as Pokemon[];

    // We shuffle the list before sorting so speed ties produce random results
    let orderedTargets: Pokemon[] = playerField.concat(enemyField);
    // We seed it with the current turn to prevent an inconsistency where it
    // was varying based on how long since you last reloaded
    globalScene.executeWithSeedOffset(
      () => {
        orderedTargets = randSeedShuffle(orderedTargets);
      },
      globalScene.currentBattle.turn,
      globalScene.waveSeed,
    );

    // Next, a check for Trick Room is applied to determine sort order.
    const speedReversed = new BooleanHolder(false);
    globalScene.arena.applyTags(TrickRoomTag, false, speedReversed);

    // Adjust the sort function based on whether Trick Room is active.
    orderedTargets.sort((a: Pokemon, b: Pokemon) => {
      const aSpeed = a?.getEffectiveStat(Stat.SPD) ?? 0;
      const bSpeed = b?.getEffectiveStat(Stat.SPD) ?? 0;

      return speedReversed.value ? aSpeed - bSpeed : bSpeed - aSpeed;
    });

    return orderedTargets.map((t) => t.getFieldIndex() + (!t.isPlayer() ? BattlerIndex.ENEMY : BattlerIndex.PLAYER));
  }

  /**
   * This takes the result of getSpeedOrder and applies priority / bypass speed attributes to it.
   * This also considers the priority levels of various commands and changes the result of getSpeedOrder based on such.
   * @returns the final sequence of commands for this turn
   */
  public getCommandOrder(): BattlerIndex[] {
    let moveOrder = this.getSpeedOrder();
    // The creation of the battlerBypassSpeed object contains checks for the ability Quick Draw and the held item Quick Claw
    // The ability Mycelium Might disables Quick Claw's activation when using a status move
    // This occurs before the main loop because of battles with more than two Pokemon
    const battlerBypassSpeed = {};

    globalScene
      .getField(true)
      .filter((p) => p.summonData)
      .map((p) => {
        const bypassSpeed = new BooleanHolder(false);
        const canCheckHeldItems = new BooleanHolder(true);
        applyAbAttrs(BypassSpeedChanceAbAttr, p, null, false, bypassSpeed);
        applyAbAttrs(PreventBypassSpeedChanceAbAttr, p, null, false, bypassSpeed, canCheckHeldItems);
        if (canCheckHeldItems.value) {
          globalScene.applyModifiers(BypassSpeedChanceModifier, p.isPlayer(), p, bypassSpeed);
        }
        battlerBypassSpeed[p.getBattlerIndex()] = bypassSpeed;
      });

    // The function begins sorting orderedTargets based on command priority, move priority, and possible speed bypasses.
    // Non-FIGHT commands (SWITCH, BALL, RUN) have a higher command priority and will always occur before any FIGHT commands.
    moveOrder = moveOrder.slice(0);
    moveOrder.sort((a, b) => {
      const aCommand = globalScene.currentBattle.turnCommands[a];
      const bCommand = globalScene.currentBattle.turnCommands[b];

      if (aCommand?.command !== bCommand?.command) {
        if (aCommand?.command === Command.FIGHT) {
          return 1;
        } else if (bCommand?.command === Command.FIGHT) {
          return -1;
        }
      } else if (aCommand?.command === Command.FIGHT) {
        const aMove = allMoves[aCommand.move!.move];
        const bMove = allMoves[bCommand!.move!.move];

        const aUser = globalScene.getField(true).find((p) => p.getBattlerIndex() === a)!;
        const bUser = globalScene.getField(true).find((p) => p.getBattlerIndex() === b)!;

        const aPriority = aMove.getPriority(aUser, false);
        const bPriority = bMove.getPriority(bUser, false);

        // The game now checks for differences in priority levels.
        // If the moves share the same original priority bracket, it can check for differences in battlerBypassSpeed and return the result.
        // This conditional is used to ensure that Quick Claw can still activate with abilities like Stall and Mycelium Might (attack moves only)
        // Otherwise, the game returns the user of the move with the highest priority.
        const isSameBracket = Math.ceil(aPriority) - Math.ceil(bPriority) === 0;
        if (aPriority !== bPriority) {
          if (isSameBracket && battlerBypassSpeed[a].value !== battlerBypassSpeed[b].value) {
            return battlerBypassSpeed[a].value ? -1 : 1;
          }
          return aPriority < bPriority ? 1 : -1;
        }
      }

      // If there is no difference between the move's calculated priorities, the game checks for differences in battlerBypassSpeed and returns the result.
      if (battlerBypassSpeed[a].value !== battlerBypassSpeed[b].value) {
        return battlerBypassSpeed[a].value ? -1 : 1;
      }

      const aIndex = moveOrder.indexOf(a);
      const bIndex = moveOrder.indexOf(b);

      return aIndex < bIndex ? -1 : aIndex > bIndex ? 1 : 0;
    });
    return moveOrder;
  }

  public override start(): void {
    super.start();

    const field = globalScene.getField();
    const moveOrder = this.getCommandOrder();

    let orderIndex = 0;

    for (const o of moveOrder) {
      const pokemon = field[o];
      const turnCommand = globalScene.currentBattle.turnCommands[o];

      if (turnCommand?.skip) {
        continue;
      }

      switch (turnCommand?.command) {
        case Command.FIGHT:
          const queuedMove = turnCommand.move;
          pokemon.turnData.order = orderIndex++;
          if (!queuedMove) {
            continue;
          }
          const move =
            pokemon.getMoveset().find((m) => m.moveId === queuedMove.move && m.ppUsed < m.getMovePp())
            ?? new PokemonMove(queuedMove.move);
          if (move.getMove().hasAttr(MoveHeaderAttr)) {
            globalScene.unshiftPhase(new MoveHeaderPhase(pokemon, move));
          }
          if (pokemon.isPlayer()) {
            if (turnCommand.cursor === -1) {
              globalScene.pushPhase(new MovePhase(pokemon, turnCommand.targets ?? queuedMove.targets, move));
            } else {
              const playerPhase = new MovePhase(
                pokemon,
                turnCommand.targets ?? queuedMove.targets,
                move,
                false,
                queuedMove.ignorePP,
              );
              globalScene.pushPhase(playerPhase);
            }
          } else {
            globalScene.pushPhase(
              new MovePhase(pokemon, turnCommand.targets ?? queuedMove.targets, move, false, queuedMove.ignorePP),
            );
          }
          break;
        case Command.BALL:
          if (turnCommand.targets && turnCommand.targets[0] && turnCommand.cursor) {
            globalScene.unshiftPhase(new AttemptCapturePhase(turnCommand.targets[0] % 2, turnCommand.cursor));
          } else {
            console.error("Error encountered when trying to throw Pokeball!");
            console.error(turnCommand);
          }
          break;
        case Command.POKEMON:
          const switchType = turnCommand.args?.[0] ? SwitchType.BATON_PASS : SwitchType.SWITCH;
          if (turnCommand.cursor) {
            globalScene.unshiftPhase(
              new SwitchSummonPhase(switchType, pokemon.getFieldIndex(), turnCommand.cursor, true, pokemon.isPlayer()),
            );
          } else {
            console.error("Error encountered when trying to switch Pokemon!");
            console.error(turnCommand);
          }
          break;
        case Command.RUN:
          let runningPokemon = pokemon;
          if (globalScene.currentBattle.double) {
            const playerActivePokemon = field.filter((pokemon) => {
              if (pokemon) {
                return pokemon.isPlayer() && pokemon.isActive();
              } else {
                return;
              }
            });

            if (playerActivePokemon.length > 1) {
              const fasterPokemon =
                playerActivePokemon[0].getStat(Stat.SPD) > playerActivePokemon[1].getStat(Stat.SPD)
                  ? playerActivePokemon[0]
                  : playerActivePokemon[1];

              const hasRunAway = playerActivePokemon.find((p) => p.hasAbility(Abilities.RUN_AWAY));
              runningPokemon = hasRunAway ?? fasterPokemon;
            }
          }
          globalScene.unshiftPhase(new AttemptRunPhase(runningPokemon.getFieldIndex()));
          break;
      }
    }

    globalScene.pushPhase(new WeatherEffectPhase());
    globalScene.pushPhase(new BerryPhase());

    // Add a new phase to check who should be taking status damage
    globalScene.pushPhase(new CheckStatusEffectPhase(moveOrder));

    globalScene.pushPhase(new TurnEndPhase());

    /**
     * this.end() will call shiftPhase(), which dumps everything from PrependQueue (aka everything that is unshifted()) to the front
     * of the queue and dequeues to start the next phase.
     * this is important since stuff like SwitchSummon, AttemptRun, AttemptCapture Phases break the "flow" and should take precedence
     */
    this.end();
  }
}
