import { AbilityId } from "#enums/ability-id";
import { MoveCategory } from "#enums/move-category";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { Stat } from "#enums/stat";
import { allMoves } from "#app/data/data-lists";

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
      .enemySpecies(SpeciesId.SNORLAX)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH);
  });

  it.each([
    { abilityName: "Overgrow", ability: AbilityId.OVERGROW, moveId: MoveId.LEAFAGE },
    { abilityName: "Blaze", ability: AbilityId.BLAZE, moveId: MoveId.FIRE_FANG },
    { abilityName: "Torrent", ability: AbilityId.TORRENT, moveId: MoveId.AQUA_JET },
    { abilityName: "Swarm", ability: AbilityId.SWARM, moveId: MoveId.BUG_BITE },
  ])(
    "$abilityName should multiply the user's attack stat by 1.5 if it uses a physical move of the relevant type at low HP",
    async ({ ability, moveId }) => {
      game.override.ability(ability).moveset(moveId);
      await game.classicMode.startBattle([SpeciesId.MAGIKARP]);
      const playerPokemon = game.scene.getPlayerPokemon()!;
      playerPokemon.hp = playerPokemon.getMaxHp() * 0.33 - 1;
      vi.spyOn(playerPokemon, "getEffectiveStat");

      game.move.select(moveId);
      await game.move.forceHit();
      await game.phaseInterceptor.to("MoveEndPhase", false);

      expect(playerPokemon.getEffectiveStat).toHaveLastReturnedWith(Math.floor(playerPokemon.stats[Stat.ATK] * 1.5));
    },
  );

  it.each([
    { abilityName: "Overgrow", ability: AbilityId.OVERGROW, moveId: MoveId.ABSORB },
    { abilityName: "Blaze", ability: AbilityId.BLAZE, moveId: MoveId.EMBER },
    { abilityName: "Torrent", ability: AbilityId.TORRENT, moveId: MoveId.WATER_GUN },
    { abilityName: "Swarm", ability: AbilityId.SWARM, moveId: MoveId.INFESTATION },
  ])(
    "$abilityName should multiply the user's sp. attack stat by 1.5 if it uses a special move of the relevant type at low HP",
    async ({ ability, moveId }) => {
      game.override.ability(ability).moveset(moveId);
      await game.classicMode.startBattle([SpeciesId.MAGIKARP]);
      const playerPokemon = game.scene.getPlayerPokemon()!;
      playerPokemon.hp = playerPokemon.getMaxHp() * 0.33 - 1;
      vi.spyOn(playerPokemon, "getEffectiveStat");

      game.move.select(moveId);
      await game.move.forceHit();
      await game.phaseInterceptor.to("MoveEndPhase", false);

      expect(playerPokemon.getEffectiveStat).toHaveLastReturnedWith(Math.floor(playerPokemon.stats[Stat.SPATK] * 1.5));
    },
  );

  it.each([
    { abilityName: "Overgrow", ability: AbilityId.OVERGROW, moveId: MoveId.ABSORB },
    { abilityName: "Blaze", ability: AbilityId.BLAZE, moveId: MoveId.EMBER },
    { abilityName: "Torrent", ability: AbilityId.TORRENT, moveId: MoveId.WATER_GUN },
    { abilityName: "Swarm", ability: AbilityId.SWARM, moveId: MoveId.INFESTATION },
  ])(
    "$abilityName should not take effect if the ability-holder is above the HP threshold",
    async ({ ability, moveId }) => {
      game.override.ability(ability).moveset(moveId);
      await game.classicMode.startBattle([SpeciesId.MAGIKARP]);
      const playerPokemon = game.scene.getPlayerPokemon()!;
      vi.spyOn(playerPokemon, "getEffectiveStat");

      game.move.select(moveId);
      await game.move.forceHit();
      await game.phaseInterceptor.to("MoveEndPhase", false);

      const statUsed =
        playerPokemon.getMoveCategory(game.scene.getEnemyPokemon()!, allMoves.get(moveId)) === MoveCategory.PHYSICAL
          ? Stat.ATK
          : Stat.SPATK;
      expect(playerPokemon.getEffectiveStat).toHaveLastReturnedWith(Math.floor(playerPokemon.stats[statUsed]));
    },
  );

  it.each([
    { abilityName: "Overgrow", ability: AbilityId.OVERGROW },
    { abilityName: "Blaze", ability: AbilityId.BLAZE },
    { abilityName: "Torrent", ability: AbilityId.TORRENT },
    { abilityName: "Swarm", ability: AbilityId.SWARM },
  ])("$abilityName should not take effect if the move used is of an incompatible type", async ({ ability }) => {
    game.override.ability(ability).moveset(MoveId.TACKLE);
    await game.classicMode.startBattle([SpeciesId.MAGIKARP]);
    const playerPokemon = game.scene.getPlayerPokemon()!;
    playerPokemon.hp = playerPokemon.getMaxHp() * 0.33 - 1;
    vi.spyOn(playerPokemon, "getEffectiveStat");

    game.move.select(MoveId.TACKLE);
    await game.move.forceHit();
    await game.phaseInterceptor.to("MoveEndPhase", false);

    expect(playerPokemon.getEffectiveStat).toHaveLastReturnedWith(Math.floor(playerPokemon.stats[Stat.ATK]));
  });
});
