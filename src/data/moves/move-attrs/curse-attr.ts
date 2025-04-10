import type { Move } from "#app/data/moves/move";
import { MoveEffectAttr } from "#app/data/moves/move-attrs/move-effect-attr";
import { type Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { StatStageChangePhase } from "#app/phases/stat-stage-change-phase";
import { BattlerTagType } from "#enums/battler-tag-type";
import { ElementalType } from "#enums/elemental-type";
import { HitResult } from "#enums/hit-result";
import { Stat } from "#enums/stat";
import i18next from "i18next";

/**
 * Attribute for {@link https://bulbapedia.bulbagarden.net/wiki/Curse_(move) | Curse}
 * to apply different effects based on the user's type:
 * - If the user is Ghost-type, this adds a {@linkcode BattlerTagType.CURSED | curse} to the target
 * at the cost of half of the user's maximum HP.
 * - Otherwise, this increases the user's Attack and Defense by one stage
 * and decreases the user's Speed by one stage.
 * @extends MoveEffectAttr
 */
export class CurseAttr extends MoveEffectAttr {
  override applyEffect(user: Pokemon, target: Pokemon, move: Move): boolean {
    if (user.getTypes(true).includes(ElementalType.GHOST)) {
      if (target.getTag(BattlerTagType.CURSED)) {
        globalScene.phaseManager.queueMessagePhase(i18next.t("battle:attackFailed"));
        return false;
      }
      const curseRecoilDamage = Math.max(1, Math.floor(user.getMaxHp() / 2));
      user.damageAndUpdate(curseRecoilDamage, {
        result: HitResult.OTHER,
        ignoreSegments: true,
        preventEndure: true,
      });
      globalScene.phaseManager.queueMessagePhase(
        i18next.t("battlerTags:cursedOnAdd", {
          pokemonNameWithAffix: getPokemonNameWithAffix(user),
          pokemonName: getPokemonNameWithAffix(target),
        }),
      );

      target.addTag(BattlerTagType.CURSED, 0, move.id, user.id);
      return true;
    } else {
      globalScene.phaseManager.unshiftPhase(
        new StatStageChangePhase(user.getBattlerIndex(), user, [Stat.ATK, Stat.DEF], 1),
      );
      globalScene.phaseManager.unshiftPhase(new StatStageChangePhase(user.getBattlerIndex(), user, [Stat.SPD], -1));
      return true;
    }
  }
}
