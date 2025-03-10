import { allMoves } from "#app/data/data-lists";
import { PresentPowerAttr } from "#app/data/move-attrs/present-power-attr";
import { NumberHolder } from "#app/utils";
import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Moves - Present", () => {
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
      .ability(Abilities.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH);
  });

  it.each([
    { descriptor: "first hit", hitsLeft: 2, totalOutcomes: 100, expectedHeals: 20 },
    { descriptor: "subsequent hits", hitsLeft: 1, totalOutcomes: 80, expectedHeals: 0 },
  ])("should have correct probabilities on $descriptor", async ({ hitsLeft, totalOutcomes, expectedHeals }) => {
    const presentAttr = allMoves.get(MoveId.PRESENT).getAttrs(PresentPowerAttr)[0];

    await game.classicMode.startBattle([Species.FEEBAS]);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();

    player.turnData.hitsLeft = hitsLeft;
    player.turnData.hitCount = 2;

    let rngSweepProgress = 0; // This will simulate entire range of RNG calls by slowly sweeping from 0 to 1
    vi.spyOn(player, "randSeedInt").mockImplementation((range: number, min: number = 0) => {
      return Math.floor(min + rngSweepProgress * range);
    });

    let count40power = 0,
      count80power = 0,
      count120power = 0,
      countHeal = 0;
    for (let i = 0; i < totalOutcomes; i++) {
      rngSweepProgress = (2 * i + 1) / (2 * totalOutcomes);

      const power = new NumberHolder(-1);
      presentAttr.apply(player, enemy, allMoves.get(MoveId.PRESENT), power);
      switch (power.value) {
        case 40:
          count40power++;
          break;
        case 80:
          count80power++;
          break;
        case 120:
          count120power++;
          break;
        case -1:
          countHeal++;
      }
    }

    expect(count40power).toBe(40);
    expect(count80power).toBe(30);
    expect(count120power).toBe(10);
    expect(countHeal).toBe(expectedHeals);
  });

  it("should end multi-hit Present, and should not deal damage, if it heals", async () => {
    game.override.ability(Abilities.PARENTAL_BOND).enemyAbility(Abilities.NO_GUARD);
    await game.classicMode.startBattle([Species.FEEBAS]);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();

    // Force RNG rolls to be maximum, which corresponds to Present healing
    vi.spyOn(player, "randSeedInt").mockImplementation((range: number, min: number = 0) => min + range - 1);

    // Check that enemy never takes positive damage
    vi.spyOn(enemy, "damage").mockImplementation((damage: number) => {
      expect(damage).toBe(0);
      return damage;
    });

    enemy.hp = 1;
    game.move.use(MoveId.PRESENT);
    await game.toNextTurn();

    expect(enemy.hp).toBe(1 + Math.floor(enemy.getMaxHp() / 4));
  });
});
