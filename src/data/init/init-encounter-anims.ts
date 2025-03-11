import { AnimConfig } from "#app/data/animations/anim-config";
import { encounterAnims } from "../animations/encounter-anims";
import { globalScene } from "#app/global-scene";
import { getEnumKeys, isNullOrUndefined } from "#app/utils";
import { EncounterAnim } from "#enums/encounter-anims";

/**
 * Fetches animation configs to be used in a Mystery Encounter
 * @param encounterAnim one or more animations to fetch
 */
export async function initEncounterAnims(encounterAnim: EncounterAnim | EncounterAnim[]): Promise<void> {
  const anims = Array.isArray(encounterAnim) ? encounterAnim : [encounterAnim];
  const encounterAnimNames = getEnumKeys(EncounterAnim);
  const encounterAnimFetches: Promise<Map<EncounterAnim, AnimConfig>>[] = [];
  for (const anim of anims) {
    if (encounterAnims.has(anim) && !isNullOrUndefined(encounterAnims.get(anim))) {
      continue;
    }
    encounterAnimFetches.push(
      globalScene
        .cachedFetch(`./battle-anims/encounter-${encounterAnimNames[anim].toLowerCase().replace(/\_/g, "-")}.json`)
        .then((response) => response.json())
        .then((cas) => encounterAnims.set(anim, new AnimConfig(cas))),
    );
  }
  await Promise.allSettled(encounterAnimFetches);
}
