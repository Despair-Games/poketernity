import { encounterAnims } from "#app/data/encounter-anims";
import { loadAnimAssets } from "./anim-utils";

/**
 * Loads encounter animation assets to scene
 * MUST be called after {@linkcode initEncounterAnims()} to load all required animations properly
 * @param startLoad
 */
export async function loadEncounterAnimAssets(startLoad?: boolean): Promise<void> {
  await loadAnimAssets(Array.from(encounterAnims.values()), startLoad);
}
