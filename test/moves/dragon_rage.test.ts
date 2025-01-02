import { Stat } from "#enums/stat";
import { Type } from "#enums/type";
import { Species } from "#enums/species";
import type { EnemyPokemon, PlayerPokemon } from "#app/field/pokemon";
import { TurnEndPhase } from "#app/phases/turn-end-phase";
import { Abilities } from "#enums/abilities";
import { BattlerTagType } from "#enums/battler-tag-type";
import { Moves } from "#enums/moves";
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

    game.overridesHelper.battleType("single");

    game.overridesHelper.starterSpecies(Species.SNORLAX);
    game.overridesHelper.moveset([Moves.DRAGON_RAGE]);
    game.overridesHelper.ability(Abilities.BALL_FETCH);
    game.overridesHelper.passiveAbility(Abilities.BALL_FETCH);
    game.overridesHelper.startingLevel(100);

    game.overridesHelper.enemySpecies(Species.SNORLAX);
    game.overridesHelper.enemyMoveset(Moves.SPLASH);
    game.overridesHelper.enemyAbility(Abilities.BALL_FETCH);
    game.overridesHelper.enemyPassiveAbility(Abilities.BALL_FETCH);
    game.overridesHelper.enemyLevel(100);

    await game.startBattle();

    partyPokemon = game.scene.getPlayerParty()[0];
    enemyPokemon = game.scene.getEnemyPokemon()!;

    // remove berries
    game.scene.removePartyMemberModifiers(0);
    game.scene.clearEnemyHeldItemModifiers();
  });

  it("ignores weaknesses", async () => {
    game.overridesHelper.disableCrits();
    vi.spyOn(enemyPokemon, "getTypes").mockReturnValue([Type.DRAGON]);

    game.moveHelper.select(Moves.DRAGON_RAGE);
    await game.phaseInterceptor.to(TurnEndPhase);

    expect(enemyPokemon.getInverseHp()).toBe(dragonRageDamage);
  });

  it("ignores resistances", async () => {
    game.overridesHelper.disableCrits();
    vi.spyOn(enemyPokemon, "getTypes").mockReturnValue([Type.STEEL]);

    game.moveHelper.select(Moves.DRAGON_RAGE);
    await game.phaseInterceptor.to(TurnEndPhase);

    expect(enemyPokemon.getInverseHp()).toBe(dragonRageDamage);
  });

  it("ignores SPATK stat stages", async () => {
    game.overridesHelper.disableCrits();
    partyPokemon.setStatStage(Stat.SPATK, 2);

    game.moveHelper.select(Moves.DRAGON_RAGE);
    await game.phaseInterceptor.to(TurnEndPhase);

    expect(enemyPokemon.getInverseHp()).toBe(dragonRageDamage);
  });

  it("ignores stab", async () => {
    game.overridesHelper.disableCrits();
    vi.spyOn(partyPokemon, "getTypes").mockReturnValue([Type.DRAGON]);

    game.moveHelper.select(Moves.DRAGON_RAGE);
    await game.phaseInterceptor.to(TurnEndPhase);

    expect(enemyPokemon.getInverseHp()).toBe(dragonRageDamage);
  });

  it("should prevent critical hits", async () => {
    partyPokemon.addTag(BattlerTagType.ALWAYS_CRIT, 99, Moves.NONE, 0);

    game.moveHelper.select(Moves.DRAGON_RAGE);
    await game.phaseInterceptor.to("BerryPhase");

    const lastAttackReceived = enemyPokemon.turnData.attacksReceived[0];
    expect(lastAttackReceived.isCritical).toBe(false);
  });

  it("ignores damage modification from abilities, for example ICE_SCALES", async () => {
    game.overridesHelper.disableCrits();
    game.overridesHelper.enemyAbility(Abilities.ICE_SCALES);

    game.moveHelper.select(Moves.DRAGON_RAGE);
    await game.phaseInterceptor.to(TurnEndPhase);

    expect(enemyPokemon.getInverseHp()).toBe(dragonRageDamage);
  });
});
