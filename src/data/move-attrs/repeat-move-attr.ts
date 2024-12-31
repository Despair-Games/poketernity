import { MoveEffectTrigger } from "#enums/move-effect-trigger";
import { Moves } from "#enums/moves";
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
 *
 * Used for [Instruct](https://bulbapedia.bulbagarden.net/wiki/Instruct_(move)).
 */
export class RepeatMoveAttr extends MoveEffectAttr {
  constructor() {
    super(false, { trigger: MoveEffectTrigger.POST_APPLY }); // needed to ensure correct protect interaction
  }

  /** Forces the target to re-use their last used move */
  override apply(user: Pokemon, target: Pokemon, _move: Move): boolean {
    // get the last move used (excluding status based failures) as well as the corresponding moveset slot
    const lastMove = target.getLastXMoves(-1).find((m) => m.move !== Moves.NONE)!;
    const movesetMove = target.getMoveset().find((m) => m?.moveId === lastMove.move)!;
    const moveTargets = lastMove.targets ?? [];

    globalScene.queueMessage(
      i18next.t("moveTriggers:instructingMove", {
        userPokemonName: getPokemonNameWithAffix(user),
        targetPokemonName: getPokemonNameWithAffix(target),
      }),
    );
    target.getMoveQueue().unshift({ move: lastMove.move, targets: moveTargets, ignorePP: false });
    target.turnData.extraTurns++;
    globalScene.appendToPhase(new MovePhase(target, moveTargets, movesetMove), MoveEndPhase);
    return true;
  }

  override getCondition(): MoveConditionFunc {
    return (_user, target, _move) => {
      // TODO: Confirm behavior of instructing move known by target but called by another move
      const lastMove = target.getLastXMoves(-1).find((m) => m.move !== Moves.NONE);
      const movesetMove = target.getMoveset().find((m) => m?.moveId === lastMove?.move);
      const moveTargets = lastMove?.targets ?? [];
      // TODO: Add a way of adding moves to list procedurally rather than a pre-defined blacklist
      const unrepeatablemoves = [
        // Locking/Continually Executed moves
        Moves.OUTRAGE,
        Moves.RAGING_FURY,
        Moves.ROLLOUT,
        Moves.PETAL_DANCE,
        Moves.THRASH,
        Moves.ICE_BALL,
        // Multi-turn Moves
        Moves.BIDE,
        Moves.SHELL_TRAP,
        Moves.BEAK_BLAST,
        Moves.FOCUS_PUNCH,
        // "First Turn Only" moves
        Moves.FAKE_OUT,
        Moves.FIRST_IMPRESSION,
        Moves.MAT_BLOCK,
        // Moves with a recharge turn
        Moves.HYPER_BEAM,
        Moves.ETERNABEAM,
        Moves.FRENZY_PLANT,
        Moves.BLAST_BURN,
        Moves.HYDRO_CANNON,
        Moves.GIGA_IMPACT,
        Moves.PRISMATIC_LASER,
        Moves.ROAR_OF_TIME,
        Moves.ROCK_WRECKER,
        Moves.METEOR_ASSAULT,
        // Charging & 2-turn moves
        Moves.DIG,
        Moves.FLY,
        Moves.BOUNCE,
        Moves.SHADOW_FORCE,
        Moves.PHANTOM_FORCE,
        Moves.DIVE,
        Moves.ELECTRO_SHOT,
        Moves.ICE_BURN,
        Moves.GEOMANCY,
        Moves.FREEZE_SHOCK,
        Moves.SKY_DROP,
        Moves.SKY_ATTACK,
        Moves.SKULL_BASH,
        Moves.SOLAR_BEAM,
        Moves.SOLAR_BLADE,
        Moves.METEOR_BEAM,
        // Other moves
        Moves.INSTRUCT,
        Moves.KINGS_SHIELD,
        Moves.SKETCH,
        Moves.TRANSFORM,
        Moves.MIMIC,
        Moves.STRUGGLE,
        // TODO: Add Max/G-Move blockage if or when they are implemented
      ];

      if (
        !movesetMove // called move not in target's moveset (dancer, forgetting the move, etc.)
        || movesetMove.ppUsed === movesetMove.getMovePp() // move out of pp
        || allMoves[lastMove?.move ?? Moves.NONE].isChargingMove() // called move is a charging/recharging move
        || !moveTargets.length // called move has no targets
        || unrepeatablemoves.includes(lastMove?.move ?? Moves.NONE)
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
