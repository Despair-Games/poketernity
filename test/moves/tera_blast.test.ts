import { BattlerIndex } from "#app/battle";
import { Stat } from "#enums/stat";
import { allMoves } from "#app/data/all-moves";
import { Type } from "#enums/type";
import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Moves - Tera Blast", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;
  const moveToCheck = allMoves[Moves.TERA_BLAST];

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

    game.overridesHelper
      .battleType("single")
      .disableCrits()
      .starterSpecies(Species.FEEBAS)
      .moveset([Moves.TERA_BLAST])
      .ability(Abilities.BALL_FETCH)
      .startingHeldItems([{ name: "TERA_SHARD", type: Type.FIRE }])
      .enemySpecies(Species.MAGIKARP)
      .enemyMoveset(Moves.SPLASH)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyLevel(20);

    vi.spyOn(moveToCheck, "calculateBattlePower");
  });

  it("changes type to match user's tera type", async () => {
    game.overridesHelper.enemySpecies(Species.FURRET).startingHeldItems([{ name: "TERA_SHARD", type: Type.FIGHTING }]);
    await game.classicMode.startBattle();
    const enemyPokemon = game.scene.getEnemyPokemon()!;
    vi.spyOn(enemyPokemon, "getMoveEffectiveness");

    game.move.select(Moves.TERA_BLAST);
    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.phaseInterceptor.to("MoveEffectPhase");

    expect(enemyPokemon.getMoveEffectiveness).toHaveReturnedWith(2);
  }, 20000);

  it("increases power if user is Stellar tera type", async () => {
    game.overridesHelper.startingHeldItems([{ name: "TERA_SHARD", type: Type.STELLAR }]);

    await game.classicMode.startBattle();

    game.move.select(Moves.TERA_BLAST);
    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.phaseInterceptor.to("MoveEffectPhase");

    expect(moveToCheck.calculateBattlePower).toHaveReturnedWith(100);
  }, 20000);

  it("is super effective against terastallized targets if user is Stellar tera type", async () => {
    game.overridesHelper.startingHeldItems([{ name: "TERA_SHARD", type: Type.STELLAR }]);

    await game.classicMode.startBattle();

    const enemyPokemon = game.scene.getEnemyPokemon()!;
    vi.spyOn(enemyPokemon, "getMoveEffectiveness");
    vi.spyOn(enemyPokemon, "isTerastallized").mockReturnValue(true);

    game.move.select(Moves.TERA_BLAST);
    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.phaseInterceptor.to("MoveEffectPhase");

    expect(enemyPokemon.getMoveEffectiveness).toHaveReturnedWith(2);
  });

  // Currently abilities are bugged and can't see when a move's category is changed
  it.todo(
    "uses the higher stat of the user's Atk and SpAtk for damage calculation",
    async () => {
      game.overridesHelper.enemyAbility(Abilities.TOXIC_DEBRIS);
      await game.classicMode.startBattle();

      const playerPokemon = game.scene.getPlayerPokemon()!;
      playerPokemon.stats[Stat.ATK] = 100;
      playerPokemon.stats[Stat.SPATK] = 1;

      game.move.select(Moves.TERA_BLAST);
      await game.phaseInterceptor.to("TurnEndPhase");
      expect(game.scene.getEnemyPokemon()!.battleData.abilityRevealed).toBe(true);
    },
    20000,
  );

  it("causes stat drops if user is Stellar tera type", async () => {
    game.overridesHelper.startingHeldItems([{ name: "TERA_SHARD", type: Type.STELLAR }]);
    await game.classicMode.startBattle();

    const playerPokemon = game.scene.getPlayerPokemon()!;

    game.move.select(Moves.TERA_BLAST);
    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.phaseInterceptor.to("MoveEndPhase");

    expect(playerPokemon.getStatStage(Stat.SPATK)).toBe(-1);
    expect(playerPokemon.getStatStage(Stat.ATK)).toBe(-1);
  }, 20000);
});
