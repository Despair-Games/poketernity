import type { NonDefaultTrainerGender } from "#enums/trainer-gender";
import type { NonNullTrainerSlot } from "#enums/trainer-slot";
import type { TrainerType } from "#enums/trainer-type";
import type { RequireOneTrainer } from "#trainers/trainer-config";
import { allTrainerConfigs } from "#trainers/trainer-configs/all-trainer-configs";
import { TrainerData, TrainerDataSet } from "#trainers/trainer-data";

export class NewTrainerSaveData {
  public readonly trainerSlot: NonNullTrainerSlot;
  public readonly trainerType: TrainerType;
  public readonly gender: NonDefaultTrainerGender;
  public readonly name: string;
  public readonly title: string;
  public readonly spriteKey: string;
  public readonly dialogueSpriteKey?: string;

  // TODO: save data classes usually allow for `any` to accommodate for
  // deserialized JSON objects. We should find a better way to do that here...
  constructor(source: TrainerData) {
    this.trainerSlot = source.trainerSlot;
    this.trainerType = source.trainerType;
    this.gender = source.gender;
    this.name = source.name;
    this.title = source.title;
    this.spriteKey = source.spriteKey;
    this.dialogueSpriteKey = source.dialogueSpriteKey;
  }

  public toTrainerData(): TrainerData {
    return new TrainerData(
      this.trainerSlot,
      {
        // TODO: Make `allNewTrainerConfigs` `Required` and remove this bang
        ...allTrainerConfigs[this.trainerType]!,
        name: { [this.gender]: () => this.name },
        title: { [this.gender]: () => this.title },
        spriteKey: { [this.gender]: () => this.spriteKey },
        dialogueSpriteKey: { [this.gender]: () => this.dialogueSpriteKey },
      },
      this.gender,
    );
  }
}

export class TrainerSaveDataSet {
  public readonly trainerSaveData: RequireOneTrainer<NewTrainerSaveData>;
  public readonly title: string;

  constructor(source: TrainerDataSet) {
    // TODO: is this type-safe?
    this.trainerSaveData = Object.fromEntries(
      Object.entries(source.trainers).map(([key, data]) => [key, new NewTrainerSaveData(data)]),
    ) as RequireOneTrainer<NewTrainerSaveData>;
    this.title = source.title;
  }

  public toTrainerData(): TrainerDataSet {
    return new TrainerDataSet(this);
  }
}
