import { Stat } from "#enums/stat";
import { TerrainType } from "#enums/terrain-type";
import { MoveEndPhase } from "#app/phases/move-end-phase";
import { TurnEndPhase } from "#app/phases/turn-end-phase";
import { Abilities } from "#enums/abilities";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { allMoves } from "#app/data/data-lists";
import { MetronomeAttr } from "#app/data/move-attrs/metronome-attr";
import { StatusEffect } from "#enums/status-effect";

// See also: TypeImmunityAbAttr
describe("Abilities - Sap Sipper", () => {
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
      .ability(Abilities.SAP_SIPPER)
      .enemySpecies(Species.RATTATA)
      .enemyAbility(Abilities.SAP_SIPPER)
      .enemyMoveset(MoveId.SPLASH);
  });

  it("raises ATK stat stage by 1 and block effects when activated against a grass attack", async () => {
    const moveToUse = MoveId.LEAFAGE;

    game.override.moveset(moveToUse);

    await game.classicMode.startBattle([Species.BULBASAUR]);

    const enemyPokemon = game.scene.getEnemyPokemon()!;
    const initialEnemyHp = enemyPokemon.hp;

    game.move.select(moveToUse);

    await game.phaseInterceptor.to(TurnEndPhase);

    expect(initialEnemyHp - enemyPokemon.hp).toBe(0);
    expect(enemyPokemon.getStatStage(Stat.ATK)).toBe(1);
  });

  it("raises ATK stat stage by 1 and block effects when activated against a grass status move", async () => {
    const moveToUse = MoveId.SPORE;

    game.override.moveset(moveToUse);

    await game.classicMode.startBattle([Species.BULBASAUR]);

    const enemyPokemon = game.scene.getEnemyPokemon()!;

    game.move.select(moveToUse);

    await game.phaseInterceptor.to(TurnEndPhase);

    expect(enemyPokemon.getStatusEffect()).toBe(StatusEffect.NONE);
    expect(enemyPokemon.getStatStage(Stat.ATK)).toBe(1);
  });

  it("do not activate against status moves that target the field", async () => {
    const moveToUse = MoveId.GRASSY_TERRAIN;

    game.override.moveset(moveToUse);

    await game.classicMode.startBattle([Species.BULBASAUR]);

    game.move.select(moveToUse);

    await game.phaseInterceptor.to(TurnEndPhase);

    expect(game.scene.arena.hasTerrain(TerrainType.GRASSY)).toBe(true);
    expect(game.scene.getEnemyPokemon()!.getStatStage(Stat.ATK)).toBe(0);
  });

  it("activate once against multi-hit grass attacks", async () => {
    const moveToUse = MoveId.BULLET_SEED;

    game.override.moveset(moveToUse);

    await game.classicMode.startBattle([Species.BULBASAUR]);

    const enemyPokemon = game.scene.getEnemyPokemon()!;
    const initialEnemyHp = enemyPokemon.hp;

    game.move.select(moveToUse);

    await game.phaseInterceptor.to(TurnEndPhase);

    expect(initialEnemyHp - enemyPokemon.hp).toBe(0);
    expect(enemyPokemon.getStatStage(Stat.ATK)).toBe(1);
  });

  it("do not activate against status moves that target the user", async () => {
    const moveToUse = MoveId.SPIKY_SHIELD;

    game.override.moveset(moveToUse);

    await game.classicMode.startBattle([Species.BULBASAUR]);

    const playerPokemon = game.scene.getPlayerPokemon()!;

    game.move.select(moveToUse);

    await game.phaseInterceptor.to(MoveEndPhase);

    expect(playerPokemon.getTag(BattlerTagType.SPIKY_SHIELD)).toBeDefined();

    await game.phaseInterceptor.to(TurnEndPhase);

    expect(playerPokemon.getStatStage(Stat.ATK)).toBe(0);
    expect(game.phaseInterceptor.log).not.toContain("ShowAbilityPhase");
  });

  it("activate once against multi-hit grass attacks (metronome)", async () => {
    const moveToUse = MoveId.METRONOME;

    const randomMoveAttr = allMoves[MoveId.METRONOME].findAttr(
      (attr) => attr instanceof MetronomeAttr,
    ) as MetronomeAttr;
    vi.spyOn(randomMoveAttr, "getMoveOverride").mockReturnValue(MoveId.BULLET_SEED);

    game.override.moveset(moveToUse);

    await game.classicMode.startBattle([Species.BULBASAUR]);

    const enemyPokemon = game.scene.getEnemyPokemon()!;
    const initialEnemyHp = enemyPokemon.hp;

    game.move.select(moveToUse);

    await game.phaseInterceptor.to(TurnEndPhase);

    expect(initialEnemyHp - enemyPokemon.hp).toBe(0);
    expect(enemyPokemon.getStatStage(Stat.ATK)).toBe(1);
  });

  it("still activates regardless of accuracy check", async () => {
    game.override.moveset(MoveId.LEAF_BLADE);

    await game.classicMode.startBattle([Species.BULBASAUR]);

    const enemyPokemon = game.scene.getEnemyPokemon()!;

    game.move.select(MoveId.LEAF_BLADE);
    await game.phaseInterceptor.to("MoveEffectPhase");

    await game.move.forceMiss();
    await game.toEndOfTurn();
    expect(enemyPokemon.getStatStage(Stat.ATK)).toBe(1);
  });
});
