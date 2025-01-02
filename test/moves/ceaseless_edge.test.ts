import { ArenaTagSide, ArenaTrapTag } from "#app/data/arena-tag";
import { allMoves } from "#app/data/all-moves";
import { Abilities } from "#enums/abilities";
import { ArenaTagType } from "#enums/arena-tag-type";
import { MoveEffectPhase } from "#app/phases/move-effect-phase";
import { TurnEndPhase } from "#app/phases/turn-end-phase";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";

describe("Moves - Ceaseless Edge", () => {
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
    game.overridesHelper.battleType("single");
    game.overridesHelper.enemySpecies(Species.RATTATA);
    game.overridesHelper.enemyAbility(Abilities.RUN_AWAY);
    game.overridesHelper.enemyPassiveAbility(Abilities.RUN_AWAY);
    game.overridesHelper.startingLevel(100);
    game.overridesHelper.enemyLevel(100);
    game.overridesHelper.moveset([Moves.CEASELESS_EDGE, Moves.SPLASH, Moves.ROAR]);
    game.overridesHelper.enemyMoveset(Moves.SPLASH);
    vi.spyOn(allMoves[Moves.CEASELESS_EDGE], "accuracy", "get").mockReturnValue(100);
  });

  test("move should hit and apply spikes", async () => {
    await game.classicMode.startBattle([Species.ILLUMISE]);

    const enemyPokemon = game.scene.getEnemyPokemon()!;

    const enemyStartingHp = enemyPokemon.hp;

    game.moveHelper.select(Moves.CEASELESS_EDGE);

    await game.phaseInterceptor.to(MoveEffectPhase, false);
    // Spikes should not have any layers before move effect is applied
    const tagBefore = game.scene.arena.getTagOnSide(ArenaTagType.SPIKES, ArenaTagSide.ENEMY) as ArenaTrapTag;
    expect(tagBefore instanceof ArenaTrapTag).toBeFalsy();

    await game.phaseInterceptor.to(TurnEndPhase);
    const tagAfter = game.scene.arena.getTagOnSide(ArenaTagType.SPIKES, ArenaTagSide.ENEMY) as ArenaTrapTag;
    expect(tagAfter instanceof ArenaTrapTag).toBeTruthy();
    expect(tagAfter.layers).toBe(1);
    expect(enemyPokemon.hp).toBeLessThan(enemyStartingHp);
  });

  test("move should hit twice with multi lens and apply two layers of spikes", async () => {
    game.overridesHelper.startingHeldItems([{ name: "MULTI_LENS" }]);
    await game.classicMode.startBattle([Species.ILLUMISE]);

    const enemyPokemon = game.scene.getEnemyPokemon()!;

    const enemyStartingHp = enemyPokemon.hp;

    game.moveHelper.select(Moves.CEASELESS_EDGE);

    await game.phaseInterceptor.to(MoveEffectPhase, false);
    // Spikes should not have any layers before move effect is applied
    const tagBefore = game.scene.arena.getTagOnSide(ArenaTagType.SPIKES, ArenaTagSide.ENEMY) as ArenaTrapTag;
    expect(tagBefore instanceof ArenaTrapTag).toBeFalsy();

    await game.phaseInterceptor.to(TurnEndPhase);
    const tagAfter = game.scene.arena.getTagOnSide(ArenaTagType.SPIKES, ArenaTagSide.ENEMY) as ArenaTrapTag;
    expect(tagAfter instanceof ArenaTrapTag).toBeTruthy();
    expect(tagAfter.layers).toBe(2);
    expect(enemyPokemon.hp).toBeLessThan(enemyStartingHp);
  });

  test("trainer - move should hit twice, apply two layers of spikes, force switch opponent - opponent takes damage", async () => {
    game.overridesHelper.startingHeldItems([{ name: "MULTI_LENS" }]);
    game.overridesHelper.startingWave(25);

    await game.classicMode.startBattle([Species.ILLUMISE]);

    game.moveHelper.select(Moves.CEASELESS_EDGE);
    await game.phaseInterceptor.to(MoveEffectPhase, false);
    // Spikes should not have any layers before move effect is applied
    const tagBefore = game.scene.arena.getTagOnSide(ArenaTagType.SPIKES, ArenaTagSide.ENEMY) as ArenaTrapTag;
    expect(tagBefore instanceof ArenaTrapTag).toBeFalsy();

    await game.toNextTurn();
    const tagAfter = game.scene.arena.getTagOnSide(ArenaTagType.SPIKES, ArenaTagSide.ENEMY) as ArenaTrapTag;
    expect(tagAfter instanceof ArenaTrapTag).toBeTruthy();
    expect(tagAfter.layers).toBe(2);

    const hpBeforeSpikes = game.scene.currentBattle.enemyParty[1].hp;
    // Check HP of pokemon that WILL BE switched in (index 1)
    game.forceEnemyToSwitch();
    game.moveHelper.select(Moves.SPLASH);
    await game.phaseInterceptor.to(TurnEndPhase, false);
    expect(game.scene.currentBattle.enemyParty[0].hp).toBeLessThan(hpBeforeSpikes);
  });
});
