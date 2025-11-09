import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { AbilityId } from "#enums/ability-id";
import { BattleType } from "#enums/battle-type";
import { MoveId } from "#enums/move-id";
import { SwitchType } from "#enums/switch-type";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveEffectAttr } from "#moves/move-effect-attr";
import type { MoveConditionFunc } from "#types/move-types";
import { ValueHolder } from "#utils/common-utils";
import i18next from "i18next";

/**
 * Attribute to force either the user (e.g. {@link https://bulbapedia.bulbagarden.net/wiki/U-turn_(move) | U-turn})
 * or the target (e.g. {@link https://bulbapedia.bulbagarden.net/wiki/Roar_(move) | Roar})
 * off the field, prompting a switch.
 */
export class ForceSwitchOutAttr extends MoveEffectAttr {
  private readonly switchType: SwitchType;

  constructor(selfTarget: boolean = false, switchType: SwitchType = SwitchType.SWITCH) {
    super(selfTarget, { lastHitOnly: true });
    this.switchType = switchType;
  }

  public isBatonPass() {
    return this.switchType === SwitchType.BATON_PASS;
  }

  public override applyEffect(user: Pokemon, target: Pokemon, move: Move): boolean {
    const switchOutTarget = this.selfTarget ? user : target;

    // If Wimp Out/Emergency Exit activates as a result of U-turn, Volt Switch, or Flip Turn,
    // the forced switch from the respective move is nullified
    if (
      [AbilityId.EMERGENCY_EXIT, AbilityId.WIMP_OUT].some((abId) => target.hasAbility(abId))
      && [MoveId.U_TURN, MoveId.VOLT_SWITCH, MoveId.FLIP_TURN].includes(move.id)
      && this.hpDroppedBelowHalf(target)
    ) {
      return false;
    }

    const switchOutIndex = switchOutTarget.getBattlerIndex();

    if (
      switchOutTarget.isEnemy()
      && globalScene.currentBattle.battleType === BattleType.WILD
      && ([SwitchType.FORCE_SWITCH, SwitchType.TELEPORT] as readonly SwitchType[]).includes(this.switchType)
    ) {
      return globalScene.tryForceFleePokemon(switchOutIndex, user);
    }
    return globalScene.tryForceSwitchPokemon(switchOutIndex, this.switchType);
  }

  /**
   * Status moves with this effect fail if the effect's target cannot be forced to
   * switch out or flee, depending on the current {@linkcode BattleType}
   */
  public override getCondition(): MoveConditionFunc {
    return (user, target, move) => {
      if (move.isAttackMove(user, target)) {
        return true;
      }

      const switchOutTarget = this.selfTarget ? user : target;

      if (
        switchOutTarget.isEnemy()
        && globalScene.currentBattle.battleType === BattleType.WILD
        && ([SwitchType.FORCE_SWITCH, SwitchType.TELEPORT] as readonly SwitchType[]).includes(this.switchType)
      ) {
        return globalScene.canForceFleePokemon(switchOutTarget, user);
      }
      return globalScene.canForceSwitchPokemon(switchOutTarget);
    };
  }

  /**
   * Overrides the generic "But it failed!" with Suction Cups et al's activation
   * text if the move failed because of the ability's effect
   */
  public override getFailedText(
    _user: Pokemon,
    target: Pokemon,
    _move: Move,
    _cancelled: ValueHolder<boolean>,
  ): string | null {
    if (this.selfTarget || this.switchType !== SwitchType.FORCE_SWITCH) {
      return null;
    }

    const blockedByAbility = new ValueHolder(false);
    applyAbAttrs("ForceSwitchOutImmunityAbAttr", target, false, blockedByAbility);
    return blockedByAbility.value
      ? i18next.t("moveTriggers:cannotBeSwitchedOut", { pokemonName: getPokemonNameWithAffix(target) })
      : null;
  }

  public override getUserBenefitScore(user: Pokemon, target: Pokemon, move: Move): number {
    if (!globalScene.getEnemyParty().find((p) => p.isActive() && !p.isOnField())) {
      return -20;
    }
    let ret = this.selfTarget
      ? Math.floor((1 - user.getHpRatio()) * 20)
      : super.getUserBenefitScore(user, target, move);
    if (this.selfTarget && this.isBatonPass()) {
      const statStageTotal = user.getStatStages().reduce((s: number, total: number) => total + s, 0);
      ret =
        ret / 2
        + Phaser.Tweens.Builders.GetEaseFunction("Sine.easeOut")(Math.min(Math.abs(statStageTotal), 10) / 10)
          * (statStageTotal >= 0 ? 10 : -10);
    }
    return ret;
  }

  /**
   * Helper function to check if the Pokémon's health is below half after taking damage.
   * Used for an edge case interaction with Wimp Out/Emergency Exit.
   * If the Ability activates due to being hit by U-turn or Volt Switch, the user of that move will not be switched out.
   */
  private hpDroppedBelowHalf(target: Pokemon): boolean {
    const pokemonHealth = target.hp;
    const maxPokemonHealth = target.getMaxHp();
    const damageTaken = target.turnData.damageTaken;
    const initialHealth = pokemonHealth + damageTaken;

    // Check if the Pokémon's health has dropped below half after the damage
    return initialHealth >= maxPokemonHealth / 2 && pokemonHealth < maxPokemonHealth / 2;
  }
}
