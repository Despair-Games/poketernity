import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("AI (Move Effect Scores) - Mind Blown", () => {
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
      .enemySpecies(SpeciesId.CYNDAQUIL)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset([MoveId.MIND_BLOWN, MoveId.SPLASH, MoveId.TACKLE])
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should be preferred when the user is at full HP", async () => {
    await game.classicMode.startBattle(SpeciesId.TANGROWTH);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toPreferSelectingMove(MoveId.MIND_BLOWN);
  });

  it("should be avoided when the user is at half HP", async () => {
    await game.classicMode.startBattle(SpeciesId.TANGROWTH);

    const enemy = game.field.getEnemyPokemon();
    enemy.hp = Math.floor(enemy.hp / 2);

    expect(enemy).toNeverSelectMove(MoveId.MIND_BLOWN);
  });

  it("should be preferred when the user has Magic Guard", async () => {
    game.override.enemyAbility(AbilityId.MAGIC_GUARD);

    await game.classicMode.startBattle(SpeciesId.TANGROWTH);

    const enemy = game.field.getEnemyPokemon();
    enemy.hp = Math.floor(enemy.hp / 2);

    expect(enemy).toPreferSelectingMove(MoveId.MIND_BLOWN);
  });

  it("should be avoided compared to other attacks with no effect", async () => {
    game.override.enemyMoveset([MoveId.MIND_BLOWN, MoveId.EMBER]).ability(AbilityId.FLASH_FIRE);

    await game.classicMode.startBattle(SpeciesId.TANGROWTH);

    game.field.revealAllAbilities();
    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toNeverSelectMove(MoveId.MIND_BLOWN);
  });
});
