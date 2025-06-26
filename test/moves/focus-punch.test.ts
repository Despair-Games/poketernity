import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Moves - Focus Punch", () => {
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
      .ability(AbilityId.UNNERVE)
      .moveset([MoveId.FOCUS_PUNCH])
      .enemySpecies(SpeciesId.GROUDON)
      .enemyAbility(AbilityId.INSOMNIA)
      .enemyMoveset(MoveId.SPLASH)
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should deal damage at the end of turn if uninterrupted", async () => {
    await game.classicMode.startBattle(SpeciesId.CHARIZARD);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();

    game.move.select(MoveId.FOCUS_PUNCH);

    await game.phaseInterceptor.to("MoveHeaderPhase");

    expect(enemy.hp).toBe(enemy.getMaxHp());
    expect(player.getMoveHistory()).toHaveLength(0);

    await game.toEndOfTurn();

    expect(enemy.hp).toBeLessThan(enemy.getMaxHp());
    expect(player.getMoveHistory()).toHaveLength(1);
    expect(player.turnData.totalDamageDealt).toBe(enemy.getMaxHp() - enemy.hp);
  });

  it("should fail if the user is hit", async () => {
    game.override.enemyMoveset([MoveId.TACKLE]);

    await game.classicMode.startBattle(SpeciesId.CHARIZARD);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();

    game.move.select(MoveId.FOCUS_PUNCH);

    await game.phaseInterceptor.to("MoveHeaderPhase");

    expect(enemy.hp).toBe(enemy.getMaxHp());
    expect(player.getMoveHistory()).toHaveLength(0);

    await game.toEndOfTurn();

    expect(enemy.hp).toBe(enemy.getMaxHp());
    expect(player.getMoveHistory()).toHaveLength(1);
    expect(player.turnData.totalDamageDealt).toBe(0);
  });

  it("should be cancelled if the user falls asleep mid-turn", async () => {
    game.override.enemyMoveset([MoveId.SPORE]);

    await game.classicMode.startBattle(SpeciesId.CHARIZARD);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();

    game.move.select(MoveId.FOCUS_PUNCH);

    await game.phaseInterceptor.to("MoveHeaderPhase");

    expect(player.getMoveHistory()).toHaveLength(0);

    await game.toEndOfTurn();

    expect(player.getMoveHistory()).toHaveLength(1);
    expect(enemy.hp).toBe(enemy.getMaxHp());
  });

  it("should not queue its pre-move message before an enemy switches", async () => {
    /** Guarantee a Trainer battle with multiple enemy Pokemon */
    game.override.startingWave(25);

    await game.classicMode.startBattle(SpeciesId.CHARIZARD);

    game.forceEnemyToSwitch();
    game.move.select(MoveId.FOCUS_PUNCH);

    await game.phaseInterceptor.to("TurnStartPhase");

    expect(game.scene.phaseManager.getCurrentPhase()?.phaseName).toBe("SwitchSummonPhase");

    await game.phaseInterceptor.to("PostActionPhase");

    expect(game.scene.phaseManager.getCurrentPhase()?.phaseName).toBe("MoveHeaderPhase");
  });
});
