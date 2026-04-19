import { eventBus } from "#app/event-bus";
import { globalScene, mpSession } from "#app/global-scene";
import { UiMode } from "#enums/ui-mode";
import type { MpReconnectModalUiHandler } from "#ui/mp-reconnect-modal-ui-handler";
import type {
  DesyncDetectedMessage,
  PeerDisconnectedMessage,
  PeerReconnectedMessage,
  SessionEndedMessage,
  TurnResolvedMessage,
} from "./mp-protocol";

/**
 * Central handler that bridges multiplayer event-bus events to game systems.
 *
 * Call {@link registerMpEventHandlers} once after the scene is ready.
 * Call {@link unregisterMpEventHandlers} on teardown.
 */

let registered = false;

function onTurnResolved(msg: TurnResolvedMessage): void {
  if (!mpSession?.commandSync) {
    console.warn("[MP] Received TurnResolved but no commandSync");
    return;
  }
  console.log(`[MP] Turn ${msg.turnIndex} resolved (wave ${msg.waveIndex})`);
  mpSession.commandSync.onTurnResolved(msg);
}

function onDesyncDetected(msg: DesyncDetectedMessage): void {
  console.error(`[MP] Desync at turn ${msg.turnIndex} wave ${msg.waveIndex}`, msg.peerHashes);
  mpSession?.commandSync?.onError(`Desync detected at turn ${msg.turnIndex}`);
}

function onPeerDisconnected(msg: PeerDisconnectedMessage): void {
  if (!mpSession?.isActive) {
    return;
  }

  console.warn(`[MP] Peer ${msg.username} disconnected — ${msg.graceSeconds}s grace`);

  // Show the reconnect modal overlay
  globalScene.ui.setMode<MpReconnectModalUiHandler>(UiMode.MP_RECONNECT, msg.username, msg.graceSeconds);
}

function onPeerReconnected(msg: PeerReconnectedMessage): void {
  console.log(`[MP] Peer ${msg.username} reconnected`);
  // The MpReconnectModalUiHandler self-dismisses via its own listener
}

function onSessionEnded(msg: SessionEndedMessage): void {
  console.log(`[MP] Session ended: ${msg.reason}`);
  mpSession?.commandSync?.onError(`Session ended: ${msg.reason}`);
  // The MpReconnectModalUiHandler and lobby handler each handle their own cleanup
}

export function registerMpEventHandlers(): void {
  if (registered) {
    return;
  }
  registered = true;

  eventBus.on("mp:turn-resolved" as any, onTurnResolved);
  eventBus.on("mp:desync" as any, onDesyncDetected);
  eventBus.on("mp:peer-disconnected" as any, onPeerDisconnected);
  eventBus.on("mp:peer-reconnected" as any, onPeerReconnected);
  eventBus.on("mp:session-ended" as any, onSessionEnded);
}

export function unregisterMpEventHandlers(): void {
  if (!registered) {
    return;
  }
  registered = false;

  eventBus.off("mp:turn-resolved" as any, onTurnResolved);
  eventBus.off("mp:desync" as any, onDesyncDetected);
  eventBus.off("mp:peer-disconnected" as any, onPeerDisconnected);
  eventBus.off("mp:peer-reconnected" as any, onPeerReconnected);
  eventBus.off("mp:session-ended" as any, onSessionEnded);
}
