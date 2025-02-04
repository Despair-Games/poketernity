import { AnticipationAbAttr } from "#app/data/ab-attrs/anticipation-ab-attr";
import { allAbilities } from "#app/data/ability";
import { Abilities } from "#enums/abilities";
import { ElementalType } from "#enums/elemental-type";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Abilities - Anticipation", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;

  beforeAll(() => {
    phaserGame = new Phaser.Game({
      type: Phaser.HEADLESS,
    });
  });

  afterEach(() => {
    game.phaseInterceptor.restoreOg();
  });

  beforeEach(() => {
    game = new GameManager(phaserGame);
    game.override
      .ability(Abilities.ANTICIPATION)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH);
  });

  it("should activate when the opponent has a super-effective move", async () => {
    game.override.enemyMoveset(MoveId.ABSORB);
    const anticipationAbility = allAbilities[Abilities.ANTICIPATION].getAttrs(AnticipationAbAttr)[0];
    vi.spyOn(anticipationAbility, "apply");
    await game.classicMode.startBattle([Species.FEEBAS]);

    expect(anticipationAbility.apply).toHaveLastReturnedWith(true);
  });

  it("should activate when the opponent has a 1HKO move", async () => {
    game.override.enemyMoveset(MoveId.FISSURE);
    const anticipationAbility = allAbilities[Abilities.ANTICIPATION].getAttrs(AnticipationAbAttr)[0];
    vi.spyOn(anticipationAbility, "apply");
    await game.classicMode.startBattle([Species.FEEBAS]);

    expect(anticipationAbility.apply).toHaveLastReturnedWith(true);
  });

  it("should not activate when the opponent does not have a super-effective or 1HKO move", async () => {
    game.override.enemyMoveset(MoveId.SPLASH);
    const anticipationAbility = allAbilities[Abilities.ANTICIPATION].getAttrs(AnticipationAbAttr)[0];
    vi.spyOn(anticipationAbility, "apply");
    await game.classicMode.startBattle([Species.FEEBAS]);

    expect(anticipationAbility.apply).toHaveLastReturnedWith(false);
  });

  it("should consider Hidden Power's calculated type, not its default Normal type", async () => {
    game.override.enemyMoveset(MoveId.HIDDEN_POWER).enemyIVs([31, 31, 31, 30, 31, 31]);
    // Hidden Power type set to Electric here
    const anticipationAbility = allAbilities[Abilities.ANTICIPATION].getAttrs(AnticipationAbAttr)[0];
    vi.spyOn(anticipationAbility, "apply");
    await game.classicMode.startBattle([Species.FEEBAS]);
    const enemyPokemon = game.scene.getEnemyPokemon();
    expect(enemyPokemon?.getMoveType(enemyPokemon.getMoveset()[0].getMove())).toBe(ElementalType.ELECTRIC);
    expect(anticipationAbility.apply).toHaveLastReturnedWith(true);
  });

  it("should not consider most variable-type moves' calculated type", async () => {
    game.override.enemySpecies(Species.PIKACHU).enemyMoveset(MoveId.REVELATION_DANCE);

    const anticipationAbility = allAbilities[Abilities.ANTICIPATION].getAttrs(AnticipationAbAttr)[0];
    vi.spyOn(anticipationAbility, "apply");
    await game.classicMode.startBattle([Species.FEEBAS]);
    const enemyPokemon = game.scene.getEnemyPokemon();

    expect(enemyPokemon?.getMoveType(enemyPokemon.getMoveset()[0].getMove())).toBe(ElementalType.ELECTRIC);
    expect(anticipationAbility.apply).toHaveLastReturnedWith(false);
  });
});
