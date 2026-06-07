import type { TrainerConfigMap } from "#trainers/new-trainer-config";
import type { TrainerConfigs } from "#trainers/trainer-config";
import { championDoubleTrainerConfigs } from "#trainers/trainer-configs/champion-double-trainer-configs";
import { championTrainerConfigs } from "#trainers/trainer-configs/champion-trainer-configs";
import { eliteFourTrainerConfigs } from "#trainers/trainer-configs/elite-four-trainer-configs";
import { evilBossTrainerConfigs } from "#trainers/trainer-configs/evil-boss-trainer-configs";
import { evilTeamTrainerConfigs, newEvilTeamTrainerConfigs } from "#trainers/trainer-configs/evil-team-trainer-configs";
import { genericTrainerConfigs, newGenericTrainerConfigs } from "#trainers/trainer-configs/generic-trainer-configs";
import { gymLeaderTrainerConfigs, newGymLeaderTrainerConfigs } from "#trainers/trainer-configs/gym-leader-configs";
import { meTrainerConfigs, newMeTrainerConfigs } from "#trainers/trainer-configs/me-trainer-configs";
import { newRivalTrainerConfigs, rivalTrainerConfigs } from "#trainers/trainer-configs/rival-trainer-configs";

export const allTrainerConfigs: TrainerConfigs = {
  ...genericTrainerConfigs,
  ...evilTeamTrainerConfigs,
  ...gymLeaderTrainerConfigs,
  ...eliteFourTrainerConfigs,
  ...championTrainerConfigs,
  ...championDoubleTrainerConfigs,
  ...rivalTrainerConfigs,
  ...evilBossTrainerConfigs,
  ...meTrainerConfigs,
};

export const allNewTrainerConfigs: TrainerConfigMap = {
  ...newGenericTrainerConfigs,
  ...newRivalTrainerConfigs,
  ...newGymLeaderTrainerConfigs,
  ...newMeTrainerConfigs,
  ...newEvilTeamTrainerConfigs,
};
