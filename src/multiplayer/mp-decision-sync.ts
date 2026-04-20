import { mpSession } from "#app/global-scene";
import type { DecisionResolvedMessage, SubmitDecisionRequest } from "./mp-protocol";

type DecisionType = "modifier" | "biome" | "encounter";

let pendingResolve: ((resolvedIndex: number) => void) | null = null;
let pendingDecisionType: DecisionType | null = null;

/**
 * Submit a decision and wait for the server to resolve consensus.
 * Returns the resolved index (may differ from selectedIndex if tiebreak occurred).
 */
export async function submitDecisionAndWait(decisionType: DecisionType, selectedIndex: number): Promise<number> {
  if (!mpSession?.isActive || !mpSession.client) {
    return selectedIndex;
  }

  const waveIndex = mpSession.currentWave;

  const request: SubmitDecisionRequest = {
    decisionType,
    waveIndex,
    selectedIndex,
  };

  pendingDecisionType = decisionType;

  // Set up listener before submitting to avoid race
  const resultPromise = new Promise<number>((resolve) => {
    pendingResolve = resolve;
  });

  await mpSession.client.submitDecision(request);

  console.log(`[MP] Submitted ${decisionType} decision: index ${selectedIndex} (wave ${waveIndex})`);

  return resultPromise;
}

/**
 * Called when the server resolves a decision.
 * Should be wired to the mp:decision-resolved event.
 */
export function onDecisionResolved(msg: DecisionResolvedMessage): void {
  console.log(
    `[MP] Decision '${msg.decisionType}' resolved to index ${msg.resolvedIndex} via ${msg.resolutionMethod} (wave ${msg.waveIndex})`,
  );

  if (pendingResolve && msg.decisionType === pendingDecisionType) {
    const resolve = pendingResolve;
    pendingResolve = null;
    pendingDecisionType = null;
    resolve(msg.resolvedIndex);
  }
}

/**
 * Reset state (on session end/disconnect).
 */
export function resetDecisionSync(): void {
  pendingResolve = null;
  pendingDecisionType = null;
}
