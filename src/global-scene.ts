import type { BattleScene } from "#app/battle-scene";
import type { MpSession } from "./multiplayer/mp-session";

export let globalScene: BattleScene;

/** Active multiplayer session, if any. */
export let mpSession: MpSession | undefined;

export function initGlobalScene(scene: BattleScene): void {
  globalScene = scene;
}

export function setMpSession(session: MpSession | undefined): void {
  mpSession = session;
}
