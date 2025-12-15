import { TrainerConfigBuilder } from "#data/trainer-config-builder";
import { SpeciesId } from "#enums/species-id";
import { TrainerGender } from "#enums/trainer-gender";
import { TrainerType } from "#enums/trainer-type";
import { afterEach, describe, expect, it } from "vitest";

let trainerConfigBuilder = new TrainerConfigBuilder();

describe("TrainerConfigBuilder - Validation", () => {
  afterEach(() => {
    trainerConfigBuilder = new TrainerConfigBuilder();
  });

  it("should throw an error if no properties are defined", () => {
    expect(() => trainerConfigBuilder.build()).toThrowError();
  });

  it("should not throw an error if all properties are properly defined", () => {
    // NOTE: The builder validation assumes that any given string input leads to a
    // valid i18n key, path, etc.
    trainerConfigBuilder
      .withTrainerType(TrainerType.RIVAL)
      .withFixedName("finn", TrainerGender.MALE)
      .withFixedName("ivy", TrainerGender.FEMALE)
      .withTitle("rival")
      .withSpriteKey("rival", TrainerGender.MALE)
      .withSpriteKey("rival_female", TrainerGender.FEMALE)
      .withEncounterBgm(TrainerType.RIVAL)
      .withBattleBgm(TrainerType.RIVAL)
      .withVictoryBgm(TrainerType.RIVAL)
      .asBoss()
      .withPokemon(SpeciesId.MAGIKARP, { nickname: "Gary" })
      .withMoneyMultiplier(2);

    expect(() => trainerConfigBuilder.build()).not.toThrowError();
  });

  it("should throw an error if a property is not defined for a supported gender", () => {
    trainerConfigBuilder
      .withTrainerType(TrainerType.RIVAL)
      .withFixedName("finn", TrainerGender.MALE)
      .withFixedName("ivy", TrainerGender.FEMALE)
      .withTitle("rival")
      .withSpriteKey("rival", TrainerGender.MALE)
      // .withSpriteKey("rival_female", TrainerGender.FEMALE)
      .withEncounterBgm(TrainerType.RIVAL)
      .withBattleBgm(TrainerType.RIVAL)
      .withVictoryBgm(TrainerType.RIVAL)
      .asBoss()
      .withPokemon(SpeciesId.MAGIKARP, { nickname: "Gary" })
      .withMoneyMultiplier(2);

    // Since a female name was set, and a female sprite key wasn't, the built config should be invalid
    expect(() => trainerConfigBuilder.build()).toThrowError();
  });

  it("should not throw an error if omitted properties have a default value", () => {
    trainerConfigBuilder
      .withTrainerType(TrainerType.RIVAL)
      .withFixedName("finn", TrainerGender.MALE)
      .withFixedName("ivy", TrainerGender.FEMALE)
      .withTitle("rival")
      .withSpriteKey("rival")
      .withEncounterBgm(TrainerType.RIVAL)
      .withPokemon(SpeciesId.MAGIKARP, { nickname: "Gary" });

    expect(() => trainerConfigBuilder.build()).not.toThrowError();
  });

  it("should throw an error if the config doesn't have any party Pokemon", () => {
    trainerConfigBuilder
      .withTrainerType(TrainerType.RIVAL)
      .withFixedName("finn", TrainerGender.MALE)
      .withFixedName("ivy", TrainerGender.FEMALE)
      .withTitle("rival")
      .withSpriteKey("rival", TrainerGender.MALE)
      .withSpriteKey("rival_female", TrainerGender.FEMALE)
      .withEncounterBgm(TrainerType.RIVAL)
      .withBattleBgm(TrainerType.RIVAL)
      .withVictoryBgm(TrainerType.RIVAL)
      .asBoss()
      .withMoneyMultiplier(2);

    // Gary the Magikarp is missing :(
    expect(() => trainerConfigBuilder.build()).toThrowError();
  });

  it("should throw an error if the config has more than 6 party Pokemon", () => {
    trainerConfigBuilder
      .withTrainerType(TrainerType.RIVAL)
      .withFixedName("finn", TrainerGender.MALE)
      .withFixedName("ivy", TrainerGender.FEMALE)
      .withTitle("rival")
      .withSpriteKey("rival", TrainerGender.MALE)
      .withSpriteKey("rival_female", TrainerGender.FEMALE)
      .withEncounterBgm(TrainerType.RIVAL)
      .withBattleBgm(TrainerType.RIVAL)
      .withVictoryBgm(TrainerType.RIVAL)
      .asBoss()
      .withPokemon(SpeciesId.MAGIKARP, { count: 7 })
      .withMoneyMultiplier(2);

    expect(() => trainerConfigBuilder.build()).toThrowError();
  });
});
