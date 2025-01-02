import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { StatusEffect } from "#enums/status-effect";
import { MoveEffectPhase } from "#app/phases/move-effect-phase";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Moves - Beat Up", () => {
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

    game.overridesHelper.enemySpecies(Species.SNORLAX);
    game.overridesHelper.enemyLevel(100);
    game.overridesHelper.enemyMoveset([Moves.SPLASH]);
    game.overridesHelper.enemyAbility(Abilities.INSOMNIA);

    game.overridesHelper.startingLevel(100);
    game.overridesHelper.moveset([Moves.BEAT_UP]);
  });

  it("should hit once for each healthy player Pokemon", async () => {
    await game.startBattle([
      Species.MAGIKARP,
      Species.BULBASAUR,
      Species.CHARMANDER,
      Species.SQUIRTLE,
      Species.PIKACHU,
      Species.EEVEE,
    ]);

    const playerPokemon = game.scene.getPlayerPokemon()!;
    const enemyPokemon = game.scene.getEnemyPokemon()!;
    let enemyStartingHp = enemyPokemon.hp;

    game.move.select(Moves.BEAT_UP);

    await game.phaseInterceptor.to(MoveEffectPhase);

    expect(playerPokemon.turnData.hitCount).toBe(6);
    expect(enemyPokemon.hp).toBeLessThan(enemyStartingHp);

    while (playerPokemon.turnData.hitsLeft > 0) {
      enemyStartingHp = enemyPokemon.hp;
      await game.phaseInterceptor.to(MoveEffectPhase);
      expect(enemyPokemon.hp).toBeLessThan(enemyStartingHp);
    }
  });

  it("should not count player Pokemon with status effects towards hit count", async () => {
    await game.startBattle([
      Species.MAGIKARP,
      Species.BULBASAUR,
      Species.CHARMANDER,
      Species.SQUIRTLE,
      Species.PIKACHU,
      Species.EEVEE,
    ]);

    const playerPokemon = game.scene.getPlayerPokemon()!;

    game.scene.getPlayerParty()[1].trySetStatus(StatusEffect.BURN);

    game.move.select(Moves.BEAT_UP);

    await game.phaseInterceptor.to(MoveEffectPhase);

    expect(playerPokemon.turnData.hitCount).toBe(5);
  });
});
