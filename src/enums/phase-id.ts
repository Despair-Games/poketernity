// -- start tsdocs imports --
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Phase } from "#app/phase";
import type { AttemptCapturePhase } from "#app/phases/attempt-capture-phase";
import type { AttemptRunPhase } from "#app/phases/attempt-run-phase";
import type { BattleEndPhase } from "#app/phases/battle-end-phase";
import type { BerryPhase } from "#app/phases/berry-phase";
import type { CheckStatusEffectPhase } from "#app/phases/check-status-effect-phase";
import type { CheckSwitchPhase } from "#app/phases/check-switch-phase";
import type { CommandPhase } from "#app/phases/command-phase";
import type { CommonAnimPhase } from "#app/phases/common-anim-phase";
import type { DamageAnimPhase } from "#app/phases/damage-anim-phase";
import type { EggHatchPhase } from "#app/phases/egg-hatch-phase";
import type { EggLapsePhase } from "#app/phases/egg-lapse-phase";
import type { EggSummaryPhase } from "#app/phases/egg-summary-phase";
import type { EncounterPhase } from "#app/phases/encounter-phase";
import type { EndCardPhase } from "#app/phases/end-card-phase";
import type { EndEvolutionPhase } from "#app/phases/end-evolution-phase";
import type { EnemyCommandPhase } from "#app/phases/enemy-command-phase";
import type { EvolutionPhase } from "#app/phases/evolution-phase";
import type { ExpPhase } from "#app/phases/exp-phase";
import type { FaintPhase } from "#app/phases/faint-phase";
import type { FormChangePhase } from "#app/phases/form-change-phase";
import type { GameOverModifierRewardPhase } from "#app/phases/game-over-modifier-reward-phase";
import type { GameOverPhase } from "#app/phases/game-over-phase";
import type { HitCheckPhase } from "#app/phases/hit-check-phase";
import type { LearnMovePhase } from "#app/phases/learn-move-phase";
import type { LevelCapPhase } from "#app/phases/level-cap-phase";
import type { LevelUpPhase } from "#app/phases/level-up-phase";
import type { LoadMoveAnimPhase } from "#app/phases/load-move-anim-phase";
import type { LoginPhase } from "#app/phases/login-phase";
import type { MessagePhase } from "#app/phases/message-phase";
import type { ModifierRewardPhase } from "#app/phases/modifier-reward-phase";
import type { MoneyRewardPhase } from "#app/phases/money-reward-phase";
import type { MoveAnimPhase } from "#app/phases/move-anim-phase";
import type { MoveChargePhase } from "#app/phases/move-charge-phase";
import type { MoveEffectPhase } from "#app/phases/move-effect-phase";
import type { MoveHeaderPhase } from "#app/phases/move-header-phase";
import type { MovePhase } from "#app/phases/move-phase";
import type { MysteryEncounterBattlePhase } from "#app/phases/mystery-encounter-phases/battle-phase";
import type { MysteryEncounterBattleStartCleanupPhase } from "#app/phases/mystery-encounter-phases/battle-start-cleanup-phase";
import type { MysteryEncounterPhase } from "#app/phases/mystery-encounter-phases/mystery-encounter-phase";
import type { MysteryEncounterOptionSelectedPhase } from "#app/phases/mystery-encounter-phases/option-selected-phase";
import type { PostActionPhase } from "#app/phases/post-action-phase";
import type { PostMysteryEncounterPhase } from "#app/phases/mystery-encounter-phases/post-mystery-encounter-phase";
import type { MysteryEncounterRewardsPhase } from "#app/phases/mystery-encounter-phases/rewards-phase";
import type { NewBattlePhase } from "#app/phases/new-battle-phase";
import type { NewBiomeEncounterPhase } from "#app/phases/new-biome-encounter-phase";
import type { NextEncounterPhase } from "#app/phases/next-encounter-phase";
import type { ObtainStatusEffectPhase } from "#app/phases/obtain-status-effect-phase";
import type { PartyExpPhase } from "#app/phases/party-exp-phase";
import type { PartyHealPhase } from "#app/phases/party-heal-phase";
import type { PokemonAnimPhase } from "#app/phases/pokemon-anim-phase";
import type { PokemonHealPhase } from "#app/phases/pokemon-heal-phase";
import type { PokemonTransformPhase } from "#app/phases/pokemon-transform-phase";
import type { PostGameOverPhase } from "#app/phases/post-game-over-phase";
import type { PostKnockoutPhase } from "#app/phases/post-knockout-phase";
import type { PostSummonPhase } from "#app/phases/post-summon-phase";
import type { PostTurnStatusEffectPhase } from "#app/phases/post-turn-status-effect-phase";
import type { QuietFormChangePhase } from "#app/phases/quiet-form-change-phase";
import type { ReloadSessionPhase } from "#app/phases/reload-session-phase";
import type { ReturnPhase } from "#app/phases/return-phase";
import type { RevivalBlessingPhase } from "#app/phases/revival-blessing-phase";
import type { RibbonModifierRewardPhase } from "#app/phases/ribbon-modifier-reward-phase";
import type { ScanIvsPhase } from "#app/phases/scan-ivs-phase";
import type { SelectBiomePhase } from "#app/phases/select-biome-phase";
import type { SelectChallengePhase } from "#app/phases/select-challenge-phase";
import type { SelectGenderPhase } from "#app/phases/select-gender-phase";
import type { SelectModifierPhase } from "#app/phases/select-modifier-phase";
import type { SelectStarterPhase } from "#app/phases/select-starter-phase";
import type { SelectTargetPhase } from "#app/phases/select-target-phase";
import type { ShinySparklePhase } from "#app/phases/shiny-sparkle-phase";
import type { ShowAbilityPhase } from "#app/phases/show-ability-phase";
import type { ShowPartyExpBarPhase } from "#app/phases/show-party-exp-bar-phase";
import type { ShowTrainerPhase } from "#app/phases/show-trainer-phase";
import type { StatStageChangePhase } from "#app/phases/stat-stage-change-phase";
import type { SummonMissingPhase } from "#app/phases/summon-missing-phase";
import type { SummonPhase } from "#app/phases/summon-phase";
import type { SwitchBiomePhase } from "#app/phases/switch-biome-phase";
import type { SwitchPhase } from "#app/phases/switch-phase";
import type { SwitchSummonPhase } from "#app/phases/switch-summon-phase";
import type { TerastallizationPhase } from "#app/phases/terastallization-phase";
import type { TitlePhase } from "#app/phases/title-phase";
import type { ToggleDoublePositionPhase } from "#app/phases/toggle-double-position-phase";
import type { TrainerVictoryPhase } from "#app/phases/trainer-victory-phase";
import type { TurnEndPhase } from "#app/phases/turn-end-phase";
import type { TurnInitPhase } from "#app/phases/turn-init-phase";
import type { TurnStartPhase } from "#app/phases/turn-start-phase";
import type { UnavailablePhase } from "#app/phases/unavailable-phase";
import type { UnlockPhase } from "#app/phases/unlock-phase";
import type { VictoryPhase } from "#app/phases/victory-phase";
import type { WeatherEffectPhase } from "#app/phases/weather-effect-phase";
/* eslint-enable @typescript-eslint/no-unused-vars */
// -- end tsdoc imports --

