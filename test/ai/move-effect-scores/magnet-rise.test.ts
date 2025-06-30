import { AbilityId } from "#enums/ability-id";
import { ElementalType } from "#enums/elemental-type";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Move Effect Scores - Magnet Rise", () => {
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
      .battleType("single")
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset([MoveId.MAGNET_RISE, MoveId.TACKLE, MoveId.SPLASH])
      .ability(AbilityId.BALL_FETCH)
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should be preferred if the user's opponent is Ground-type", async () => {
    await game.classicMode.startBattle(SpeciesId.DRILBUR);

    const enemy = game.field.getEnemyPokemon();

    expect(enemy).toPreferSelectingMove(MoveId.MAGNET_RISE);
  });

  it("should not be preferred if the user's opponent is not Ground-type", async () => {
    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const enemy = game.field.getEnemyPokemon();

    expect(enemy).not.toPreferSelectingMove(MoveId.MAGNET_RISE);
  });

  it("should be preferred after the user's opponent Terastallizes into Ground-type", async () => {
    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();

    game.field.forceTera(player, ElementalType.GROUND);
    expect(enemy).toPreferSelectingMove(MoveId.MAGNET_RISE);
  });

  it("should not be preferred if the user is Flying-type", async () => {
    game.override.enemySpecies(SpeciesId.PIDGEY);

    await game.classicMode.startBattle(SpeciesId.DRILBUR);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).not.toPreferSelectingMove(MoveId.MAGNET_RISE);
  });

  it("should not be preferred if the user has Levitate", async () => {
    game.override.enemyAbility(AbilityId.LEVITATE);

    await game.classicMode.startBattle(SpeciesId.DRILBUR);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).not.toPreferSelectingMove(MoveId.MAGNET_RISE);
  });
});
