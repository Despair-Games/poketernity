import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { Stat } from "#enums/stat";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { allMoves } from "#app/data/data-lists";
import { MoveFlags } from "#enums/move-flags";

describe("Abilities - Gooey/Tangling Hair", () => {
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
      .moveset([MoveId.TACKLE, MoveId.EMBER, MoveId.DOUBLE_IRON_BASH])
      .ability(Abilities.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyMoveset(MoveId.SPLASH);
  });

  it.each([
    { abilityName: "Gooey", ability: Abilities.GOOEY },
    { abilityName: "Tangling Hair", ability: Abilities.TANGLING_HAIR },
  ])(
    "$abilityName should decrease the attacker's speed by 1 stage if the attacker uses a contact move",
    async ({ ability }) => {
      game.override.enemyAbility(ability);
      await game.classicMode.startBattle([Species.FEEBAS]);
      const pokemon = game.scene.getPlayerPokemon()!;

      game.move.select(MoveId.TACKLE);
      await game.toEndOfTurn();

      expect(allMoves.get(MoveId.TACKLE).hasFlag(MoveFlags.MAKES_CONTACT)).toBe(true);
      expect(pokemon.getStatStage(Stat.SPD)).toBe(-1);
    },
  );

  it.each([
    { abilityName: "Gooey", ability: Abilities.GOOEY },
    { abilityName: "Tangling Hair", ability: Abilities.TANGLING_HAIR },
  ])(
    "$abilityName should not activate if the attacker has the ability Long Reach and uses a contact move",
    async ({ ability }) => {
      game.override.ability(Abilities.LONG_REACH).enemyAbility(ability);
      await game.classicMode.startBattle([Species.FEEBAS]);
      const pokemon = game.scene.getPlayerPokemon()!;

      game.move.select(MoveId.TACKLE);
      await game.toEndOfTurn();

      expect(allMoves.get(MoveId.TACKLE).hasFlag(MoveFlags.MAKES_CONTACT)).toBe(true);
      expect(pokemon.getStatStage(Stat.SPD)).toBe(0);
    },
  );

  it.each([
    { abilityName: "Gooey", ability: Abilities.GOOEY },
    { abilityName: "Tangling Hair", ability: Abilities.TANGLING_HAIR },
  ])(
    "$abilityName should not affect the attacker's speed if the attacker does not use a contact move",
    async ({ ability }) => {
      game.override.enemyAbility(ability);
      await game.classicMode.startBattle([Species.FEEBAS]);
      const pokemon = game.scene.getPlayerPokemon()!;

      game.move.select(MoveId.EMBER);
      await game.toEndOfTurn();

      expect(allMoves.get(MoveId.EMBER).hasFlag(MoveFlags.MAKES_CONTACT)).toBe(false);
      expect(pokemon.getStatStage(Stat.SPD)).toBe(0);
    },
  );

  it.each([
    { abilityName: "Gooey", ability: Abilities.GOOEY },
    { abilityName: "Tangling Hair", ability: Abilities.TANGLING_HAIR },
  ])("$abilityName should activate per hit of a contact-making multi-strike move", async ({ ability }) => {
    game.override.enemyAbility(ability);
    await game.classicMode.startBattle([Species.FEEBAS]);
    const pokemon = game.scene.getPlayerPokemon()!;

    game.move.select(MoveId.DOUBLE_IRON_BASH);
    await game.toEndOfTurn();

    expect(allMoves.get(MoveId.DOUBLE_IRON_BASH).hasFlag(MoveFlags.MAKES_CONTACT)).toBe(true);
    expect(pokemon.getStatStage(Stat.SPD)).toBe(-2);
  });
});
