import type { TrainerConfigs } from "../../trainer-config";
import { championTrainerConfigs } from "./champion-trainer-configs";
import { eliteFourTrainerConfigs } from "./elite-four-trainer-configs";
import { evilBossTrainerConfigs } from "./evil-boss-trainer-configs";
import { evilTeamTrainerConfigsConfigs } from "./evil-team-trainer-configs";
import { genericTrainerConfigs } from "./generic-trainer-configs";
import { gymLeaderTrainerConfigs } from "./gym-leader-configs";
import { meTrainerConfigs } from "./me-trainer-configs";
import { rivalTrainerConfigs } from "./rival-trainer-configs";
export const allTrainerConfigs: TrainerConfigs = {
  ...genericTrainerConfigs,
  ...evilTeamTrainerConfigsConfigs,
  ...gymLeaderTrainerConfigs,
  ...eliteFourTrainerConfigs,
  ...championTrainerConfigs,
  ...rivalTrainerConfigs,
  ...evilBossTrainerConfigs,
  ...meTrainerConfigs,
};
