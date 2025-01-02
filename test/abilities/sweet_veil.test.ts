import { BattlerIndex } from "#app/battle";
import { Abilities } from "#enums/abilities";
import { BattlerTagType } from "#enums/battler-tag-type";
import { CommandPhase } from "#app/phases/command-phase";
import { TurnEndPhase } from "#app/phases/turn-end-phase";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

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
    game.overridesHelper.battleType("double");
    game.overridesHelper.moveset([Moves.SPLASH, Moves.REST, Moves.YAWN]);
    game.overridesHelper.enemySpecies(Species.MAGIKARP);
    game.overridesHelper.enemyAbility(Abilities.BALL_FETCH);
    game.overridesHelper.enemyMoveset([Moves.POWDER, Moves.POWDER, Moves.POWDER, Moves.POWDER]);
  });

  it("prevents the user and its allies from falling asleep", async () => {
    await game.startBattle([Species.SWIRLIX, Species.MAGIKARP]);

    game.moveHelper.select(Moves.SPLASH);
    game.moveHelper.select(Moves.SPLASH, 1);

    await game.phaseInterceptor.to(TurnEndPhase);

    expect(game.scene.getPlayerField().every((p) => p.status?.effect)).toBe(false);
  });

  it("causes Rest to fail when used by the user or its allies", async () => {
    game.overridesHelper.enemyMoveset(Moves.SPLASH);
    await game.startBattle([Species.SWIRLIX, Species.MAGIKARP]);

    game.moveHelper.select(Moves.SPLASH);
    game.moveHelper.select(Moves.REST, 1);

    await game.phaseInterceptor.to(TurnEndPhase);

    expect(game.scene.getPlayerField().every((p) => p.status?.effect)).toBe(false);
  });

  it("causes Yawn to fail if used on the user or its allies", async () => {
    game.overridesHelper.enemyMoveset([Moves.YAWN, Moves.YAWN, Moves.YAWN, Moves.YAWN]);
    await game.startBattle([Species.SWIRLIX, Species.MAGIKARP]);

    game.moveHelper.select(Moves.SPLASH);
    game.moveHelper.select(Moves.SPLASH, 1);

    await game.phaseInterceptor.to(TurnEndPhase);

    expect(game.scene.getPlayerField().every((p) => !!p.getTag(BattlerTagType.DROWSY))).toBe(false);
  });

  it("prevents the user and its allies already drowsy due to Yawn from falling asleep.", async () => {
    game.overridesHelper.enemySpecies(Species.PIKACHU);
    game.overridesHelper.enemyLevel(5);
    game.overridesHelper.startingLevel(5);
    game.overridesHelper.enemyMoveset(Moves.SPLASH);

    await game.startBattle([Species.SHUCKLE, Species.SHUCKLE, Species.SWIRLIX]);

    game.moveHelper.select(Moves.SPLASH);
    game.moveHelper.select(Moves.YAWN, 1, BattlerIndex.PLAYER);

    await game.phaseInterceptor.to("BerryPhase");

    expect(game.scene.getPlayerField().some((p) => !!p.getTag(BattlerTagType.DROWSY))).toBe(true);

    await game.phaseInterceptor.to(CommandPhase);
    game.moveHelper.select(Moves.SPLASH);
    game.doSwitchPokemon(2);

    expect(game.scene.getPlayerField().every((p) => p.status?.effect)).toBe(false);
  });
});
