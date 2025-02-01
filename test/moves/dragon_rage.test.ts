import type { EnemyPokemon, PlayerPokemon } from "#app/field/pokemon";
import { Abilities } from "#enums/abilities";
import { BattlerTagType } from "#enums/battler-tag-type";
import { ElementType } from "#enums/element-type";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { Stat } from "#enums/stat";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Moves - Dragon Rage", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;
  let partyPokemon: PlayerPokemon;
  let enemyPokemon: EnemyPokemon;

  const dragonRageDamage = 40;

  beforeAll(() => {
    phaserGame = new Phaser.Game({
      type: Phaser.HEADLESS,
    });
  });

  afterEach(() => {
    game.phaseInterceptor.restoreOg();
  });

  beforeEach(async () => {
    game = new GameManager(phaserGame);

    game.override
      .battleType("single")
      .moveset([Moves.DRAGON_RAGE])
      .ability(Abilities.BALL_FETCH)
      .startingLevel(100)
      .enemySpecies(Species.SNORLAX)
      .enemyMoveset(Moves.SPLASH)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyLevel(100);

    await game.classicMode.startBattle([Species.SNORLAX]);

    partyPokemon = game.field.getPlayerPokemon();
    enemyPokemon = game.field.getEnemyPokemon();
  });

  it("ignores weaknesses", async () => {
    game.override.disableCrits();
    vi.spyOn(enemyPokemon, "getTypes").mockReturnValue([ElementType.DRAGON]);

    game.move.select(Moves.DRAGON_RAGE);
    await game.phaseInterceptor.to("TurnEndPhase");

    expect(enemyPokemon.getInverseHp()).toBe(dragonRageDamage);
  });

  it("ignores resistances", async () => {
    game.override.disableCrits();
    vi.spyOn(enemyPokemon, "getTypes").mockReturnValue([ElementType.STEEL]);

    game.move.select(Moves.DRAGON_RAGE);
    await game.phaseInterceptor.to("TurnEndPhase");

    expect(enemyPokemon.getInverseHp()).toBe(dragonRageDamage);
  });

  it("ignores SPATK stat stages", async () => {
    game.override.disableCrits();
    partyPokemon.setStatStage(Stat.SPATK, 2);

    game.move.select(Moves.DRAGON_RAGE);
    await game.phaseInterceptor.to("TurnEndPhase");

    expect(enemyPokemon.getInverseHp()).toBe(dragonRageDamage);
  });

  it("ignores stab", async () => {
    game.override.disableCrits();
    vi.spyOn(partyPokemon, "getTypes").mockReturnValue([ElementType.DRAGON]);

    game.move.select(Moves.DRAGON_RAGE);
    await game.phaseInterceptor.to("TurnEndPhase");

    expect(enemyPokemon.getInverseHp()).toBe(dragonRageDamage);
  });

  it("should prevent critical hits", async () => {
    partyPokemon.addTag(BattlerTagType.ALWAYS_CRIT, 99, Moves.NONE, 0);

    game.move.select(Moves.DRAGON_RAGE);
    await game.phaseInterceptor.to("BerryPhase");

    const lastAttackReceived = enemyPokemon.turnData.attacksReceived[0];
    expect(lastAttackReceived.isCritical).toBe(false);
  });

  it("ignores damage modification from abilities, for example ICE_SCALES", async () => {
    game.override.disableCrits();
    game.override.enemyAbility(Abilities.ICE_SCALES);

    game.move.select(Moves.DRAGON_RAGE);
    await game.phaseInterceptor.to("TurnEndPhase");

    expect(enemyPokemon.getInverseHp()).toBe(dragonRageDamage);
  });
});
