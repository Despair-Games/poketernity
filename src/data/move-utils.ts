import { type Pokemon, HitResult } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BooleanHolder, toDmgValue } from "#app/utils";
import i18next from "i18next";
import { BlockNonDirectDamageAbAttr } from "./ab-attrs/block-non-direct-damage-ab-attr";
import { applyAbAttrs } from "./ability";
import type { Move } from "./move";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { UserMoveConditionFunc } from "./move-conditions";

export const crashDamageFunc = (user: Pokemon, _move: Move) => {
  const cancelled = new BooleanHolder(false);
  applyAbAttrs(BlockNonDirectDamageAbAttr, user, cancelled);
  if (cancelled.value) {
    return false;
  }

  user.damageAndUpdate(toDmgValue(user.getMaxHp() / 2), HitResult.OTHER, false, true);
  globalScene.queueMessage(
    i18next.t("moveTriggers:keptGoingAndCrashed", { pokemonName: getPokemonNameWithAffix(user) }),
  );
  user.turnData.damageTaken += toDmgValue(user.getMaxHp() / 2);

  return true;
};

export const frenzyMissFunc: UserMoveConditionFunc = (user: Pokemon, move: Move) => {
  while (user.getMoveQueue().length && user.getMoveQueue()[0].move === move.id) {
    user.getMoveQueue().shift();
  }
  user.removeTag(BattlerTagType.FRENZY); // FRENZY tag should be disrupted on miss/no effect

  return true;
};
