import { LegacyAnimConfig } from "#app/data/animations/anim-config";
import { encounterAnims } from "#app/data/animations/encounter-anims";
import { globalScene } from "#app/global-scene";
import { coerceArray, getEnumKeys, isNil } from "#app/utils/common-utils";
import { EncounterAnim } from "#enums/encounter-anims";

/**
 * Fetches animation configs to be used in a Mystery Encounter
 * @param encounterAnim one or more animations to fetch
 */
export async function initEncounterAnims(encounterAnim: EncounterAnim | EncounterAnim[]): Promise<void> {
  const anims = coerceArray(encounterAnim);
  const encounterAnimNames = getEnumKeys(EncounterAnim);
  const encounterAnimFetches: Promise<Map<EncounterAnim, LegacyAnimConfig>>[] = [];
  for (const anim of anims) {
    if (encounterAnims.has(anim) && !isNil(encounterAnims.get(anim))) {
      continue;
    }
    encounterAnimFetches.push(
      globalScene
        .cachedFetch(`./battle-anims/encounter-${encounterAnimNames[anim].toLowerCase().replace(/\_/g, "-")}.json`)
        .then((response) => response.json())
        .then((cas) => encounterAnims.set(anim, new LegacyAnimConfig(cas))),
    );
  }
  await Promise.allSettled(encounterAnimFetches);
}
