/** Determines whether an NPC trainer is allowed to Terastallize any of their pokemon */
export enum TeraAIMode {
  /** The trainer cannot use Terastallization */
  NONE,
  /** The trainer will Tersastallize the configured pokemon on the first turn it's sent out */
  INSTANT,
  /** (Currently unused) The trainer will choose when to Terastallize their pokemon based on the current battle state */
  SMART,
}
