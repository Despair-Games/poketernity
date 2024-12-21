import { MoveResult, type Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { MovePhase } from "#app/phases/move-phase";
import { BooleanHolder } from "#app/utils";
import { Abilities } from "#enums/abilities";
import { ArenaTagType } from "#enums/arena-tag-type";
import { StatusEffect } from "#enums/status-effect";
import { Type } from "#enums/type";
import i18next from "i18next";
import { FieldPreventExplosiveMovesAbAttr } from "./ab-attrs/field-prevent-explosive-moves-ab-attr";
import { applyAbAttrs } from "./ability";
import { StockpilingTag } from "./battler-tags";
import { allMoves, type Move } from "./move";
import { MoveCategory } from "#enums/move-category";
import { Command } from "#app/ui/command-ui-handler";

export type MoveConditionFunc = (user: Pokemon, target: Pokemon, move: Move) => boolean;
export type UserMoveConditionFunc = (user: Pokemon, move: Move) => boolean;

export class MoveCondition {
  protected func: MoveConditionFunc;

  constructor(func: MoveConditionFunc) {
    this.func = func;
  }

  apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    return this.func(user, target, move);
  }

  getUserBenefitScore(_user: Pokemon, _target: Pokemon, _move: Move): number {
    return 0;
  }
}

export class FirstMoveCondition extends MoveCondition {
  constructor() {
    super((user, _target, _move) => user.battleSummonData?.waveTurnCount === 1);
  }

  override getUserBenefitScore(user: Pokemon, target: Pokemon, move: Move): number {
    return this.apply(user, target, move) ? 10 : -20;
  }
}

/**
 * Condition used by the move {@link https://bulbapedia.bulbagarden.net/wiki/Upper_Hand_(move) | Upper Hand}.
 * Moves with this condition are only successful when the target has selected
 * a high-priority attack (after factoring in priority-boosting effects) and
 * hasn't moved yet this turn.
 */
export class UpperHandCondition extends MoveCondition {
  constructor() {
    super((_user, target, _move) => {
      const targetCommand = globalScene.currentBattle.turnCommands[target.getBattlerIndex()];

      return (
        !!targetCommand
        && targetCommand.command === Command.FIGHT
        && !target.turnData.acted
        && !!targetCommand.move?.move
        && allMoves[targetCommand.move.move].category !== MoveCategory.STATUS
        && allMoves[targetCommand.move.move].getPriority(target) > 0
      );
    });
  }
}

export const unknownTypeCondition: MoveConditionFunc = (user, _target, _move) =>
  !user.getTypes().includes(Type.UNKNOWN);

export const hasStockpileStacksCondition: MoveConditionFunc = (user) => {
  const hasStockpilingTag = user.getTag(StockpilingTag);
  return !!hasStockpilingTag && hasStockpilingTag.stockpiledCount > 0;
};

// TODO: Review this
export const targetMoveCopiableCondition: MoveConditionFunc = (_user, target, _move) => {
  const targetMoves = target.getMoveHistory().filter((m) => !m.virtual);
  if (!targetMoves.length) {
    return false;
  }

  const copiableMove = targetMoves[0];

  if (!copiableMove.move) {
    return false;
  }

  if (allMoves[copiableMove.move].isChargingMove() && copiableMove.result === MoveResult.OTHER) {
    return false;
  }

  // TODO: Add last turn of Bide
  return true;
};

export const failOnGravityCondition: MoveConditionFunc = (_user, _target, _move) =>
  !globalScene.arena.getTag(ArenaTagType.GRAVITY);

export const failOnBossCondition: MoveConditionFunc = (_user, target, _move) => !target.isBossImmune();

export const failIfSingleBattle: MoveConditionFunc = (_user, _target, _move) => globalScene.currentBattle.double;

export const failIfDampCondition: MoveConditionFunc = (user, _target, move) => {
  const cancelled = new BooleanHolder(false);
  globalScene.getField(true).map((p) => applyAbAttrs(FieldPreventExplosiveMovesAbAttr, p, cancelled));
  // Queue a message if an ability prevented usage of the move
  if (cancelled.value) {
    globalScene.queueMessage(
      i18next.t("moveTriggers:cannotUseMove", { pokemonName: getPokemonNameWithAffix(user), moveName: move.name }),
    );
  }
  return !cancelled.value;
};

export const userSleptOrComatoseCondition: MoveConditionFunc = (user: Pokemon, _target: Pokemon, _move: Move) =>
  user.status?.effect === StatusEffect.SLEEP || user.hasAbility(Abilities.COMATOSE);

export const targetSleptOrComatoseCondition: MoveConditionFunc = (_user: Pokemon, target: Pokemon, _move: Move) =>
  target.status?.effect === StatusEffect.SLEEP || target.hasAbility(Abilities.COMATOSE);

export const failIfLastCondition: MoveConditionFunc = (_user: Pokemon, _target: Pokemon, _move: Move) =>
  globalScene.phaseQueue.find((phase) => phase instanceof MovePhase) !== undefined;

export const failIfLastInPartyCondition: MoveConditionFunc = (user: Pokemon, _target: Pokemon, _move: Move) => {
  const party: Pokemon[] = user.getParty();
  return party.some((pokemon) => pokemon.isActive() && !pokemon.isOnField());
};

export const failIfGhostTypeCondition: MoveConditionFunc = (_user: Pokemon, target: Pokemon, _move: Move) =>
  !target.isOfType(Type.GHOST);

export const lastMoveCopiableCondition: MoveConditionFunc = (_user, _target, _move) => {
  const copiableMove = globalScene.currentBattle.lastMove;

  if (!copiableMove) {
    return false;
  }

  if (allMoves[copiableMove].isChargingMove()) {
    return false;
  }

  // TODO: Add last turn of Bide
  return true;
};
