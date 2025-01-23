import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { allMoves } from "#app/data/all-moves";
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
      .enemyMoveset(Moves.SPLASH);
  });

  // Note: All affected moves have been verified to have the flag required by all_moves
  it.each([
    {
      ability: Abilities.MEGA_LAUNCHER,
      abilityName: "Mega Launcher",
      move: Moves.DARK_PULSE,
      moveFlag: MoveFlags.PULSE_MOVE,
      factor: 1.5,
    },
    {
      ability: Abilities.IRON_FIST,
      abilityName: "Iron Fist",
      move: Moves.FIRE_PUNCH,
      moveFlag: MoveFlags.PUNCHING_MOVE,
      factor: 1.2,
    },
    {
      ability: Abilities.TOUGH_CLAWS,
      abilityName: "Tough Claws",
      move: Moves.TACKLE,
      moveFlag: MoveFlags.MAKES_CONTACT,
      factor: 1.3,
    },
    {
      ability: Abilities.PUNK_ROCK,
      abilityName: "Punk Rock",
      move: Moves.UPROAR,
      moveFlag: MoveFlags.SOUND_MOVE,
      factor: 1.3,
    },
    {
      ability: Abilities.STRONG_JAW,
      abilityName: "Strong Jaw",
      move: Moves.FIRE_FANG,
      moveFlag: MoveFlags.BITING_MOVE,
      factor: 1.5,
    },
    {
      ability: Abilities.RECKLESS,
      abilityName: "Reckless",
      move: Moves.TAKE_DOWN,
      moveFlag: MoveFlags.RECKLESS_MOVE,
      factor: 1.2,
    },
    {
      ability: Abilities.SHARPNESS,
      abilityName: "Sharpness",
      move: Moves.CUT,
      moveFlag: MoveFlags.SLICING_MOVE,
      factor: 1.5,
    },
  ])(
    "$abilityName should boost the damage of specific moves by a factor of $factor",
    async ({ ability, move, moveFlag, factor }) => {
      game.override.moveset(move).ability(ability);
      await game.classicMode.startBattle([Species.FEEBAS]);
      const playerPokemon = game.scene.getPlayerPokemon()!;
      const moveUsed = allMoves[move];
      vi.spyOn(moveUsed, "calculateBattlePower");

      game.move.select(move);
      await game.move.forceHit();
      await game.phaseInterceptor.to("BerryPhase");

      expect(moveUsed.checkFlag(moveFlag, playerPokemon, null)).toBe(true);
      expect(moveUsed.calculateBattlePower).toHaveLastReturnedWith(moveUsed.power * factor);
    },
  );
});
