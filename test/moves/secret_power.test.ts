import { Abilities } from "#enums/abilities";
import { Biome } from "#enums/biome";
import { MoveId } from "#enums/move-id";
import { Stat } from "#enums/stat";
import { allAbilities, allMoves } from "#app/data/data-lists";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { StatusEffect } from "#enums/status-effect";
import { BattlerIndex } from "#enums/battler-index";
import { ArenaTagType } from "#enums/arena-tag-type";
import { ArenaTagSide } from "#enums/arena-tag-side";
import { AbAttrFlag } from "#enums/ab-attr-flag";

describe("Moves - Secret Power", () => {
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
      .moveset([MoveId.SECRET_POWER])
      .ability(Abilities.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyLevel(60)
      .enemyAbility(Abilities.BALL_FETCH);
  });

  it("Secret Power checks for an active terrain first then looks at the biome for its secondary effect", async () => {
    game.override.startingBiome(Biome.VOLCANO).enemyMoveset([MoveId.SPLASH, MoveId.MISTY_TERRAIN]);
    vi.spyOn(allMoves[MoveId.SECRET_POWER], "chance", "get").mockReturnValue(100);
    await game.classicMode.startBattle([Species.FEEBAS]);

    const enemyPokemon = game.scene.getEnemyPokemon()!;

    // No Terrain + Biome.VOLCANO --> Burn
    game.move.select(MoveId.SECRET_POWER);
    await game.forceEnemyMove(MoveId.SPLASH);
    await game.toEndOfTurn();
    expect(enemyPokemon.getStatusEffect(true)).toBe(StatusEffect.BURN);

    // Misty Terrain --> SpAtk -1
    game.move.select(MoveId.SECRET_POWER);
    await game.forceEnemyMove(MoveId.MISTY_TERRAIN);
    await game.toEndOfTurn();
    expect(enemyPokemon.getStatStage(Stat.SPATK)).toBe(-1);
  });

  it("Secret Power's effect chance is doubled by Serene Grace, but not by the 'rainbow' effect from Fire/Water Pledge", async () => {
    game.override
      .moveset([MoveId.FIRE_PLEDGE, MoveId.WATER_PLEDGE, MoveId.SECRET_POWER, MoveId.SPLASH])
      .ability(Abilities.SERENE_GRACE)
      .enemyMoveset([MoveId.SPLASH])
      .battleType("double");
    await game.classicMode.startBattle([Species.BLASTOISE, Species.CHARIZARD]);

    game.move.select(MoveId.WATER_PLEDGE, 0, BattlerIndex.ENEMY);
    game.move.select(MoveId.FIRE_PLEDGE, 1, BattlerIndex.ENEMY_2);

    await game.toEndOfTurn();

    const sereneGraceAttr = allAbilities[Abilities.SERENE_GRACE].getAttrs(AbAttrFlag.MOVE_EFFECT_CHANCE_MULTIPLIER)[0];
    vi.spyOn(sereneGraceAttr, "apply");

    let rainbowEffect = game.scene.arena.getTagOnSide(ArenaTagType.WATER_FIRE_PLEDGE, ArenaTagSide.PLAYER);
    expect(rainbowEffect).toBeDefined();

    rainbowEffect = rainbowEffect!;
    vi.spyOn(rainbowEffect, "apply");

    game.move.select(MoveId.SECRET_POWER, 0, BattlerIndex.ENEMY);
    game.move.select(MoveId.SPLASH, 1);

    await game.toEndOfTurn();

    expect(sereneGraceAttr.apply).toHaveBeenCalledOnce();
    expect(sereneGraceAttr.apply).toHaveLastReturnedWith(true);

    expect(rainbowEffect.apply).toHaveBeenCalledTimes(0);
  });
});
