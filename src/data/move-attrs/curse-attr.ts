import { type Pokemon, HitResult } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { StatStageChangePhase } from "#app/phases/stat-stage-change-phase";
import { BattlerTagType } from "#enums/battler-tag-type";
import { Stat } from "#enums/stat";
import { Type } from "#enums/type";
import i18next from "i18next";
import type { Move } from "../move";
import { MoveEffectAttr } from "./move-effect-attr";

export class CurseAttr extends MoveEffectAttr {
  /**
   * If the user is Ghost-type, this adds a {@linkcode BattlerTagType.CURSED Curse} to the target
   * at the cost of half of the user's maximum HP.
   * Otherwise, this increases the user's Attack and Defense by one stage
   * and decreases the user's Speed by one stage.
   */
  override apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    if (user.getTypes(true).includes(Type.GHOST)) {
      if (target.getTag(BattlerTagType.CURSED)) {
        globalScene.queueMessage(i18next.t("battle:attackFailed"));
        return false;
      }
      const curseRecoilDamage = Math.max(1, Math.floor(user.getMaxHp() / 2));
      user.damageAndUpdate(curseRecoilDamage, HitResult.OTHER, false, true, true);
      globalScene.queueMessage(
        i18next.t("battlerTags:cursedOnAdd", {
          pokemonNameWithAffix: getPokemonNameWithAffix(user),
          pokemonName: getPokemonNameWithAffix(target),
        }),
      );

      target.addTag(BattlerTagType.CURSED, 0, move.id, user.id);
      return true;
    } else {
      globalScene.unshiftPhase(new StatStageChangePhase(user.getBattlerIndex(), true, [Stat.ATK, Stat.DEF], 1));
      globalScene.unshiftPhase(new StatStageChangePhase(user.getBattlerIndex(), true, [Stat.SPD], -1));
      return true;
    }
  }
}
