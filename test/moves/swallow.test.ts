import { Stat } from "#enums/stat";
import { type StockpilingTag } from "#app/data/battler-tags";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveResult } from "#enums/move-result";
import { MovePhase } from "#app/phases/move-phase";
import { TurnInitPhase } from "#app/phases/turn-init-phase";
import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Moves - Swallow", () => {
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

    game.override.battleType("single");

    game.override.enemySpecies(Species.RATTATA);
    game.override.enemyMoveset(MoveId.SPLASH);
    game.override.enemyAbility(Abilities.NONE);
    game.override.enemyLevel(2000);

    game.override.moveset([MoveId.SWALLOW, MoveId.SWALLOW, MoveId.SWALLOW, MoveId.SWALLOW]);
    game.override.ability(Abilities.NONE);
  });

  describe("consumes all stockpile stacks to heal (scaling with stacks)", () => {
    it("1 stack -> 25% heal", async () => {
      const stacksToSetup = 1;
      const expectedHeal = 25;

      await game.startBattle([Species.ABOMASNOW]);

      const pokemon = game.scene.getPlayerPokemon()!;
      vi.spyOn(pokemon, "getMaxHp").mockReturnValue(100);
      pokemon["hp"] = 1;

      pokemon.addTag(BattlerTagType.STOCKPILING);

      const stockpilingTag = pokemon.getTag<StockpilingTag>(BattlerTagType.STOCKPILING)!;
      expect(stockpilingTag).toBeDefined();
      expect(stockpilingTag.stockpiledCount).toBe(stacksToSetup);

      vi.spyOn(pokemon, "heal");

      game.move.select(MoveId.SWALLOW);
      await game.phaseInterceptor.to(TurnInitPhase);

      expect(pokemon.heal).toHaveBeenCalledOnce();
      expect(pokemon.heal).toHaveReturnedWith(expectedHeal);

      expect(pokemon.getTag<StockpilingTag>(BattlerTagType.STOCKPILING)).toBeUndefined();
    });

    it("2 stacks -> 50% heal", async () => {
      const stacksToSetup = 2;
      const expectedHeal = 50;

      await game.startBattle([Species.ABOMASNOW]);

      const pokemon = game.scene.getPlayerPokemon()!;
      vi.spyOn(pokemon, "getMaxHp").mockReturnValue(100);
      pokemon["hp"] = 1;

      pokemon.addTag(BattlerTagType.STOCKPILING);
      pokemon.addTag(BattlerTagType.STOCKPILING);

      const stockpilingTag = pokemon.getTag<StockpilingTag>(BattlerTagType.STOCKPILING)!;
      expect(stockpilingTag).toBeDefined();
      expect(stockpilingTag.stockpiledCount).toBe(stacksToSetup);

      vi.spyOn(pokemon, "heal");

      game.move.select(MoveId.SWALLOW);
      await game.phaseInterceptor.to(TurnInitPhase);

      expect(pokemon.heal).toHaveBeenCalledOnce();
      expect(pokemon.heal).toHaveReturnedWith(expectedHeal);

      expect(pokemon.getTag<StockpilingTag>(BattlerTagType.STOCKPILING)).toBeUndefined();
    });

    it("3 stacks -> 100% heal", async () => {
      const stacksToSetup = 3;
      const expectedHeal = 100;

      await game.startBattle([Species.ABOMASNOW]);

      const pokemon = game.scene.getPlayerPokemon()!;
      vi.spyOn(pokemon, "getMaxHp").mockReturnValue(100);
      pokemon["hp"] = 0.0001;

      pokemon.addTag(BattlerTagType.STOCKPILING);
      pokemon.addTag(BattlerTagType.STOCKPILING);
      pokemon.addTag(BattlerTagType.STOCKPILING);

      const stockpilingTag = pokemon.getTag<StockpilingTag>(BattlerTagType.STOCKPILING)!;
      expect(stockpilingTag).toBeDefined();
      expect(stockpilingTag.stockpiledCount).toBe(stacksToSetup);

      vi.spyOn(pokemon, "heal");

      game.move.select(MoveId.SWALLOW);
      await game.phaseInterceptor.to(TurnInitPhase);

      expect(pokemon.heal).toHaveBeenCalledOnce();
      expect(pokemon.heal).toHaveReturnedWith(expect.closeTo(expectedHeal));

      expect(pokemon.getTag<StockpilingTag>(BattlerTagType.STOCKPILING)).toBeUndefined();
    });
  });

  it("fails without stacks", async () => {
    await game.startBattle([Species.ABOMASNOW]);

    const pokemon = game.scene.getPlayerPokemon()!;

    const stockpilingTag = pokemon.getTag<StockpilingTag>(BattlerTagType.STOCKPILING)!;
    expect(stockpilingTag).toBeUndefined();

    game.move.select(MoveId.SWALLOW);
    await game.phaseInterceptor.to(TurnInitPhase);

    expect(pokemon.getLastXMoves()?.[0]?.result).toBe(MoveResult.FAIL);
  });

  describe("restores stat stage boosts granted by stacks", () => {
    it("decreases stats based on stored values (both boosts equal)", async () => {
      await game.startBattle([Species.ABOMASNOW]);

      const pokemon = game.scene.getPlayerPokemon()!;
      pokemon.addTag(BattlerTagType.STOCKPILING);

      const stockpilingTag = pokemon.getTag<StockpilingTag>(BattlerTagType.STOCKPILING)!;
      expect(stockpilingTag).toBeDefined();

      game.move.select(MoveId.SWALLOW);
      await game.phaseInterceptor.to(MovePhase);

      expect(pokemon.getStatStage(Stat.DEF)).toBe(1);
      expect(pokemon.getStatStage(Stat.SPDEF)).toBe(1);

      await game.phaseInterceptor.to(TurnInitPhase);

      expect(pokemon.getLastXMoves()?.[0]?.result).toBe(MoveResult.SUCCESS);

      expect(pokemon.getStatStage(Stat.DEF)).toBe(0);
      expect(pokemon.getStatStage(Stat.SPDEF)).toBe(0);

      expect(pokemon.getTag<StockpilingTag>(BattlerTagType.STOCKPILING)).toBeUndefined();
    });

    it("lower stat stages based on stored values (different boosts)", async () => {
      await game.startBattle([Species.ABOMASNOW]);

      const pokemon = game.scene.getPlayerPokemon()!;
      pokemon.addTag(BattlerTagType.STOCKPILING);

      const stockpilingTag = pokemon.getTag<StockpilingTag>(BattlerTagType.STOCKPILING)!;
      expect(stockpilingTag).toBeDefined();

      // for the sake of simplicity (and because other tests cover the setup), set boost amounts directly
      stockpilingTag.statChangeCounts = {
        [Stat.DEF]: -1,
        [Stat.SPDEF]: 2,
      };

      game.move.select(MoveId.SWALLOW);

      await game.phaseInterceptor.to(TurnInitPhase);

      expect(pokemon.getLastXMoves()?.[0]?.result).toBe(MoveResult.SUCCESS);

      expect(pokemon.getStatStage(Stat.DEF)).toBe(1);
      expect(pokemon.getStatStage(Stat.SPDEF)).toBe(-2);

      expect(pokemon.getTag<StockpilingTag>(BattlerTagType.STOCKPILING)).toBeUndefined();
    });
  });
});
