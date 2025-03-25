import { BattlerIndex } from "#enums/battler-index";
import { Stat } from "#enums/stat";
import { allMoves } from "#app/data/data-lists";
import { ElementalType } from "#enums/elemental-type";
import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Moves - Tera Blast", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;
  const moveToCheck = allMoves.get(MoveId.TERA_BLAST);

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
      .starterSpecies(SpeciesId.FEEBAS)
      .moveset([MoveId.TERA_BLAST])
      .ability(AbilityId.BALL_FETCH)
      .startingHeldItems([{ name: "TERA_SHARD", type: ElementalType.FIRE }])
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyMoveset(MoveId.SPLASH)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyLevel(20);

    vi.spyOn(moveToCheck, "calculateBattlePower");
  });

  it("changes type to match user's tera type", async () => {
    game.override
      .enemySpecies(SpeciesId.FURRET)
      .startingHeldItems([{ name: "TERA_SHARD", type: ElementalType.FIGHTING }]);
    await game.classicMode.startBattle();
    const enemyPokemon = game.scene.getEnemyPokemon()!;
    vi.spyOn(enemyPokemon, "getMoveEffectiveness");

    game.move.select(MoveId.TERA_BLAST);
    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.phaseInterceptor.to("MoveEffectPhase");

    expect(enemyPokemon.getMoveEffectiveness).toHaveReturnedWith(2);
  }, 20000);

  it("increases power if user is Stellar tera type", async () => {
    game.override.startingHeldItems([{ name: "TERA_SHARD", type: ElementalType.STELLAR }]);

    await game.classicMode.startBattle();

    game.move.select(MoveId.TERA_BLAST);
    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.phaseInterceptor.to("MoveEffectPhase");

    expect(moveToCheck.calculateBattlePower).toHaveReturnedWith(100);
  }, 20000);

  it("is super effective against terastallized targets if user is Stellar tera type", async () => {
    game.override.startingHeldItems([{ name: "TERA_SHARD", type: ElementalType.STELLAR }]);

    await game.classicMode.startBattle();

    const enemyPokemon = game.scene.getEnemyPokemon()!;
    vi.spyOn(enemyPokemon, "getMoveEffectiveness");
    vi.spyOn(enemyPokemon, "isTerastallized").mockReturnValue(true);

    game.move.select(MoveId.TERA_BLAST);
    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.phaseInterceptor.to("MoveEffectPhase");

    expect(enemyPokemon.getMoveEffectiveness).toHaveReturnedWith(2);
  });

  // Currently abilities are bugged and can't see when a move's category is changed
  it.todo(
    "uses the higher stat of the user's Atk and SpAtk for damage calculation",
    async () => {
      game.override.enemyAbility(AbilityId.TOXIC_DEBRIS);
      await game.classicMode.startBattle();

      const playerPokemon = game.scene.getPlayerPokemon()!;
      playerPokemon.stats[Stat.ATK] = 100;
      playerPokemon.stats[Stat.SPATK] = 1;

      game.move.select(MoveId.TERA_BLAST);
      await game.toEndOfTurn();
      expect(game.scene.getEnemyPokemon()!.battleData.abilitiesApplied).toContain(AbilityId.TOXIC_DEBRIS);
    },
    20000,
  );

  it("causes stat drops if user is Stellar tera type", async () => {
    game.override.startingHeldItems([{ name: "TERA_SHARD", type: ElementalType.STELLAR }]);
    await game.classicMode.startBattle();

    const playerPokemon = game.scene.getPlayerPokemon()!;

    game.move.select(MoveId.TERA_BLAST);
    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.phaseInterceptor.to("MoveEndPhase");

    expect(playerPokemon.getStatStage(Stat.SPATK)).toBe(-1);
    expect(playerPokemon.getStatStage(Stat.ATK)).toBe(-1);
  }, 20000);
});
