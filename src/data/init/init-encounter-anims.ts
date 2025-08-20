import { LegacyAnimConfig } from "#animations/anim-config";
import { encounterAnims } from "#animations/encounter-anims";
import { globalScene } from "#app/global-scene";
import { EncounterAnim } from "#enums/encounter-anim";
import { coerceArray, isNil } from "#utils/common-utils";

/**
 * Fetches animation configs to be used in a Mystery Encounter
 * @param encounterAnim one or more animations to fetch
 */
export async function initEncounterAnims(encounterAnim: EncounterAnim | EncounterAnim[]): Promise<void> {
  const anims = coerceArray(encounterAnim);
  const encounterAnimNames = Object.keys(EncounterAnim);
  const encounterAnimFetches: Promise<Map<EncounterAnim, LegacyAnimConfig>>[] = [];
  for (const anim of anims) {
    if (encounterAnims.has(anim) && !isNil(encounterAnims.get(anim))) {
      continue;
    }
    encounterAnimFetches.push(
      globalScene
        .cachedFetch(`./battle-anims/encounter-${encounterAnimNames[anim - 1].toLowerCase().replace(/_/g, "-")}.json`)
        .then((response) => response.json())
        .then((cas) => encounterAnims.set(anim, new LegacyAnimConfig(cas))),
    );
  }
  await Promise.allSettled(encounterAnimFetches);
}
