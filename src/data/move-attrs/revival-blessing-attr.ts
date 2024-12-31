import { SwitchType } from "#enums/switch-type";
import type { Pokemon } from "#app/field/pokemon";
import { PlayerPokemon, EnemyPokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { RevivalBlessingPhase } from "#app/phases/revival-blessing-phase";
import { SwitchSummonPhase } from "#app/phases/switch-summon-phase";
import { toDmgValue } from "#app/utils";
import i18next from "i18next";
import type { Move } from "#app/data/move";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";
import type { MoveConditionFunc } from "../move-conditions";

/**
 * Attribute used for Revival Blessing.
 * @extends MoveEffectAttr
 * @see {@linkcode apply}
 */
export class RevivalBlessingAttr extends MoveEffectAttr {
  constructor() {
    super(true);
  }

  /**
   * If the user is a player Pokemon, allows the player to select a
   * fainted Pokemon in their party to revive to half of its maximum HP.
   * Otherwise, revives a random Pokemon in the user's party.
   */
  override apply(user: Pokemon, _target: Pokemon, _move: Move): boolean {
    // If user is player, checks if the user has fainted pokemon
    if (user instanceof PlayerPokemon) {
      globalScene.unshiftPhase(new RevivalBlessingPhase(user));
      return true;
    } else if (user instanceof EnemyPokemon) {
      // If used by an enemy trainer with at least one fainted non-boss Pokemon, this
      // revives one of said Pokemon selected at random.
      const faintedPokemon = globalScene.getEnemyParty().filter((p) => p.isFainted() && !p.isBoss());
      const pokemon = faintedPokemon[user.randSeedInt(faintedPokemon.length)];
      const slotIndex = globalScene.getEnemyParty().findIndex((p) => pokemon.id === p.id);
      pokemon.resetStatus();
      pokemon.heal(Math.min(toDmgValue(0.5 * pokemon.getMaxHp()), pokemon.getMaxHp()));
      globalScene.queueMessage(
        i18next.t("moveTriggers:revivalBlessing", { pokemonName: getPokemonNameWithAffix(pokemon) }),
        0,
        true,
      );

      if (globalScene.currentBattle.double && globalScene.getEnemyParty().length > 1) {
        const allyPokemon = user.getAlly();
        if (slotIndex <= 1) {
          globalScene.unshiftPhase(
            new SwitchSummonPhase(SwitchType.SWITCH, pokemon.getFieldIndex(), slotIndex, false, false),
          );
        } else if (allyPokemon.isFainted()) {
          globalScene.unshiftPhase(
            new SwitchSummonPhase(SwitchType.SWITCH, allyPokemon.getFieldIndex(), slotIndex, false, false),
          );
        }
      }
      return true;
    }
    return false;
  }

  override getCondition(): MoveConditionFunc {
    return (user, _target, _move) =>
      (user instanceof PlayerPokemon && globalScene.getPlayerParty().some((p) => p.isFainted()))
      || (user instanceof EnemyPokemon
        && user.hasTrainer()
        && globalScene.getEnemyParty().some((p) => p.isFainted() && !p.isBoss()));
  }

  override getUserBenefitScore(user: Pokemon, _target: Pokemon, _move: Move): number {
    if (user.hasTrainer() && globalScene.getEnemyParty().some((p) => p.isFainted() && !p.isBoss())) {
      return 20;
    }

    return -20;
  }
}
