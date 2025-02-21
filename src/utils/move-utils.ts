import { applyAbAttrs } from "#app/data/apply-ab-attrs";
import { type Move, type MoveAttrFilter } from "#app/data/move";
import type { MoveAttr } from "#app/data/move-attrs/move-attr";
import type { Pokemon } from "#app/field/pokemon";
import type { PokemonMove } from "#app/field/pokemon-move";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BooleanHolder, toDmgValue, type AbstractConstructor } from "#app/utils";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { BattlerIndex } from "#enums/battler-index";
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

export function applyMoveAttrs<TAttr extends MoveAttr>(
  attrType: AbstractConstructor<TAttr>,
  ...params: Parameters<TAttr["apply"]>
): void {
  applyMoveAttrsInternal((attr: MoveAttr) => attr instanceof attrType, ...params);
}

export function applyFilteredMoveAttrs<TAttr extends MoveAttr>(
  attrFilter: MoveAttrFilter,
  ...params: Parameters<TAttr["apply"]>
): void {
  applyMoveAttrsInternal(attrFilter, ...params);
}

export function applyMoveChargeAttrs<TAttr extends MoveAttr>(
  attrType: AbstractConstructor<TAttr>,
  ...params: Parameters<TAttr["apply"]>
): void {
  applyMoveChargeAttrsInternal((attr: MoveAttr) => attr instanceof attrType, ...params);
}

//#endregion
//#region Helpers

function applyMoveAttrsInternal<TAttr extends MoveAttr>(
  attrFilter: MoveAttrFilter,
  ...params: Parameters<TAttr["apply"]>
): void {
  const [user, target, move, ...args] = params;
  move.attrs.filter((attr) => attrFilter(attr)).forEach((attr) => attr.apply(user, target, move, ...args));
}

function applyMoveChargeAttrsInternal<TAttr extends MoveAttr>(
  attrFilter: MoveAttrFilter,
  ...params: Parameters<TAttr["apply"]>
): void {
  const [user, target, move, ...args] = params;
  if (move.isChargingMove()) {
    move.chargeAttrs.filter((attr) => attrFilter(attr)).forEach((attr) => attr.apply(user, target, move, ...args));
  }
}
export function isFieldTargeted(targets: BattlerIndex[]) {
  return targets.some((t) => [BattlerIndex.BOTH_SIDES, BattlerIndex.PLAYER_SIDE, BattlerIndex.ENEMY_SIDE].includes(t));
}

//#endregion
