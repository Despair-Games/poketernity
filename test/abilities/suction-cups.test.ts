import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Abilities - Suction Cups", () => {
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
      .enemyAbility(Abilities.SUCTION_CUPS)
      .enemyLevel(100);
  });

  it("should prevent the user from being forced to switch out", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    game.move.use(MoveId.WHIRLWIND);
    await game.move.forceEnemyMove(MoveId.SPLASH);
    await game.toEndOfTurn();

    const enemyPokemon = game.field.getEnemyPokemon();
    expect(enemyPokemon.switchOutStatus).toBe(false);
  });

  it("should not prevent other Pokemon on the field from being forced to switch out via Wimp Out", async () => {
    game.override.ability(Abilities.WIMP_OUT);
    await game.classicMode.startBattle([Species.FEEBAS, Species.MILOTIC]);

    const [feebas, milotic] = game.scene.getPlayerParty();

    game.move.use(MoveId.SPLASH);
    await game.move.forceEnemyMove(MoveId.FALSE_SWIPE);
    game.doSelectPartyPokemon(1);
    await game.toEndOfTurn();

    expect(feebas.isOnField()).toBe(false);
    expect(feebas.isAllowedInBattle()).toBe(true);
    expect(milotic.isOnField()).toBe(true);
  });
});
