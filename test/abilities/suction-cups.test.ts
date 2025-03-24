import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
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
      .ability(AbilityId.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.SUCTION_CUPS)
      .enemyLevel(100);
  });

  it("should prevent the user from being forced to switch out", async () => {
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);

    game.move.use(MoveId.WHIRLWIND);
    await game.move.forceEnemyMove(MoveId.SPLASH);
    await game.toEndOfTurn();

    const enemyPokemon = game.field.getEnemyPokemon();
    expect(enemyPokemon.switchOutStatus).toBe(false);
  });

  it("should not prevent other Pokemon on the field from being forced to switch out via Wimp Out", async () => {
    game.override.ability(AbilityId.WIMP_OUT);
    await game.classicMode.startBattle([SpeciesId.FEEBAS, SpeciesId.MILOTIC]);

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
