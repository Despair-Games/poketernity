import { Abilities } from "#app/enums/abilities";
import { ArenaTagType } from "#app/enums/arena-tag-type";
import { BattlerTagType } from "#app/enums/battler-tag-type";
import { Gender } from "#app/enums/gender";
import { Moves } from "#app/enums/moves";
import { EFFECTIVE_STATS, getStatKey, Stat, type EffectiveStat } from "#app/enums/stat";
import { StatusEffect } from "#app/enums/status-effect";
import { TerrainType } from "#app/enums/terrain-type";
import { Type } from "#app/enums/type";
import { WeatherType } from "#app/enums/weather-type";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { MovePhase } from "#app/phases/move-phase";
import { isNullOrUndefined, NumberHolder, randSeedInt, toDmgValue } from "#app/utils";
import i18next from "i18next";
import { Ability, allAbilities, PostDamageForceSwitchAbAttr } from "./ability";
import { PreventBypassSpeedChanceAbAttr } from "./ab-attrs/prevent-bypass-speed-chance-ab-attr";
import { FormBlockDamageAbAttr } from "./ab-attrs/form-block-damage-ab-attr";
import { PostSummonStatStageChangeOnArenaAbAttr } from "./ab-attrs/post-summon-stat-stage-change-on-arena-ab-attr";
import { MoneyAbAttr } from "./ab-attrs/money-ab-attr";
import { IgnoreTypeImmunityAbAttr } from "./ab-attrs/ignore-type-immunity-ab-attr";
import { NoFusionAbilityAbAttr } from "./ab-attrs/no-fusion-ability-ab-attr";
import { NoTransformAbilityAbAttr } from "./ab-attrs/no-transform-ability-ab-attr";
import { UnswappableAbilityAbAttr } from "./ab-attrs/unswappable-ability-ab-attr";
import { UnsuppressableAbilityAbAttr } from "./ab-attrs/unsuppressable-ability-ab-attr";
import { UncopiableAbilityAbAttr } from "./ab-attrs/uncopiable-ability-ab-attr";
import { InfiltratorAbAttr } from "./ab-attrs/infiltrator-ab-attr";
import { IgnoreProtectOnContactAbAttr } from "./ab-attrs/ignore-protect-on-contact-ab-attr";
import { AlwaysHitAbAttr } from "./ab-attrs/always-hit-ab-attr";
import { SuppressFieldAbilitiesAbAttr } from "./ab-attrs/suppress-field-abilities-ab-attr";
import { MoveAbilityBypassAbAttr } from "./ab-attrs/move-ability-bypass-ab-attr";
import { SyncEncounterNatureAbAttr } from "./ab-attrs/sync-encounter-nature-ab-attr";
import { WeightMultiplierAbAttr } from "./ab-attrs/weight-multiplier-ab-attr";
import { ReduceBerryUseThresholdAbAttr } from "./ab-attrs/reduce-berry-use-threshold-ab-attr";
import { ForceSwitchOutImmunityAbAttr } from "./ab-attrs/force-switch-out-immunity-ab-attr";
import { IncreasePpAbAttr } from "./ab-attrs/increase-pp-ab-attr";
import { FlinchStatStageChangeAbAttr } from "./ab-attrs/flinch-stat-stage-change-ab-attr";
import { ReduceStatusEffectDurationAbAttr } from "./ab-attrs/reduce-status-effect-duration-ab-attr";
import { BlockRedirectAbAttr } from "./ab-attrs/block-redirect-ab-attr";
import { RedirectTypeMoveAbAttr } from "./ab-attrs/redirect-type-move-ab-attr";
import { PostFaintClearWeatherAbAttr } from "./ab-attrs/post-faint-clear-weather-ab-attr";
import { PostFaintUnsuppressedWeatherFormChangeAbAttr } from "./ab-attrs/post-faint-unsuppressed-weather-form-change-ab-attr";
import { MaxMultiHitAbAttr } from "./ab-attrs/max-multi-hit-ab-attr";
import { RunSuccessAbAttr } from "./ab-attrs/run-success-ab-attr";
import { PreventBerryUseAbAttr } from "./ab-attrs/prevent-berry-use-ab-attr";
import { DoubleBerryEffectAbAttr } from "./ab-attrs/double-berry-effect-ab-attr";
import { ReduceBurnDamageAbAttr } from "./ab-attrs/reduce-burn-damage-ab-attr";
import { BypassBurnDamageReductionAbAttr } from "./ab-attrs/bypass-burn-damage-reduction-ab-attr";
import { StatStageChangeCopyAbAttr } from "./ab-attrs/stat-stage-change-copy-ab-attr";
import { StatStageChangeMultiplierAbAttr } from "./ab-attrs/stat-stage-change-multiplier-ab-attr";
import { PostItemLostApplyBattlerTagAbAttr } from "./ab-attrs/post-item-lost-apply-battler-tag-ab-attr";
import { PostDancingMoveAbAttr } from "./ab-attrs/post-dancing-move-ab-attr";
import { PostBiomeChangeTerrainChangeAbAttr } from "./ab-attrs/post-biome-change-terrain-change-ab-attr";
import { PostBiomeChangeWeatherChangeAbAttr } from "./ab-attrs/post-biome-change-weather-change-ab-attr";
import { PostTurnFormChangeAbAttr } from "./ab-attrs/post-turn-form-change-ab-attr";
import { SpeedBoostAbAttr } from "./ab-attrs/speed-boost-ab-attr";
import { MoodyAbAttr } from "./ab-attrs/moody-ab-attr";
import { PostTurnResetStatusAbAttr } from "./ab-attrs/post-turn-reset-status-ab-attr";
import { PostTerrainChangeAddBattlerTagAttr } from "./ab-attrs/post-terrain-change-add-battler-tag-attr";
import { PostWeatherChangeAddBattlerTagAttr } from "./ab-attrs/post-weather-change-add-battler-tag-ab-attr";
import { PostWeatherChangeFormChangeAbAttr } from "./ab-attrs/post-weather-change-form-change-ab-attr";
import { SuppressWeatherEffectAbAttr } from "./ab-attrs/suppress-weather-effect-ab-attr";
import { BlockWeatherDamageAttr } from "./ab-attrs/block-weather-damage-attr";
import { IgnoreContactAbAttr } from "./ab-attrs/ignore-contact-ab-attr";
import { ChangeMovePriorityAbAttr } from "./ab-attrs/change-move-priority-ab-attr";
import { BlockOneHitKOAbAttr } from "./ab-attrs/block-one-hit-ko-ab-attr";
import { BlockStatusDamageAbAttr } from "./ab-attrs/block-status-damage-ab-attr";
import { BlockNonDirectDamageAbAttr } from "./ab-attrs/block-non-direct-damage-ab-attr";
import { ConditionalCritAbAttr } from "./ab-attrs/conditional-crit-ab-attr";
import { MultCritAbAttr } from "./ab-attrs/mult-crit-ab-attr";
import { BonusCritAbAttr } from "./ab-attrs/bonus-crit-ab-attr";
import { BlockCritAbAttr } from "./ab-attrs/block-crit-ab-attr";
import { UserFieldBattlerTagImmunityAbAttr } from "./ab-attrs/user-field-battler-tag-immunity-ab-attr";
import { BattlerTagImmunityAbAttr } from "./ab-attrs/battler-tag-immunity-ab-attr";
import { UserFieldStatusEffectImmunityAbAttr } from "./ab-attrs/user-field-status-effect-immunity-ab-attr";
import { StatusEffectImmunityAbAttr } from "./ab-attrs/status-effect-immunity-ab-attr";
import { ConfusionOnStatusEffectAbAttr } from "./ab-attrs/confusion-on-status-effect-ab-attr";
import { PreSwitchOutFormChangeAbAttr } from "./ab-attrs/pre-switch-out-form-change-ab-attr";
import { PreSwitchOutHealAbAttr } from "./ab-attrs/pre-switch-out-heal-ab-attr";
import { PreSwitchOutClearWeatherAbAttr } from "./ab-attrs/pre-switch-out-clear-weather-ab-attr";
import { PreSwitchOutResetStatusAbAttr } from "./ab-attrs/pre-switch-out-reset-status-ab-attr";
import { CommanderAbAttr } from "./ab-attrs/commander-ab-attr";
import { PostSummonFormChangeByWeatherAbAttr } from "./ab-attrs/post-summon-form-change-by-weather-ab-attr";
import { PostSummonUserFieldRemoveStatusEffectAbAttr } from "./ab-attrs/post-summon-user-field-remove-status-effect-ab-attr";
import { PostSummonFormChangeAbAttr } from "./ab-attrs/post-summon-form-change-ab-attr";
import { PostSummonTerrainChangeAbAttr } from "./ab-attrs/post-summon-terrain-change-ab-attr";
import { PostSummonWeatherChangeAbAttr } from "./ab-attrs/post-summon-weather-change-ab-attr";
import { DownloadAbAttr } from "./ab-attrs/download-ab-attr";
import { PostSummonStatStageChangeAbAttr } from "./ab-attrs/post-summon-stat-stage-change-ab-attr";
import { PostSummonAddBattlerTagAbAttr } from "./ab-attrs/post-summon-add-battler-tag-ab-attr";
import { PostSummonUnnamedMessageAbAttr } from "./ab-attrs/post-summon-unnamed-message-ab-attr";
import { PostSummonMessageAbAttr } from "./ab-attrs/post-summon-message-ab-attr";
import { PostSummonRemoveArenaTagAbAttr } from "./ab-attrs/post-summon-remove-arena-tag-ab-attr";
import { PostIntimidateStatStageChangeAbAttr } from "./ab-attrs/post-intimidate-stat-stage-change-ab-attr";
import { IgnoreOpponentStatStagesAbAttr } from "./ab-attrs/ignore-opponent-stat-stages-ab-attr";
import { PostKnockOutStatStageChangeAbAttr } from "./ab-attrs/post-knock-out-stat-stage-change-ab-attr";
import { PostVictoryFormChangeAbAttr } from "./ab-attrs/post-victory-form-change-ab-attr";
import { PostVictoryStatStageChangeAbAttr } from "./ab-attrs/post-victory-stat-stage-change-ab-attr";
import { SynchronizeStatusAbAttr } from "./ab-attrs/synchronize-status-ab-attr";
import { PostAttackApplyBattlerTagAbAttr } from "./ab-attrs/post-attack-apply-battler-tag-ab-attr";
import { PostAttackApplyStatusEffectAbAttr } from "./ab-attrs/post-attack-apply-status-effect-ab-attr";
import { GorillaTacticsAbAttr } from "./ab-attrs/gorilla-tactics-ab-attr";
import { StatMultiplierAbAttr } from "./ab-attrs/stat-multiplier-ab-attr";
import { AllyMoveCategoryPowerBoostAbAttr } from "./ab-attrs/ally-move-category-power-boost-ab-attr";
import { UserFieldMoveTypePowerBoostAbAttr } from "./ab-attrs/user-field-move-type-power-boost-ab-attr";
import { VariableMovePowerBoostAbAttr } from "./ab-attrs/variable-move-power-boost-ab-attr";
import { LowHpMoveTypeAttackMultiplierAbAttr } from "./ab-attrs/low-hp-move-type-attack-multiplier-ab-attr";
import { MoveTypePowerBoostAbAttr } from "./ab-attrs/move-type-power-boost-ab-attr";
import { MovePowerBoostAbAttr } from "./ab-attrs/move-power-boost-ab-attr";
import { DamageBoostAbAttr } from "./ab-attrs/damage-boost-ab-attr";
import { AddSecondStrikeAbAttr } from "./ab-attrs/add-second-strike-ab-attr";
import { MoveTypeChangeAbAttr } from "./ab-attrs/move-type-change-ab-attr";
import { FieldMultiplyStatAbAttr } from "./ab-attrs/field-multiply-stat-ab-attr";
import { FieldPreventExplosionLikeAbAttr } from "./ab-attrs/field-prevent-explosion-like-ab-attr";
import { PostStatStageChangeStatStageChangeAbAttr } from "./ab-attrs/post-stat-stage-change-stat-stage-change-ab-attr";
import { PostDefendWeatherChangeAbAttr } from "./ab-attrs/post-defend-weather-change-ab-attr";
import { PostDefendCritStatStageChangeAbAttr } from "./ab-attrs/post-defend-crit-stat-stage-change-ab-attr";
import { PostDefendContactApplyTagChanceAbAttr } from "./ab-attrs/post-defend-contact-apply-tag-chance-ab-attr";
import { EffectSporeAbAttr } from "./ab-attrs/effect-spore-ab-attr";
import { PostDefendContactApplyStatusEffectAbAttr } from "./ab-attrs/post-defend-contact-apply-status-effect-ab-attr";
import { PostDefendTerrainChangeAbAttr } from "./ab-attrs/post-defend-terrain-change-ab-attr";
import { PostDefendApplyArenaTrapTagAbAttr } from "./ab-attrs/post-defend-apply-arena-trap-tag-ab-attr";
import { PostDefendHpGatedStatStageChangeAbAttr } from "./ab-attrs/post-defend-hp-gated-stat-tage-change-ab-attr";
import { PostDefendStatStageChangeAbAttr } from "./ab-attrs/post-defend-stat-stage-change-ab-attr";
import { GroundedTag } from "./battler-tags";
import type { Move } from "./move";
import { applyMoveAttrs } from "./move";
import { allMoves } from "#app/data/all-moves";
import { FlinchAttr } from "./move-attrs/flinch-attr";
import { VariableMoveTypeAttr } from "./move-attrs/variable-move-type-attr";
import { VariablePowerAttr } from "./move-attrs/variable-power-attr";
import { OneHitKOAttr } from "./move-attrs/one-hit-ko-attr";
import { AttackMove } from "./move";
import { MoveFlags } from "../enums/move-flags";
import { MoveCategory } from "../enums/move-category";
import { getNonVolatileStatusEffects } from "./status-effect";
import { IgnoreTypeStatusEffectImmunityAbAttr } from "./ab-attrs/ignore-type-status-effect-immunity-ab-attr";
import { BlockItemTheftAbAttr } from "./ab-attrs/block-item-theft-ab-attr";
import { BlockRecoilDamageAttr } from "./ab-attrs/block-recoil-damage-ab-attr";
import { DoubleBattleChanceAbAttr } from "./ab-attrs/double-battle-chance-ab-attr";
import { PostBattleInitFormChangeAbAttr } from "./ab-attrs/post-battle-init-form-change-ab-attr";
import { PostBattleInitStatStageChangeAbAttr } from "./ab-attrs/post-battle-init-stat-stage-change-ab-attr";
import { PreDefendFullHpEndureAbAttr } from "./ab-attrs/pre-defend-full-hp-endure-ab-attr";
import { StabBoostAbAttr } from "./ab-attrs/stab-boost-ab-attr";
import { ReceivedMoveDamageMultiplierAbAttr } from "./ab-attrs/received-move-damage-multiplier-ab-attr";
import { AlliedFieldDamageReductionAbAttr } from "./ab-attrs/allied-field-damage-reduction-ab-attr";
import { ReceivedTypeDamageMultiplierAbAttr } from "./ab-attrs/received-type-damage-multiplier-ab-attr";
import { AttackTypeImmunityAbAttr } from "./ab-attrs/attack-type-immunity-ab-attr";
import { TypeImmunityHealAbAttr } from "./ab-attrs/type-immunity-heal-ab-attr";
import { TypeImmunityStatStageChangeAbAttr } from "./ab-attrs/type-immunity-stat-stage-change-ab-attr";
import { TypeImmunityAddBattlerTagAbAttr } from "./ab-attrs/type-immunity-add-battler-tag-ab-attr";
import type { AbAttrCondition } from "#app/@types/AbAttrCondition";
import { NonSuperEffectiveImmunityAbAttr } from "./ab-attrs/non-super-effective-immunity-ab-attr";
import { FullHpResistTypeAbAttr } from "./ab-attrs/full-hp-resist-type-ab-attr";
import { FieldPriorityMoveImmunityAbAttr } from "./ab-attrs/field-priority-move-immunity-ab-attr";
import { MoveImmunityAbAttr } from "./ab-attrs/move-immunity-ab-attr";
import { WonderSkinAbAttr } from "./ab-attrs/wonder-skin-ab-attr";
import { MoveImmunityStatStageChangeAbAttr } from "./ab-attrs/move-immunity-stat-stage-change-ab-attr";
import { ReverseDrainAbAttr } from "./ab-attrs/reverse-drain-ab-attr";
import { MoveEffectChanceMultiplierAbAttr } from "./ab-attrs/move-effect-chance-multiplier-ab-attr";
import { IgnoreMoveEffectsAbAttr } from "./ab-attrs/ignore-move-effect-ab-attr";
import { PostDefendApplyBattlerTagAbAttr } from "./ab-attrs/post-defend-apply-battler-tag-ab-attr";
import { PostDefendTypeChangeAbAttr } from "./ab-attrs/post-defend-type-change-ab-attr";
import { PostDefendContactDamageAbAttr } from "./ab-attrs/post-defend-contact-damage-ab-attr";
import { PostDefendPerishSongAbAttr } from "./ab-attrs/post-defend-perish-song-ab-attr";
import { PostDefendAbilitySwapAbAttr } from "./ab-attrs/post-defend-ability-swap-ab-attr";
import { PostDefendAbilityGiveAbAttr } from "./ab-attrs/post-defend-ability-give-ab-attr";
import { PostDefendMoveDisableAbAttr } from "./ab-attrs/post-defend-move-disable-ab-attr";
import { PokemonTypeChangeAbAttr } from "./ab-attrs/pokemon-type-change-ab-attr";
import { FieldMoveTypePowerBoostAbAttr } from "./ab-attrs/field-move-type-power-boost-ab-attr";
import { PostAttackStealHeldItemAbAttr } from "./ab-attrs/post-attack-steal-held-item-ab-attr";
import { PostDefendStealHeldItemAbAttr } from "./ab-attrs/post-defend-steal-held-item-ab-attr";
import { CopyFaintedAllyAbilityAbAttr } from "./ab-attrs/copy-fainted-ally-ability-ab-attr";
import { IntimidateImmunityAbAttr } from "./ab-attrs/intimidate-immunity-ab-attr";
import { PostSummonAllyHealAbAttr } from "./ab-attrs/post-summon-ally-heal-ab-attr";
import { PostSummonClearAllyStatStagesAbAttr } from "./ab-attrs/post-summon-clear-ally-stat-stages-ab-attr";
import { PostSummonCopyAbilityAbAttr } from "./ab-attrs/post-summon-copy-ability-ab-attr";
import { PostSummonCopyAllyStatsAbAttr } from "./ab-attrs/post-summon-copy-ally-stats-ab-attr";
import { PostSummonTransformAbAttr } from "./ab-attrs/post-summon-transform-ab-attr";
import { PostSummonWeatherSuppressedFormChangeAbAttr } from "./ab-attrs/post-summon-weather-suppressed-form-change-ab-attr";
import { ProtectStatAbAttr } from "./ab-attrs/protect-stat-ab-attr";
import { ForewarnAbAttr } from "./ab-attrs/forewarn-ab-attr";
import { FriskAbAttr } from "./ab-attrs/frisk-ab-attr";
import { PostWeatherLapseHealAbAttr } from "./ab-attrs/post-weather-lapse-heal-ab-attr";
import { PostWeatherLapseDamageAbAttr } from "./ab-attrs/post-weather-lapse-damage-ab-attr";
import { PostTurnStatusHealAbAttr } from "./ab-attrs/post-turn-status-heal-ab-attr";
import { PostTurnLootAbAttr } from "./ab-attrs/post-turn-loot-ab-attr";
import { PostTurnHurtIfSleepingAbAttr } from "./ab-attrs/post-turn-hurt-if-sleeping-ab-attr";
import { FetchBallAbAttr } from "./ab-attrs/fetch-ball-ab-attr";
import { HealFromBerryUseAbAttr } from "./ab-attrs/heal-from-berry-use-ab-attr";
import { ArenaTrapAbAttr } from "./ab-attrs/arena-trap-ab-attr";
import { PostBattleLootAbAttr } from "./ab-attrs/post-battle-loot-ab-attr";
import { PostFaintContactDamageAbAttr } from "./ab-attrs/post-faint-contact-damage-ab-attr";
import { PostFaintHPDamageAbAttr } from "./ab-attrs/post-faint-hp-damage-ab-attr";
import { BypassSpeedChanceAbAttr } from "./ab-attrs/bypass-speed-chance-ab-attr";
import { TerrainEventTypeChangeAbAttr } from "./ab-attrs/terrain-event-type-change-ab-attr";
import { WeatherBasedSpeedDoublerAbAttr } from "./ab-attrs/weather-based-speed-doubler-ab-attr";

