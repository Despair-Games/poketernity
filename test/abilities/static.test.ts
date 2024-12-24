import { PostDefendContactApplyStatusEffectAbAttr } from "#app/data/ab-attrs/post-defend-contact-apply-status-effect-ab-attr";
import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { StatusEffect } from "#enums/status-effect";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Abilities - Static", () => {
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
      .moveset([Moves.SPLASH])
      .ability(Abilities.STATIC)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset([Moves.TACKLE, Moves.WATER_GUN]);
  });

  it("can paralyze a Ground-type Pokemon", async () => {
    await game.classicMode.startBattle([Species.DIGLETT]);
    const pokemon = game.scene.getPlayerPokemon();
    vi.spyOn(
      pokemon
        ?.getAbility()
        .getAttrs(PostDefendContactApplyStatusEffectAbAttr)[0] as PostDefendContactApplyStatusEffectAbAttr,
      "chance",
      "get",
    ).mockReturnValue(100);

    game.move.select(Moves.SPLASH);
    await game.forceEnemyMove(Moves.TACKLE);
    await game.phaseInterceptor.to("BerryPhase");

    const attacker = game.scene.getEnemyPokemon();
    expect(attacker?.status?.effect).toBe(StatusEffect.PARALYSIS);
  });

  it("should not activate from a non-contact attack", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);
    const pokemon = game.scene.getPlayerPokemon();
    vi.spyOn(
      pokemon
        ?.getAbility()
        .getAttrs(PostDefendContactApplyStatusEffectAbAttr)[0] as PostDefendContactApplyStatusEffectAbAttr,
      "chance",
      "get",
    ).mockReturnValue(100);

    game.move.select(Moves.SPLASH);
    await game.forceEnemyMove(Moves.WATER_GUN);
    await game.phaseInterceptor.to("BerryPhase");

    const attacker = game.scene.getEnemyPokemon();
    expect(attacker?.status).toBeUndefined();
  });
});
