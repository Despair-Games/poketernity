import { commonAnims } from "#app/data/battle-anims";
import { loadAnimAssets } from "#app/utils/move-anim-utils";

export function loadCommonAnimAssets(startLoad?: boolean): Promise<void> {
  return new Promise((resolve) => {
    loadAnimAssets(Array.from(commonAnims.values()), startLoad).then(() => resolve());
  });
}
