import type { UserMoveConditionFunc } from "#app/@types/UserMoveConditionFunc";
import { applyAbAttrs } from "#app/data/apply-ab-attrs";
import type { Move } from "#app/data/move";
import type { Pokemon } from "#app/field/pokemon";
import type { PokemonMove } from "#app/field/pokemon-move";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BooleanHolder, toDmgValue } from "#app/utils";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { BattlerTagType } from "#enums/battler-tag-type";
import { HitResult } from "#enums/hit-result";
import { t } from "i18next";

//#region Exports

export const FilterAllMoves = (_pokemonMove: PokemonMove) => null;

export const crashDamageFunc = (user: Pokemon, _move: Move) => {
  const cancelled = new BooleanHolder(false);
  applyAbAttrs(AbAttrFlag.BLOCK_NON_DIRECT_DAMAGE, user, false, cancelled);
  if (cancelled.value) {
    return false;
  }

  user.damageAndUpdate(toDmgValue(user.getMaxHp() / 2), HitResult.OTHER, false, true);
  globalScene.queueMessage(t("moveTriggers:keptGoingAndCrashed", { pokemonName: getPokemonNameWithAffix(user) }));
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

//#endregion
