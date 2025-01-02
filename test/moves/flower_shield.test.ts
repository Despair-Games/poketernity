import { Stat } from "#enums/stat";
import { SemiInvulnerableTag } from "#app/data/battler-tags";
import { Type } from "#enums/type";
import { Biome } from "#enums/biome";
import { TurnEndPhase } from "#app/phases/turn-end-phase";
import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Moves - Flower Shield", () => {
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
    game.overridesHelper.ability(Abilities.NONE);
    game.overridesHelper.enemyAbility(Abilities.NONE);
    game.overridesHelper.battleType("single");
    game.overridesHelper.moveset([Moves.FLOWER_SHIELD, Moves.SPLASH]);
    game.overridesHelper.enemyMoveset(Moves.SPLASH);
  });

  it("raises DEF stat stage by 1 for all Grass-type Pokemon on the field by one stage - single battle", async () => {
    game.overridesHelper.enemySpecies(Species.CHERRIM);

    await game.startBattle([Species.MAGIKARP]);
    const cherrim = game.scene.getEnemyPokemon()!;
    const magikarp = game.scene.getPlayerPokemon()!;

    expect(magikarp.getStatStage(Stat.DEF)).toBe(0);
    expect(cherrim.getStatStage(Stat.DEF)).toBe(0);

    game.moveHelper.select(Moves.FLOWER_SHIELD);
    await game.phaseInterceptor.to(TurnEndPhase);

    expect(magikarp.getStatStage(Stat.DEF)).toBe(0);
    expect(cherrim.getStatStage(Stat.DEF)).toBe(1);
  });

  it("raises DEF stat stage by 1 for all Grass-type Pokemon on the field by one stage - double battle", async () => {
    game.overridesHelper.enemySpecies(Species.MAGIKARP).startingBiome(Biome.GRASS).battleType("double");

    await game.startBattle([Species.CHERRIM, Species.MAGIKARP]);
    const field = game.scene.getField(true);

    const grassPokemons = field.filter((p) => p.getTypes().includes(Type.GRASS));
    const nonGrassPokemons = field.filter((pokemon) => !grassPokemons.includes(pokemon));

    grassPokemons.forEach((p) => expect(p.getStatStage(Stat.DEF)).toBe(0));
    nonGrassPokemons.forEach((p) => expect(p.getStatStage(Stat.DEF)).toBe(0));

    game.moveHelper.select(Moves.FLOWER_SHIELD);
    game.moveHelper.select(Moves.SPLASH, 1);
    await game.phaseInterceptor.to(TurnEndPhase);

    grassPokemons.forEach((p) => expect(p.getStatStage(Stat.DEF)).toBe(1));
    nonGrassPokemons.forEach((p) => expect(p.getStatStage(Stat.DEF)).toBe(0));
  });

  /**
   * See semi-vulnerable state tags. {@linkcode SemiInvulnerableTag}
   */
  it("does not raise DEF stat stage for a Pokemon in semi-vulnerable state", async () => {
    game.overridesHelper.enemySpecies(Species.PARAS);
    game.overridesHelper.enemyMoveset([Moves.DIG, Moves.DIG, Moves.DIG, Moves.DIG]);
    game.overridesHelper.enemyLevel(50);

    await game.startBattle([Species.CHERRIM]);
    const paras = game.scene.getEnemyPokemon()!;
    const cherrim = game.scene.getPlayerPokemon()!;

    expect(paras.getStatStage(Stat.DEF)).toBe(0);
    expect(cherrim.getStatStage(Stat.DEF)).toBe(0);
    expect(paras.getTag(SemiInvulnerableTag)).toBeUndefined;

    game.moveHelper.select(Moves.FLOWER_SHIELD);
    await game.phaseInterceptor.to(TurnEndPhase);

    expect(paras.getTag(SemiInvulnerableTag)).toBeDefined();
    expect(paras.getStatStage(Stat.DEF)).toBe(0);
    expect(cherrim.getStatStage(Stat.DEF)).toBe(1);
  });

  it("does nothing if there are no Grass-type Pokemon on the field", async () => {
    game.overridesHelper.enemySpecies(Species.MAGIKARP);

    await game.startBattle([Species.MAGIKARP]);
    const enemy = game.scene.getEnemyPokemon()!;
    const ally = game.scene.getPlayerPokemon()!;

    expect(enemy.getStatStage(Stat.DEF)).toBe(0);
    expect(ally.getStatStage(Stat.DEF)).toBe(0);

    game.moveHelper.select(Moves.FLOWER_SHIELD);
    await game.phaseInterceptor.to(TurnEndPhase);

    expect(enemy.getStatStage(Stat.DEF)).toBe(0);
    expect(ally.getStatStage(Stat.DEF)).toBe(0);
  });
});
