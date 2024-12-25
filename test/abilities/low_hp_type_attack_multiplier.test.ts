import { Abilities } from "#enums/abilities";
import { MoveCategory } from "#enums/move-category";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { Stat } from "#enums/stat";
import { allMoves } from "#app/data/move";

describe("Abilities - Overgrow/Blaze/Torrent/Swarm", () => {
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
    { abilityName: "Overgrow", ability: Abilities.OVERGROW, move: Moves.LEAFAGE },
    { abilityName: "Blaze", ability: Abilities.BLAZE, move: Moves.EMBER },
    { abilityName: "Torrent", ability: Abilities.TORRENT, move: Moves.WATER_GUN },
    { abilityName: "Swarm", ability: Abilities.SWARM, move: Moves.BUG_BITE },
  ])(
    "$abilityName should multiply the user's attacking stat by 1.5 if it uses a move of the relevant type at low HP",
    async ({ ability, move }) => {
      game.override.ability(ability);
      await game.classicMode.startBattle([Species.RATTATA]);
      const playerPokemon = game.scene.getPlayerPokemon()!;
      playerPokemon.hp = playerPokemon.getMaxHp() * 0.33 - 1;
      vi.spyOn(playerPokemon, "getEffectiveStat");

      game.move.select(move);
      await game.move.forceHit();
      await game.phaseInterceptor.to("BerryPhase");

      const playerStat =
        allMoves[move].category === MoveCategory.PHYSICAL
          ? playerPokemon.stats[Stat.ATK]
          : playerPokemon.stats[Stat.SPATK];
      expect(playerPokemon.getEffectiveStat).toHaveLastReturnedWith(Math.floor(playerStat * 1.5));
    },
  );
});
