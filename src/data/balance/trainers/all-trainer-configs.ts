import { TrainerConfigs } from "#app/data/trainer-config";
import { championTrainerConfigs } from "./champion-trainer-config";
import { eliteFourTrainerConfigs } from "./elite-four-trainer-config";
import { evilBossTrainerConfigs } from "./evil-boss-trainer-config";
import { evilTeamTrainerConfigs } from "./evil-team-trainer-config";
import { genericTrainerConfigs } from "./generic-trainer-config";
import { gymLeaderTrainerConfigs } from "./gym-leader-trainer-config";
import { mysteryEncounterTrainerConfigs } from "./mystery-encounter-trainer-config";
import { rivalTrainerConfigs } from "./rival-trainer-config";

export const trainerConfigs: TrainerConfigs = {
  ...genericTrainerConfigs,
  ...evilTeamTrainerConfigs,
  ...gymLeaderTrainerConfigs,
  ...eliteFourTrainerConfigs,
  ...championTrainerConfigs,
  ...rivalTrainerConfigs,
  ...evilBossTrainerConfigs,
  ...mysteryEncounterTrainerConfigs,
};
