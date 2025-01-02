import { Stat } from "#enums/stat";
import { Species } from "#enums/species";
import type { EnemyPokemon, PlayerPokemon } from "#app/field/pokemon";
import { DamageAnimPhase } from "#app/phases/damage-anim-phase";
import { TurnEndPhase } from "#app/phases/turn-end-phase";
import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Moves - Fissure", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;
  let partyPokemon: PlayerPokemon;
  let enemyPokemon: EnemyPokemon;

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
    game.overridesHelper.disableCrits();

    game.overridesHelper.starterSpecies(Species.SNORLAX);
    game.overridesHelper.moveset([Moves.FISSURE]);
    game.overridesHelper.passiveAbility(Abilities.BALL_FETCH);
    game.overridesHelper.startingLevel(100);

    game.overridesHelper.enemySpecies(Species.SNORLAX);
    game.overridesHelper.enemyMoveset(Moves.SPLASH);
    game.overridesHelper.enemyPassiveAbility(Abilities.BALL_FETCH);
    game.overridesHelper.enemyLevel(100);

    await game.startBattle();

    partyPokemon = game.scene.getPlayerParty()[0];
    enemyPokemon = game.scene.getEnemyPokemon()!;

    // remove berries
    game.scene.removePartyMemberModifiers(0);
    game.scene.clearEnemyHeldItemModifiers();
  });

  it("ignores damage modification from abilities, for example FUR_COAT", async () => {
    game.overridesHelper.ability(Abilities.NO_GUARD);
    game.overridesHelper.enemyAbility(Abilities.FUR_COAT);

    game.move.select(Moves.FISSURE);
    await game.phaseInterceptor.to(DamageAnimPhase, true);

    expect(enemyPokemon.isFainted()).toBe(true);
  });

  it("ignores user's ACC stat stage", async () => {
    vi.spyOn(partyPokemon, "getAccuracyMultiplier");

    partyPokemon.setStatStage(Stat.ACC, -6);

    game.move.select(Moves.FISSURE);

    // wait for TurnEndPhase instead of DamagePhase as fissure might not actually inflict damage
    await game.phaseInterceptor.to(TurnEndPhase);

    expect(partyPokemon.getAccuracyMultiplier).toHaveReturnedWith(1);
  });

  it("ignores target's EVA stat stage", async () => {
    vi.spyOn(partyPokemon, "getAccuracyMultiplier");

    enemyPokemon.setStatStage(Stat.EVA, 6);

    game.move.select(Moves.FISSURE);

    // wait for TurnEndPhase instead of DamagePhase as fissure might not actually inflict damage
    await game.phaseInterceptor.to(TurnEndPhase);

    expect(partyPokemon.getAccuracyMultiplier).toHaveReturnedWith(1);
  });
});
