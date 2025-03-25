import { BattlerIndex } from "#enums/battler-index";
import { allMoves } from "#app/data/data-lists";
import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { Stat, type BattleStat } from "#enums/stat";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Moves - Spectral Thief", () => {
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
      .moveset([MoveId.SPECTRAL_THIEF])
      .ability(AbilityId.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(SpeciesId.SKARMORY)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset(MoveId.IRON_DEFENSE)
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should steal the target's positive stat stages before attacking", async () => {
    await game.classicMode.startBattle([SpeciesId.MAGIKARP]);

    const player = game.scene.getPlayerPokemon()!;
    const enemy = game.scene.getEnemyPokemon()!;
    const spy = vi.spyOn(enemy, "getAttackDamage");

    game.move.select(MoveId.SPECTRAL_THIEF);
    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);

    await game.phaseInterceptor.to("MoveEndPhase");
    const preEffectDamage = enemy.getAttackDamage(player, allMoves.get(MoveId.SPECTRAL_THIEF)).damage;

    await game.phaseInterceptor.to("MoveEffectPhase");

    const postEffectDamage = spy.mock.results.at(-1)?.value.damage;
    expect(postEffectDamage).toBeGreaterThan(preEffectDamage);
    expect(player.getStatStage(Stat.DEF)).toBe(2);
    expect(enemy.getStatStage(Stat.DEF)).toBe(0);
  });

  it("should not steal negative stat stages from the target", async () => {
    game.override.enemyMoveset(MoveId.SHELL_SMASH);

    await game.classicMode.startBattle([SpeciesId.MAGIKARP]);

    const player = game.scene.getPlayerPokemon()!;
    const enemy = game.scene.getEnemyPokemon()!;

    game.move.select(MoveId.SPECTRAL_THIEF);
    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);

    await game.phaseInterceptor.to("MoveEndPhase");
    await game.phaseInterceptor.to("MoveEffectPhase");

    [Stat.ATK, Stat.SPATK, Stat.SPD].forEach((stat: BattleStat) => {
      expect(player.getStatStage(stat)).toBe(2);
      expect(enemy.getStatStage(stat)).toBe(0);
    });

    [Stat.DEF, Stat.SPDEF].forEach((stat: BattleStat) => {
      expect(player.getStatStage(stat)).toBe(0);
      expect(enemy.getStatStage(stat)).toBe(-1);
    });
  });

  it("should steal stat stages even if the target has Clear Body", async () => {
    game.override.enemyAbility(AbilityId.CLEAR_BODY);

    await game.classicMode.startBattle([SpeciesId.MAGIKARP]);

    const player = game.scene.getPlayerPokemon()!;
    const enemy = game.scene.getEnemyPokemon()!;

    game.move.select(MoveId.SPECTRAL_THIEF);
    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);

    await game.phaseInterceptor.to("MoveEndPhase");
    await game.phaseInterceptor.to("MoveEffectPhase");

    expect(player.getStatStage(Stat.DEF)).toBe(2);
    expect(enemy.getStatStage(Stat.DEF)).toBe(0);
    expect(enemy.battleData.abilitiesApplied.includes(AbilityId.CLEAR_BODY)).toBeFalsy();
  });

  it.each([
    { abilityName: "Simple", abilityId: AbilityId.SIMPLE, multiplier: 2 },
    { abilityName: "Contrary", abilityId: AbilityId.CONTRARY, multiplier: -1 },
  ])(
    "$abilityName should multiply the stolen stat stages from this effect by $multiplier",
    async ({ abilityId, multiplier }) => {
      game.override.ability(abilityId);

      await game.classicMode.startBattle([SpeciesId.MAGIKARP]);

      const player = game.scene.getPlayerPokemon()!;
      const enemy = game.scene.getEnemyPokemon()!;

      game.move.select(MoveId.SPECTRAL_THIEF);
      game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);

      await game.phaseInterceptor.to("MoveEndPhase");
      await game.phaseInterceptor.to("MoveEffectPhase");

      expect(player.getStatStage(Stat.DEF)).toBe(2 * multiplier);
      expect(enemy.getStatStage(Stat.DEF)).toBe(0);
    },
  );

  it("should not activate Defiant when stealing stat stages", async () => {
    game.override.enemyAbility(AbilityId.DEFIANT);

    await game.classicMode.startBattle([SpeciesId.MAGIKARP]);

    const player = game.scene.getPlayerPokemon()!;
    const enemy = game.scene.getEnemyPokemon()!;

    game.move.select(MoveId.SPECTRAL_THIEF);
    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);

    await game.phaseInterceptor.to("MoveEndPhase");
    await game.phaseInterceptor.to("MoveEffectPhase");

    expect(player.getStatStage(Stat.DEF)).toBe(2);
    expect(enemy.getStatStage(Stat.DEF)).toBe(0);
    expect(enemy.getStatStage(Stat.ATK)).toBe(0);
    expect(enemy.battleData.abilitiesApplied.includes(AbilityId.DEFIANT)).toBeFalsy();
  });
});
