import { AbilityId } from "#enums/ability-id";
import { BattlerIndex } from "#enums/battler-index";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { Stat } from "#enums/stat";
import { GameManager } from "#test/test-utils/game-manager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Moves - Doodle", () => {
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
      .ability(AbilityId.ADAPTABILITY)
      .battleType("single")
      .disableCrits()
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH);
  });

  it("should copy the opponent's ability in singles", async () => {
    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    game.move.use(MoveId.DOODLE);
    await game.toEndOfTurn();

    expect(game.field.getPlayerPokemon().getAbility().id).toBe(AbilityId.BALL_FETCH);
  });

  it("should copy the opponent's ability to itself and its ally in doubles", async () => {
    game.override.battleType("double");
    await game.classicMode.startBattle(SpeciesId.FEEBAS, SpeciesId.MAGIKARP);

    game.move.use(MoveId.DOODLE, 0, BattlerIndex.ENEMY);
    game.move.use(MoveId.SPLASH, 1);
    await game.toEndOfTurn();

    expect(game.scene.getPlayerField()[0].getAbility().id).toBe(AbilityId.BALL_FETCH);
    expect(game.scene.getPlayerField()[1].getAbility().id).toBe(AbilityId.BALL_FETCH);
  });

  // TODO: https://github.com/pagefaultgames/pokerogue/pull/5146
  it.todo("should activate post-summon abilities", async () => {
    game.override.battleType("double").enemyAbility(AbilityId.INTIMIDATE);

    await game.classicMode.startBattle(SpeciesId.FEEBAS, SpeciesId.MAGIKARP);

    game.move.use(MoveId.DOODLE, 0, BattlerIndex.ENEMY);
    game.move.use(MoveId.SPLASH, 1);
    await game.toEndOfTurn();

    // Enemies should have been intimidated twice
    expect(game.field.getEnemyPokemon()).toHaveStatStage(Stat.ATK, -2);
  });
});
