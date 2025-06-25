// -- start tsdocs imports --
/* biome-ignore-start lint/correctness/noUnusedImports: tsdoc imports */
import type { Phase } from "#app/phase";
import type { AttemptCapturePhase } from "#phases/attempt-capture-phase";
import type { AttemptRunPhase } from "#phases/attempt-run-phase";
import type { BattleEndPhase } from "#phases/battle-end-phase";
import type { BerryPhase } from "#phases/berry-phase";
import type { CheckStatusEffectPhase } from "#phases/check-status-effect-phase";
import type { CheckSwitchPhase } from "#phases/check-switch-phase";
import type { CommandPhase } from "#phases/command-phase";
import type { CommonAnimPhase } from "#phases/common-anim-phase";
import type { DamageAnimPhase } from "#phases/damage-anim-phase";
import type { EggHatchPhase } from "#phases/egg-hatch-phase";
import type { EggLapsePhase } from "#phases/egg-lapse-phase";
import type { EggSummaryPhase } from "#phases/egg-summary-phase";
import type { EncounterPhase } from "#phases/encounter-phase";
import type { EndCardPhase } from "#phases/end-card-phase";
import type { EndEvolutionPhase } from "#phases/end-evolution-phase";
import type { EnemyCommandPhase } from "#phases/enemy-command-phase";
import type { EvolutionPhase } from "#phases/evolution-phase";
import type { ExpPhase } from "#phases/exp-phase";
import type { FaintPhase } from "#phases/faint-phase";
import type { FormChangePhase } from "#phases/form-change-phase";
import type { GameOverModifierRewardPhase } from "#phases/game-over-modifier-reward-phase";
import type { GameOverPhase } from "#phases/game-over-phase";
import type { HitCheckPhase } from "#phases/hit-check-phase";
import type { LearnMovePhase } from "#phases/learn-move-phase";
import type { LevelCapPhase } from "#phases/level-cap-phase";
import type { LevelUpPhase } from "#phases/level-up-phase";
import type { LoadMoveAnimPhase } from "#phases/load-move-anim-phase";
import type { LoginPhase } from "#phases/login-phase";
import type { MessagePhase } from "#phases/message-phase";
import type { ModifierRewardPhase } from "#phases/modifier-reward-phase";
import type { MoneyRewardPhase } from "#phases/money-reward-phase";
import type { MoveAnimPhase } from "#phases/move-anim-phase";
import type { MoveChargePhase } from "#phases/move-charge-phase";
import type { MoveEffectPhase } from "#phases/move-effect-phase";
import type { MoveHeaderPhase } from "#phases/move-header-phase";
import type { MovePhase } from "#phases/move-phase";
import type { MysteryEncounterBattlePhase } from "#phases/mystery-encounter-phases/battle-phase";
import type { MysteryEncounterBattleStartCleanupPhase } from "#phases/mystery-encounter-phases/battle-start-cleanup-phase";
import type { MysteryEncounterPhase } from "#phases/mystery-encounter-phases/mystery-encounter-phase";
import type { MysteryEncounterOptionSelectedPhase } from "#phases/mystery-encounter-phases/option-selected-phase";
import type { PostMysteryEncounterPhase } from "#phases/mystery-encounter-phases/post-mystery-encounter-phase";
import type { MysteryEncounterRewardsPhase } from "#phases/mystery-encounter-phases/rewards-phase";
import type { NewBattlePhase } from "#phases/new-battle-phase";
import type { NewBiomeEncounterPhase } from "#phases/new-biome-encounter-phase";
import type { NextEncounterPhase } from "#phases/next-encounter-phase";
import type { ObtainStatusEffectPhase } from "#phases/obtain-status-effect-phase";
import type { PartyExpPhase } from "#phases/party-exp-phase";
import type { PartyHealPhase } from "#phases/party-heal-phase";
import type { PokemonAnimPhase } from "#phases/pokemon-anim-phase";
import type { PokemonHealPhase } from "#phases/pokemon-heal-phase";
import type { PokemonTransformPhase } from "#phases/pokemon-transform-phase";
import type { PostActionPhase } from "#phases/post-action-phase";
import type { PostGameOverPhase } from "#phases/post-game-over-phase";
import type { PostKnockoutPhase } from "#phases/post-knockout-phase";
import type { PostSummonPhase } from "#phases/post-summon-phase";
import type { PostTurnStatusEffectPhase } from "#phases/post-turn-status-effect-phase";
import type { QuietFormChangePhase } from "#phases/quiet-form-change-phase";
import type { ReloadSessionPhase } from "#phases/reload-session-phase";
import type { ReturnPhase } from "#phases/return-phase";
import type { RevivalBlessingPhase } from "#phases/revival-blessing-phase";
import type { RibbonModifierRewardPhase } from "#phases/ribbon-modifier-reward-phase";
import type { ScanIvsPhase } from "#phases/scan-ivs-phase";
import type { SelectBiomePhase } from "#phases/select-biome-phase";
import type { SelectChallengePhase } from "#phases/select-challenge-phase";
import type { SelectGenderPhase } from "#phases/select-gender-phase";
import type { SelectModifierPhase } from "#phases/select-modifier-phase";
import type { SelectStarterPhase } from "#phases/select-starter-phase";
import type { SelectTargetPhase } from "#phases/select-target-phase";
import type { ShinySparklePhase } from "#phases/shiny-sparkle-phase";
import type { ShowAbilityPhase } from "#phases/show-ability-phase";
import type { ShowPartyExpBarPhase } from "#phases/show-party-exp-bar-phase";
import type { ShowTrainerPhase } from "#phases/show-trainer-phase";
import type { StatStageChangePhase } from "#phases/stat-stage-change-phase";
import type { SummonMissingPhase } from "#phases/summon-missing-phase";
import type { SummonPhase } from "#phases/summon-phase";
import type { SwitchBiomePhase } from "#phases/switch-biome-phase";
import type { SwitchPhase } from "#phases/switch-phase";
import type { SwitchSummonPhase } from "#phases/switch-summon-phase";
import type { TerastallizationPhase } from "#phases/terastallization-phase";
import type { TitlePhase } from "#phases/title-phase";
import type { ToggleDoublePositionPhase } from "#phases/toggle-double-position-phase";
import type { TrainerVictoryPhase } from "#phases/trainer-victory-phase";
import type { TurnEndPhase } from "#phases/turn-end-phase";
import type { TurnInitPhase } from "#phases/turn-init-phase";
import type { TurnStartPhase } from "#phases/turn-start-phase";
import type { UnavailablePhase } from "#phases/unavailable-phase";
import type { UnlockPhase } from "#phases/unlock-phase";
import type { VictoryPhase } from "#phases/victory-phase";
import type { WeatherEffectPhase } from "#phases/weather-effect-phase";
/* biome-ignore-end lint/correctness/noUnusedImports: tsdoc imports */
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
