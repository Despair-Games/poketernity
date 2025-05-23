import type { TrainerType } from "#enums/trainer-type";
import { TrainerVariant } from "#enums/trainer-variant";
import Trainer from "#field/trainer";

export default class TrainerData {
  public trainerType: TrainerType;
  public variant: TrainerVariant;
  public partyTemplateIndex: number;
  public name: string;
  public partnerName: string;

  constructor(source: Trainer | any) {
    const sourceTrainer = source.type === "Trainer" ? (source as Trainer) : null;
    this.trainerType = sourceTrainer ? sourceTrainer.config.trainerType : source.trainerType;
    this.variant = Object.hasOwn(source, "variant")
      ? source.variant
      : source.female
        ? TrainerVariant.FEMALE
        : TrainerVariant.DEFAULT;
    this.partyTemplateIndex = source.partyMemberTemplateIndex;
    this.name = source.name;
    this.partnerName = source.partnerName;
  }

  toTrainer(): Trainer {
    return new Trainer(this.trainerType, this.variant, this.partyTemplateIndex, this.name, this.partnerName);
  }
}