export enum PhaseId {
  /** {@linkcode AttemptCapturePhase} */
  ATTEMPT_CAPTURE,
  /** {@linkcode AttemptRunPhase} */
  ATTEMPT_RUN,
  /** {@linkcode BattleEndPhase} */
  BATTLE_END,
  /** {@linkcode BerryPhase} */
  BERRY,
  /** {@linkcode CheckStatusEffectPhase} */
  CHECK_STATUS_EFFECT,
  /** {@linkcode CheckSwitchPhase} */
  CHECK_SWITCH,
  /** {@linkcode CommandPhase} */
  COMMAND,
  /** {@linkcode CommonAnimPhase} */
  COMMON_ANIM,
  /** {@linkcode DamageAnimPhase} */
  DAMAGE_ANIM,
  /** {@linkcode EggHatchPhase} */
  EGG_HATCH,
  /** {@linkcode EggLapsePhase} */
  EGG_LAPSE,
  /** {@linkcode EggSummaryPhase} */
  EGG_SUMMARY,
  /** {@linkcode EncounterPhase} */
  ENCOUNTER,
  /** {@linkcode EndCardPhase} */
  END_CARD,
  /** {@linkcode EndEvolutionPhase} */
  END_EVOLUTION,
  /** {@linkcode EnemyCommandPhase} */
  ENEMY_COMMAND,
  /** {@linkcode EvolutionPhase} */
  EVOLUTION,
  /** {@linkcode ExpPhase} */
  EXP,
  /** {@linkcode FaintPhase} */
  FAINT,
  /** {@linkcode FormChangePhase} */
  FORM_CHANGE,
  /** {@linkcode GameOverPhase} */
  GAME_OVER,
  /** {@linkcode GameOverModifierRewardPhase} */
  GAME_OVER_MODIFIER_REWARD,
  /** {@linkcode HitCheckPhase} */
  HIT_CHECK,
  /** {@linkcode LearnMovePhase} */
  LEARN_MOVE,
  /** {@linkcode LevelCapPhase} */
  LEVEL_CAP,
  /** {@linkcode LevelUpPhase} */
  LEVEL_UP,
  /** {@linkcode LoadMoveAnimPhase} */
  LOAD_MOVE_ANIM,
  /** {@linkcode LoginPhase} */
  LOGIN,
  /** {@linkcode MessagePhase} */
  MESSAGE,
  /** {@linkcode MysteryEncounterBattlePhase} */
  ME_BATTLE,
  /** {@linkcode MysteryEncounterBattleStartCleanupPhase} */
  ME_BATTLE_START_CLEANUP,
  /** {@linkcode MysteryEncounterPhase} */
  ME_ENCOUNTER,
  /** {@linkcode MysteryEncounterOptionSelectedPhase} */
  ME_OPTION_SELECTED,
  /** {@linkcode PostMysteryEncounterPhase} */
  ME_POST,
  /** {@linkcode MysteryEncounterRewardsPhase} */
  ME_REWARDS,
  /** {@linkcode ModifierRewardPhase} */
  MODIFIER_REWARD,
  /** {@linkcode MoneyRewardPhase} */
  MONEY_REWARD,
  /** {@linkcode MovePhase} */
  MOVE,
  /** {@linkcode MoveAnimPhase} */
  MOVE_ANIM,
  /** {@linkcode MoveChargePhase} */
  MOVE_CHARGE,
  /** {@linkcode MoveEffectPhase} */
  MOVE_EFFECT,
  /** {@linkcode PostActionPhase} */
  POST_ACTION,
  /** {@linkcode MoveHeaderPhase} */
  MOVE_HEADER,
  /** {@linkcode NewBattlePhase} */
  NEW_BATTLE,
  /** {@linkcode NewBiomeEncounterPhase} */
  NEW_BIOME_ENCOUNTER,
  /** {@linkcode NextEncounterPhase} */
  NEXT_ENCOUNTER,
  /** {@linkcode ObtainStatusEffectPhase} */
  OBTAIN_STATUS_EFFECT,
  /** {@linkcode PartyExpPhase} */
  PARTY_EXP,
  /** {@linkcode PartyHealPhase} */
  PARTY_HEAL,
  /** {@linkcode PokemonAnimPhase} */
  POKEMON_ANIM,
  /** {@linkcode PokemonHealPhase} */
  POKEMON_HEAL,
  /** {@linkcode PokemonTransformPhase} */
  POKEMON_TRANSFORM,
  /** {@linkcode PostGameOverPhase} */
  POST_GAME_OVER,
  /** {@linkcode PostKnockoutPhase} */
  POST_KNOCKOUT,
  /** {@linkcode PostSummonPhase} */
  POST_SUMMON,
  /** {@linkcode PostTurnStatusEffectPhase} */
  POST_TURN_STATUS_EFFECT,
  /** {@linkcode QuietFormChangePhase} */
  QUIET_FORM_CHANGE,
  /** {@linkcode ReloadSessionPhase} */
  RELOAD_SESSION,
  /** {@linkcode ReturnPhase} */
  RETURN,
  /** {@linkcode RevivalBlessingPhase} */
  REVIVAL_BLESSING,
  /** {@linkcode RibbonModifierRewardPhase} */
  RIBBON_MODIFIER_REWARD,
  /** {@linkcode ScanIvsPhase} */
  SCAN_IVS,
  /** {@linkcode SelectBiomePhase} */
  SELECT_BIOME,
  /** {@linkcode SelectChallengePhase} */
  SELECT_CHALLENGE,
  /** {@linkcode SelectGenderPhase} */
  SELECT_GENDER,
  /** {@linkcode SelectModifierPhase} */
  SELECT_MODIFIER,
  /** {@linkcode SelectStarterPhase} */
  SELECT_STARTER,
  /** {@linkcode SelectTargetPhase} */
  SELECT_TARGET,
  /** {@linkcode ShinySparklePhase} */
  SHINY_SPARKLE,
  /** {@linkcode ShowAbilityPhase} */
  SHOW_ABILITY,
  /** {@linkcode ShowPartyExpBarPhase} */
  SHOW_PARTY_EXP_BAR,
  /** {@linkcode ShowTrainerPhase} */
  SHOW_TRAINER,
  /** {@linkcode StatStageChangePhase} */
  STAT_STAGE_CHANGE,
  /** {@linkcode SummonPhase} */
  SUMMON,
  /** {@linkcode SummonMissingPhase} */
  SUMMON_MISSING,
  /** {@linkcode SwitchPhase} */
  SWITCH,
  /** {@linkcode SwitchBiomePhase} */
  SWITCH_BIOME,
  /** {@linkcode SwitchSummonPhase} */
  SWITCH_SUMMON,
  /** {@linkcode TerastallizationPhase} */
  TERASTALLIZATION,
  /** {@linkcode TitlePhase} */
  TITLE,
  /** {@linkcode ToggleDoublePositionPhase} */
  TOGGLE_DOUBLE_POSITION,
  /** {@linkcode TrainerVictoryPhase} */
  TRAINER_VICTORY,
  /** {@linkcode TurnEndPhase} */
  TURN_END,
  /** {@linkcode TurnInitPhase} */
  TURN_INIT,
  /** {@linkcode TurnStartPhase} */
  TURN_START,
  /** {@linkcode UnavailablePhase} */
  UNAVAILABLE,
  /** {@linkcode UnlockPhase} */
  UNLOCK,
  /** {@linkcode Phase} */
  UNSPECIFIED,
  /** {@linkcode VictoryPhase} */
  VICTORY,
  /** {@linkcode WeatherEffectPhase} */
  WEATHER_EFFECT,
}
