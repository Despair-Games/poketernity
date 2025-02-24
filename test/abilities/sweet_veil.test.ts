import { Abilities } from "#enums/abilities";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { allAbilities } from "#app/data/data-lists";

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
      .ability(Abilities.SWEET_VEIL)
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH);
  });

  it("prevents the user and its allies from falling asleep", async () => {
    game.override.enemyMoveset(MoveId.SPORE);
    await game.classicMode.startBattle([Species.SWIRLIX, Species.MAGIKARP]);

    game.move.use(MoveId.SPLASH);
    game.move.use(MoveId.SPLASH, 1);

    await game.toEndOfTurn();

    expect(game.scene.getPlayerField().some((p) => p.hasNonVolatileStatusEffect(true, true))).toBe(false);
  });

  it("causes Rest to fail when used by the user or its allies", async () => {
    game.override.enemyMoveset(MoveId.SPLASH);
    await game.classicMode.startBattle([Species.SWIRLIX, Species.MAGIKARP]);
    game.scene.getPlayerField().forEach((p) => (p.hp = 1)); // Damage Pokemon so they can attempt to use Rest

    game.move.use(MoveId.REST);
    game.move.use(MoveId.REST, 1);

    await game.toEndOfTurn();

    expect(game.scene.getPlayerField().some((p) => p.hasNonVolatileStatusEffect(true, true))).toBe(false);
    expect(game.scene.getPlayerField().every((p) => p.hp === 1)).toBe(true);
  });

  it("causes Yawn to fail if used on the user or its allies", async () => {
    game.override.enemyMoveset(MoveId.YAWN);
    await game.classicMode.startBattle([Species.SWIRLIX, Species.MAGIKARP]);

    game.move.use(MoveId.SPLASH);
    game.move.use(MoveId.SPLASH, 1);

    await game.toEndOfTurn();

    expect(game.scene.getPlayerField().some((p) => !!p.getTag(BattlerTagType.DROWSY))).toBe(false);
  });

  it("prevents the user and its allies already drowsy due to Yawn from falling asleep.", async () => {
    game.override.enemyMoveset(MoveId.YAWN).ability(Abilities.BALL_FETCH);
    await game.classicMode.startBattle([Species.FEEBAS, Species.SHUCKLE, Species.SWIRLIX]);

    // Prevent test failing due to Swirlix randomly rolling its HA
    vi.spyOn(game.scene.getPlayerParty()[2], "getAbility").mockReturnValue(allAbilities[Abilities.SWEET_VEIL]);

    game.move.use(MoveId.SPLASH);
    game.move.use(MoveId.SPLASH, 1);

    await game.toNextTurn();

    expect(game.scene.getPlayerField().some((p) => !!p.getTag(BattlerTagType.DROWSY))).toBe(true);

    // Turn 2: Switch into Swirlix with Sweet Veil
    game.move.use(MoveId.SPLASH);
    game.doSwitchPokemon(2);

    await game.toEndOfTurn();

    expect(game.scene.getPlayerField().some((p) => p.hasNonVolatileStatusEffect(true, true))).toBe(false);
  });
});
