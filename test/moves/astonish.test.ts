import { allMoves } from "#app/data/all-moves";
import { BattlerTagType } from "#enums/battler-tag-type";
import { BerryPhase } from "#app/phases/berry-phase";
import { CommandPhase } from "#app/phases/command-phase";
import { MoveEndPhase } from "#app/phases/move-end-phase";
import { TurnEndPhase } from "#app/phases/turn-end-phase";
import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";

describe("Moves - Astonish", () => {
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
    game.overridesHelper.moveset([Moves.ASTONISH, Moves.SPLASH]);
    game.overridesHelper.enemySpecies(Species.BLASTOISE);
    game.overridesHelper.enemyAbility(Abilities.INSOMNIA);
    game.overridesHelper.enemyMoveset([Moves.TACKLE, Moves.TACKLE, Moves.TACKLE, Moves.TACKLE]);
    game.overridesHelper.startingLevel(100);
    game.overridesHelper.enemyLevel(100);

    vi.spyOn(allMoves[Moves.ASTONISH], "chance", "get").mockReturnValue(100);
  });

  test("move effect should cancel the target's move on the turn it applies", async () => {
    await game.startBattle([Species.MEOWSCARADA]);

    const leadPokemon = game.scene.getPlayerPokemon()!;

    const enemyPokemon = game.scene.getEnemyPokemon()!;

    game.moveHelper.select(Moves.ASTONISH);

    await game.phaseInterceptor.to(MoveEndPhase, false);

    expect(enemyPokemon.getTag(BattlerTagType.FLINCHED)).toBeDefined();

    await game.phaseInterceptor.to(TurnEndPhase);

    expect(leadPokemon.hp).toBe(leadPokemon.getMaxHp());
    expect(enemyPokemon.getTag(BattlerTagType.FLINCHED)).toBeUndefined();

    await game.phaseInterceptor.to(CommandPhase, false);

    game.moveHelper.select(Moves.SPLASH);

    await game.phaseInterceptor.to(BerryPhase, false);

    expect(leadPokemon.hp).toBeLessThan(leadPokemon.getMaxHp());
  });
});
