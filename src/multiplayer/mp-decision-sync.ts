import { globalScene, mpSession } from "#app/global-scene";
import type { DecisionResolvedMessage, SubmitDecisionRequest } from "./mp-protocol";

type DecisionType = "modifier" | "modifier_target" | "biome" | "encounter";

let pendingResolve: ((resolvedIndex: number) => void) | null = null;
let pendingDecisionType: DecisionType | null = null;
let pendingLocalIndex: number | null = null;
let pendingLabelResolver: ((index: number) => string) | null = null;

/**
 * Submit a decision and wait for the server to resolve consensus.
 * Returns the resolved index (may differ from selectedIndex if tiebreak occurred).
 *
 * @param resolveLabel - Optional function that converts an index to a human-readable
 *   label. Used to show a specific message when the partner's choice wins.
 */
export async function submitDecisionAndWait(
  decisionType: DecisionType,
  selectedIndex: number,
  resolveLabel?: (index: number) => string,
): Promise<number> {
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
  pendingLocalIndex = selectedIndex;
  pendingLabelResolver = resolveLabel ?? null;
  globalScene.ui.showText("Waiting for partner...");

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
    const localIndex = pendingLocalIndex;
    const labelResolver = pendingLabelResolver;
    pendingResolve = null;
    pendingDecisionType = null;
    pendingLocalIndex = null;
    pendingLabelResolver = null;

    // If the resolved choice differs from what this player picked, show a brief message
    if (localIndex !== null && msg.resolvedIndex !== localIndex) {
      const choiceName = labelResolver?.(msg.resolvedIndex);
      const label = choiceName ? `${choiceName} was chosen!` : "Partner's choice was selected!";
      globalScene.ui.showText(label, {
        callbackDelay: 1500,
        callback: () => {
          globalScene.ui.clearText();
          resolve(msg.resolvedIndex);
        },
      });
    } else {
      globalScene.ui.clearText();
      resolve(msg.resolvedIndex);
    }
  } else {
    globalScene.ui.clearText();
  }
}

/**
 * Reset state (on session end/disconnect).
 */
export function resetDecisionSync(): void {
  pendingResolve = null;
  pendingDecisionType = null;
  pendingLocalIndex = null;
  pendingLabelResolver = null;
}
