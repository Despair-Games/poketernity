import { globalScene } from "#app/global-scene";
import type { TurnCommand } from "#app/turn-command-manager";
import { allMoves } from "#data/data-lists";
import type { BattleCommand } from "#enums/battle-command";
import type { BattlerIndex } from "#enums/battler-index";
import type { ElementalType } from "#enums/elemental-type";
import type { MoveId } from "#enums/move-id";
import type { TurnMove } from "#types/move-types";
import type { PeerCommandData } from "./mp-protocol";

/**
 * Wire-safe representation of a {@linkcode TurnCommand}.
 * Pokemon references are replaced by their battler index,
 * and Move objects by their numeric id.
 */
export interface SerializedTurnCommand {
  readonly battlerIndex: BattlerIndex;
  readonly command: BattleCommand;
  readonly cursor?: number;
  readonly turnMove?: SerializedTurnMove;
  readonly targets?: BattlerIndex[];
  readonly args?: unknown[];
}

interface SerializedTurnMove {
  readonly moveId: MoveId;
  readonly targets: BattlerIndex[];
  readonly type: ElementalType;
  readonly ignorePP?: boolean;
}

/**
 * Serialize a single {@linkcode TurnCommand} for network transmission.
 */
export function serializeTurnCommand(cmd: TurnCommand): SerializedTurnCommand {
  return {
    battlerIndex: cmd.pokemon.getBattlerIndex(),
    command: cmd.command,
    cursor: cmd.cursor,
    turnMove: cmd.turnMove
      ? {
          moveId: cmd.turnMove.move.id,
          targets: [...cmd.turnMove.targets],
          type: cmd.turnMove.type,
          ignorePP: cmd.turnMove.ignorePP,
        }
      : undefined,
    targets: cmd.targets ? [...cmd.targets] : undefined,
    args: cmd.args,
  };
}

/**
 * Reconstruct a {@linkcode TurnCommand} from its serialized form.
 * Returns `undefined` if the pokemon or move cannot be resolved.
 */
export function deserializeTurnCommand(cmd: SerializedTurnCommand): TurnCommand | undefined {
  const pokemon = globalScene.getPokemonByBattlerIndex(cmd.battlerIndex);
  if (!pokemon) {
    console.warn(`[MP] Could not find pokemon at battler index ${cmd.battlerIndex}`);
    return;
  }

  let turnMove: TurnMove | undefined;
  if (cmd.turnMove) {
    const move = allMoves.get(cmd.turnMove.moveId);
    if (!move) {
      console.warn(`[MP] Could not find move with id ${cmd.turnMove.moveId}`);
      return;
    }
    turnMove = {
      move,
      targets: cmd.turnMove.targets,
      type: cmd.turnMove.type,
      ignorePP: cmd.turnMove.ignorePP,
    };
  }

  return {
    pokemon,
    command: cmd.command,
    cursor: cmd.cursor,
    turnMove,
    targets: cmd.targets,
    args: cmd.args,
  };
}

/**
 * Parse peer command data and apply all valid commands to the turn manager.
 */
export function applyPeerCommands(peerCommands: PeerCommandData[]): void {
  const turnManager = globalScene.currentBattle.turnManager;
  for (const peerData of peerCommands) {
    const commands: SerializedTurnCommand[] = JSON.parse(peerData.commandJson);
    for (const cmd of commands) {
      const turnCommand = deserializeTurnCommand(cmd);
      if (turnCommand) {
        turnManager.addCommand(turnCommand);
      }
    }
  }
}
