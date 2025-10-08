import type { ObjectValues } from "#types/utility-types";

/** Determines whether an NPC trainer is allowed to Terastallize any of their pokemon */
export const TeraAIMode = {
  /** The trainer cannot use Terastallization */
  NONE: 1,
  /** The trainer will Tersastallize the configured pokemon on the first turn it's sent out */
  INSTANT: 2,
  /** (Currently unused) The trainer will choose when to Terastallize their pokemon based on the current battle state */
  SMART: 3,
} as const;

export type TeraAIMode = ObjectValues<typeof TeraAIMode>;
