import { Stat } from "#enums/stat";
import { GameManager } from "#test/testUtils/gameManager";
import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { EnemyCommandPhase } from "#app/phases/enemy-command-phase";
import { TurnInitPhase } from "#app/phases/turn-init-phase";

describe("Moves - Growth", () => {
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
    game.overridesHelper.enemyAbility(Abilities.MOXIE);
    game.overridesHelper.ability(Abilities.INSOMNIA);
    game.overridesHelper.moveset([Moves.GROWTH]);
    game.overridesHelper.enemyMoveset(Moves.SPLASH);
  });

  it("should raise SPATK stat stage by 1", async () => {
    await game.startBattle([Species.MIGHTYENA]);

    const playerPokemon = game.scene.getPlayerPokemon()!;

    expect(playerPokemon.getStatStage(Stat.SPATK)).toBe(0);

    game.move.select(Moves.GROWTH);
    await game.phaseInterceptor.runFrom(EnemyCommandPhase).to(TurnInitPhase);

    expect(playerPokemon.getStatStage(Stat.SPATK)).toBe(1);
  }, 20000);
});
