// -- start tsdocs imports --
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Phase } from "#app/phase";
import { AttemptCapturePhase } from "#app/phases/attempt-capture-phase";
import { AttemptRunPhase } from "#app/phases/attempt-run-phase";
import { BattleEndPhase } from "#app/phases/battle-end-phase";
import { BerryPhase } from "#app/phases/berry-phase";
import { CheckStatusEffectPhase } from "#app/phases/check-status-effect-phase";
import { CheckSwitchPhase } from "#app/phases/check-switch-phase";
import { CommandPhase } from "#app/phases/command-phase";
import { CommonAnimPhase } from "#app/phases/common-anim-phase";
import { DamageAnimPhase } from "#app/phases/damage-anim-phase";
import { EggHatchPhase } from "#app/phases/egg-hatch-phase";
import { EggLapsePhase } from "#app/phases/egg-lapse-phase";
import { EggSummaryPhase } from "#app/phases/egg-summary-phase";
import { EncounterPhase } from "#app/phases/encounter-phase";
import { EndCardPhase } from "#app/phases/end-card-phase";
import { EndEvolutionPhase } from "#app/phases/end-evolution-phase";
import { EnemyCommandPhase } from "#app/phases/enemy-command-phase";
import { EvolutionPhase } from "#app/phases/evolution-phase";
import { ExpPhase } from "#app/phases/exp-phase";
import { FaintPhase } from "#app/phases/faint-phase";
import { FormChangePhase } from "#app/phases/form-change-phase";
import { GameOverModifierRewardPhase } from "#app/phases/game-over-modifier-reward-phase";
import { GameOverPhase } from "#app/phases/game-over-phase";
import { HitCheckPhase } from "#app/phases/hit-check-phase";
import { LearnMovePhase } from "#app/phases/learn-move-phase";
import { LevelCapPhase } from "#app/phases/level-cap-phase";
import { LevelUpPhase } from "#app/phases/level-up-phase";
import { LoadMoveAnimPhase } from "#app/phases/load-move-anim-phase";
import { LoginPhase } from "#app/phases/login-phase";
import { MessagePhase } from "#app/phases/message-phase";
import { ModifierRewardPhase } from "#app/phases/modifier-reward-phase";
import { MoneyRewardPhase } from "#app/phases/money-reward-phase";
import { MoveAnimPhase } from "#app/phases/move-anim-phase";
import { MoveChargePhase } from "#app/phases/move-charge-phase";
import { MoveEffectPhase } from "#app/phases/move-effect-phase";
import { MoveEndPhase } from "#app/phases/move-end-phase";
import { MoveHeaderPhase } from "#app/phases/move-header-phase";
import { MovePhase } from "#app/phases/move-phase";
import { MysteryEncounterBattlePhase } from "#app/phases/mystery-encounter-phases/battle-phase";
import { MysteryEncounterBattleStartCleanupPhase } from "#app/phases/mystery-encounter-phases/battle-start-cleanup-phase";
import { MysteryEncounterPhase } from "#app/phases/mystery-encounter-phases/mystery-encounter-phase";
import { MysteryEncounterOptionSelectedPhase } from "#app/phases/mystery-encounter-phases/option-selected-phase";
import { PostMysteryEncounterPhase } from "#app/phases/mystery-encounter-phases/post-mystery-encounter-phase";
import { MysteryEncounterRewardsPhase } from "#app/phases/mystery-encounter-phases/rewards-phase";
import { NewBattlePhase } from "#app/phases/new-battle-phase";
import { NewBiomeEncounterPhase } from "#app/phases/new-biome-encounter-phase";
import { NextEncounterPhase } from "#app/phases/next-encounter-phase";
import { ObtainStatusEffectPhase } from "#app/phases/obtain-status-effect-phase";
import { PartyExpPhase } from "#app/phases/party-exp-phase";
import { PartyHealPhase } from "#app/phases/party-heal-phase";
import { PokemonAnimPhase } from "#app/phases/pokemon-anim-phase";
import { PokemonHealPhase } from "#app/phases/pokemon-heal-phase";
import { PokemonTransformPhase } from "#app/phases/pokemon-transform-phase";
import { PostGameOverPhase } from "#app/phases/post-game-over-phase";
import { PostSummonPhase } from "#app/phases/post-summon-phase";
import { PostTurnStatusEffectPhase } from "#app/phases/post-turn-status-effect-phase";
import { QuietFormChangePhase } from "#app/phases/quiet-form-change-phase";
import { ReloadSessionPhase } from "#app/phases/reload-session-phase";
import { ReturnPhase } from "#app/phases/return-phase";
import { RevivalBlessingPhase } from "#app/phases/revival-blessing-phase";
import { RibbonModifierRewardPhase } from "#app/phases/ribbon-modifier-reward-phase";
import { ScanIvsPhase } from "#app/phases/scan-ivs-phase";
import { SelectBiomePhase } from "#app/phases/select-biome-phase";
import { SelectChallengePhase } from "#app/phases/select-challenge-phase";
import { SelectGenderPhase } from "#app/phases/select-gender-phase";
import { SelectModifierPhase } from "#app/phases/select-modifier-phase";
import { SelectStarterPhase } from "#app/phases/select-starter-phase";
import { SelectTargetPhase } from "#app/phases/select-target-phase";
import { ShinySparklePhase } from "#app/phases/shiny-sparkle-phase";
import { ShowAbilityPhase } from "#app/phases/show-ability-phase";
import { ShowPartyExpBarPhase } from "#app/phases/show-party-exp-bar-phase";
import { ShowTrainerPhase } from "#app/phases/show-trainer-phase";
import { StatStageChangePhase } from "#app/phases/stat-stage-change-phase";
import { SummonMissingPhase } from "#app/phases/summon-missing-phase";
import { SummonPhase } from "#app/phases/summon-phase";
import { SwitchBiomePhase } from "#app/phases/switch-biome-phase";
import { SwitchPhase } from "#app/phases/switch-phase";
import { SwitchSummonPhase } from "#app/phases/switch-summon-phase";
import { TerastallizationPhase } from "#app/phases/terastallization-phase";
import { TitlePhase } from "#app/phases/title-phase";
import { ToggleDoublePositionPhase } from "#app/phases/toggle-double-position-phase";
import { TrainerVictoryPhase } from "#app/phases/trainer-victory-phase";
import { TurnEndPhase } from "#app/phases/turn-end-phase";
import { TurnInitPhase } from "#app/phases/turn-init-phase";
import { TurnStartPhase } from "#app/phases/turn-start-phase";
import { UnavailablePhase } from "#app/phases/unavailable-phase";
import { UnlockPhase } from "#app/phases/unlock-phase";
import { VictoryPhase } from "#app/phases/victory-phase";
import { WeatherEffectPhase } from "#app/phases/weather-effect-phase";
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
  /** {@linkcode MoveEndPhase} */
  MOVE_END,
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
  POST_KNOCKOUT,
}
