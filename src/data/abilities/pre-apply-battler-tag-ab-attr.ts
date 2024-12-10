import type Pokemon from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";
import type { BattlerTag } from "../battler-tags";
import { AbAttr } from "./ab-attr";

export class PreApplyBattlerTagAbAttr extends AbAttr {
  applyPreApplyBattlerTag(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    _tag: BattlerTag,
    _cancelled: BooleanHolder,
    _args: any[],
  ): boolean {
    return false;
  }
}
