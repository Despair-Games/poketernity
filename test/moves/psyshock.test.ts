import { allMoves } from "#app/data/data-lists";
import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Moves - Psyshock", () => {
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
      .enemyAbility(AbilityId.FUR_COAT)
      .enemyMoveset(MoveId.SPLASH)
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should deal physical damage", async () => {
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);

    const enemy = game.field.getEnemyPokemon();

    game.move.use(MoveId.PSYSHOCK);
    await game.toEndOfTurn();

    expect(enemy.battleData.abilitiesApplied).toContain(AbilityId.FUR_COAT);
  });

  it("should use the user's Sp. Atk stat stages during damage calculation", async () => {
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);
    const psyshock = allMoves.get(MoveId.PSYSHOCK);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();

    const { damage: preDamage } = enemy.getAttackDamage(player, psyshock);

    game.move.use(MoveId.NASTY_PLOT);
    await game.toNextTurn();

    const { damage: postDamage } = enemy.getAttackDamage(player, psyshock);

    expect(postDamage).toBeGreaterThan(2 * preDamage - 3);
    expect(postDamage).toBeLessThan(2 * preDamage + 3);
  });
});