function getTerrainCondition(...terrainTypes: TerrainType[]): AbAttrCondition {
  return (_pokemon: Pokemon) => {
    const terrainType = globalScene.arena.terrain?.terrainType;
    return !!terrainType && terrainTypes.indexOf(terrainType) > -1;
  };
}

export function getWeatherCondition(...weatherTypes: WeatherType[]): AbAttrCondition {
  return () => {
    if (!globalScene?.arena) {
      return false;
    }
    if (globalScene.arena.weather?.isEffectSuppressed()) {
      return false;
    }
    const weatherType = globalScene.arena.weather?.weatherType;
    return !!weatherType && weatherTypes.indexOf(weatherType) > -1;
  };
}

/**
 * Condition function to applied to abilities related to Sheer Force.
 * Checks if last move used against target was affected by a Sheer Force user and:
 * Disables: Color Change, Pickpocket, Berserk, Anger Shell
 * @returns If `false` disables the ability which the condition is applied to.
 */
function getSheerForceHitDisableAbCondition(): AbAttrCondition {
  return (pokemon: Pokemon) => {
    if (!pokemon.turnData) {
      return true;
    }

    const lastReceivedAttack = pokemon.turnData.attacksReceived[0];
    if (!lastReceivedAttack) {
      return true;
    }

    const lastAttacker = pokemon.getOpponents().find((p) => p.id === lastReceivedAttack.sourceId);
    if (!lastAttacker) {
      return true;
    }

    /**if the last move chance is greater than or equal to cero, and the last attacker's ability is sheer force*/
    const SheerForceAffected =
      allMoves[lastReceivedAttack.move].chance >= 0 && lastAttacker.hasAbility(Abilities.SHEER_FORCE);

    return !SheerForceAffected;
  };
}

function getAnticipationCondition(): AbAttrCondition {
  return (pokemon: Pokemon) => {
    for (const opponent of pokemon.getOpponents()) {
      for (const move of opponent.moveset) {
        // ignore null/undefined moves
        if (!move) {
          continue;
        }
        // the move's base type (not accounting for variable type changes) is super effective
        if (
          move.getMove() instanceof AttackMove
          && pokemon.getAttackTypeEffectiveness(move.getMove().type, opponent, true, undefined, move.getMove()) >= 2
        ) {
          return true;
        }
        // move is a OHKO
        if (move.getMove().hasAttr(OneHitKOAttr)) {
          return true;
        }
        // edge case for hidden power, type is computed
        if (move.getMove().id === Moves.HIDDEN_POWER) {
          const iv_val = Math.floor(
            (((opponent.ivs[Stat.HP] & 1)
              + (opponent.ivs[Stat.ATK] & 1) * 2
              + (opponent.ivs[Stat.DEF] & 1) * 4
              + (opponent.ivs[Stat.SPD] & 1) * 8
              + (opponent.ivs[Stat.SPATK] & 1) * 16
              + (opponent.ivs[Stat.SPDEF] & 1) * 32)
              * 15)
              / 63,
          );

          const type = [
            Type.FIGHTING,
            Type.FLYING,
            Type.POISON,
            Type.GROUND,
            Type.ROCK,
            Type.BUG,
            Type.GHOST,
            Type.STEEL,
            Type.FIRE,
            Type.WATER,
            Type.GRASS,
            Type.ELECTRIC,
            Type.PSYCHIC,
            Type.ICE,
            Type.DRAGON,
            Type.DARK,
          ][iv_val];

          if (pokemon.getAttackTypeEffectiveness(type, opponent) >= 2) {
            return true;
          }
        }
      }
    }
    return false;
  };
}

/**
 * Creates an ability condition that causes the ability to fail if that ability
 * has already been used by that pokemon that battle. It requires an ability to
 * be specified due to current limitations in how conditions on abilities work.
 * @param ability The {@linkcode Abilities | ability} to check if it's already been applied
 * @returns The {@linkcode AbAttrCondition | ability attribute condition}
 */
function getOncePerBattleCondition(ability: Abilities): AbAttrCondition {
  return (pokemon: Pokemon) => {
    return !pokemon.battleData?.abilitiesApplied.includes(ability);
  };
}

