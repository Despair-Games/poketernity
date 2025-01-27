import { allMoves } from "#app/data/all-moves";
import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
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
      .ability(Abilities.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.FUR_COAT)
      .enemyMoveset(Moves.SPLASH)
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should deal physical damage", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    const enemy = game.field.getEnemyPokemon();

    game.move.use(Moves.PSYSHOCK);
    await game.phaseInterceptor.to("BerryPhase");

    expect(enemy.battleData.abilitiesApplied).toContain(Abilities.FUR_COAT);
  });

  it("should use the user's Sp. Atk stat stages during damage calculation", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);
    const psyshock = allMoves[Moves.PSYSHOCK];

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();

    const { damage: preDamage } = enemy.getAttackDamage(player, psyshock);

    game.move.use(Moves.NASTY_PLOT);
    await game.toNextTurn();

    const { damage: postDamage } = enemy.getAttackDamage(player, psyshock);

    expect(postDamage).toBeGreaterThan(2 * preDamage - 3);
    expect(postDamage).toBeLessThan(2 * preDamage + 3);
  });
});
