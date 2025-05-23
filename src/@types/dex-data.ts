/**
 * Dex entry for a single Pokemon Species
 */
export interface DexEntry {
  seenAttr: bigint;
  caughtAttr: bigint;
  seenCount: number;
  caughtCount: number;
  hatchedCount: number;
}

export interface DexData {
  [key: number]: DexEntry;
}
