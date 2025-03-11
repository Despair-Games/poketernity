import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { allMoves } from "#app/data/data-lists";
import { MoveFlags } from "#enums/move-flags";

describe("Abilities - Move Flag Power Boost Ability Attr", () => {
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
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH);
  });

  // Note: All affected moves have been verified to have the flag required by all_moves
  it.each([
    {
      ability: Abilities.MEGA_LAUNCHER,
      abilityName: "Mega Launcher",
      moveId: MoveId.DARK_PULSE,
      moveFlag: MoveFlags.PULSE_MOVE,
      factor: 1.5,
    },
    {
      ability: Abilities.IRON_FIST,
      abilityName: "Iron Fist",
      moveId: MoveId.FIRE_PUNCH,
      moveFlag: MoveFlags.PUNCHING_MOVE,
      factor: 1.2,
    },
    {
      ability: Abilities.TOUGH_CLAWS,
      abilityName: "Tough Claws",
      moveId: MoveId.TACKLE,
      moveFlag: MoveFlags.MAKES_CONTACT,
      factor: 1.3,
    },
    {
      ability: Abilities.PUNK_ROCK,
      abilityName: "Punk Rock",
      moveId: MoveId.UPROAR,
      moveFlag: MoveFlags.SOUND_MOVE,
      factor: 1.3,
    },
    {
      ability: Abilities.STRONG_JAW,
      abilityName: "Strong Jaw",
      moveId: MoveId.FIRE_FANG,
      moveFlag: MoveFlags.BITING_MOVE,
      factor: 1.5,
    },
    {
      ability: Abilities.RECKLESS,
      abilityName: "Reckless",
      moveId: MoveId.TAKE_DOWN,
      moveFlag: MoveFlags.RECKLESS_MOVE,
      factor: 1.2,
    },
    {
      ability: Abilities.SHARPNESS,
      abilityName: "Sharpness",
      moveId: MoveId.CUT,
      moveFlag: MoveFlags.SLICING_MOVE,
      factor: 1.5,
    },
  ])(
    "$abilityName should boost the damage of specific moves by a factor of $factor",
    async ({ ability, moveId: move, moveFlag, factor }) => {
      game.override.moveset(move).ability(ability);
      await game.classicMode.startBattle([Species.FEEBAS]);
      const playerPokemon = game.scene.getPlayerPokemon()!;
      const moveUsed = allMoves.get(move);
      vi.spyOn(moveUsed, "calculateBattlePower");

      game.move.select(move);
      await game.move.forceHit();
      await game.toEndOfTurn();

      expect(moveUsed.checkFlag(moveFlag, playerPokemon, null)).toBe(true);
      expect(moveUsed.calculateBattlePower).toHaveLastReturnedWith(moveUsed.power * factor);
    },
  );
});
