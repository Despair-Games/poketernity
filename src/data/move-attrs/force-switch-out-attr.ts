import { BattleType } from "#app/battle";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveCategory } from "#enums/move-category";
import { Moves } from "#enums/moves";
import { SwitchType } from "#enums/switch-type";
import type { Pokemon, EnemyPokemon } from "#app/field/pokemon";
import { PlayerPokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BattleEndPhase } from "#app/phases/battle-end-phase";
import { MoveEndPhase } from "#app/phases/move-end-phase";
import { NewBattlePhase } from "#app/phases/new-battle-phase";
import { SwitchPhase } from "#app/phases/switch-phase";
import { SwitchSummonPhase } from "#app/phases/switch-summon-phase";
import { BooleanHolder } from "#app/utils";
import i18next from "i18next";
import { ForceSwitchOutImmunityAbAttr } from "#app/data/ab-attrs/force-switch-out-immunity-ab-attr";
import { PostDamageForceSwitchAbAttr, applyAbAttrs } from "#app/data/ability";
import type { Move } from "#app/data/move";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";
import type { MoveConditionFunc } from "../move-conditions";

export class ForceSwitchOutAttr extends MoveEffectAttr {
  constructor(
    private selfSwitch: boolean = false,
    private switchType: SwitchType = SwitchType.SWITCH,
  ) {
    super(false, { lastHitOnly: true });
  }

  isBatonPass() {
    return this.switchType === SwitchType.BATON_PASS;
  }

  /**
   * If conditions to switch out are met, forces the target
   * (or user if {@linkcode selfSwitch} is `true`) to switch out
   */
  override apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    // Check if the move category is not STATUS or if the switch out condition is not met
    if (!this.getSwitchOutCondition()(user, target, move)) {
      return false;
    }

    /** The {@linkcode Pokemon} to be switched out with this effect */
    const switchOutTarget = this.selfSwitch ? user : target;

    // If the switch-out target is a Dondozo with a Tatsugiri in its mouth
    // (e.g. when it uses Flip Turn), make it spit out the Tatsugiri before switching out.
    switchOutTarget.lapseTag(BattlerTagType.COMMANDED);

    if (switchOutTarget instanceof PlayerPokemon) {
      /**
       * Check if Wimp Out/Emergency Exit activates due to being hit by U-turn or Volt Switch
       * If it did, the user of U-turn or Volt Switch will not be switched out.
       */
      if (
        target.getAbility().hasAttr(PostDamageForceSwitchAbAttr)
        && [Moves.U_TURN, Moves.VOLT_SWITCH, Moves.FLIP_TURN].includes(move.id)
      ) {
        if (this.hpDroppedBelowHalf(target)) {
          return false;
        }
      }

      // Find indices of off-field Pokemon that are eligible to be switched into
      const eligibleNewIndices: number[] = [];
      globalScene.getPlayerParty().forEach((pokemon, index) => {
        if (pokemon.isAllowedInBattle() && !pokemon.isOnField()) {
          eligibleNewIndices.push(index);
        }
      });

      if (eligibleNewIndices.length < 1) {
        return false;
      }

      if (switchOutTarget.hp > 0) {
        if (this.switchType === SwitchType.FORCE_SWITCH) {
          switchOutTarget.leaveField(true);
          const slotIndex = eligibleNewIndices[user.randSeedInt(eligibleNewIndices.length)];
          globalScene.prependToPhase(
            new SwitchSummonPhase(this.switchType, switchOutTarget.getFieldIndex(), slotIndex, false, true),
            MoveEndPhase,
          );
        } else {
          switchOutTarget.leaveField(this.switchType === SwitchType.SWITCH);
          globalScene.prependToPhase(
            new SwitchPhase(this.switchType, switchOutTarget.getFieldIndex(), true, true),
            MoveEndPhase,
          );
          return true;
        }
      }
      return false;
    } else if (globalScene.currentBattle.battleType !== BattleType.WILD) {
      // Switch out logic for enemy trainers
      // Find indices of off-field Pokemon that are eligible to be switched into
      const eligibleNewIndices: number[] = [];
      globalScene.getEnemyParty().forEach((pokemon, index) => {
        if (pokemon.isAllowedInBattle() && !pokemon.isOnField()) {
          eligibleNewIndices.push(index);
        }
      });

      if (eligibleNewIndices.length < 1) {
        return false;
      }

      if (switchOutTarget.hp > 0) {
        if (this.switchType === SwitchType.FORCE_SWITCH) {
          switchOutTarget.leaveField(true);
          const slotIndex = eligibleNewIndices[user.randSeedInt(eligibleNewIndices.length)];
          globalScene.prependToPhase(
            new SwitchSummonPhase(this.switchType, switchOutTarget.getFieldIndex(), slotIndex, false, false),
            MoveEndPhase,
          );
        } else {
          switchOutTarget.leaveField(this.switchType === SwitchType.SWITCH);
          globalScene.prependToPhase(
            new SwitchSummonPhase(
              this.switchType,
              switchOutTarget.getFieldIndex(),
              globalScene.currentBattle.trainer
                ? globalScene.currentBattle.trainer.getNextSummonIndex((switchOutTarget as EnemyPokemon).trainerSlot)
                : 0,
              false,
              false,
            ),
            MoveEndPhase,
          );
        }
      }
    } else {
      // Switch out logic for wild pokemon
      /**
       * Check if Wimp Out/Emergency Exit activates due to being hit by U-turn or Volt Switch
       * If it did, the user of U-turn or Volt Switch will not be switched out.
       */
      if (
        target.getAbility().hasAttr(PostDamageForceSwitchAbAttr)
        && [Moves.U_TURN, Moves.VOLT_SWITCH, Moves.FLIP_TURN].includes(move.id)
      ) {
        if (this.hpDroppedBelowHalf(target)) {
          return false;
        }
      }

      if (globalScene.currentBattle.waveIndex % 10 === 0) {
        return false;
      }

      // Don't allow wild mons to flee with U-turn et al
      if (this.selfSwitch && !user.isPlayer() && move.category !== MoveCategory.STATUS) {
        return false;
      }

      if (switchOutTarget.hp > 0) {
        switchOutTarget.leaveField(false);
        globalScene.queueMessage(
          i18next.t("moveTriggers:fled", { pokemonName: getPokemonNameWithAffix(switchOutTarget) }),
          null,
          true,
          500,
        );

        // in double battles redirect potential moves off fled pokemon
        if (globalScene.currentBattle.double) {
          const allyPokemon = switchOutTarget.getAlly();
          globalScene.redirectPokemonMoves(switchOutTarget, allyPokemon);
        }
      }

      if (!switchOutTarget.getAlly()?.isActive(true)) {
        globalScene.clearEnemyHeldItemModifiers();

        if (switchOutTarget.hp) {
          globalScene.pushPhase(new BattleEndPhase(false));
          globalScene.pushPhase(new NewBattlePhase());
        }
      }
    }

