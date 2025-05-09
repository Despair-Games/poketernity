import type { TrainerConfigs } from "#data/trainer-config";
import { championDoubleTrainerConfigs } from "#trainer-configs/champion-double-trainer-configs";
import { championTrainerConfigs } from "#trainer-configs/champion-trainer-configs";
import { eliteFourTrainerConfigs } from "#trainer-configs/elite-four-trainer-configs";
import { evilBossTrainerConfigs } from "#trainer-configs/evil-boss-trainer-configs";
import { evilTeamTrainerConfigs } from "#trainer-configs/evil-team-trainer-configs";
import { genericTrainerConfigs } from "#trainer-configs/generic-trainer-configs";
import { gymLeaderTrainerConfigs } from "#trainer-configs/gym-leader-configs";
import { meTrainerConfigs } from "#trainer-configs/me-trainer-configs";
import { rivalTrainerConfigs } from "#trainer-configs/rival-trainer-configs";

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
