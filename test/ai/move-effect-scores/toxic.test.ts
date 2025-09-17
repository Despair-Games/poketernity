import { AbilityId } from "#enums/ability-id";
import { ArenaTagSide } from "#enums/arena-tag-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import { BattlerIndex } from "#enums/battler-index";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Move Effect Scores - Toxic", () => {
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
      .enemyMoveset([MoveId.TOXIC, MoveId.SUPER_FANG])
      .ability(AbilityId.BALL_FETCH)
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should be preferred over Super Fang", async () => {
    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toPreferSelectingMove(MoveId.TOXIC);
  });

  it.each([
    { abilityName: "Poison Puppeteer", abilityId: AbilityId.POISON_PUPPETEER },
    { abilityName: "Merciless", abilityId: AbilityId.MERCILESS },
  ])("should be preferred over high-value moves if the user has $abilityName", async ({ abilityId }) => {
    game.override.enemyAbility(abilityId).enemyMoveset([MoveId.TOXIC, MoveId.WILL_O_WISP]);

    await game.classicMode.startBattle(SpeciesId.GYARADOS);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toPreferSelectingMove(MoveId.TOXIC);
  });

  it("should be preferred over normal Poison effects", async () => {
    game.override.enemyMoveset([MoveId.TOXIC, MoveId.POISON_GAS]);

    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toPreferSelectingMove(MoveId.TOXIC);
  });

  it("should be avoided if the opponent is already poisoned", async () => {
    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    game.move.use(MoveId.SPLASH);
    await game.move.selectEnemyMove(MoveId.TOXIC);
    await game.move.forceHit();
    await game.toNextTurn();

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toNeverSelectMove(MoveId.TOXIC);
  });

  it("should be avoided if the opponent is under the effects of Safeguard", async () => {
    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    game.scene.arena.addTag(ArenaTagType.SAFEGUARD, 0, 1, MoveId.NONE, ArenaTagSide.PLAYER, true);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toNeverSelectMove(MoveId.TOXIC);
  });

  it("should be avoided if the opponent is Poison-type", async () => {
    await game.classicMode.startBattle(SpeciesId.SKORUPI);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toNeverSelectMove(MoveId.TOXIC);
  });

  it("should still be preferred against Poison-type Pokemon if the user has Corrosion", async () => {
    game.override.enemyAbility(AbilityId.CORROSION);

    await game.classicMode.startBattle(SpeciesId.SKORUPI);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toPreferSelectingMove(MoveId.TOXIC);
  });
});
