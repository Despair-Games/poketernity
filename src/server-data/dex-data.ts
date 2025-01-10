/**
 * Dex entry for a single Pokemon Species
 */

import { DexEntry } from "./dex-entry";

export interface DexData {
  [key: number]: DexEntry;
}
