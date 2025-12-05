import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { SwitchType } from "#enums/switch-type";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveEffectAttr } from "#moves/move-effect-attr";
import type { MoveConditionFunc } from "#types/move-types";
import { toDmgValue } from "#utils/common-utils";
import i18next from "i18next";

/**
 * Attribute to revive a Pokemon in the user's party to 50% HP.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Revival_Blessing_(move) | Revival Blessing}
 */
export class RevivalBlessingAttr extends MoveEffectAttr {
  constructor() {
    super(true);
  }

  override applyEffect(user: Pokemon, _target: Pokemon, _move: Move): boolean {
    // If user is player, checks if the user has fainted pokemon
    if (user.isPlayer()) {
      globalScene.phaseManager.createAndUnshiftPhase("RevivalBlessingPhase", user);
      return true;
    }
    if (user.isEnemy()) {
      // If used by an enemy trainer with at least one fainted non-boss Pokemon, this
      // revives one of said Pokemon selected at random.
      const faintedPokemon = globalScene.getEnemyParty().filter((p) => p.isFainted() && !p.boss);
      const pokemon = faintedPokemon[user.randSeedInt(faintedPokemon.length)];
      const slotIndex = globalScene.getEnemyParty().findIndex((p) => pokemon.id === p.id);
      const { currentBattle, phaseManager } = globalScene;

      pokemon.resetStatus();
      pokemon.heal(Math.min(toDmgValue(0.5 * pokemon.getMaxHp()), pokemon.getMaxHp()));
      globalScene.phaseManager.createAndUnshiftPhase(
        "MessagePhase",
        i18next.t("moveTriggers:revivalBlessing", { pokemonName: getPokemonNameWithAffix(pokemon) }),
        0,
        true,
      );

      if (currentBattle.double && globalScene.getEnemyParty().length > 1) {
        const allyPokemon = user.getAlly();
        if (slotIndex <= 1) {
          phaseManager.createAndUnshiftPhase("SummonPhase", pokemon.getBattlerIndex());
        } else if (allyPokemon?.isFainted()) {
          globalScene.phaseManager.unshiftPhase(
            // SummonPhase is queued separately from SwitchPhase to disable the Enemy Trainer anim
            phaseManager.createPhase("SwitchPhase", allyPokemon.getBattlerIndex(), SwitchType.SWITCH, slotIndex, false),
            phaseManager.createPhase("SummonPhase", allyPokemon.getBattlerIndex(), { playTrainerAnim: false }),
          );
        }
      }
      return true;
    }
    return false;
  }

  override getCondition(): MoveConditionFunc {
    return (user, _target, _move) =>
      (user.isPlayer() && globalScene.getPlayerParty().some((p) => p.isFainted()))
      || (user.isEnemy() && user.hasTrainer() && globalScene.getEnemyParty().some((p) => p.isFainted() && !p.boss));
  }

  override getUserBenefitScore(user: Pokemon, _target: Pokemon, _move: Move): number {
    if (user.hasTrainer() && globalScene.getEnemyParty().some((p) => p.isFainted() && !p.boss)) {
      return 20;
    }

    return -20;
  }
}
