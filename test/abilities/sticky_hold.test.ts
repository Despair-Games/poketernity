import { allMoves } from "#app/data/all-moves";
import { StealHeldItemChanceAttr } from "#app/data/move-attrs/steal-held-item-chance-attr";
import { Abilities } from "#enums/abilities";
import { BerryType } from "#enums/berry-type";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Abilities - Sticky Hold", () => {
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
    // We are testing Sticky Hold on the enemy, since Knock Off's item removal is coded to not affect the player.
    game.override
      .ability(Abilities.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.STICKY_HOLD)
      .enemyHeldItems([{ name: "BERRY", type: BerryType.LUM }])
      .enemyLevel(100);
  });

  it.each([Moves.THIEF, Moves.PLUCK, Moves.INCINERATE, Moves.KNOCK_OFF].map((move) => ({ move, name: Moves[move] })))(
    "should prevent the user from losing a held item when hit by the move $name",
    async ({ move }) => {
      // Force item removal RNG calls to succeed
      if (move === Moves.THIEF) {
        vi.spyOn(allMoves[move].getAttrs(StealHeldItemChanceAttr)[0], "chance", "get").mockReturnValue(1.0);
      }
      vi.spyOn(allMoves[move], "chance", "get").mockReturnValue(-1);

      await game.classicMode.startBattle([Species.FEEBAS]);

      game.move.use(move);
      await game.move.forceEnemyMove(Moves.SPLASH);
      await game.toNextTurn();

      const enemyPokemon = game.field.getEnemyPokemon();
      expect(enemyPokemon.getHeldItems().length).toBe(1);
    },
  );

  // TODO: Enable this test, and add it to the above test block, once Corrosive Gas is implemented
  it.todo("should prevent the user from losing a held item when hit by the move 'CORROSIVE_GAS'", () => {});

  it.each([Abilities.MAGICIAN, Abilities.PICKPOCKET].map((ability) => ({ ability, name: Abilities[ability] })))(
    "should prevent the user's held item from being stolen by the ability $name",
    async ({ ability }) => {
      game.override.ability(ability);
      await game.classicMode.startBattle([Species.FEEBAS]);

      game.move.use(Moves.FALSE_SWIPE);
      await game.move.forceEnemyMove(Moves.FALSE_SWIPE);
      await game.toNextTurn();

      const enemyPokemon = game.field.getEnemyPokemon();
      expect(enemyPokemon.getHeldItems().length).toBe(1);
    },
  );
});
