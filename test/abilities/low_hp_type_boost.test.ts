import { Abilities } from "#enums/abilities";
import { MoveCategory } from "#enums/move-category";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { Stat } from "#enums/stat";
import { allMoves } from "#app/data/move";

describe("Abilities - Low Hp Type Boost", () => {
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
      .moveset([Moves.LEAFAGE, Moves.EMBER, Moves.WATER_GUN, Moves.BUG_BITE])
      .disableCrits()
      .enemySpecies(Species.SNORLAX)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(Moves.SPLASH);
  });

  it.each([
    { abilityName: "Overgrow", ability: Abilities.OVERGROW },
    { abilityName: "Blaze", ability: Abilities.BLAZE },
    { abilityName: "Torrent", ability: Abilities.TORRENT },
    { abilityName: "Swarm", ability: Abilities.SWARM },
  ])(
    "$abilityName should multiply the user's attacking stat by 1.5 if it uses a move of the relevant type at low HP",
    async ({ ability }) => {
      game.override.ability(ability);
      await game.classicMode.startBattle([Species.RATTATA]);
      const playerPokemon = game.scene.getPlayerPokemon()!;
      playerPokemon.hp = playerPokemon.getMaxHp() * 0.33 - 1;
      vi.spyOn(playerPokemon, "getEffectiveStat");

      const moveId = getMove(ability);
      game.move.select(moveId);
      await game.move.forceHit();
      await game.phaseInterceptor.to("BerryPhase");

      const playerStat =
        allMoves[moveId].category === MoveCategory.PHYSICAL
          ? playerPokemon.stats[Stat.ATK]
          : playerPokemon.stats[Stat.SPATK];
      expect(playerPokemon.getEffectiveStat).toHaveLastReturnedWith(Math.floor(playerStat * 1.5));
    },
  );
});

/**
 * Helper function that determines which move should be used based on the tested ability
 * @param ability the ability used in the test
 * @returns the move that should be used in the test
 */
function getMove(ability: Abilities): Moves {
  switch (ability) {
    case Abilities.OVERGROW:
      return Moves.LEAFAGE;
    case Abilities.BLAZE:
      return Moves.EMBER;
    case Abilities.TORRENT:
      return Moves.WATER_GUN;
    case Abilities.SWARM:
      return Moves.BUG_BITE;
  }
  return Moves.NONE;
}
