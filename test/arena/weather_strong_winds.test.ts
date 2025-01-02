import { allMoves } from "#app/data/all-moves";
import { StatusEffect } from "#enums/status-effect";
import { TurnStartPhase } from "#app/phases/turn-start-phase";
import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Weather - Strong Winds", () => {
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
    game.overridesHelper.startingLevel(10);
    game.overridesHelper.enemySpecies(Species.TAILLOW);
    game.overridesHelper.enemyAbility(Abilities.DELTA_STREAM);
    game.overridesHelper.moveset([Moves.THUNDERBOLT, Moves.ICE_BEAM, Moves.ROCK_SLIDE]);
  });

  it("electric type move is not very effective on Rayquaza", async () => {
    game.overridesHelper.enemySpecies(Species.RAYQUAZA);

    await game.classicMode.startBattle([Species.PIKACHU]);
    const pikachu = game.scene.getPlayerPokemon()!;
    const enemy = game.scene.getEnemyPokemon()!;

    game.moveHelper.select(Moves.THUNDERBOLT);

    await game.phaseInterceptor.to(TurnStartPhase);
    expect(enemy.getAttackTypeEffectiveness(allMoves[Moves.THUNDERBOLT].type, pikachu)).toBe(0.5);
  });

  it("electric type move is neutral for flying type pokemon", async () => {
    await game.classicMode.startBattle([Species.PIKACHU]);
    const pikachu = game.scene.getPlayerPokemon()!;
    const enemy = game.scene.getEnemyPokemon()!;

    game.moveHelper.select(Moves.THUNDERBOLT);

    await game.phaseInterceptor.to(TurnStartPhase);
    expect(enemy.getAttackTypeEffectiveness(allMoves[Moves.THUNDERBOLT].type, pikachu)).toBe(1);
  });

  it("ice type move is neutral for flying type pokemon", async () => {
    await game.classicMode.startBattle([Species.PIKACHU]);
    const pikachu = game.scene.getPlayerPokemon()!;
    const enemy = game.scene.getEnemyPokemon()!;

    game.moveHelper.select(Moves.ICE_BEAM);

    await game.phaseInterceptor.to(TurnStartPhase);
    expect(enemy.getAttackTypeEffectiveness(allMoves[Moves.ICE_BEAM].type, pikachu)).toBe(1);
  });

  it("rock type move is neutral for flying type pokemon", async () => {
    await game.classicMode.startBattle([Species.PIKACHU]);
    const pikachu = game.scene.getPlayerPokemon()!;
    const enemy = game.scene.getEnemyPokemon()!;

    game.moveHelper.select(Moves.ROCK_SLIDE);

    await game.phaseInterceptor.to(TurnStartPhase);
    expect(enemy.getAttackTypeEffectiveness(allMoves[Moves.ROCK_SLIDE].type, pikachu)).toBe(1);
  });

  it("weather goes away when last trainer pokemon dies to indirect damage", async () => {
    game.overridesHelper.enemyStatusEffect(StatusEffect.POISON);

    await game.classicMode.startBattle([Species.MAGIKARP]);

    const enemy = game.scene.getEnemyPokemon()!;
    enemy.hp = 1;

    game.moveHelper.select(Moves.SPLASH);
    await game.phaseInterceptor.to("TurnEndPhase");

    expect(game.scene.arena.weather?.weatherType).toBeUndefined();
  });
});
