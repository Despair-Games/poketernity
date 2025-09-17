import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { Stat } from "#enums/stat";
import { GameManager } from "#test/test-utils/game-manager";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Move Effect Scores - Agility", () => {
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
      .ability(AbilityId.BALL_FETCH)
      .enemyMoveset([MoveId.AGILITY, MoveId.SPLASH, MoveId.TACKLE])
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should be preferred when using the move would improve the user's turn order", async () => {
    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();
    player.setStat(Stat.SPD, 75);
    enemy.setStat(Stat.SPD, 50);

    expect(enemy).toPreferSelectingMove(MoveId.AGILITY);
  });

  it("should not be preferred when using the move would not improve the user's turn order", async () => {
    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();
    player.setStat(Stat.SPD, 75);
    enemy.setStat(Stat.SPD, 100);

    expect(enemy).not.toPreferSelectingMove(MoveId.AGILITY);
  });

  it("should be avoided when the user has Contrary", async () => {
    game.override.enemyAbility(AbilityId.CONTRARY);

    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();
    player.setStat(Stat.SPD, 75);
    enemy.setStat(Stat.SPD, 50);

    expect(enemy).toNeverSelectMove(MoveId.AGILITY);
  });
});
