import { PROTECT_MOVES } from "#constants/move-constants";
import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import { capitalizeString } from "#utils/string-utils";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Move Effect Scores - Wish", () => {
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
      .enemyMoveset([MoveId.WISH, MoveId.TACKLE, MoveId.GROWL, MoveId.SPLASH])
      .ability(AbilityId.BALL_FETCH)
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("Enemy should prefer selecting Wish over moves that do nothing", async () => {
    game.override.enemyMoveset([MoveId.WISH, MoveId.SPLASH]);

    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const enemy = game.field.getEnemyPokemon();

    expect(enemy).toPreferSelectingMove(MoveId.WISH);
  });

  it("Enemy should prefer selecting Wish when damaged", async () => {
    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const enemy = game.field.getEnemyPokemon();

    game.move.use(MoveId.TACKLE);
    await game.move.selectEnemyMove(MoveId.SPLASH);

    await game.toNextTurn();

    expect(enemy).toPreferSelectingMove(MoveId.WISH);
  });

  it.each(
    PROTECT_MOVES.map((moveId) => ({
      moveName: capitalizeString(MoveId[moveId], "_", false, true),
      moveId,
    })),
  )("Enemy should prefer selecting Wish when it knows $moveName", async ({ moveId }) => {
    game.override.enemyMoveset([moveId, MoveId.WISH, MoveId.TACKLE, MoveId.SPLASH]);
    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const enemy = game.field.getEnemyPokemon();

    // Enemy uses protection move so that it may be less inclined to select it on the next turn
    game.move.use(MoveId.SPLASH);
    await game.move.selectEnemyMove(moveId);
    await game.toNextTurn();

    expect(enemy).toPreferSelectingMove(MoveId.WISH);
  });

  it("Enemy should strongly prefer selecting Wish when it knows Protect AND is damaged", async () => {
    // Super Fang should always have a score above (+1) since it does >40% damage
    game.override.enemyMoveset([MoveId.PROTECT, MoveId.WISH, MoveId.SUPER_FANG, MoveId.SPLASH]);
    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const enemy = game.field.getEnemyPokemon();

    // Enemy uses Protect so that it may be less inclined to select it on the next turn
    game.move.use(MoveId.SPLASH);
    await game.move.selectEnemyMove(MoveId.PROTECT);
    await game.toNextTurn();

    enemy.hp = 1;

    expect(enemy).toPreferSelectingMove(MoveId.WISH);
  });

  it("Enemy should avoid selecting Wish when its effect is already active", async () => {
    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const enemy = game.field.getEnemyPokemon();

    game.move.use(MoveId.SPLASH);
    await game.move.selectEnemyMove(MoveId.WISH);
    await game.toNextTurn();

    expect(enemy).toNeverSelectMove(MoveId.WISH);
  });

  it("Enemy should avoid selecting Wish while under the effects of Heal Block", async () => {
    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const enemy = game.field.getEnemyPokemon();

    game.move.use(MoveId.HEAL_BLOCK);
    await game.move.selectEnemyMove(MoveId.SPLASH);
    await game.toNextTurn();

    expect(enemy).toNeverSelectMove(MoveId.WISH);
  });
});
