import { TrainerType } from "#enums/trainer-type";
import { TrainerConfig } from "#app/data/trainer-config";
import { signatureSpecies } from "#app/data/balance/signatureSpecies";
import { ElementalType } from "#enums/elemental-type";

// This file has all the trainers that only appear as double partners in the game.
// They are initialized as the same type as their doubles partner (SILVER will be GymLeader since he is paired with GIOVANNI GYM)

let t = TrainerType.SILVER;

export const doublePartnerConfigs = {
  [TrainerType.SILVER]: new TrainerConfig(t).initForGymLeader(signatureSpecies["SILVER"], true, ElementalType.NORMAL),
  [TrainerType.MAY]: new TrainerConfig(t++).initForGymLeader(signatureSpecies["MAY"], false, ElementalType.NORMAL),
  [TrainerType.BRENDAN]: new TrainerConfig(t++).initForGymLeader(
    signatureSpecies["BRENDAN"],
    true,
    ElementalType.NORMAL,
  ),
  [TrainerType.BIANCA]: new TrainerConfig(t++).initForGymLeader(
    signatureSpecies["BIANCA"],
    false,
    ElementalType.NORMAL,
  ),
  [TrainerType.SERENA]: new TrainerConfig(t++).initForGymLeader(
    signatureSpecies["SERENA"],
    false,
    ElementalType.NORMAL,
  ),
};
