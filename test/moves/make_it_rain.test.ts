import { Stat } from "#enums/stat";
import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { MoveEndPhase } from "#app/phases/move-end-phase";
import { StatStageChangePhase } from "#app/phases/stat-stage-change-phase";

describe("Moves - Make It Rain", () => {
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
    game.overridesHelper.battleType("double");
    game.overridesHelper.moveset([Moves.MAKE_IT_RAIN, Moves.SPLASH]);
    game.overridesHelper.enemySpecies(Species.SNORLAX);
    game.overridesHelper.enemyAbility(Abilities.INSOMNIA);
    game.overridesHelper.enemyMoveset(Moves.SPLASH);
    game.overridesHelper.startingLevel(100);
    game.overridesHelper.enemyLevel(100);
  });

  it("should only lower SPATK stat stage by 1 once in a double battle", async () => {
    await game.startBattle([Species.CHARIZARD, Species.BLASTOISE]);

    const playerPokemon = game.scene.getPlayerPokemon()!;

    game.moveHelper.select(Moves.MAKE_IT_RAIN);
    game.moveHelper.select(Moves.SPLASH, 1);

    await game.phaseInterceptor.to(MoveEndPhase);

    expect(playerPokemon.getStatStage(Stat.SPATK)).toBe(-1);
  });

  it("should apply effects even if the target faints", async () => {
    game.overridesHelper.enemyLevel(1); // ensures the enemy will faint
    game.overridesHelper.battleType("single");

    await game.startBattle([Species.CHARIZARD]);

    const playerPokemon = game.scene.getPlayerPokemon()!;
    const enemyPokemon = game.scene.getEnemyPokemon()!;

    game.moveHelper.select(Moves.MAKE_IT_RAIN);

    await game.phaseInterceptor.to(StatStageChangePhase);

    expect(enemyPokemon.isFainted()).toBe(true);
    expect(playerPokemon.getStatStage(Stat.SPATK)).toBe(-1);
  });

  it("should reduce Sp. Atk. once after KOing two enemies", async () => {
    game.overridesHelper.enemyLevel(1); // ensures the enemy will faint

    await game.startBattle([Species.CHARIZARD, Species.BLASTOISE]);

    const playerPokemon = game.scene.getPlayerPokemon()!;
    const enemyPokemon = game.scene.getEnemyField();

    game.moveHelper.select(Moves.MAKE_IT_RAIN);
    game.moveHelper.select(Moves.SPLASH, 1);

    await game.phaseInterceptor.to(StatStageChangePhase);

    enemyPokemon.forEach((p) => expect(p.isFainted()).toBe(true));
    expect(playerPokemon.getStatStage(Stat.SPATK)).toBe(-1);
  });

  it("should lower SPATK stat stage by 1 if it only hits the second target", async () => {
    await game.startBattle([Species.CHARIZARD, Species.BLASTOISE]);

    const playerPokemon = game.scene.getPlayerPokemon()!;

    game.moveHelper.select(Moves.MAKE_IT_RAIN);
    game.moveHelper.select(Moves.SPLASH, 1);

    // Make Make It Rain miss the first target
    await game.moveHelper.forceMiss(true);

    await game.phaseInterceptor.to(MoveEndPhase);

    expect(playerPokemon.getStatStage(Stat.SPATK)).toBe(-1);
  });
});
