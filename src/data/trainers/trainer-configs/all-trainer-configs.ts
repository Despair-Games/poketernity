import type { TrainerConfigMap } from "#trainers/trainer-config";
import { championTrainerConfigs } from "#trainers/trainer-configs/champion-trainer-configs";
import { eliteFourTrainerConfigs } from "#trainers/trainer-configs/elite-four-trainer-configs";
import { evilBossTrainerConfigs } from "#trainers/trainer-configs/evil-boss-trainer-configs";
import { evilTeamTrainerConfigs } from "#trainers/trainer-configs/evil-team-trainer-configs";
import { genericTrainerConfigs } from "#trainers/trainer-configs/generic-trainer-configs";
import { gymLeaderTrainerConfigs } from "#trainers/trainer-configs/gym-leader-configs";
import { meTrainerConfigs } from "#trainers/trainer-configs/me-trainer-configs";
import { rivalTrainerConfigs } from "#trainers/trainer-configs/rival-trainer-configs";

export const allTrainerConfigs: TrainerConfigMap = {
  ...genericTrainerConfigs,
  ...rivalTrainerConfigs,
  ...gymLeaderTrainerConfigs,
  ...meTrainerConfigs,
  ...evilTeamTrainerConfigs,
  ...evilBossTrainerConfigs,
  ...eliteFourTrainerConfigs,
  ...championTrainerConfigs,
} as const;
