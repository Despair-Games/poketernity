import { Stat } from "#enums/stat";
import { TerrainType } from "#enums/terrain-type";
import { MoveEndPhase } from "#app/phases/move-end-phase";
import { TurnEndPhase } from "#app/phases/turn-end-phase";
import { AbilityId } from "#enums/ability-id";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { allMoves } from "#app/data/data-lists";
import { MetronomeAttr } from "#app/data/moves/move-attrs/metronome-attr";
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
      .ability(AbilityId.SAP_SIPPER)
      .enemySpecies(SpeciesId.RATTATA)
      .enemyAbility(AbilityId.SAP_SIPPER)
      .enemyMoveset(MoveId.SPLASH);
  });

  it("raises ATK stat stage by 1 and block effects when activated against a grass attack", async () => {
    const moveToUse = MoveId.LEAFAGE;

    game.override.moveset(moveToUse);

    await game.classicMode.startBattle([SpeciesId.BULBASAUR]);

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

    await game.classicMode.startBattle([SpeciesId.BULBASAUR]);

    const enemyPokemon = game.scene.getEnemyPokemon()!;

    game.move.select(moveToUse);

    await game.phaseInterceptor.to(TurnEndPhase);

    expect(enemyPokemon.getStatusEffect()).toBe(StatusEffect.NONE);
    expect(enemyPokemon.getStatStage(Stat.ATK)).toBe(1);
  });

  it("do not activate against status moves that target the field", async () => {
    const moveToUse = MoveId.GRASSY_TERRAIN;

    game.override.moveset(moveToUse);

    await game.classicMode.startBattle([SpeciesId.BULBASAUR]);

    game.move.select(moveToUse);

    await game.phaseInterceptor.to(TurnEndPhase);

    expect(game.scene.arena.hasTerrain(TerrainType.GRASSY)).toBe(true);
    expect(game.scene.getEnemyPokemon()!.getStatStage(Stat.ATK)).toBe(0);
  });

  it("activate once against multi-hit grass attacks", async () => {
    const moveToUse = MoveId.BULLET_SEED;

    game.override.moveset(moveToUse);

    await game.classicMode.startBattle([SpeciesId.BULBASAUR]);

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

    await game.classicMode.startBattle([SpeciesId.BULBASAUR]);

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

    const randomMoveAttr = allMoves
      .get(MoveId.METRONOME)
      .findAttr((attr) => attr instanceof MetronomeAttr) as MetronomeAttr;
    vi.spyOn(randomMoveAttr, "getRandomMove").mockReturnValue(MoveId.BULLET_SEED);

    game.override.moveset(moveToUse);

    await game.classicMode.startBattle([SpeciesId.BULBASAUR]);

    const enemyPokemon = game.scene.getEnemyPokemon()!;
    const initialEnemyHp = enemyPokemon.hp;

    game.move.select(moveToUse);

    await game.phaseInterceptor.to(TurnEndPhase);

    expect(initialEnemyHp - enemyPokemon.hp).toBe(0);
    expect(enemyPokemon.getStatStage(Stat.ATK)).toBe(1);
  });

  it("still activates regardless of accuracy check", async () => {
    game.override.moveset(MoveId.LEAF_BLADE);

    await game.classicMode.startBattle([SpeciesId.BULBASAUR]);

    const enemyPokemon = game.scene.getEnemyPokemon()!;

    game.move.select(MoveId.LEAF_BLADE);
    await game.phaseInterceptor.to("MoveEffectPhase");

    await game.move.forceMiss();
    await game.toEndOfTurn();
    expect(enemyPokemon.getStatStage(Stat.ATK)).toBe(1);
  });
});