export function initAbilities() {
  allAbilities.push(
    new Ability(Abilities.STENCH, 3).attr(
      PostAttackApplyBattlerTagAbAttr,
      false,
      (_user, target, move) =>
        !move.hasAttr(FlinchAttr)
        && !target.turnData.acted
        && move.category !== MoveCategory.STATUS
        && (target.status
          ? ![StatusEffect.FREEZE, StatusEffect.SLEEP, StatusEffect.FAINT].includes(target.status.effect)
          : true)
          ? 10
          : 0,
      BattlerTagType.FLINCHED,
    ),
    new Ability(Abilities.DRIZZLE, 3)
      .attr(PostSummonWeatherChangeAbAttr, WeatherType.RAIN)
      .attr(PostBiomeChangeWeatherChangeAbAttr, WeatherType.RAIN),
    new Ability(Abilities.SPEED_BOOST, 3).attr(SpeedBoostAbAttr),
    new Ability(Abilities.BATTLE_ARMOR, 3).attr(BlockCritAbAttr).ignorable(),
    new Ability(Abilities.STURDY, 3).attr(PreDefendFullHpEndureAbAttr).attr(BlockOneHitKOAbAttr).ignorable(),
    new Ability(Abilities.DAMP, 3).attr(FieldPreventExplosionLikeAbAttr).ignorable(),
    new Ability(Abilities.LIMBER, 3).attr(StatusEffectImmunityAbAttr, StatusEffect.PARALYSIS).ignorable(),
    new Ability(Abilities.SAND_VEIL, 3)
      .attr(StatMultiplierAbAttr, Stat.EVA, 1.2)
      .attr(BlockWeatherDamageAttr, WeatherType.SANDSTORM)
      .condition(getWeatherCondition(WeatherType.SANDSTORM))
      .ignorable(),
    new Ability(Abilities.STATIC, 3)
      .attr(PostDefendContactApplyStatusEffectAbAttr, 30, StatusEffect.PARALYSIS)
      .bypassFaint(),
    new Ability(Abilities.VOLT_ABSORB, 3).attr(TypeImmunityHealAbAttr, Type.ELECTRIC).ignorable(),
    new Ability(Abilities.WATER_ABSORB, 3).attr(TypeImmunityHealAbAttr, Type.WATER).ignorable(),
    new Ability(Abilities.OBLIVIOUS, 3)
      .attr(BattlerTagImmunityAbAttr, [BattlerTagType.INFATUATED, BattlerTagType.TAUNT])
      .attr(IntimidateImmunityAbAttr)
      .ignorable(),
    new Ability(Abilities.CLOUD_NINE, 3)
      .attr(SuppressWeatherEffectAbAttr, true)
      .attr(PostSummonUnnamedMessageAbAttr, i18next.t("abilityTriggers:weatherEffectDisappeared"))
      .attr(PostSummonWeatherSuppressedFormChangeAbAttr)
      .attr(PostFaintUnsuppressedWeatherFormChangeAbAttr)
      .bypassFaint(),
    new Ability(Abilities.COMPOUND_EYES, 3).attr(StatMultiplierAbAttr, Stat.ACC, 1.3),
    new Ability(Abilities.INSOMNIA, 3)
      .attr(StatusEffectImmunityAbAttr, StatusEffect.SLEEP)
      .attr(BattlerTagImmunityAbAttr, BattlerTagType.DROWSY)
      .ignorable(),
    new Ability(Abilities.COLOR_CHANGE, 3)
      .attr(PostDefendTypeChangeAbAttr)
      .condition(getSheerForceHitDisableAbCondition()),
    new Ability(Abilities.IMMUNITY, 3)
      .attr(StatusEffectImmunityAbAttr, StatusEffect.POISON, StatusEffect.TOXIC)
      .ignorable(),
    new Ability(Abilities.FLASH_FIRE, 3)
      .attr(TypeImmunityAddBattlerTagAbAttr, Type.FIRE, BattlerTagType.FIRE_BOOST, 1)
      .ignorable(),
    new Ability(Abilities.SHIELD_DUST, 3).attr(IgnoreMoveEffectsAbAttr).ignorable(),
    new Ability(Abilities.OWN_TEMPO, 3)
      .attr(BattlerTagImmunityAbAttr, BattlerTagType.CONFUSED)
      .attr(IntimidateImmunityAbAttr)
      .ignorable(),
    new Ability(Abilities.SUCTION_CUPS, 3).attr(ForceSwitchOutImmunityAbAttr).ignorable(),
    new Ability(Abilities.INTIMIDATE, 3).attr(PostSummonStatStageChangeAbAttr, [Stat.ATK], -1, false, true),
    new Ability(Abilities.SHADOW_TAG, 3).attr(ArenaTrapAbAttr, (_user, target) => {
      if (target.hasAbility(Abilities.SHADOW_TAG)) {
        return false;
      }
      return true;
    }),
    new Ability(Abilities.ROUGH_SKIN, 3).attr(PostDefendContactDamageAbAttr, 8).bypassFaint(),
    new Ability(Abilities.WONDER_GUARD, 3)
      .attr(NonSuperEffectiveImmunityAbAttr)
      .attr(UncopiableAbilityAbAttr)
      .attr(UnswappableAbilityAbAttr)
      .ignorable(),
    new Ability(Abilities.LEVITATE, 3)
      .attr(
        AttackTypeImmunityAbAttr,
        Type.GROUND,
        (pokemon: Pokemon) => !pokemon.getTag(GroundedTag) && !globalScene.arena.getTag(ArenaTagType.GRAVITY),
      )
      .ignorable(),
    new Ability(Abilities.EFFECT_SPORE, 3).attr(EffectSporeAbAttr),
    new Ability(Abilities.SYNCHRONIZE, 3).attr(SyncEncounterNatureAbAttr).attr(SynchronizeStatusAbAttr),
    new Ability(Abilities.CLEAR_BODY, 3).attr(ProtectStatAbAttr).ignorable(),
    new Ability(Abilities.NATURAL_CURE, 3).attr(PreSwitchOutResetStatusAbAttr),
    new Ability(Abilities.LIGHTNING_ROD, 3)
      .attr(RedirectTypeMoveAbAttr, Type.ELECTRIC)
      .attr(TypeImmunityStatStageChangeAbAttr, Type.ELECTRIC, Stat.SPATK, 1)
      .ignorable(),
    new Ability(Abilities.SERENE_GRACE, 3).attr(MoveEffectChanceMultiplierAbAttr, 2),
    new Ability(Abilities.SWIFT_SWIM, 3).attr(WeatherBasedSpeedDoublerAbAttr, [
      WeatherType.RAIN,
      WeatherType.HEAVY_RAIN,
    ]),
    new Ability(Abilities.CHLOROPHYLL, 3).attr(WeatherBasedSpeedDoublerAbAttr, [
      WeatherType.SUNNY,
      WeatherType.HARSH_SUN,
    ]),
    new Ability(Abilities.ILLUMINATE, 3)
      .attr(ProtectStatAbAttr, Stat.ACC)
      .attr(DoubleBattleChanceAbAttr)
      .attr(IgnoreOpponentStatStagesAbAttr, [Stat.EVA])
      .ignorable(),
    new Ability(Abilities.TRACE, 3).attr(PostSummonCopyAbilityAbAttr).attr(UncopiableAbilityAbAttr),
    new Ability(Abilities.HUGE_POWER, 3).attr(StatMultiplierAbAttr, Stat.ATK, 2),
    new Ability(Abilities.POISON_POINT, 3)
      .attr(PostDefendContactApplyStatusEffectAbAttr, 30, StatusEffect.POISON)
      .bypassFaint(),
    new Ability(Abilities.INNER_FOCUS, 3)
      .attr(BattlerTagImmunityAbAttr, BattlerTagType.FLINCHED)
      .attr(IntimidateImmunityAbAttr)
      .ignorable(),
    new Ability(Abilities.MAGMA_ARMOR, 3).attr(StatusEffectImmunityAbAttr, StatusEffect.FREEZE).ignorable(),
    new Ability(Abilities.WATER_VEIL, 3).attr(StatusEffectImmunityAbAttr, StatusEffect.BURN).ignorable(),
    new Ability(Abilities.MAGNET_PULL, 3).attr(ArenaTrapAbAttr, (_user, target) => {
      if (
        target.getTypes(true).includes(Type.STEEL)
        || (target.getTypes(true).includes(Type.STELLAR) && target.getTypes().includes(Type.STEEL))
      ) {
        return true;
      }
      return false;
    }),
    new Ability(Abilities.SOUNDPROOF, 3)
      .attr(
        MoveImmunityAbAttr,
        (pokemon, attacker, move) => pokemon !== attacker && move.hasFlag(MoveFlags.SOUND_BASED),
      )
      .ignorable(),
    new Ability(Abilities.RAIN_DISH, 3).attr(PostWeatherLapseHealAbAttr, 1, WeatherType.RAIN, WeatherType.HEAVY_RAIN),
    new Ability(Abilities.SAND_STREAM, 3)
      .attr(PostSummonWeatherChangeAbAttr, WeatherType.SANDSTORM)
      .attr(PostBiomeChangeWeatherChangeAbAttr, WeatherType.SANDSTORM),
    new Ability(Abilities.PRESSURE, 3)
      .attr(IncreasePpAbAttr)
      .attr(PostSummonMessageAbAttr, (pokemon: Pokemon) =>
        i18next.t("abilityTriggers:postSummonPressure", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
      ),
    new Ability(Abilities.THICK_FAT, 3)
      .attr(ReceivedTypeDamageMultiplierAbAttr, Type.FIRE, 0.5)
      .attr(ReceivedTypeDamageMultiplierAbAttr, Type.ICE, 0.5)
      .ignorable(),
    new Ability(Abilities.EARLY_BIRD, 3).attr(ReduceStatusEffectDurationAbAttr, StatusEffect.SLEEP),
    new Ability(Abilities.FLAME_BODY, 3)
      .attr(PostDefendContactApplyStatusEffectAbAttr, 30, StatusEffect.BURN)
      .bypassFaint(),
    new Ability(Abilities.RUN_AWAY, 3).attr(RunSuccessAbAttr),
    new Ability(Abilities.KEEN_EYE, 3).attr(ProtectStatAbAttr, Stat.ACC).ignorable(),
    new Ability(Abilities.HYPER_CUTTER, 3).attr(ProtectStatAbAttr, Stat.ATK).ignorable(),
    new Ability(Abilities.PICKUP, 3).attr(PostBattleLootAbAttr),
    new Ability(Abilities.TRUANT, 3).attr(PostSummonAddBattlerTagAbAttr, BattlerTagType.TRUANT, 1, false),
    new Ability(Abilities.HUSTLE, 3)
      .attr(StatMultiplierAbAttr, Stat.ATK, 1.5)
      .attr(StatMultiplierAbAttr, Stat.ACC, 0.8, (_user, _target, move) => move.category === MoveCategory.PHYSICAL),
    new Ability(Abilities.CUTE_CHARM, 3).attr(PostDefendContactApplyTagChanceAbAttr, 30, BattlerTagType.INFATUATED),
    new Ability(Abilities.PLUS, 3).conditionalAttr(
      (p) =>
        globalScene.currentBattle.double && [Abilities.PLUS, Abilities.MINUS].some((a) => p.getAlly().hasAbility(a)),
      StatMultiplierAbAttr,
      Stat.SPATK,
      1.5,
    ),
    new Ability(Abilities.MINUS, 3).conditionalAttr(
      (p) =>
        globalScene.currentBattle.double && [Abilities.PLUS, Abilities.MINUS].some((a) => p.getAlly().hasAbility(a)),
      StatMultiplierAbAttr,
      Stat.SPATK,
      1.5,
    ),
    new Ability(Abilities.FORECAST, 3)
      .attr(UncopiableAbilityAbAttr)
      .attr(NoFusionAbilityAbAttr)
      .attr(PostSummonFormChangeByWeatherAbAttr, Abilities.FORECAST)
      .attr(PostWeatherChangeFormChangeAbAttr, Abilities.FORECAST, [
        WeatherType.NONE,
        WeatherType.SANDSTORM,
        WeatherType.STRONG_WINDS,
        WeatherType.FOG,
      ]),
    new Ability(Abilities.STICKY_HOLD, 3).attr(BlockItemTheftAbAttr).bypassFaint().ignorable(),
    new Ability(Abilities.SHED_SKIN, 3).conditionalAttr((_pokemon) => !randSeedInt(3), PostTurnResetStatusAbAttr),
    new Ability(Abilities.GUTS, 3)
      .attr(BypassBurnDamageReductionAbAttr)
      .conditionalAttr(
        (pokemon) => !!pokemon.status || pokemon.hasAbility(Abilities.COMATOSE),
        StatMultiplierAbAttr,
        Stat.ATK,
        1.5,
      ),
    new Ability(Abilities.MARVEL_SCALE, 3)
      .conditionalAttr(
        (pokemon) => !!pokemon.status || pokemon.hasAbility(Abilities.COMATOSE),
        StatMultiplierAbAttr,
        Stat.DEF,
        1.5,
      )
      .ignorable(),
    new Ability(Abilities.LIQUID_OOZE, 3).attr(ReverseDrainAbAttr),
    new Ability(Abilities.OVERGROW, 3).attr(LowHpMoveTypeAttackMultiplierAbAttr, Type.GRASS),
    new Ability(Abilities.BLAZE, 3).attr(LowHpMoveTypeAttackMultiplierAbAttr, Type.FIRE),
    new Ability(Abilities.TORRENT, 3).attr(LowHpMoveTypeAttackMultiplierAbAttr, Type.WATER),
    new Ability(Abilities.SWARM, 3).attr(LowHpMoveTypeAttackMultiplierAbAttr, Type.BUG),
    new Ability(Abilities.ROCK_HEAD, 3).attr(BlockRecoilDamageAttr),
    new Ability(Abilities.DROUGHT, 3)
      .attr(PostSummonWeatherChangeAbAttr, WeatherType.SUNNY)
      .attr(PostBiomeChangeWeatherChangeAbAttr, WeatherType.SUNNY),
    new Ability(Abilities.ARENA_TRAP, 3)
      .attr(ArenaTrapAbAttr, (_user, target) => {
        if (target.isGrounded()) {
          return true;
        }
        return false;
      })
      .attr(DoubleBattleChanceAbAttr),
    new Ability(Abilities.VITAL_SPIRIT, 3)
      .attr(StatusEffectImmunityAbAttr, StatusEffect.SLEEP)
      .attr(BattlerTagImmunityAbAttr, BattlerTagType.DROWSY)
      .ignorable(),
    new Ability(Abilities.WHITE_SMOKE, 3).attr(ProtectStatAbAttr).ignorable(),
    new Ability(Abilities.PURE_POWER, 3).attr(StatMultiplierAbAttr, Stat.ATK, 2),
    new Ability(Abilities.SHELL_ARMOR, 3).attr(BlockCritAbAttr).ignorable(),
    new Ability(Abilities.AIR_LOCK, 3)
      .attr(SuppressWeatherEffectAbAttr, true)
      .attr(PostSummonUnnamedMessageAbAttr, i18next.t("abilityTriggers:weatherEffectDisappeared"))
      .attr(PostSummonWeatherSuppressedFormChangeAbAttr)
      .attr(PostFaintUnsuppressedWeatherFormChangeAbAttr)
      .bypassFaint(),
    new Ability(Abilities.TANGLED_FEET, 4)
      .conditionalAttr((pokemon) => !!pokemon.getTag(BattlerTagType.CONFUSED), StatMultiplierAbAttr, Stat.EVA, 2)
      .ignorable(),
    new Ability(Abilities.MOTOR_DRIVE, 4)
      .attr(TypeImmunityStatStageChangeAbAttr, Type.ELECTRIC, Stat.SPD, 1)
      .ignorable(),
    new Ability(Abilities.RIVALRY, 4)
      .attr(
        MovePowerBoostAbAttr,
        (user, target, _move) =>
          user?.gender !== Gender.GENDERLESS && target?.gender !== Gender.GENDERLESS && user?.gender === target?.gender,
        1.25,
        true,
      )
      .attr(
        MovePowerBoostAbAttr,
        (user, target, _move) =>
          user?.gender !== Gender.GENDERLESS && target?.gender !== Gender.GENDERLESS && user?.gender !== target?.gender,
        0.75,
      ),
    new Ability(Abilities.STEADFAST, 4).attr(FlinchStatStageChangeAbAttr, [Stat.SPD], 1),
    new Ability(Abilities.SNOW_CLOAK, 4)
      .attr(StatMultiplierAbAttr, Stat.EVA, 1.2)
      .attr(BlockWeatherDamageAttr, WeatherType.HAIL)
      .condition(getWeatherCondition(WeatherType.HAIL, WeatherType.SNOW))
      .ignorable(),
    new Ability(Abilities.GLUTTONY, 4).attr(ReduceBerryUseThresholdAbAttr),
    new Ability(Abilities.ANGER_POINT, 4).attr(PostDefendCritStatStageChangeAbAttr, Stat.ATK, 6),
    new Ability(Abilities.UNBURDEN, 4)
      .attr(PostItemLostApplyBattlerTagAbAttr, BattlerTagType.UNBURDEN)
      .bypassFaint() // Allows reviver seed to activate Unburden
      .edgeCase(), // Should not restore Unburden boost if Pokemon loses then regains Unburden ability
    new Ability(Abilities.HEATPROOF, 4)
      .attr(ReceivedTypeDamageMultiplierAbAttr, Type.FIRE, 0.5)
      .attr(ReduceBurnDamageAbAttr, 0.5)
      .ignorable(),
    new Ability(Abilities.SIMPLE, 4).attr(StatStageChangeMultiplierAbAttr, 2).ignorable(),
    new Ability(Abilities.DRY_SKIN, 4)
      .attr(PostWeatherLapseDamageAbAttr, 2, WeatherType.SUNNY, WeatherType.HARSH_SUN)
      .attr(PostWeatherLapseHealAbAttr, 2, WeatherType.RAIN, WeatherType.HEAVY_RAIN)
      .attr(ReceivedTypeDamageMultiplierAbAttr, Type.FIRE, 1.25)
      .attr(TypeImmunityHealAbAttr, Type.WATER)
      .ignorable(),
    new Ability(Abilities.DOWNLOAD, 4).attr(DownloadAbAttr),
    new Ability(Abilities.IRON_FIST, 4).attr(
      MovePowerBoostAbAttr,
      (_user, _target, move) => move.hasFlag(MoveFlags.PUNCHING_MOVE),
      1.2,
    ),
    new Ability(Abilities.POISON_HEAL, 4)
      .attr(PostTurnStatusHealAbAttr, StatusEffect.TOXIC, StatusEffect.POISON)
      .attr(BlockStatusDamageAbAttr, StatusEffect.TOXIC, StatusEffect.POISON),
    new Ability(Abilities.ADAPTABILITY, 4).attr(StabBoostAbAttr),
    new Ability(Abilities.SKILL_LINK, 4).attr(MaxMultiHitAbAttr),
    new Ability(Abilities.HYDRATION, 4)
      .attr(PostTurnResetStatusAbAttr)
      .condition(getWeatherCondition(WeatherType.RAIN, WeatherType.HEAVY_RAIN)),
    new Ability(Abilities.SOLAR_POWER, 4)
      .attr(PostWeatherLapseDamageAbAttr, 2, WeatherType.SUNNY, WeatherType.HARSH_SUN)
      .attr(StatMultiplierAbAttr, Stat.SPATK, 1.5)
      .condition(getWeatherCondition(WeatherType.SUNNY, WeatherType.HARSH_SUN)),
    new Ability(Abilities.QUICK_FEET, 4)
      .conditionalAttr(
        (pokemon) => (pokemon.status ? pokemon.status.effect === StatusEffect.PARALYSIS : false),
        StatMultiplierAbAttr,
        Stat.SPD,
        2,
      )
      .conditionalAttr(
        (pokemon) => !!pokemon.status || pokemon.hasAbility(Abilities.COMATOSE),
        StatMultiplierAbAttr,
        Stat.SPD,
        1.5,
      ),
    new Ability(Abilities.NORMALIZE, 4).attr(MoveTypeChangeAbAttr, Type.NORMAL, 1.2, (_user, _target, move) => {
      return ![Moves.HIDDEN_POWER, Moves.WEATHER_BALL, Moves.NATURAL_GIFT, Moves.JUDGMENT, Moves.TECHNO_BLAST].includes(
        move.id,
      );
    }),
    new Ability(Abilities.SNIPER, 4).attr(MultCritAbAttr, 1.5),
    new Ability(Abilities.MAGIC_GUARD, 4).attr(BlockNonDirectDamageAbAttr),
    new Ability(Abilities.NO_GUARD, 4).attr(AlwaysHitAbAttr).attr(DoubleBattleChanceAbAttr),
    new Ability(Abilities.STALL, 4).attr(ChangeMovePriorityAbAttr, (_pokemon, _move: Move) => true, -0.2),
    new Ability(Abilities.TECHNICIAN, 4).attr(
      MovePowerBoostAbAttr,
      (user, target, move) => {
        const power = new NumberHolder(move.power);
        applyMoveAttrs(VariablePowerAttr, user, target, move, power);
        return power.value <= 60;
      },
      1.5,
    ),
    new Ability(Abilities.LEAF_GUARD, 4)
      .attr(StatusEffectImmunityAbAttr)
      .condition(getWeatherCondition(WeatherType.SUNNY, WeatherType.HARSH_SUN))
      .ignorable(),
    new Ability(Abilities.KLUTZ, 4).unimplemented(),
    new Ability(Abilities.MOLD_BREAKER, 4)
      .attr(PostSummonMessageAbAttr, (pokemon: Pokemon) =>
        i18next.t("abilityTriggers:postSummonMoldBreaker", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
      )
      .attr(MoveAbilityBypassAbAttr),
    new Ability(Abilities.SUPER_LUCK, 4).attr(BonusCritAbAttr),
    new Ability(Abilities.AFTERMATH, 4).attr(PostFaintContactDamageAbAttr, 4).bypassFaint(),
    new Ability(Abilities.ANTICIPATION, 4).conditionalAttr(
      getAnticipationCondition(),
      PostSummonMessageAbAttr,
      (pokemon: Pokemon) =>
        i18next.t("abilityTriggers:postSummonAnticipation", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
    ),
    new Ability(Abilities.FOREWARN, 4).attr(ForewarnAbAttr),
    new Ability(Abilities.UNAWARE, 4)
      .attr(IgnoreOpponentStatStagesAbAttr, [Stat.ATK, Stat.DEF, Stat.SPATK, Stat.SPDEF, Stat.ACC, Stat.EVA])
      .ignorable(),
    new Ability(Abilities.TINTED_LENS, 4).attr(
      DamageBoostAbAttr,
      2,
      (user, target, move) => (target?.getMoveEffectiveness(user!, move) ?? 1) <= 0.5,
    ),
    new Ability(Abilities.FILTER, 4)
      .attr(
        ReceivedMoveDamageMultiplierAbAttr,
        (target, user, move) => target.getMoveEffectiveness(user, move) >= 2,
        0.75,
      )
      .ignorable(),
    new Ability(Abilities.SLOW_START, 4).attr(PostSummonAddBattlerTagAbAttr, BattlerTagType.SLOW_START, 5),
    new Ability(Abilities.SCRAPPY, 4)
      .attr(IgnoreTypeImmunityAbAttr, Type.GHOST, [Type.NORMAL, Type.FIGHTING])
      .attr(IntimidateImmunityAbAttr),
    new Ability(Abilities.STORM_DRAIN, 4)
      .attr(RedirectTypeMoveAbAttr, Type.WATER)
      .attr(TypeImmunityStatStageChangeAbAttr, Type.WATER, Stat.SPATK, 1)
      .ignorable(),
    new Ability(Abilities.ICE_BODY, 4)
      .attr(BlockWeatherDamageAttr, WeatherType.HAIL)
      .attr(PostWeatherLapseHealAbAttr, 1, WeatherType.HAIL, WeatherType.SNOW),
    new Ability(Abilities.SOLID_ROCK, 4)
      .attr(
        ReceivedMoveDamageMultiplierAbAttr,
        (target, user, move) => target.getMoveEffectiveness(user, move) >= 2,
        0.75,
      )
      .ignorable(),
    new Ability(Abilities.SNOW_WARNING, 4)
      .attr(PostSummonWeatherChangeAbAttr, WeatherType.SNOW)
      .attr(PostBiomeChangeWeatherChangeAbAttr, WeatherType.SNOW),
    new Ability(Abilities.HONEY_GATHER, 4).attr(MoneyAbAttr),
    new Ability(Abilities.FRISK, 4).attr(FriskAbAttr),
    new Ability(Abilities.RECKLESS, 4).attr(
      MovePowerBoostAbAttr,
      (_user, _target, move) => move.hasFlag(MoveFlags.RECKLESS_MOVE),
      1.2,
    ),
    new Ability(Abilities.MULTITYPE, 4)
      .attr(UncopiableAbilityAbAttr)
      .attr(UnswappableAbilityAbAttr)
      .attr(UnsuppressableAbilityAbAttr)
      .attr(NoFusionAbilityAbAttr),
    new Ability(Abilities.FLOWER_GIFT, 4)
      .conditionalAttr(
        getWeatherCondition(WeatherType.SUNNY || WeatherType.HARSH_SUN),
        StatMultiplierAbAttr,
        Stat.ATK,
        1.5,
      )
      .conditionalAttr(
        getWeatherCondition(WeatherType.SUNNY || WeatherType.HARSH_SUN),
        StatMultiplierAbAttr,
        Stat.SPDEF,
        1.5,
      )
      .attr(UncopiableAbilityAbAttr)
      .attr(NoFusionAbilityAbAttr)
      .attr(PostSummonFormChangeByWeatherAbAttr, Abilities.FLOWER_GIFT)
      .attr(PostWeatherChangeFormChangeAbAttr, Abilities.FLOWER_GIFT, [
        WeatherType.NONE,
        WeatherType.SANDSTORM,
        WeatherType.STRONG_WINDS,
        WeatherType.FOG,
        WeatherType.HAIL,
        WeatherType.HEAVY_RAIN,
        WeatherType.SNOW,
        WeatherType.RAIN,
      ])
      .partial() // Should also boosts stats of ally
      .ignorable(),
    new Ability(Abilities.BAD_DREAMS, 4).attr(PostTurnHurtIfSleepingAbAttr),
    new Ability(Abilities.PICKPOCKET, 5)
      .attr(PostDefendStealHeldItemAbAttr, (_target, _user, move) => move.hasFlag(MoveFlags.MAKES_CONTACT))
      .condition(getSheerForceHitDisableAbCondition()),
    new Ability(Abilities.SHEER_FORCE, 5)
      .attr(MovePowerBoostAbAttr, (_user, _target, move) => move.chance >= 1, 5461 / 4096)
      .attr(MoveEffectChanceMultiplierAbAttr, 0), // Should disable life orb, eject button, red card, kee/maranga berry if they get implemented
    new Ability(Abilities.CONTRARY, 5).attr(StatStageChangeMultiplierAbAttr, -1).ignorable(),
    new Ability(Abilities.UNNERVE, 5).attr(PreventBerryUseAbAttr),
    new Ability(Abilities.DEFIANT, 5)
      .attr(PostStatStageChangeStatStageChangeAbAttr, (_target, _statsChanged, stages) => stages < 0, [Stat.ATK], 2)
      .edgeCase(), // Should not boost stats if switching into court changed sticky web
    new Ability(Abilities.DEFEATIST, 5)
      .attr(StatMultiplierAbAttr, Stat.ATK, 0.5)
      .attr(StatMultiplierAbAttr, Stat.SPATK, 0.5)
      .condition((pokemon) => pokemon.getHpRatio() <= 0.5),
    new Ability(Abilities.CURSED_BODY, 5).attr(PostDefendMoveDisableAbAttr, 30).bypassFaint(),
    new Ability(Abilities.HEALER, 5).conditionalAttr(
      (pokemon) => pokemon.getAlly() && pokemon.getAlly().status?.effect !== StatusEffect.FAINT && randSeedInt(10) < 3,
      PostTurnResetStatusAbAttr,
      true,
    ),
    new Ability(Abilities.FRIEND_GUARD, 5).attr(AlliedFieldDamageReductionAbAttr, 0.75).ignorable(),
    new Ability(Abilities.WEAK_ARMOR, 5)
      .attr(
        PostDefendStatStageChangeAbAttr,
        (_target, _user, move) => move.category === MoveCategory.PHYSICAL,
        Stat.DEF,
        -1,
      )
      .attr(
        PostDefendStatStageChangeAbAttr,
        (_target, _user, move) => move.category === MoveCategory.PHYSICAL,
        Stat.SPD,
        2,
      ),
    new Ability(Abilities.HEAVY_METAL, 5).attr(WeightMultiplierAbAttr, 2).ignorable(),
    new Ability(Abilities.LIGHT_METAL, 5).attr(WeightMultiplierAbAttr, 0.5).ignorable(),
    new Ability(Abilities.MULTISCALE, 5)
      .attr(ReceivedMoveDamageMultiplierAbAttr, (target, _user, _move) => target.isFullHp(), 0.5)
      .ignorable(),
    new Ability(Abilities.TOXIC_BOOST, 5).attr(
      MovePowerBoostAbAttr,
      (user, _target, move) =>
        move.category === MoveCategory.PHYSICAL
        && (user?.status?.effect === StatusEffect.POISON || user?.status?.effect === StatusEffect.TOXIC),
      1.5,
    ),
    new Ability(Abilities.FLARE_BOOST, 5).attr(
      MovePowerBoostAbAttr,
      (user, _target, move) => move.category === MoveCategory.SPECIAL && user?.status?.effect === StatusEffect.BURN,
      1.5,
    ),
    new Ability(Abilities.HARVEST, 5)
      .attr(
        PostTurnLootAbAttr,
        "EATEN_BERRIES",
        /** Rate is doubled when under sun {@link https://dex.pokemonshowdown.com/abilities/harvest} */
        (pokemon) => 0.5 * (getWeatherCondition(WeatherType.SUNNY, WeatherType.HARSH_SUN)(pokemon) ? 2 : 1),
      )
      .edgeCase(), // Cannot recover berries used up by fling or natural gift (unimplemented)
    new Ability(Abilities.TELEPATHY, 5)
      .attr(
        MoveImmunityAbAttr,
        (pokemon, attacker, move) => pokemon.getAlly() === attacker && move instanceof AttackMove,
      )
      .ignorable(),
    new Ability(Abilities.MOODY, 5).attr(MoodyAbAttr),
    new Ability(Abilities.OVERCOAT, 5)
      .attr(BlockWeatherDamageAttr)
      .attr(
        MoveImmunityAbAttr,
        (pokemon, attacker, move) => pokemon !== attacker && move.hasFlag(MoveFlags.POWDER_MOVE),
      )
      .ignorable(),
    new Ability(Abilities.POISON_TOUCH, 5)
      .attr(PostAttackApplyStatusEffectAbAttr, true, 30, StatusEffect.POISON)
      .edgeCase(), // Does not inflict poison if user gets inflicted with target's Mummy
    new Ability(Abilities.REGENERATOR, 5).attr(PreSwitchOutHealAbAttr),
    new Ability(Abilities.BIG_PECKS, 5).attr(ProtectStatAbAttr, Stat.DEF).ignorable(),
    new Ability(Abilities.SAND_RUSH, 5)
      .attr(WeatherBasedSpeedDoublerAbAttr, [WeatherType.SANDSTORM])
      .attr(BlockWeatherDamageAttr, WeatherType.SANDSTORM),
    new Ability(Abilities.WONDER_SKIN, 5).attr(WonderSkinAbAttr).ignorable(),
    new Ability(Abilities.ANALYTIC, 5).attr(
      MovePowerBoostAbAttr,
      (user, _target, _move) => {
        const movePhase = globalScene.findPhase((phase) => phase instanceof MovePhase && phase.pokemon.id !== user?.id);
        return isNullOrUndefined(movePhase);
      },
      1.3,
    ),
    new Ability(Abilities.ILLUSION, 5).attr(UncopiableAbilityAbAttr).attr(UnswappableAbilityAbAttr).unimplemented(),
    new Ability(Abilities.IMPOSTER, 5).attr(PostSummonTransformAbAttr).attr(UncopiableAbilityAbAttr),
    new Ability(Abilities.INFILTRATOR, 5).attr(InfiltratorAbAttr).partial(), // does not bypass Mist
    new Ability(Abilities.MUMMY, 5).attr(PostDefendAbilityGiveAbAttr, Abilities.MUMMY).bypassFaint(),
    new Ability(Abilities.MOXIE, 5).attr(PostVictoryStatStageChangeAbAttr, Stat.ATK, 1),
    new Ability(Abilities.JUSTIFIED, 5).attr(
      PostDefendStatStageChangeAbAttr,
      (_target, user, move) => user.getMoveType(move) === Type.DARK && move.category !== MoveCategory.STATUS,
      Stat.ATK,
      1,
    ),
    new Ability(Abilities.RATTLED, 5)
      .attr(
        PostDefendStatStageChangeAbAttr,
        (_target, user, move) => {
          const moveType = user.getMoveType(move);
          return (
            move.category !== MoveCategory.STATUS
            && (moveType === Type.DARK || moveType === Type.BUG || moveType === Type.GHOST)
          );
        },
        Stat.SPD,
        1,
      )
      .attr(PostIntimidateStatStageChangeAbAttr, [Stat.SPD], 1),
    new Ability(Abilities.MAGIC_BOUNCE, 5).ignorable().unimplemented(),
    new Ability(Abilities.SAP_SIPPER, 5).attr(TypeImmunityStatStageChangeAbAttr, Type.GRASS, Stat.ATK, 1).ignorable(),
    new Ability(Abilities.PRANKSTER, 5).attr(
      ChangeMovePriorityAbAttr,
      (_pokemon, move: Move) => move.category === MoveCategory.STATUS,
      1,
    ),
    new Ability(Abilities.SAND_FORCE, 5)
      .attr(MoveTypePowerBoostAbAttr, Type.ROCK, 1.3)
      .attr(MoveTypePowerBoostAbAttr, Type.GROUND, 1.3)
      .attr(MoveTypePowerBoostAbAttr, Type.STEEL, 1.3)
      .attr(BlockWeatherDamageAttr, WeatherType.SANDSTORM)
      .condition(getWeatherCondition(WeatherType.SANDSTORM)),
    new Ability(Abilities.IRON_BARBS, 5).attr(PostDefendContactDamageAbAttr, 8).bypassFaint(),
    new Ability(Abilities.ZEN_MODE, 5)
      .attr(PostBattleInitFormChangeAbAttr, () => 0)
      .attr(PostSummonFormChangeAbAttr, (p) => (p.getHpRatio() <= 0.5 ? 1 : 0))
      .attr(PostTurnFormChangeAbAttr, (p) => (p.getHpRatio() <= 0.5 ? 1 : 0))
      .attr(UncopiableAbilityAbAttr)
      .attr(UnswappableAbilityAbAttr)
      .attr(UnsuppressableAbilityAbAttr)
      .attr(NoFusionAbilityAbAttr)
      .bypassFaint(),
    new Ability(Abilities.VICTORY_STAR, 5).attr(StatMultiplierAbAttr, Stat.ACC, 1.1).partial(), // Does not boost ally's accuracy
    new Ability(Abilities.TURBOBLAZE, 5)
      .attr(PostSummonMessageAbAttr, (pokemon: Pokemon) =>
        i18next.t("abilityTriggers:postSummonTurboblaze", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
      )
      .attr(MoveAbilityBypassAbAttr),
    new Ability(Abilities.TERAVOLT, 5)
      .attr(PostSummonMessageAbAttr, (pokemon: Pokemon) =>
        i18next.t("abilityTriggers:postSummonTeravolt", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
      )
      .attr(MoveAbilityBypassAbAttr),
    new Ability(Abilities.AROMA_VEIL, 6)
      .attr(UserFieldBattlerTagImmunityAbAttr, [
        BattlerTagType.INFATUATED,
        BattlerTagType.TAUNT,
        BattlerTagType.DISABLED,
        BattlerTagType.TORMENT,
        BattlerTagType.HEAL_BLOCK,
      ])
      .ignorable(),
    new Ability(Abilities.FLOWER_VEIL, 6).ignorable().unimplemented(),
    new Ability(Abilities.CHEEK_POUCH, 6).attr(HealFromBerryUseAbAttr, 1 / 3),
    new Ability(Abilities.PROTEAN, 6).attr(PokemonTypeChangeAbAttr),
    //.condition((p) => !p.summonData?.abilitiesApplied.includes(Abilities.PROTEAN)), //Gen 9 Implementation
    new Ability(Abilities.FUR_COAT, 6)
      .attr(ReceivedMoveDamageMultiplierAbAttr, (_target, _user, move) => move.category === MoveCategory.PHYSICAL, 0.5)
      .ignorable(),
    new Ability(Abilities.MAGICIAN, 6).attr(PostAttackStealHeldItemAbAttr),
    new Ability(Abilities.BULLETPROOF, 6)
      .attr(
        MoveImmunityAbAttr,
        (pokemon, attacker, move) => pokemon !== attacker && move.hasFlag(MoveFlags.BALLBOMB_MOVE),
      )
      .ignorable(),
    new Ability(Abilities.COMPETITIVE, 6)
      .attr(PostStatStageChangeStatStageChangeAbAttr, (_target, _statsChanged, stages) => stages < 0, [Stat.SPATK], 2)
      .edgeCase(), // Should not boost stats if switching into court changed sticky web
    new Ability(Abilities.STRONG_JAW, 6).attr(
      MovePowerBoostAbAttr,
      (_user, _target, move) => move.hasFlag(MoveFlags.BITING_MOVE),
      1.5,
    ),
    new Ability(Abilities.REFRIGERATE, 6).attr(
      MoveTypeChangeAbAttr,
      Type.ICE,
      1.2,
      (_user, _target, move) => move.type === Type.NORMAL && !move.hasAttr(VariableMoveTypeAttr),
    ),
    new Ability(Abilities.SWEET_VEIL, 6)
      .attr(UserFieldStatusEffectImmunityAbAttr, StatusEffect.SLEEP)
      .attr(UserFieldBattlerTagImmunityAbAttr, BattlerTagType.DROWSY)
      .ignorable()
      .partial(), // Mold Breaker ally should not be affected by Sweet Veil
    new Ability(Abilities.STANCE_CHANGE, 6)
      .attr(UncopiableAbilityAbAttr)
      .attr(UnswappableAbilityAbAttr)
      .attr(UnsuppressableAbilityAbAttr)
      .attr(NoFusionAbilityAbAttr),
    new Ability(Abilities.GALE_WINGS, 6).attr(
      ChangeMovePriorityAbAttr,
      (pokemon, move) => pokemon.isFullHp() && pokemon.getMoveType(move) === Type.FLYING,
      1,
    ),
    new Ability(Abilities.MEGA_LAUNCHER, 6).attr(
      MovePowerBoostAbAttr,
      (_user, _target, move) => move.hasFlag(MoveFlags.PULSE_MOVE),
      1.5,
    ),
    new Ability(Abilities.GRASS_PELT, 6)
      .conditionalAttr(getTerrainCondition(TerrainType.GRASSY), StatMultiplierAbAttr, Stat.DEF, 1.5)
      .ignorable(),
    new Ability(Abilities.SYMBIOSIS, 6).unimplemented(),
    new Ability(Abilities.TOUGH_CLAWS, 6).attr(
      MovePowerBoostAbAttr,
      (_user, _target, move) => move.hasFlag(MoveFlags.MAKES_CONTACT),
      1.3,
    ),
    new Ability(Abilities.PIXILATE, 6).attr(
      MoveTypeChangeAbAttr,
      Type.FAIRY,
      1.2,
      (_user, _target, move) => move.type === Type.NORMAL && !move.hasAttr(VariableMoveTypeAttr),
    ),
    new Ability(Abilities.GOOEY, 6).attr(
      PostDefendStatStageChangeAbAttr,
      (target, user, move) => move.checkFlag(MoveFlags.MAKES_CONTACT, user, target),
      Stat.SPD,
      -1,
      false,
    ),
    new Ability(Abilities.AERILATE, 6).attr(
      MoveTypeChangeAbAttr,
      Type.FLYING,
      1.2,
      (_user, _target, move) => move.type === Type.NORMAL && !move.hasAttr(VariableMoveTypeAttr),
    ),
    new Ability(Abilities.PARENTAL_BOND, 6).attr(AddSecondStrikeAbAttr, 0.25),
    new Ability(Abilities.DARK_AURA, 6)
      .attr(PostSummonMessageAbAttr, (pokemon: Pokemon) =>
        i18next.t("abilityTriggers:postSummonDarkAura", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
      )
      .attr(FieldMoveTypePowerBoostAbAttr, Type.DARK, 4 / 3),
    new Ability(Abilities.FAIRY_AURA, 6)
      .attr(PostSummonMessageAbAttr, (pokemon: Pokemon) =>
        i18next.t("abilityTriggers:postSummonFairyAura", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
      )
      .attr(FieldMoveTypePowerBoostAbAttr, Type.FAIRY, 4 / 3),
    new Ability(Abilities.AURA_BREAK, 6)
      .ignorable()
      .conditionalAttr(
        (_pokemon) => globalScene.getField(true).some((p) => p.hasAbility(Abilities.DARK_AURA)),
        FieldMoveTypePowerBoostAbAttr,
        Type.DARK,
        9 / 16,
      )
      .conditionalAttr(
        (_pokemon) => globalScene.getField(true).some((p) => p.hasAbility(Abilities.FAIRY_AURA)),
        FieldMoveTypePowerBoostAbAttr,
        Type.FAIRY,
        9 / 16,
      )
      .conditionalAttr(
        (_pokemon) =>
          globalScene
            .getField(true)
            .some((p) => p.hasAbility(Abilities.DARK_AURA) || p.hasAbility(Abilities.FAIRY_AURA)),
        PostSummonMessageAbAttr,
        (pokemon: Pokemon) =>
          i18next.t("abilityTriggers:postSummonAuraBreak", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
      ),
    new Ability(Abilities.PRIMORDIAL_SEA, 6)
      .attr(PostSummonWeatherChangeAbAttr, WeatherType.HEAVY_RAIN)
      .attr(PostBiomeChangeWeatherChangeAbAttr, WeatherType.HEAVY_RAIN)
      .attr(PreSwitchOutClearWeatherAbAttr)
      .attr(PostFaintClearWeatherAbAttr)
      .bypassFaint(),
    new Ability(Abilities.DESOLATE_LAND, 6)
      .attr(PostSummonWeatherChangeAbAttr, WeatherType.HARSH_SUN)
      .attr(PostBiomeChangeWeatherChangeAbAttr, WeatherType.HARSH_SUN)
      .attr(PreSwitchOutClearWeatherAbAttr)
      .attr(PostFaintClearWeatherAbAttr)
      .bypassFaint(),
    new Ability(Abilities.DELTA_STREAM, 6)
      .attr(PostSummonWeatherChangeAbAttr, WeatherType.STRONG_WINDS)
      .attr(PostBiomeChangeWeatherChangeAbAttr, WeatherType.STRONG_WINDS)
      .attr(PreSwitchOutClearWeatherAbAttr)
      .attr(PostFaintClearWeatherAbAttr)
      .bypassFaint(),
    new Ability(Abilities.STAMINA, 7).attr(
      PostDefendStatStageChangeAbAttr,
      (_target, _user, move) => move.category !== MoveCategory.STATUS,
      Stat.DEF,
      1,
    ),
    new Ability(Abilities.WIMP_OUT, 7).attr(PostDamageForceSwitchAbAttr).edgeCase(), // Should not trigger when hurting itself in confusion, causes Fake Out to fail turn 1 and succeed turn 2 if pokemon is switched out before battle start via playing in Switch Mode
    new Ability(Abilities.EMERGENCY_EXIT, 7).attr(PostDamageForceSwitchAbAttr).edgeCase(), // Should not trigger when hurting itself in confusion, causes Fake Out to fail turn 1 and succeed turn 2 if pokemon is switched out before battle start via playing in Switch Mode
    new Ability(Abilities.WATER_COMPACTION, 7).attr(
      PostDefendStatStageChangeAbAttr,
      (_target, user, move) => user.getMoveType(move) === Type.WATER && move.category !== MoveCategory.STATUS,
      Stat.DEF,
      2,
    ),
    new Ability(Abilities.MERCILESS, 7).attr(
      ConditionalCritAbAttr,
      (_user, target, _move) =>
        target?.status?.effect === StatusEffect.TOXIC || target?.status?.effect === StatusEffect.POISON,
    ),
    new Ability(Abilities.SHIELDS_DOWN, 7)
      .attr(PostBattleInitFormChangeAbAttr, () => 0)
      .attr(PostSummonFormChangeAbAttr, (p) => (p.formIndex % 7) + (p.getHpRatio() <= 0.5 ? 7 : 0))
      .attr(PostTurnFormChangeAbAttr, (p) => (p.formIndex % 7) + (p.getHpRatio() <= 0.5 ? 7 : 0))
      .attr(UncopiableAbilityAbAttr)
      .attr(UnswappableAbilityAbAttr)
      .attr(UnsuppressableAbilityAbAttr)
      .attr(NoFusionAbilityAbAttr)
      .bypassFaint()
      .partial(), // Meteor form should protect against status effects and yawn
    new Ability(Abilities.STAKEOUT, 7).attr(
      MovePowerBoostAbAttr,
      (_user, target, _move) => !!target?.turnData.switchedInThisTurn,
      2,
    ),
    new Ability(Abilities.WATER_BUBBLE, 7)
      .attr(ReceivedTypeDamageMultiplierAbAttr, Type.FIRE, 0.5)
      .attr(MoveTypePowerBoostAbAttr, Type.WATER, 2)
      .attr(StatusEffectImmunityAbAttr, StatusEffect.BURN)
      .ignorable(),
    new Ability(Abilities.STEELWORKER, 7).attr(MoveTypePowerBoostAbAttr, Type.STEEL),
    new Ability(Abilities.BERSERK, 7)
      .attr(
        PostDefendHpGatedStatStageChangeAbAttr,
        (_target, _user, move) => move.category !== MoveCategory.STATUS,
        0.5,
        [Stat.SPATK],
        1,
      )
      .condition(getSheerForceHitDisableAbCondition()),
    new Ability(Abilities.SLUSH_RUSH, 7).attr(WeatherBasedSpeedDoublerAbAttr, [WeatherType.HAIL, WeatherType.SNOW]),
    new Ability(Abilities.LONG_REACH, 7).attr(IgnoreContactAbAttr),
    new Ability(Abilities.LIQUID_VOICE, 7).attr(MoveTypeChangeAbAttr, Type.WATER, 1, (_user, _target, move) =>
      move.hasFlag(MoveFlags.SOUND_BASED),
    ),
    new Ability(Abilities.TRIAGE, 7).attr(
      ChangeMovePriorityAbAttr,
      (_pokemon, move) => move.hasFlag(MoveFlags.TRIAGE_MOVE),
      3,
    ),
    new Ability(Abilities.GALVANIZE, 7).attr(
      MoveTypeChangeAbAttr,
      Type.ELECTRIC,
      1.2,
      (_user, _target, move) => move.type === Type.NORMAL && !move.hasAttr(VariableMoveTypeAttr),
    ),
    new Ability(Abilities.SURGE_SURFER, 7).conditionalAttr(
      getTerrainCondition(TerrainType.ELECTRIC),
      StatMultiplierAbAttr,
      Stat.SPD,
      2,
    ),
    new Ability(Abilities.SCHOOLING, 7)
      .attr(PostBattleInitFormChangeAbAttr, () => 0)
      .attr(PostSummonFormChangeAbAttr, (p) => (p.level < 20 || p.getHpRatio() <= 0.25 ? 0 : 1))
      .attr(PostTurnFormChangeAbAttr, (p) => (p.level < 20 || p.getHpRatio() <= 0.25 ? 0 : 1))
      .attr(UncopiableAbilityAbAttr)
      .attr(UnswappableAbilityAbAttr)
      .attr(UnsuppressableAbilityAbAttr)
      .attr(NoFusionAbilityAbAttr)
      .bypassFaint(),
    new Ability(Abilities.DISGUISE, 7)
      .attr(UncopiableAbilityAbAttr)
      .attr(UnswappableAbilityAbAttr)
      .attr(UnsuppressableAbilityAbAttr)
      .attr(NoTransformAbilityAbAttr)
      .attr(NoFusionAbilityAbAttr)
      // Add BattlerTagType.DISGUISE if the pokemon is in its disguised form
      .conditionalAttr(
        (pokemon) => pokemon.formIndex === 0,
        PostSummonAddBattlerTagAbAttr,
        BattlerTagType.DISGUISE,
        0,
        false,
      )
      .attr(
        FormBlockDamageAbAttr,
        (target, user, move) => !!target.getTag(BattlerTagType.DISGUISE) && target.getMoveEffectiveness(user, move) > 0,
        0,
        BattlerTagType.DISGUISE,
        (pokemon, abilityName) =>
          i18next.t("abilityTriggers:disguiseAvoidedDamage", {
            pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
            abilityName: abilityName,
          }),
        (pokemon) => toDmgValue(pokemon.getMaxHp() / 8),
      )
      .attr(PostBattleInitFormChangeAbAttr, () => 0)
      .bypassFaint()
      .ignorable(),
    new Ability(Abilities.BATTLE_BOND, 7)
      .attr(PostVictoryFormChangeAbAttr, () => 2)
      .attr(PostBattleInitFormChangeAbAttr, () => 1)
      .attr(UncopiableAbilityAbAttr)
      .attr(UnswappableAbilityAbAttr)
      .attr(UnsuppressableAbilityAbAttr)
      .attr(NoFusionAbilityAbAttr)
      .bypassFaint(),
    new Ability(Abilities.POWER_CONSTRUCT, 7)
      .conditionalAttr(
        (pokemon) => pokemon.formIndex === 2 || pokemon.formIndex === 4,
        PostBattleInitFormChangeAbAttr,
        () => 2,
      )
      .conditionalAttr(
        (pokemon) => pokemon.formIndex === 3 || pokemon.formIndex === 5,
        PostBattleInitFormChangeAbAttr,
        () => 3,
      )
      .conditionalAttr(
        (pokemon) => pokemon.formIndex === 2 || pokemon.formIndex === 4,
        PostSummonFormChangeAbAttr,
        (p) => (p.getHpRatio() <= 0.5 || p.getFormKey() === "complete" ? 4 : 2),
      )
      .conditionalAttr(
        (pokemon) => pokemon.formIndex === 2 || pokemon.formIndex === 4,
        PostTurnFormChangeAbAttr,
        (p) => (p.getHpRatio() <= 0.5 || p.getFormKey() === "complete" ? 4 : 2),
      )
      .conditionalAttr(
        (pokemon) => pokemon.formIndex === 3 || pokemon.formIndex === 5,
        PostSummonFormChangeAbAttr,
        (p) => (p.getHpRatio() <= 0.5 || p.getFormKey() === "10-complete" ? 5 : 3),
      )
      .conditionalAttr(
        (pokemon) => pokemon.formIndex === 3 || pokemon.formIndex === 5,
        PostTurnFormChangeAbAttr,
        (p) => (p.getHpRatio() <= 0.5 || p.getFormKey() === "10-complete" ? 5 : 3),
      )
      .attr(UncopiableAbilityAbAttr)
      .attr(UnswappableAbilityAbAttr)
      .attr(UnsuppressableAbilityAbAttr)
      .attr(NoFusionAbilityAbAttr)
      .bypassFaint(),
    new Ability(Abilities.CORROSION, 7)
      .attr(IgnoreTypeStatusEffectImmunityAbAttr, [StatusEffect.POISON, StatusEffect.TOXIC], [Type.STEEL, Type.POISON])
      .edgeCase(), // Should interact correctly with magic coat/bounce (not yet implemented) + fling with toxic orb (not implemented yet)
    new Ability(Abilities.COMATOSE, 7)
      .attr(UncopiableAbilityAbAttr)
      .attr(UnswappableAbilityAbAttr)
      .attr(UnsuppressableAbilityAbAttr)
      .attr(StatusEffectImmunityAbAttr, ...getNonVolatileStatusEffects())
      .attr(BattlerTagImmunityAbAttr, BattlerTagType.DROWSY),
    new Ability(Abilities.QUEENLY_MAJESTY, 7).attr(FieldPriorityMoveImmunityAbAttr).ignorable(),
    new Ability(Abilities.INNARDS_OUT, 7).attr(PostFaintHPDamageAbAttr).bypassFaint(),
    new Ability(Abilities.DANCER, 7).attr(PostDancingMoveAbAttr),
    new Ability(Abilities.BATTERY, 7).attr(AllyMoveCategoryPowerBoostAbAttr, [MoveCategory.SPECIAL], 1.3),
    new Ability(Abilities.FLUFFY, 7)
      .attr(ReceivedMoveDamageMultiplierAbAttr, (_target, _user, move) => move.hasFlag(MoveFlags.MAKES_CONTACT), 0.5)
      .attr(ReceivedMoveDamageMultiplierAbAttr, (_target, user, move) => user.getMoveType(move) === Type.FIRE, 2)
      .ignorable(),
    new Ability(Abilities.DAZZLING, 7).attr(FieldPriorityMoveImmunityAbAttr).ignorable(),
    new Ability(Abilities.SOUL_HEART, 7).attr(PostKnockOutStatStageChangeAbAttr, Stat.SPATK, 1),
    new Ability(Abilities.TANGLING_HAIR, 7).attr(
      PostDefendStatStageChangeAbAttr,
      (target, user, move) => move.checkFlag(MoveFlags.MAKES_CONTACT, user, target),
      Stat.SPD,
      -1,
      false,
    ),
    new Ability(Abilities.RECEIVER, 7).attr(CopyFaintedAllyAbilityAbAttr).attr(UncopiableAbilityAbAttr),
    new Ability(Abilities.POWER_OF_ALCHEMY, 7).attr(CopyFaintedAllyAbilityAbAttr).attr(UncopiableAbilityAbAttr),
    new Ability(Abilities.BEAST_BOOST, 7).attr(
      PostVictoryStatStageChangeAbAttr,
      (p) => {
        let highestStat: EffectiveStat;
        let highestValue = 0;
        for (const s of EFFECTIVE_STATS) {
          const value = p.getStat(s, false);
          if (value > highestValue) {
            highestStat = s;
            highestValue = value;
          }
        }
        return highestStat!;
      },
      1,
    ),
    new Ability(Abilities.RKS_SYSTEM, 7)
      .attr(UncopiableAbilityAbAttr)
      .attr(UnswappableAbilityAbAttr)
      .attr(UnsuppressableAbilityAbAttr)
      .attr(NoFusionAbilityAbAttr),
    new Ability(Abilities.ELECTRIC_SURGE, 7)
      .attr(PostSummonTerrainChangeAbAttr, TerrainType.ELECTRIC)
      .attr(PostBiomeChangeTerrainChangeAbAttr, TerrainType.ELECTRIC),
    new Ability(Abilities.PSYCHIC_SURGE, 7)
      .attr(PostSummonTerrainChangeAbAttr, TerrainType.PSYCHIC)
      .attr(PostBiomeChangeTerrainChangeAbAttr, TerrainType.PSYCHIC),
    new Ability(Abilities.MISTY_SURGE, 7)
      .attr(PostSummonTerrainChangeAbAttr, TerrainType.MISTY)
      .attr(PostBiomeChangeTerrainChangeAbAttr, TerrainType.MISTY),
    new Ability(Abilities.GRASSY_SURGE, 7)
      .attr(PostSummonTerrainChangeAbAttr, TerrainType.GRASSY)
      .attr(PostBiomeChangeTerrainChangeAbAttr, TerrainType.GRASSY),
    new Ability(Abilities.FULL_METAL_BODY, 7).attr(ProtectStatAbAttr),
    new Ability(Abilities.SHADOW_SHIELD, 7).attr(
      ReceivedMoveDamageMultiplierAbAttr,
      (target, _user, _move) => target.isFullHp(),
      0.5,
    ),
    new Ability(Abilities.PRISM_ARMOR, 7).attr(
      ReceivedMoveDamageMultiplierAbAttr,
      (target, user, move) => target.getMoveEffectiveness(user, move) >= 2,
      0.75,
    ),
    new Ability(Abilities.NEUROFORCE, 7).attr(
      MovePowerBoostAbAttr,
      (user, target, move) => (target?.getMoveEffectiveness(user!, move) ?? 1) >= 2,
      1.25,
    ),
    new Ability(Abilities.INTREPID_SWORD, 8).attr(PostSummonStatStageChangeAbAttr, [Stat.ATK], 1, true),
    new Ability(Abilities.DAUNTLESS_SHIELD, 8).attr(PostSummonStatStageChangeAbAttr, [Stat.DEF], 1, true),
    new Ability(Abilities.LIBERO, 8).attr(PokemonTypeChangeAbAttr),
    //.condition((p) => !p.summonData?.abilitiesApplied.includes(Abilities.LIBERO)), //Gen 9 Implementation
    new Ability(Abilities.BALL_FETCH, 8)
      .attr(FetchBallAbAttr)
      .condition(getOncePerBattleCondition(Abilities.BALL_FETCH)),
    new Ability(Abilities.COTTON_DOWN, 8)
      .attr(
        PostDefendStatStageChangeAbAttr,
        (_target, _user, move) => move.category !== MoveCategory.STATUS,
        Stat.SPD,
        -1,
        false,
        true,
      )
      .bypassFaint(),
    new Ability(Abilities.PROPELLER_TAIL, 8).attr(BlockRedirectAbAttr),
    new Ability(Abilities.MIRROR_ARMOR, 8).ignorable().unimplemented(),
    /**
     * Right now, the logic is attached to Surf and Dive moves. Ideally, the post-defend/hit should be an
     * ability attribute but the current implementation of move effects for BattlerTag does not support this- in the case
     * where Cramorant is fainted.
     * @see {@linkcode GulpMissileTagAttr} and {@linkcode GulpMissileTag} for Gulp Missile implementation
     */
    new Ability(Abilities.GULP_MISSILE, 8)
      .attr(UnsuppressableAbilityAbAttr)
      .attr(NoTransformAbilityAbAttr)
      .attr(NoFusionAbilityAbAttr)
      .attr(UncopiableAbilityAbAttr)
      .attr(UnswappableAbilityAbAttr)
      .bypassFaint(),
    new Ability(Abilities.STALWART, 8).attr(BlockRedirectAbAttr),
    new Ability(Abilities.STEAM_ENGINE, 8).attr(
      PostDefendStatStageChangeAbAttr,
      (_target, user, move) => {
        const moveType = user.getMoveType(move);
        return move.category !== MoveCategory.STATUS && (moveType === Type.FIRE || moveType === Type.WATER);
      },
      Stat.SPD,
      6,
    ),
    new Ability(Abilities.PUNK_ROCK, 8)
      .attr(MovePowerBoostAbAttr, (_user, _target, move) => move.hasFlag(MoveFlags.SOUND_BASED), 1.3)
      .attr(ReceivedMoveDamageMultiplierAbAttr, (_target, _user, move) => move.hasFlag(MoveFlags.SOUND_BASED), 0.5)
      .ignorable(),
    new Ability(Abilities.SAND_SPIT, 8).attr(
      PostDefendWeatherChangeAbAttr,
      WeatherType.SANDSTORM,
      (_target, _user, move) => move.category !== MoveCategory.STATUS,
    ),
    new Ability(Abilities.ICE_SCALES, 8)
      .attr(ReceivedMoveDamageMultiplierAbAttr, (_target, _user, move) => move.category === MoveCategory.SPECIAL, 0.5)
      .ignorable(),
    new Ability(Abilities.RIPEN, 8).attr(DoubleBerryEffectAbAttr),
    new Ability(Abilities.ICE_FACE, 8)
      .attr(UncopiableAbilityAbAttr)
      .attr(UnswappableAbilityAbAttr)
      .attr(UnsuppressableAbilityAbAttr)
      .attr(NoTransformAbilityAbAttr)
      .attr(NoFusionAbilityAbAttr)
      // Add BattlerTagType.ICE_FACE if the pokemon is in ice face form
      .conditionalAttr(
        (pokemon) => pokemon.formIndex === 0,
        PostSummonAddBattlerTagAbAttr,
        BattlerTagType.ICE_FACE,
        0,
        false,
      )
      // When summoned with active HAIL or SNOW, add BattlerTagType.ICE_FACE
      .conditionalAttr(
        getWeatherCondition(WeatherType.HAIL, WeatherType.SNOW),
        PostSummonAddBattlerTagAbAttr,
        BattlerTagType.ICE_FACE,
        0,
      )
      // When weather changes to HAIL or SNOW while pokemon is fielded, add BattlerTagType.ICE_FACE
      .attr(PostWeatherChangeAddBattlerTagAttr, BattlerTagType.ICE_FACE, 0, WeatherType.HAIL, WeatherType.SNOW)
      .attr(
        FormBlockDamageAbAttr,
        (target, _user, move) => move.category === MoveCategory.PHYSICAL && !!target.getTag(BattlerTagType.ICE_FACE),
        0,
        BattlerTagType.ICE_FACE,
        (pokemon, abilityName) =>
          i18next.t("abilityTriggers:iceFaceAvoidedDamage", {
            pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
            abilityName: abilityName,
          }),
      )
      .attr(PostBattleInitFormChangeAbAttr, () => 0)
      .bypassFaint()
      .ignorable(),
    new Ability(Abilities.POWER_SPOT, 8).attr(
      AllyMoveCategoryPowerBoostAbAttr,
      [MoveCategory.SPECIAL, MoveCategory.PHYSICAL],
      1.3,
    ),
    new Ability(Abilities.MIMICRY, 8).attr(TerrainEventTypeChangeAbAttr),
    new Ability(Abilities.SCREEN_CLEANER, 8).attr(PostSummonRemoveArenaTagAbAttr, [
      ArenaTagType.AURORA_VEIL,
      ArenaTagType.LIGHT_SCREEN,
      ArenaTagType.REFLECT,
    ]),
    new Ability(Abilities.STEELY_SPIRIT, 8).attr(UserFieldMoveTypePowerBoostAbAttr, Type.STEEL),
    new Ability(Abilities.PERISH_BODY, 8).attr(PostDefendPerishSongAbAttr, 4),
    new Ability(Abilities.WANDERING_SPIRIT, 8).attr(PostDefendAbilitySwapAbAttr).bypassFaint().edgeCase(), //  interacts incorrectly with rock head. It's meant to switch abilities before recoil would apply so that a pokemon with rock head would lose rock head first and still take the recoil
    new Ability(Abilities.GORILLA_TACTICS, 8).attr(GorillaTacticsAbAttr),
    new Ability(Abilities.NEUTRALIZING_GAS, 8)
      .attr(SuppressFieldAbilitiesAbAttr)
      .attr(UncopiableAbilityAbAttr)
      .attr(UnswappableAbilityAbAttr)
      .attr(NoTransformAbilityAbAttr)
      .attr(PostSummonMessageAbAttr, (pokemon: Pokemon) =>
        i18next.t("abilityTriggers:postSummonNeutralizingGas", {
          pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
        }),
      )
      .partial(), // A bunch of weird interactions with other abilities being suppressed then unsuppressed
    new Ability(Abilities.PASTEL_VEIL, 8)
      .attr(PostSummonUserFieldRemoveStatusEffectAbAttr, StatusEffect.POISON, StatusEffect.TOXIC)
      .attr(UserFieldStatusEffectImmunityAbAttr, StatusEffect.POISON, StatusEffect.TOXIC)
      .ignorable(),
    new Ability(Abilities.HUNGER_SWITCH, 8)
      .attr(PostTurnFormChangeAbAttr, (p) => (p.getFormKey() ? 0 : 1))
      .attr(PostTurnFormChangeAbAttr, (p) => (p.getFormKey() ? 1 : 0))
      .attr(UncopiableAbilityAbAttr)
      .attr(UnswappableAbilityAbAttr)
      .attr(NoTransformAbilityAbAttr)
      .attr(NoFusionAbilityAbAttr)
      .condition((pokemon) => !pokemon.isTerastallized()),
    new Ability(Abilities.QUICK_DRAW, 8).attr(BypassSpeedChanceAbAttr, 30),
    new Ability(Abilities.UNSEEN_FIST, 8).attr(IgnoreProtectOnContactAbAttr),
    new Ability(Abilities.CURIOUS_MEDICINE, 8).attr(PostSummonClearAllyStatStagesAbAttr),
    new Ability(Abilities.TRANSISTOR, 8).attr(MoveTypePowerBoostAbAttr, Type.ELECTRIC),
    new Ability(Abilities.DRAGONS_MAW, 8).attr(MoveTypePowerBoostAbAttr, Type.DRAGON),
    new Ability(Abilities.CHILLING_NEIGH, 8).attr(PostVictoryStatStageChangeAbAttr, Stat.ATK, 1),
    new Ability(Abilities.GRIM_NEIGH, 8).attr(PostVictoryStatStageChangeAbAttr, Stat.SPATK, 1),
    new Ability(Abilities.AS_ONE_GLASTRIER, 8)
      .attr(PostSummonMessageAbAttr, (pokemon: Pokemon) =>
        i18next.t("abilityTriggers:postSummonAsOneGlastrier", {
          pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
        }),
      )
      .attr(PreventBerryUseAbAttr)
      .attr(PostVictoryStatStageChangeAbAttr, Stat.ATK, 1)
      .attr(UncopiableAbilityAbAttr)
      .attr(UnswappableAbilityAbAttr)
      .attr(UnsuppressableAbilityAbAttr),
    new Ability(Abilities.AS_ONE_SPECTRIER, 8)
      .attr(PostSummonMessageAbAttr, (pokemon: Pokemon) =>
        i18next.t("abilityTriggers:postSummonAsOneSpectrier", {
          pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
        }),
      )
      .attr(PreventBerryUseAbAttr)
      .attr(PostVictoryStatStageChangeAbAttr, Stat.SPATK, 1)
      .attr(UncopiableAbilityAbAttr)
      .attr(UnswappableAbilityAbAttr)
      .attr(UnsuppressableAbilityAbAttr),
    new Ability(Abilities.LINGERING_AROMA, 9)
      .attr(PostDefendAbilityGiveAbAttr, Abilities.LINGERING_AROMA)
      .bypassFaint(),
    new Ability(Abilities.SEED_SOWER, 9).attr(PostDefendTerrainChangeAbAttr, TerrainType.GRASSY),
    new Ability(Abilities.THERMAL_EXCHANGE, 9)
      .attr(
        PostDefendStatStageChangeAbAttr,
        (_target, user, move) => user.getMoveType(move) === Type.FIRE && move.category !== MoveCategory.STATUS,
        Stat.ATK,
        1,
      )
      .attr(StatusEffectImmunityAbAttr, StatusEffect.BURN)
      .ignorable(),
    new Ability(Abilities.ANGER_SHELL, 9)
      .attr(
        PostDefendHpGatedStatStageChangeAbAttr,
        (_target, _user, move) => move.category !== MoveCategory.STATUS,
        0.5,
        [Stat.ATK, Stat.SPATK, Stat.SPD],
        1,
      )
      .attr(
        PostDefendHpGatedStatStageChangeAbAttr,
        (_target, _user, move) => move.category !== MoveCategory.STATUS,
        0.5,
        [Stat.DEF, Stat.SPDEF],
        -1,
      )
      .condition(getSheerForceHitDisableAbCondition()),
    new Ability(Abilities.PURIFYING_SALT, 9)
      .attr(StatusEffectImmunityAbAttr)
      .attr(ReceivedTypeDamageMultiplierAbAttr, Type.GHOST, 0.5)
      .ignorable(),
    new Ability(Abilities.WELL_BAKED_BODY, 9)
      .attr(TypeImmunityStatStageChangeAbAttr, Type.FIRE, Stat.DEF, 2)
      .ignorable(),
    new Ability(Abilities.WIND_RIDER, 9)
      .attr(
        MoveImmunityStatStageChangeAbAttr,
        (pokemon, attacker, move) =>
          pokemon !== attacker && move.hasFlag(MoveFlags.WIND_MOVE) && move.category !== MoveCategory.STATUS,
        Stat.ATK,
        1,
      )
      .attr(PostSummonStatStageChangeOnArenaAbAttr, ArenaTagType.TAILWIND)
      .ignorable(),
    new Ability(Abilities.GUARD_DOG, 9)
      .attr(PostIntimidateStatStageChangeAbAttr, [Stat.ATK], 1, true)
      .attr(ForceSwitchOutImmunityAbAttr)
      .ignorable(),
    new Ability(Abilities.ROCKY_PAYLOAD, 9).attr(MoveTypePowerBoostAbAttr, Type.ROCK),
    new Ability(Abilities.WIND_POWER, 9).attr(
      PostDefendApplyBattlerTagAbAttr,
      (_target, _user, move) => move.hasFlag(MoveFlags.WIND_MOVE),
      BattlerTagType.CHARGED,
    ),
    new Ability(Abilities.ZERO_TO_HERO, 9)
      .attr(UncopiableAbilityAbAttr)
      .attr(UnswappableAbilityAbAttr)
      .attr(UnsuppressableAbilityAbAttr)
      .attr(NoTransformAbilityAbAttr)
      .attr(NoFusionAbilityAbAttr)
      .attr(PostBattleInitFormChangeAbAttr, () => 0)
      .attr(PreSwitchOutFormChangeAbAttr, (pokemon) => (!pokemon.isFainted() ? 1 : pokemon.formIndex))
      .bypassFaint(),
    new Ability(Abilities.COMMANDER, 9)
      .attr(CommanderAbAttr)
      .attr(DoubleBattleChanceAbAttr) // Custom implementation to allow more double battles
      .attr(UncopiableAbilityAbAttr)
      .attr(UnswappableAbilityAbAttr)
      .edgeCase(), // Encore, Frenzy, and other non-`TURN_END` tags don't lapse correctly on the commanding Pokemon.
    new Ability(Abilities.ELECTROMORPHOSIS, 9).attr(
      PostDefendApplyBattlerTagAbAttr,
      (_target, _user, move) => move.category !== MoveCategory.STATUS,
      BattlerTagType.CHARGED,
    ),
    new Ability(Abilities.PROTOSYNTHESIS, 9)
      .conditionalAttr(
        getWeatherCondition(WeatherType.SUNNY, WeatherType.HARSH_SUN),
        PostSummonAddBattlerTagAbAttr,
        BattlerTagType.PROTOSYNTHESIS,
        0,
        true,
      )
      .attr(
        PostWeatherChangeAddBattlerTagAttr,
        BattlerTagType.PROTOSYNTHESIS,
        0,
        WeatherType.SUNNY,
        WeatherType.HARSH_SUN,
      )
      .attr(UncopiableAbilityAbAttr)
      .attr(UnswappableAbilityAbAttr)
      .attr(NoTransformAbilityAbAttr)
      .partial(), // While setting the tag, the getbattlestat should ignore all modifiers to stats except stat stages
    new Ability(Abilities.QUARK_DRIVE, 9)
      .conditionalAttr(
        getTerrainCondition(TerrainType.ELECTRIC),
        PostSummonAddBattlerTagAbAttr,
        BattlerTagType.QUARK_DRIVE,
        0,
        true,
      )
      .attr(PostTerrainChangeAddBattlerTagAttr, BattlerTagType.QUARK_DRIVE, 0, TerrainType.ELECTRIC)
      .attr(UncopiableAbilityAbAttr)
      .attr(UnswappableAbilityAbAttr)
      .attr(NoTransformAbilityAbAttr)
      .partial(), // While setting the tag, the getbattlestat should ignore all modifiers to stats except stat stages
    new Ability(Abilities.GOOD_AS_GOLD, 9)
      .attr(
        MoveImmunityAbAttr,
        (pokemon, attacker, move) => pokemon !== attacker && move.category === MoveCategory.STATUS,
      )
      .ignorable()
      .partial(), // Lots of weird interactions with moves and abilities such as negating status moves that target the field
    new Ability(Abilities.VESSEL_OF_RUIN, 9)
      .attr(FieldMultiplyStatAbAttr, Stat.SPATK, 0.75)
      .attr(PostSummonMessageAbAttr, (user) =>
        i18next.t("abilityTriggers:postSummonVesselOfRuin", {
          pokemonNameWithAffix: getPokemonNameWithAffix(user),
          statName: i18next.t(getStatKey(Stat.SPATK)),
        }),
      )
      .ignorable(),
    new Ability(Abilities.SWORD_OF_RUIN, 9)
      .attr(FieldMultiplyStatAbAttr, Stat.DEF, 0.75)
      .attr(PostSummonMessageAbAttr, (user) =>
        i18next.t("abilityTriggers:postSummonSwordOfRuin", {
          pokemonNameWithAffix: getPokemonNameWithAffix(user),
          statName: i18next.t(getStatKey(Stat.DEF)),
        }),
      ),
    new Ability(Abilities.TABLETS_OF_RUIN, 9)
      .attr(FieldMultiplyStatAbAttr, Stat.ATK, 0.75)
      .attr(PostSummonMessageAbAttr, (user) =>
        i18next.t("abilityTriggers:postSummonTabletsOfRuin", {
          pokemonNameWithAffix: getPokemonNameWithAffix(user),
          statName: i18next.t(getStatKey(Stat.ATK)),
        }),
      )
      .ignorable(),
    new Ability(Abilities.BEADS_OF_RUIN, 9)
      .attr(FieldMultiplyStatAbAttr, Stat.SPDEF, 0.75)
      .attr(PostSummonMessageAbAttr, (user) =>
        i18next.t("abilityTriggers:postSummonBeadsOfRuin", {
          pokemonNameWithAffix: getPokemonNameWithAffix(user),
          statName: i18next.t(getStatKey(Stat.SPDEF)),
        }),
      ),
    new Ability(Abilities.ORICHALCUM_PULSE, 9)
      .attr(PostSummonWeatherChangeAbAttr, WeatherType.SUNNY)
      .attr(PostBiomeChangeWeatherChangeAbAttr, WeatherType.SUNNY)
      .conditionalAttr(
        getWeatherCondition(WeatherType.SUNNY, WeatherType.HARSH_SUN),
        StatMultiplierAbAttr,
        Stat.ATK,
        4 / 3,
      ),
    new Ability(Abilities.HADRON_ENGINE, 9)
      .attr(PostSummonTerrainChangeAbAttr, TerrainType.ELECTRIC)
      .attr(PostBiomeChangeTerrainChangeAbAttr, TerrainType.ELECTRIC)
      .conditionalAttr(getTerrainCondition(TerrainType.ELECTRIC), StatMultiplierAbAttr, Stat.SPATK, 4 / 3),
    new Ability(Abilities.OPPORTUNIST, 9).attr(StatStageChangeCopyAbAttr),
    new Ability(Abilities.CUD_CHEW, 9).unimplemented(),
    new Ability(Abilities.SHARPNESS, 9).attr(
      MovePowerBoostAbAttr,
      (_user, _target, move) => move.hasFlag(MoveFlags.SLICING_MOVE),
      1.5,
    ),
    new Ability(Abilities.SUPREME_OVERLORD, 9)
      .attr(
        VariableMovePowerBoostAbAttr,
        (user, _target, _move) =>
          1
          + 0.1
            * Math.min(
              user.isPlayer() ? globalScene.currentBattle.playerFaints : globalScene.currentBattle.enemyFaints,
              5,
            ),
      )
      .partial(), // Counter resets every wave instead of on arena reset
    new Ability(Abilities.COSTAR, 9).attr(PostSummonCopyAllyStatsAbAttr),
    new Ability(Abilities.TOXIC_DEBRIS, 9)
      .attr(
        PostDefendApplyArenaTrapTagAbAttr,
        (_target, _user, move) => move.category === MoveCategory.PHYSICAL,
        ArenaTagType.TOXIC_SPIKES,
      )
      .bypassFaint(),
    new Ability(Abilities.ARMOR_TAIL, 9).attr(FieldPriorityMoveImmunityAbAttr).ignorable(),
    new Ability(Abilities.EARTH_EATER, 9).attr(TypeImmunityHealAbAttr, Type.GROUND).ignorable(),
    new Ability(Abilities.MYCELIUM_MIGHT, 9)
      .attr(ChangeMovePriorityAbAttr, (_pokemon, move) => move.category === MoveCategory.STATUS, -0.2)
      .attr(PreventBypassSpeedChanceAbAttr, (_pokemon, move) => move.category === MoveCategory.STATUS)
      .attr(MoveAbilityBypassAbAttr, (_pokemon, move: Move) => move.category === MoveCategory.STATUS),
    new Ability(Abilities.MINDS_EYE, 9)
      .attr(IgnoreTypeImmunityAbAttr, Type.GHOST, [Type.NORMAL, Type.FIGHTING])
      .attr(ProtectStatAbAttr, Stat.ACC)
      .attr(IgnoreOpponentStatStagesAbAttr, [Stat.EVA])
      .ignorable(),
    new Ability(Abilities.SUPERSWEET_SYRUP, 9).attr(PostSummonStatStageChangeAbAttr, [Stat.EVA], -1),
    new Ability(Abilities.HOSPITALITY, 9).attr(PostSummonAllyHealAbAttr, 4, true),
    new Ability(Abilities.TOXIC_CHAIN, 9)
      .attr(PostAttackApplyStatusEffectAbAttr, false, 30, StatusEffect.TOXIC)
      .edgeCase(), // Does not inflict poison if user gets inflicted with target's Mummy
    new Ability(Abilities.EMBODY_ASPECT_TEAL, 9)
      .attr(PostBattleInitStatStageChangeAbAttr, [Stat.SPD], 1, true)
      .attr(UncopiableAbilityAbAttr)
      .attr(UnswappableAbilityAbAttr)
      .attr(NoTransformAbilityAbAttr)
      .partial(), // Ogerpon tera interactions
    new Ability(Abilities.EMBODY_ASPECT_WELLSPRING, 9)
      .attr(PostBattleInitStatStageChangeAbAttr, [Stat.SPDEF], 1, true)
      .attr(UncopiableAbilityAbAttr)
      .attr(UnswappableAbilityAbAttr)
      .attr(NoTransformAbilityAbAttr)
      .partial(), // Ogerpon tera interactions
    new Ability(Abilities.EMBODY_ASPECT_HEARTHFLAME, 9)
      .attr(PostBattleInitStatStageChangeAbAttr, [Stat.ATK], 1, true)
      .attr(UncopiableAbilityAbAttr)
      .attr(UnswappableAbilityAbAttr)
      .attr(NoTransformAbilityAbAttr)
      .partial(), // Ogerpon tera interactions
    new Ability(Abilities.EMBODY_ASPECT_CORNERSTONE, 9)
      .attr(PostBattleInitStatStageChangeAbAttr, [Stat.DEF], 1, true)
      .attr(UncopiableAbilityAbAttr)
      .attr(UnswappableAbilityAbAttr)
      .attr(NoTransformAbilityAbAttr)
      .partial(), // Ogerpon tera interactions
    new Ability(Abilities.TERA_SHIFT, 9)
      .attr(PostSummonFormChangeAbAttr, (p) => (p.getFormKey() ? 0 : 1))
      .attr(UncopiableAbilityAbAttr)
      .attr(UnswappableAbilityAbAttr)
      .attr(UnsuppressableAbilityAbAttr)
      .attr(NoTransformAbilityAbAttr)
      .attr(NoFusionAbilityAbAttr),
    new Ability(Abilities.TERA_SHELL, 9)
      .attr(FullHpResistTypeAbAttr)
      .attr(UncopiableAbilityAbAttr)
      .attr(UnswappableAbilityAbAttr)
      .ignorable(),
    new Ability(Abilities.TERAFORM_ZERO, 9)
      .attr(UncopiableAbilityAbAttr)
      .attr(UnswappableAbilityAbAttr)
      .unimplemented(),
    new Ability(Abilities.POISON_PUPPETEER, 9)
      .attr(UncopiableAbilityAbAttr)
      .attr(UnswappableAbilityAbAttr)
      .attr(ConfusionOnStatusEffectAbAttr, StatusEffect.POISON, StatusEffect.TOXIC),
  );
}
