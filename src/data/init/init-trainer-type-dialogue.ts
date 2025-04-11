import { allTrainerConfigs } from "#app/data/trainer-configs/all-trainer-configs";
import { trainerTypeDialogue } from "#app/data/dialogue";
import type { TrainerType } from "#enums/trainer-type";

export function initTrainerTypeDialogue(): void {
  const trainerTypes = Object.keys(trainerTypeDialogue).map((t) => parseInt(t) as TrainerType);
  for (const trainerType of trainerTypes) {
    const messages = trainerTypeDialogue[trainerType];
    const messageTypes = ["encounter", "victory", "defeat"];
    for (const messageType of messageTypes) {
      if (Array.isArray(messages)) {
        if (messages[0][messageType]) {
          allTrainerConfigs[trainerType][`${messageType}Messages`] = messages[0][messageType];
        }
        if (messages.length > 1) {
          const femaleMessageKey = `female${messageType.slice(0, 1).toUpperCase()}${messageType.slice(1)}Messages`;
          allTrainerConfigs[trainerType][femaleMessageKey] = messages[1][messageType];
        }
      } else {
        allTrainerConfigs[trainerType][`${messageType}Messages`] = messages[messageType];
      }
    }
  }
}
