import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { Stat } from "#enums/stat";
import { GameManager } from "#test/test-utils/game-manager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Abilities - Rattled", () => {
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
      .ability(AbilityId.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.RATTLED)
      .enemyMoveset(MoveId.SPLASH)
      .startingLevel(100)
      .enemyLevel(100);
  });

  it.each([
    { typeName: "Dark", moveId: MoveId.BITE },
    { typeName: "Bug", moveId: MoveId.BUG_BITE },
    { typeName: "Ghost", moveId: MoveId.ASTONISH },
  ])("should increase the source's Speed by 1 stage when hit by a $typeName-type move", async ({ moveId }) => {
    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    const enemy = game.field.getEnemyPokemon();

    game.move.use(moveId);
    await game.toEndOfTurn();

    expect(enemy.getStatStage(Stat.SPD)).toBe(1);
  });

  it("should not increase the source's Speed when hit by a Normal-type move", async () => {
    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    const enemy = game.field.getEnemyPokemon();

    game.move.use(MoveId.TACKLE);
    await game.toEndOfTurn();

    expect(enemy.getStatStage(Stat.SPD)).toBe(0);
  });

  it("should not increase the source's Speed from moves that have no effect", async () => {
    game.override.enemySpecies(SpeciesId.SNORLAX);

    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    const enemy = game.field.getEnemyPokemon();

    game.move.use(MoveId.ASTONISH);
    await game.toEndOfTurn();

    expect(enemy.getStatStage(Stat.SPD)).toBe(0);
  });

  it("should increase the source's Speed by 1 stage for each hit of Beat Up", async () => {
    await game.classicMode.startBattle(SpeciesId.MAGIKARP, SpeciesId.FEEBAS, SpeciesId.GOLDEEN);

    const enemy = game.field.getEnemyPokemon();

    game.move.use(MoveId.BEAT_UP);
    await game.toEndOfTurn();

    expect(enemy.getStatStage(Stat.SPD)).toBe(3);
  });

  it("should increase the source's Speed after the source is Intimidated", async () => {
    game.override.ability(AbilityId.INTIMIDATE);

    await game.classicMode.startBattle(SpeciesId.MAGIKARP, SpeciesId.FEEBAS);

    const enemy = game.field.getEnemyPokemon();

    // Rattled should have activated before the turn starts due to the player Magikarp's Intimidate
    expect(enemy.getStatStage(Stat.SPD)).toBe(1);

    game.switchPokemon(1);

    // advance to before the enemy makes a move
    await game.phaseInterceptor.to("MovePhase", false);

    // Rattled should activate again after the player Feebas with Intimidate enters the field
    expect(enemy.getStatStage(Stat.SPD)).toBe(2);
  });

  it("should not increase the source's Speed if the source's substitute blocks Intimidate", async () => {
    game.override.ability(AbilityId.INTIMIDATE).enemyMoveset(MoveId.SUBSTITUTE);

    await game.classicMode.startBattle(SpeciesId.MAGIKARP, SpeciesId.FEEBAS);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy.getStatStage(Stat.SPD)).toBe(1);

    game.move.use(MoveId.SPLASH);
    await game.toNextTurn();

    game.switchPokemon(1);

    await game.toEndOfTurn();

    expect(enemy.getStatStage(Stat.SPD)).toBe(1);
  });
});
