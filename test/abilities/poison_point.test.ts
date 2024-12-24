import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import { PostDefendContactApplyStatusEffectAbAttr } from "#app/data/ab-attrs/post-defend-contact-apply-status-effect-ab-attr";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { StatusEffect } from "#enums/status-effect";

describe("Abilities - Poison Point", () => {
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
      .ability(Abilities.POISON_POINT)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(Moves.SPLASH);
  });

  it("should paralyze an attacking Pokemon if contact is made", async () => {
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
    await game.forceEnemyMove(Moves.TACKLE);
    await game.phaseInterceptor.to("BerryPhase");

    const attacker = game.scene.getEnemyPokemon();
    expect(attacker?.status?.effect).toBe(StatusEffect.POISON);
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
