import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import type { BlockNonDirectDamageAbAttr } from "#abilities/block-non-direct-damage-ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { BattlerIndex } from "#enums/battler-index";
import { HitResult } from "#enums/hit-result";
import { MoveId } from "#enums/move-id";
import type { Pokemon } from "#field/pokemon";
import type { PokemonMove } from "#field/pokemon-move";
import type { Move, MoveAttrFilter } from "#moves/move";
import type { MoveAttr } from "#moves/move-attr";
import type { AbstractConstructor } from "#types/utility-types";
import { BooleanHolder, getTSEnumKeys, toDmgValue } from "#utils/common-utils";
import { t } from "i18next";

//#region Exports

export const FilterAllMoves = (_pokemonMove: PokemonMove) => null;

export const crashDamageFunc = (user: Pokemon, _move: Move): boolean => {
  const cancelled = new BooleanHolder(false);
  applyAbAttrs<BlockNonDirectDamageAbAttr>(AbAttrFlag.BLOCK_NON_DIRECT_DAMAGE, user, false, cancelled);
  if (cancelled.value) {
    return false;
  }

  user.damageAndUpdate(toDmgValue(user.getMaxHp() / 2), {
    result: HitResult.OTHER,
    ignoreSegments: true,
  });
  globalScene.phaseManager.createAndUnshiftPhase(
    "MessagePhase",
    t("moveTriggers:keptGoingAndCrashed", { pokemonName: getPokemonNameWithAffix(user) }),
  );

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

/**
 * Returns a list of all G-max Moves, based on the move's name.
 *
 * Note that this function deliberately does not check for a move flag, since it is
 * designed to be called before `initMoves()` has finished.
 */
export function getGmaxMoveList(): MoveId[] {
  const ret: MoveId[] = [];
  for (const move_name of getTSEnumKeys(MoveId)) {
    if (move_name.startsWith("G_MAX_")) {
      ret.push(MoveId[move_name]);
    }
  }
  return ret;
}

/**
 * Returns a list of all Max Moves, including G-max Moves, based on the move's name.
 *
 * Note that this function deliberately does not check for a move flag, since it is
 * designed to be called before `initMoves()` has finished.
 */
export function getMaxMoveList(): MoveId[] {
  const ret = getGmaxMoveList();
  for (const move_name of getTSEnumKeys(MoveId)) {
    if (move_name.startsWith("MAX_")) {
      ret.push(MoveId[move_name]);
    }
  }
  return ret;
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

export function isFieldTargeted(targets: BattlerIndex[]): boolean {
  return targets.some((t) => [BattlerIndex.BOTH_SIDES, BattlerIndex.PLAYER_SIDE, BattlerIndex.ENEMY_SIDE].includes(t));
}

//#endregion
