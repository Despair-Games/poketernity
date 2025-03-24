import { BattlerIndex } from "#enums/battler-index";
import { ElementalType } from "#enums/elemental-type";
import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, it, expect, vi } from "vitest";

describe("Moves - Plasma Fists", () => {
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
      .moveset([MoveId.PLASMA_FISTS, MoveId.TACKLE])
      .battleType("double")
      .startingLevel(100)
      .enemySpecies(SpeciesId.DUSCLOPS)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset(MoveId.TACKLE)
      .enemyLevel(100);
  });

  it("should convert all subsequent Normal-type attacks to Electric-type", async () => {
    await game.classicMode.startBattle([SpeciesId.DUSCLOPS, SpeciesId.BLASTOISE]);

    const field = game.scene.getField(true);
    field.forEach((p) => vi.spyOn(p, "getMoveType"));

    game.move.select(MoveId.PLASMA_FISTS, 0, BattlerIndex.ENEMY);
    game.move.select(MoveId.TACKLE, 1, BattlerIndex.ENEMY_2);

    await game.move.selectEnemyMove(MoveId.TACKLE, BattlerIndex.PLAYER);
    await game.move.selectEnemyMove(MoveId.TACKLE, BattlerIndex.PLAYER_2);

    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.PLAYER_2, BattlerIndex.ENEMY, BattlerIndex.ENEMY_2]);

    await game.toEndOfTurn();

    field.forEach((p) => {
      expect(p.getMoveType).toHaveLastReturnedWith(ElementalType.ELECTRIC);
      expect(p.hp).toBeLessThan(p.getMaxHp());
    });
  });

  it("should not affect Normal-type attacks boosted by Pixilate", async () => {
    game.override.battleType("single").enemyAbility(AbilityId.PIXILATE);

    await game.classicMode.startBattle([SpeciesId.ONIX]);

    const playerPokemon = game.scene.getPlayerPokemon()!;
    const enemyPokemon = game.scene.getEnemyPokemon()!;
    vi.spyOn(enemyPokemon, "getMoveType");

    game.move.select(MoveId.PLASMA_FISTS);

    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.toEndOfTurn();

    expect(enemyPokemon.getMoveType).toHaveLastReturnedWith(ElementalType.FAIRY);
    expect(playerPokemon.hp).toBeLessThan(playerPokemon.getMaxHp());
  });

  it("should affect moves that become Normal type due to Normalize", async () => {
    game.override.battleType("single").enemyAbility(AbilityId.NORMALIZE).enemyMoveset(MoveId.WATER_GUN);

    await game.classicMode.startBattle([SpeciesId.DUSCLOPS]);

    const playerPokemon = game.scene.getPlayerPokemon()!;
    const enemyPokemon = game.scene.getEnemyPokemon()!;
    vi.spyOn(enemyPokemon, "getMoveType");

    game.move.select(MoveId.PLASMA_FISTS);

    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.toEndOfTurn();

    expect(enemyPokemon.getMoveType).toHaveLastReturnedWith(ElementalType.ELECTRIC);
    expect(playerPokemon.hp).toBeLessThan(playerPokemon.getMaxHp());
  });
});
