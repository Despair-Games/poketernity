import { MoveEffectTrigger } from "#enums/move-effect-trigger";
import { MoveId } from "#enums/move-id";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { MoveEndPhase } from "#app/phases/move-end-phase";
import { MovePhase } from "#app/phases/move-phase";
import i18next from "i18next";
import { type Move } from "#app/data/move";
import { allMoves } from "#app/data/all-moves";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";
import type { MoveConditionFunc } from "../move-conditions";

/**
 * Attribute used for moves that causes the target to repeat their last used move.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Instruct_(move) | Instruct}.
 * @extends MoveEffectAttr
 */
export class RepeatMoveAttr extends MoveEffectAttr {
  constructor() {
    super(false, { trigger: MoveEffectTrigger.POST_APPLY }); // needed to ensure correct protect interaction
  }

  override applyEffect(user: Pokemon, target: Pokemon, _move: Move): boolean {
    // get the last move used (excluding status based failures) as well as the corresponding moveset slot
    const lastMove = target.getLastXMoves(-1).find((m) => m.moveId !== MoveId.NONE)!;
    const movesetMove = target.getMoveset().find((m) => m?.moveId === lastMove.moveId)!;
    const moveTargets = lastMove.targets ?? [];

    globalScene.queueMessage(
      i18next.t("moveTriggers:instructingMove", {
        userPokemonName: getPokemonNameWithAffix(user),
        targetPokemonName: getPokemonNameWithAffix(target),
      }),
    );
    target.getMoveQueue().unshift({ moveId: lastMove.moveId, targets: moveTargets, ignorePP: false });
    target.turnData.extraTurns++;
    globalScene.appendToPhase(new MovePhase(target, moveTargets, movesetMove), MoveEndPhase);
    return true;
  }

  override getCondition(): MoveConditionFunc {
    return (_user, target, _move) => {
      // TODO: Confirm behavior of instructing move known by target but called by another move
      const lastMove = target.getLastXMoves(-1).find((m) => m.moveId !== MoveId.NONE);
      const movesetMove = target.getMoveset().find((m) => m?.moveId === lastMove?.moveId);
      const moveTargets = lastMove?.targets ?? [];
      // TODO: Add a way of adding moves to list procedurally rather than a pre-defined blacklist
      const unrepeatablemoves = [
        // Locking/Continually Executed moves
        MoveId.OUTRAGE,
        MoveId.RAGING_FURY,
        MoveId.ROLLOUT,
        MoveId.PETAL_DANCE,
        MoveId.THRASH,
        MoveId.ICE_BALL,
        // Multi-turn Moves
        MoveId.BIDE,
        MoveId.SHELL_TRAP,
        MoveId.BEAK_BLAST,
        MoveId.FOCUS_PUNCH,
        // "First Turn Only" moves
        MoveId.FAKE_OUT,
        MoveId.FIRST_IMPRESSION,
        MoveId.MAT_BLOCK,
        // Moves with a recharge turn
        MoveId.HYPER_BEAM,
        MoveId.ETERNABEAM,
        MoveId.FRENZY_PLANT,
        MoveId.BLAST_BURN,
        MoveId.HYDRO_CANNON,
        MoveId.GIGA_IMPACT,
        MoveId.PRISMATIC_LASER,
        MoveId.ROAR_OF_TIME,
        MoveId.ROCK_WRECKER,
        MoveId.METEOR_ASSAULT,
        // Charging & 2-turn moves
        MoveId.DIG,
        MoveId.FLY,
        MoveId.BOUNCE,
        MoveId.SHADOW_FORCE,
        MoveId.PHANTOM_FORCE,
        MoveId.DIVE,
        MoveId.ELECTRO_SHOT,
        MoveId.ICE_BURN,
        MoveId.GEOMANCY,
        MoveId.FREEZE_SHOCK,
        MoveId.SKY_DROP,
        MoveId.SKY_ATTACK,
        MoveId.SKULL_BASH,
        MoveId.SOLAR_BEAM,
        MoveId.SOLAR_BLADE,
        MoveId.METEOR_BEAM,
        // Other moves
        MoveId.INSTRUCT,
        MoveId.KINGS_SHIELD,
        MoveId.SKETCH,
        MoveId.TRANSFORM,
        MoveId.MIMIC,
        MoveId.STRUGGLE,
        // TODO: Add Max/G-Move blockage if or when they are implemented
      ];

      if (
        !movesetMove // called move not in target's moveset (dancer, forgetting the move, etc.)
        || movesetMove.ppUsed === movesetMove.getMovePp() // move out of pp
        || allMoves[lastMove?.moveId ?? MoveId.NONE].isChargingMove() // called move is a charging/recharging move
        || !moveTargets.length // called move has no targets
        || unrepeatablemoves.includes(lastMove?.moveId ?? MoveId.NONE)
      ) {
        // called move is explicitly in the banlist
        return false;
      }
      return true;
    };
  }

  override getTargetBenefitScore(_user: Pokemon, _target: Pokemon, _move: Move): number {
    // TODO: Make the AI acutally use instruct
    /* Ideally, the AI would score instruct based on the scorings of the on-field pokemons'
     * last used moves at the time of using Instruct (by the time the instructor gets to act)
     * with respect to the user's side.
     * In 99.9% of cases, this would be the pokemon's ally (unless the target had last
     * used a move like Decorate on the user or its ally)
     */
    return 2;
  }
}
