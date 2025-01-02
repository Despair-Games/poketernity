import { BattlerTagType } from "#enums/battler-tag-type";
import { TurnEndPhase } from "#app/phases/turn-end-phase";
import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Abilities - Wind Power", () => {
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
    game.overridesHelper.battleType("single");
    game.overridesHelper.enemySpecies(Species.SHIFTRY);
    game.overridesHelper.enemyAbility(Abilities.WIND_POWER);
    game.overridesHelper.moveset([Moves.TAILWIND, Moves.SPLASH, Moves.PETAL_BLIZZARD, Moves.SANDSTORM]);
    game.overridesHelper.enemyMoveset(Moves.SPLASH);
  });

  it("it becomes charged when hit by wind moves", async () => {
    await game.startBattle([Species.MAGIKARP]);
    const shiftry = game.scene.getEnemyPokemon()!;

    expect(shiftry.getTag(BattlerTagType.CHARGED)).toBeUndefined();

    game.moveHelper.select(Moves.PETAL_BLIZZARD);
    await game.phaseInterceptor.to(TurnEndPhase);

    expect(shiftry.getTag(BattlerTagType.CHARGED)).toBeDefined();
  });

  it("it becomes charged when Tailwind takes effect on its side", async () => {
    game.overridesHelper.ability(Abilities.WIND_POWER);
    game.overridesHelper.enemySpecies(Species.MAGIKARP);

    await game.startBattle([Species.SHIFTRY]);
    const shiftry = game.scene.getPlayerPokemon()!;

    expect(shiftry.getTag(BattlerTagType.CHARGED)).toBeUndefined();

    game.moveHelper.select(Moves.TAILWIND);
    await game.phaseInterceptor.to(TurnEndPhase);

    expect(shiftry.getTag(BattlerTagType.CHARGED)).toBeDefined();
  });

  it("does not become charged when Tailwind takes effect on opposing side", async () => {
    game.overridesHelper.enemySpecies(Species.MAGIKARP);
    game.overridesHelper.ability(Abilities.WIND_POWER);

    await game.startBattle([Species.SHIFTRY]);
    const magikarp = game.scene.getEnemyPokemon()!;
    const shiftry = game.scene.getPlayerPokemon()!;

    expect(shiftry.getTag(BattlerTagType.CHARGED)).toBeUndefined();
    expect(magikarp.getTag(BattlerTagType.CHARGED)).toBeUndefined();

    game.moveHelper.select(Moves.TAILWIND);

    await game.phaseInterceptor.to(TurnEndPhase);

    expect(shiftry.getTag(BattlerTagType.CHARGED)).toBeDefined();
    expect(magikarp.getTag(BattlerTagType.CHARGED)).toBeUndefined();
  });

  it("does not interact with Sandstorm", async () => {
    game.overridesHelper.enemySpecies(Species.MAGIKARP);

    await game.startBattle([Species.SHIFTRY]);
    const shiftry = game.scene.getPlayerPokemon()!;

    expect(shiftry.getTag(BattlerTagType.CHARGED)).toBeUndefined();

    game.moveHelper.select(Moves.SANDSTORM);

    await game.phaseInterceptor.to(TurnEndPhase);

    expect(shiftry.getTag(BattlerTagType.CHARGED)).toBeUndefined();
  });
});