    return true;
  }

  override getCondition(): MoveConditionFunc {
    return (user, target, move) =>
      move.category !== MoveCategory.STATUS || this.getSwitchOutCondition()(user, target, move);
  }

  override getFailedText(_user: Pokemon, target: Pokemon, _move: Move, _cancelled: BooleanHolder): string | null {
    const blockedByAbility = new BooleanHolder(false);
    applyAbAttrs(ForceSwitchOutImmunityAbAttr, target, blockedByAbility);
    return blockedByAbility.value
      ? i18next.t("moveTriggers:cannotBeSwitchedOut", { pokemonName: getPokemonNameWithAffix(target) })
      : null;
  }

  getSwitchOutCondition(): MoveConditionFunc {
    return (user, target, _move) => {
      const switchOutTarget = this.selfSwitch ? user : target;
      const player = switchOutTarget instanceof PlayerPokemon;

      if (!this.selfSwitch) {
        // Dondozo with an allied Tatsugiri in its mouth cannot be forced out
        const commandedTag = switchOutTarget.getTag(BattlerTagType.COMMANDED);
        if (commandedTag?.getSourcePokemon()?.isActive(true)) {
          return false;
        }

        if (
          !player
          && globalScene.currentBattle.isBattleMysteryEncounter()
          && !globalScene.currentBattle.mysteryEncounter?.fleeAllowed
        ) {
          // Don't allow wild opponents to be force switched during MEs with flee disabled
          return false;
        }

        const blockedByAbility = new BooleanHolder(false);
        applyAbAttrs(ForceSwitchOutImmunityAbAttr, target, blockedByAbility);
        return !blockedByAbility.value;
      }

      if (!player && globalScene.currentBattle.battleType === BattleType.WILD) {
        if (this.isBatonPass()) {
          return false;
        }
        // Don't allow wild opponents to flee on the boss stage since it can ruin a run early on
        if (globalScene.currentBattle.waveIndex % 10 === 0) {
          return false;
        }
      }

      const party = player ? globalScene.getPlayerParty() : globalScene.getEnemyParty();
      return (
        (!player && !globalScene.currentBattle.battleType)
        || party.filter(
          (p) =>
            p.isAllowedInBattle()
            && (player || (p as EnemyPokemon).trainerSlot === (switchOutTarget as EnemyPokemon).trainerSlot),
        ).length > globalScene.currentBattle.getBattlerCount()
      );
    };
  }

  override getUserBenefitScore(user: Pokemon, target: Pokemon, move: Move): number {
    if (!globalScene.getEnemyParty().find((p) => p.isActive() && !p.isOnField())) {
      return -20;
    }
    let ret = this.selfSwitch
      ? Math.floor((1 - user.getHpRatio()) * 20)
      : super.getUserBenefitScore(user, target, move);
    if (this.selfSwitch && this.isBatonPass()) {
      const statStageTotal = user.getStatStages().reduce((s: number, total: number) => (total += s), 0);
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
  hpDroppedBelowHalf(target: Pokemon): boolean {
    const pokemonHealth = target.hp;
    const maxPokemonHealth = target.getMaxHp();
    const damageTaken = target.turnData.damageTaken;
    const initialHealth = pokemonHealth + damageTaken;

    // Check if the Pokémon's health has dropped below half after the damage
    return initialHealth >= maxPokemonHealth / 2 && pokemonHealth < maxPokemonHealth / 2;
  }
}
