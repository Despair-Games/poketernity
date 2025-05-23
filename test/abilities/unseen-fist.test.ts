import { AbilityId } from "#enums/ability-id";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Abilities - Unseen Fist", () => {
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
      .enemySpecies(SpeciesId.SNORLAX)
      .enemyMoveset(MoveId.PROTECT)
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should cause a contact move to ignore Protect", async () =>
    await testUnseenFistHitResult(game, MoveId.QUICK_ATTACK, MoveId.PROTECT, true));

  it("should not cause a non-contact move to ignore Protect", async () =>
    await testUnseenFistHitResult(game, MoveId.ABSORB, MoveId.PROTECT, false));

  it("should not apply if the source has Long Reach", async () => {
    game.override.passiveAbility(AbilityId.LONG_REACH);
    await testUnseenFistHitResult(game, MoveId.QUICK_ATTACK, MoveId.PROTECT, false);
  });

  it("should cause a contact move to ignore Wide Guard", async () =>
    await testUnseenFistHitResult(game, MoveId.BREAKING_SWIPE, MoveId.WIDE_GUARD, true));

  it("should not cause a non-contact move to ignore Wide Guard", async () =>
    await testUnseenFistHitResult(game, MoveId.BULLDOZE, MoveId.WIDE_GUARD, false));

  it("should cause a contact move to ignore Protect, but not Substitute", async () => {
    game.override.enemyLevel(1);
    game.override.moveset([MoveId.TACKLE]);

    await game.classicMode.startBattle(SpeciesId.URSHIFU);

    const enemyPokemon = game.scene.getEnemyPokemon()!;
    enemyPokemon.addTag(BattlerTagType.SUBSTITUTE, 0, MoveId.NONE, enemyPokemon.id);

    game.move.select(MoveId.TACKLE);

    await game.phaseInterceptor.to("BerryPhase", false);

    expect(enemyPokemon.getTag(BattlerTagType.SUBSTITUTE)).toBeUndefined();
    expect(enemyPokemon.hp).toBe(enemyPokemon.getMaxHp());
  });
});

async function testUnseenFistHitResult(
  game: GameManager,
  attackMoveId: MoveId,
  protectMoveId: MoveId,
  shouldSucceed: boolean = true,
): Promise<void> {
  game.override.moveset([attackMoveId]);
  game.override.enemyMoveset(protectMoveId);

  await game.classicMode.startBattle(SpeciesId.URSHIFU);

  const enemyPokemon = game.field.getEnemyPokemon();

  const enemyStartingHp = enemyPokemon.hp;

  game.move.select(attackMoveId);
  await game.phaseInterceptor.to("TurnEndPhase", false);

  if (shouldSucceed) {
    expect(enemyPokemon.hp).toBeLessThan(enemyStartingHp);
  } else {
    expect(enemyPokemon.hp).toBe(enemyStartingHp);
  }
}
