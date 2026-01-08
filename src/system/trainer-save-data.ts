import type { RequireOneTrainer } from "#data/new-trainer-config";
import { TrainerData, type TrainerDataSet } from "#data/trainer-data";
import type { TrainerGender } from "#enums/trainer-gender";
import type { NonNullTrainerSlot } from "#enums/trainer-slot";
import type { TrainerType } from "#enums/trainer-type";
import { TrainerVariant } from "#enums/trainer-variant";
import { Trainer } from "#field/trainer";
import { allNewTrainerConfigs } from "#trainer-configs/all-trainer-configs";

export class TrainerSaveData {
  public trainerType: TrainerType;
  public variant: TrainerVariant;
  public partyTemplateIndex: number;
  public name: string;
  public partnerName: string;

  constructor(source: Trainer | any) {
    const sourceTrainer = source.type === "Trainer" ? (source as Trainer) : null;
    this.trainerType = sourceTrainer ? sourceTrainer.config.trainerType : source.trainerType;
    if (Object.hasOwn(source, "variant")) {
      this.variant = source.variant;
    } else if (source.female) {
      this.variant = TrainerVariant.FEMALE;
    } else {
      this.variant = TrainerVariant.DEFAULT;
    }
    this.partyTemplateIndex = source.partyMemberTemplateIndex;
    this.name = source.name;
    this.partnerName = source.partnerName;
  }

  toTrainer(): Trainer {
    return new Trainer(this.trainerType, this.variant, this.partyTemplateIndex, this.name, this.partnerName);
  }
}

export class NewTrainerSaveData {
  public readonly trainerSlot: NonNullTrainerSlot;
  public readonly trainerType: TrainerType;
  public readonly gender: TrainerGender;
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
        ...allNewTrainerConfigs[this.trainerType]!,
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
      Object.entries(source.trainerData).map(([key, data]) => [key, new NewTrainerSaveData(data)]),
    ) as RequireOneTrainer<NewTrainerSaveData>;
    this.title = source.title;
  }
}
