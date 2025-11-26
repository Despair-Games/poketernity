import { allMoves } from "#data/data-lists";
import { AbilityId } from "#enums/ability-id";
import { BerryType } from "#enums/berry-type";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Abilities - Sticky Hold", () => {
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
    // We are testing Sticky Hold on the enemy, since Knock Off's item removal is coded to not affect the player.
    game.override
      .ability(AbilityId.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.STICKY_HOLD)
      .enemyHeldItems([{ name: "BERRY", type: BerryType.LUM }])
      .enemyLevel(100);
  });

  const stealMoves = [MoveId.THIEF, MoveId.PLUCK, MoveId.INCINERATE, MoveId.KNOCK_OFF] as const;
  const stealMovesObj = stealMoves.map((moveId) => ({ moveId, name: MoveId[moveId] }));
  it.each(stealMovesObj)(//
  "should prevent the user from losing a held item when hit by the move $name", async ({ moveId }) => {
    vi.spyOn(allMoves.get(moveId), "chance", "get").mockReturnValue(-1);

    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    game.move.use(moveId);
    await game.move.forceEnemyMove(MoveId.SPLASH);
    await game.toNextTurn();

    const enemyPokemon = game.field.getEnemyPokemon();
    expect(enemyPokemon.getHeldItems().length).toBe(1);
  });

  // TODO: add Corrosive Gas to this test block when it's implemented
  const stealAbilities = [AbilityId.MAGICIAN, AbilityId.PICKPOCKET] as const;
  const stealAbilitiesObj = stealAbilities.map((abilityId) => ({ abilityId, name: AbilityId[abilityId] }));
  it.each(stealAbilitiesObj)(//
  "should prevent the user's held item from being stolen by the ability $name", async ({ abilityId }) => {
    game.override.ability(abilityId);
    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    game.move.use(MoveId.FALSE_SWIPE);
    await game.move.forceEnemyMove(MoveId.FALSE_SWIPE);
    await game.toNextTurn();

    const enemyPokemon = game.field.getEnemyPokemon();
    expect(enemyPokemon.getHeldItems().length).toBe(1);
  });
});
