import { NON_VOLATILE_STATUS_EFFECTS } from "#app/constants/game-constants";
import { BattlerIndex } from "#app/enums/battler-index";
import { Stat } from "#app/enums/stat";
import { StatusEffect } from "#app/enums/status-effect";
import { TerrainType } from "#app/enums/terrain-type";
import { capitalizeString } from "#app/utils/string-utils";
import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

//#region Test Constants

const nonVolatileStatusEffects = NON_VOLATILE_STATUS_EFFECTS.map((statusEffectId) => ({
  statusEffectName: capitalizeString(StatusEffect[statusEffectId], "_", false, true),
  statusEffectId: statusEffectId,
}));

//#endregion

describe("Ability - Marvel Scale", () => {
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
      .ability(AbilityId.MARVEL_SCALE)
      .battleType("single")
      .disableCrits()
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH)
      .startingLevel(9)
      .enemyLevel(10);
  });

  it("should not apply a defense boost with no status effect", async () => {
    const { field, classicMode } = game;

    await classicMode.startBattle(SpeciesId.FEEBAS);
    const player = field.getPlayerPokemon();
    game.move.use(MoveId.SPLASH);
    await game.toEndOfTurn();
    const playerDef = player.getStat(Stat.DEF);

    expect(player.hasNonVolatileStatusEffect()).toBe(false);
    expect(player).toHaveEffectiveStat(Stat.DEF, playerDef);
  });

  it("should not apply a defense boost with confusion status effect", async () => {
    const { field, classicMode, move } = game;

    await classicMode.startBattle(SpeciesId.FEEBAS);
    const player = field.getPlayerPokemon();
    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    move.use(MoveId.SPLASH);
    await move.selectEnemyMove(MoveId.CONFUSE_RAY);
    await move.forceHit();
    await game.toEndOfTurn();
    const playerDef = player.getStat(Stat.DEF);

    expect(player.hasNonVolatileStatusEffect()).toBe(false);
    expect(player).toHaveEffectiveStat(Stat.DEF, playerDef);
  });

  it.each(nonVolatileStatusEffects)(
    "should apply a 1.5x defense boost with $statusEffectName status effect",
    async ({ statusEffectId }) => {
      const { override, classicMode, field } = game;
      override.statusEffect(statusEffectId);

      await classicMode.startBattle(SpeciesId.FEEBAS);
      const player = field.getPlayerPokemon();
      game.move.use(MoveId.SPLASH);
      await game.toEndOfTurn();
      const playerDef = player.getStat(Stat.DEF);

      expect(player.hasNonVolatileStatusEffect()).toBe(true);
      expect(player).toHaveEffectiveStat(Stat.DEF, Math.floor(playerDef * 1.5));
    },
  );

  it("should stack with 'Fur Coat' ability", async () => {
    const { override, field, classicMode } = game;
    override.statusEffect(StatusEffect.PARALYSIS).passiveAbility(AbilityId.FUR_COAT);

    await classicMode.startBattle(SpeciesId.FEEBAS);
    const player = field.getPlayerPokemon();
    const enemy = field.getEnemyPokemon();
    game.move.use(MoveId.SPLASH);
    await game.toEndOfTurn();
    const playerDef = player.getStat(Stat.DEF);

    expect(player.hasNonVolatileStatusEffect()).toBe(true);
    expect(player).toHaveEffectiveStat(Stat.DEF, Math.floor(playerDef * 1.5 * 2.0), { enemy });
  });

  it("should stack with 'Grass Pelt' ability", async () => {
    const { override, field, classicMode } = game;
    override.statusEffect(StatusEffect.PARALYSIS).passiveAbility(AbilityId.GRASS_PELT);

    await classicMode.startBattle(SpeciesId.FEEBAS);
    const player = field.getPlayerPokemon();
    const enemy = field.getEnemyPokemon();
    game.move.use(MoveId.GRASSY_TERRAIN);
    await game.toEndOfTurn();
    const playerDef = player.getStat(Stat.DEF);

    expect(player.hasNonVolatileStatusEffect()).toBe(true);
    expect(game).toHaveTerrain(TerrainType.GRASSY);
    expect(player).toHaveEffectiveStat(Stat.DEF, Math.floor(playerDef * 1.5 * 1.5), { enemy });
  });
});
