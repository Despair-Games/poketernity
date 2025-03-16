import type { TrainerConfigs } from "#app/data/trainer-config";
import { championTrainerConfigs } from "./champion-trainer-configs";
import { eliteFourTrainerConfigs } from "./elite-four-trainer-configs";
import { evilBossTrainerConfigs } from "./evil-boss-trainer-configs";
import { evilTeamTrainerConfigsConfigs } from "./evil-team-trainer-configs";
import { genericTrainerConfigs } from "./generic-trainer-configs";
import { gymLeaderTrainerConfigs } from "./gym-leader-configs";
import { meTrainerConfigs } from "./me-trainer-configs";
import { rivalTrainerConfigs } from "./rival-trainer-configs";
import { championDoubleTrainerConfigs } from "./champion-double-trainer-configs";
import { gymLeaderDoubleTrainerConfig } from "#app/data/balance/trainer-configs/gym-leader-double-trainer-config";
import { doublePartnerConfigs } from "#app/data/balance/trainer-configs/double-partners-trainer-config";

export const allTrainerConfigs: TrainerConfigs = {
  ...genericTrainerConfigs,
  ...evilTeamTrainerConfigsConfigs,
  ...gymLeaderTrainerConfigs,
  ...gymLeaderDoubleTrainerConfig,
  ...eliteFourTrainerConfigs,
  ...championTrainerConfigs,
  ...championDoubleTrainerConfigs,
  ...rivalTrainerConfigs,
  ...evilBossTrainerConfigs,
  ...meTrainerConfigs,
  ...doublePartnerConfigs,
};
