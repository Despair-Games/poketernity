import { AbilityId } from "#enums/ability-id";
import { BattlerIndex } from "#enums/battler-index";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

// TODO: make `expect`s more specific
describe("Abilities - Sweet Veil", () => {
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
      .battleType("double")
      .ability(AbilityId.BALL_FETCH)
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH);
  });

  it("prevents the user and its allies from falling asleep", async () => {
    game.override.enemyMoveset(MoveId.SPORE);
    await game.classicMode.startBattle(SpeciesId.SWIRLIX, SpeciesId.MAGIKARP);
    game.field.mockAbility(game.field.getPlayerPokemon(), AbilityId.SWEET_VEIL);

    game.move.use(MoveId.SPLASH);
    game.move.use(MoveId.SPLASH, 1);

    await game.toEndOfTurn();

    expect(game.scene.getPlayerField().some((p) => p.hasNonVolatileStatusEffect(true, true))).toBe(false);
  });

  it("causes Rest to fail when used by the user or its allies", async () => {
    game.override.enemyMoveset(MoveId.SPLASH);
    await game.classicMode.startBattle(SpeciesId.SWIRLIX, SpeciesId.MAGIKARP);
    game.field.mockAbility(game.field.getPlayerPokemon(), AbilityId.SWEET_VEIL);
    // Damage Pokemon so they can attempt to use Rest
    for (const p of game.scene.getPlayerField()) {
      p.hp = 1;
    }
    game.move.use(MoveId.REST);
    game.move.use(MoveId.REST, 1);

    await game.toEndOfTurn();

    expect(game.scene.getPlayerField().some((p) => p.hasNonVolatileStatusEffect(true, true))).toBe(false);
    expect(game.scene.getPlayerField().every((p) => p.hp === 1)).toBe(true);
  });

  it("causes Yawn to fail if used on the user or its allies", async () => {
    game.override.enemyMoveset(MoveId.YAWN);
    await game.classicMode.startBattle(SpeciesId.SWIRLIX, SpeciesId.MAGIKARP);
    game.field.mockAbility(game.field.getPlayerPokemon(), AbilityId.SWEET_VEIL);

    game.move.use(MoveId.SPLASH);
    game.move.use(MoveId.SPLASH, 1);

    await game.toEndOfTurn();

    expect(game.scene.getPlayerField().some((p) => p.hasTag(BattlerTagType.DROWSY))).toBe(false);
  });

  it("prevents the user and its allies already drowsy due to Yawn from falling asleep.", async () => {
    game.override.enemyMoveset(MoveId.YAWN);
    await game.classicMode.startBattle(SpeciesId.FEEBAS, SpeciesId.SHUCKLE, SpeciesId.SWIRLIX);
    game.field.mockAbility(game.scene.getPlayerParty()[2], AbilityId.SWEET_VEIL);

    game.move.use(MoveId.SPLASH);
    game.move.use(MoveId.YAWN, 1, BattlerIndex.PLAYER);

    await game.toNextTurn();

    expect(game.scene.getPlayerField().some((p) => p.hasTag(BattlerTagType.DROWSY))).toBe(true);

    // Turn 2: Switch into Swirlix with Sweet Veil
    game.move.use(MoveId.SPLASH);
    game.switchPokemon(2);

    await game.toEndOfTurn();

    expect(game.scene.getPlayerField().some((p) => p.hasNonVolatileStatusEffect(true, true))).toBe(false);
  });
});
