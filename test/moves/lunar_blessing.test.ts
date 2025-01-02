import { StatusEffect } from "#enums/status-effect";
import { CommandPhase } from "#app/phases/command-phase";
import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Moves - Lunar Blessing", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;

  beforeAll(() => {
    phaserGame = new Phaser.Game({ type: Phaser.HEADLESS });
  });

  afterEach(() => {
    game.phaseInterceptor.restoreOg();
  });

  beforeEach(() => {
    game = new GameManager(phaserGame);

    game.overridesHelper.battleType("double");

    game.overridesHelper.enemySpecies(Species.SHUCKLE);
    game.overridesHelper.enemyMoveset(Moves.SPLASH);
    game.overridesHelper.enemyAbility(Abilities.BALL_FETCH);

    game.overridesHelper.moveset([Moves.LUNAR_BLESSING, Moves.SPLASH]);
    game.overridesHelper.ability(Abilities.BALL_FETCH);
  });

  it("should restore 25% HP of the user and its ally", async () => {
    await game.startBattle([Species.RATTATA, Species.RATTATA]);
    const [leftPlayer, rightPlayer] = game.scene.getPlayerField();

    vi.spyOn(leftPlayer, "getMaxHp").mockReturnValue(100);
    vi.spyOn(rightPlayer, "getMaxHp").mockReturnValue(100);

    const initialHp = 1;
    leftPlayer["hp"] = initialHp;
    rightPlayer["hp"] = initialHp;
    const expectedHeal = 25;

    vi.spyOn(leftPlayer, "heal");
    vi.spyOn(rightPlayer, "heal");

    game.moveHelper.select(Moves.LUNAR_BLESSING, 0);
    await game.phaseInterceptor.to(CommandPhase);
    game.moveHelper.select(Moves.SPLASH, 1);
    await game.toNextTurn();

    expect(leftPlayer.heal).toHaveBeenCalledOnce();
    expect(leftPlayer.heal).toHaveReturnedWith(expectedHeal);

    expect(rightPlayer.heal).toHaveBeenCalledOnce();
    expect(rightPlayer.heal).toHaveReturnedWith(expectedHeal);
  });

  it("should cure status effect of the user and its ally", async () => {
    game.overridesHelper.statusEffect(StatusEffect.BURN);
    await game.startBattle([Species.RATTATA, Species.RATTATA]);
    const [leftPlayer, rightPlayer] = game.scene.getPlayerField();

    vi.spyOn(leftPlayer, "resetStatus");
    vi.spyOn(rightPlayer, "resetStatus");

    game.moveHelper.select(Moves.LUNAR_BLESSING, 0);
    await game.phaseInterceptor.to(CommandPhase);
    game.moveHelper.select(Moves.SPLASH, 1);
    await game.toNextTurn();

    expect(leftPlayer.resetStatus).toHaveBeenCalledOnce();
    expect(rightPlayer.resetStatus).toHaveBeenCalledOnce();

    expect(leftPlayer.status?.effect).toBeUndefined();
    expect(rightPlayer.status?.effect).toBeUndefined();
  });
});
