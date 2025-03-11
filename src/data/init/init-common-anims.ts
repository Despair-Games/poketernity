import { commonAnims } from "../animations/common-anims";
import { AnimConfig } from "../animations/anim-config";
import { globalScene } from "#app/global-scene";
import { getEnumKeys, getEnumValues } from "#app/utils";
import { CommonAnim } from "#enums/common-anim";

export function initCommonAnims(): Promise<void> {
  return new Promise((resolve) => {
    const commonAnimNames = getEnumKeys(CommonAnim);
    const commonAnimIds = getEnumValues(CommonAnim);
    const commonAnimFetches: Promise<Map<CommonAnim, AnimConfig>>[] = [];
    for (let ca = 0; ca < commonAnimIds.length; ca++) {
      const commonAnimId = commonAnimIds[ca];
      commonAnimFetches.push(
        globalScene
          .cachedFetch(`./battle-anims/common-${commonAnimNames[ca].toLowerCase().replace(/\_/g, "-")}.json`)
          .then((response) => response.json())
          .then((cas) => commonAnims.set(commonAnimId, new AnimConfig(cas))),
      );
    }
    Promise.allSettled(commonAnimFetches).then(() => resolve());
  });
}
