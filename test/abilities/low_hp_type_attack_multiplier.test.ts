import { Abilities } from "#enums/abilities";
import { MoveCategory } from "#enums/move-category";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { Stat } from "#enums/stat";
import { allMoves } from "#app/data/all-moves";

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
      .disableCrits()
      .enemySpecies(Species.SNORLAX)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(Moves.SPLASH);
  });

  it.each([
    { abilityName: "Overgrow", ability: Abilities.OVERGROW, move: Moves.LEAFAGE },
    { abilityName: "Blaze", ability: Abilities.BLAZE, move: Moves.FIRE_FANG },
    { abilityName: "Torrent", ability: Abilities.TORRENT, move: Moves.AQUA_JET },
    { abilityName: "Swarm", ability: Abilities.SWARM, move: Moves.BUG_BITE },
  ])(
    "$abilityName should multiply the user's attack stat by 1.5 if it uses a physical move of the relevant type at low HP",
    async ({ ability, move }) => {
      game.override.ability(ability).moveset(move);
      await game.classicMode.startBattle([Species.RATTATA]);
      const playerPokemon = game.scene.getPlayerPokemon()!;
      playerPokemon.hp = playerPokemon.getMaxHp() * 0.33 - 1;
      vi.spyOn(playerPokemon, "getEffectiveStat");

      game.move.select(move);
      await game.move.forceHit();
      await game.phaseInterceptor.to("BerryPhase");

      expect(playerPokemon.getEffectiveStat).toHaveLastReturnedWith(Math.floor(playerPokemon.stats[Stat.ATK] * 1.5));
    },
  );

  it.each([
    { abilityName: "Overgrow", ability: Abilities.OVERGROW, move: Moves.ABSORB },
    { abilityName: "Blaze", ability: Abilities.BLAZE, move: Moves.EMBER },
    { abilityName: "Torrent", ability: Abilities.TORRENT, move: Moves.WATER_GUN },
    { abilityName: "Swarm", ability: Abilities.SWARM, move: Moves.INFESTATION },
  ])(
    "$abilityName should multiply the user's sp. attack stat by 1.5 if it uses a special move of the relevant type at low HP",
    async ({ ability, move }) => {
      game.override.ability(ability).moveset(move);
      await game.classicMode.startBattle([Species.RATTATA]);
      const playerPokemon = game.scene.getPlayerPokemon()!;
      playerPokemon.hp = playerPokemon.getMaxHp() * 0.33 - 1;
      vi.spyOn(playerPokemon, "getEffectiveStat");

      game.move.select(move);
      await game.move.forceHit();
      await game.phaseInterceptor.to("BerryPhase");

      expect(playerPokemon.getEffectiveStat).toHaveLastReturnedWith(Math.floor(playerPokemon.stats[Stat.SPATK] * 1.5));
    },
  );

  it.each([
    { abilityName: "Overgrow", ability: Abilities.OVERGROW, move: Moves.ABSORB },
    { abilityName: "Blaze", ability: Abilities.BLAZE, move: Moves.EMBER },
    { abilityName: "Torrent", ability: Abilities.TORRENT, move: Moves.WATER_GUN },
    { abilityName: "Swarm", ability: Abilities.SWARM, move: Moves.INFESTATION },
  ])(
    "$abilityName should not take effect if the ability-holder is above the HP threshold",
    async ({ ability, move }) => {
      game.override.ability(ability).moveset(move);
      await game.classicMode.startBattle([Species.RATTATA]);
      const playerPokemon = game.scene.getPlayerPokemon()!;
      vi.spyOn(playerPokemon, "getEffectiveStat");

      game.move.select(move);
      await game.move.forceHit();
      await game.phaseInterceptor.to("BerryPhase");

      const statUsed =
        playerPokemon.getMoveCategory(game.scene.getEnemyPokemon()!, allMoves[move]) === MoveCategory.PHYSICAL
          ? Stat.ATK
          : Stat.SPATK;
      expect(playerPokemon.getEffectiveStat).toHaveLastReturnedWith(Math.floor(playerPokemon.stats[statUsed]));
    },
  );

  it.each([
    { abilityName: "Overgrow", ability: Abilities.OVERGROW },
    { abilityName: "Blaze", ability: Abilities.BLAZE },
    { abilityName: "Torrent", ability: Abilities.TORRENT },
    { abilityName: "Swarm", ability: Abilities.SWARM },
  ])("$abilityName should not take effect if the move used is of an incompatible type", async ({ ability }) => {
    game.override.ability(ability).moveset(Moves.TACKLE);
    await game.classicMode.startBattle([Species.RATTATA]);
    const playerPokemon = game.scene.getPlayerPokemon()!;
    playerPokemon.hp = playerPokemon.getMaxHp() * 0.33 - 1;
    vi.spyOn(playerPokemon, "getEffectiveStat");

    game.move.select(Moves.TACKLE);
    await game.move.forceHit();
    await game.phaseInterceptor.to("BerryPhase");

    expect(playerPokemon.getEffectiveStat).toHaveLastReturnedWith(Math.floor(playerPokemon.stats[Stat.ATK]));
  });
});
