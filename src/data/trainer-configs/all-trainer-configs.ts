import type { TrainerConfigs } from "#app/data/trainer-config";
import { championTrainerConfigs } from "#app/data/trainer-configs/champion-trainer-configs";
import { eliteFourTrainerConfigs } from "#app/data/trainer-configs/elite-four-trainer-configs";
import { evilBossTrainerConfigs } from "#app/data/trainer-configs/evil-boss-trainer-configs";
import { evilTeamTrainerConfigs } from "#app/data/trainer-configs/evil-team-trainer-configs";
import { genericTrainerConfigs } from "#app/data/trainer-configs/generic-trainer-configs";
import { gymLeaderTrainerConfigs } from "#app/data/trainer-configs/gym-leader-configs";
import { meTrainerConfigs } from "#app/data/trainer-configs/me-trainer-configs";
import { rivalTrainerConfigs } from "#app/data/trainer-configs/rival-trainer-configs";
import { championDoubleTrainerConfigs } from "#app/data/trainer-configs/champion-double-trainer-configs";

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
