import { commonAnims } from "#app/data/common-anims";
import { loadAnimAssets } from "./anim-utils";

export function loadCommonAnimAssets(startLoad?: boolean): Promise<void> {
  return new Promise((resolve) => {
    loadAnimAssets(Array.from(commonAnims.values()), startLoad).then(() => resolve());
  });
}
