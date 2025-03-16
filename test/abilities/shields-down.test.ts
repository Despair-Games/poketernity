import { BattlerTagType } from "#app/enums/battler-tag-type";
import { QuietFormChangePhase } from "#app/phases/quiet-form-change-phase";
import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { StatusEffect } from "#enums/status-effect";
import { GameManager } from "#test/test-utils/gameManager";
import { afterEach, beforeAll, beforeEach, describe, expect, test } from "vitest";

describe("Abilities - SHIELDS DOWN", () => {
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
    const moveToUse = MoveId.SPLASH;
    game.override.battleType("single");
    game.override.ability(Abilities.SHIELDS_DOWN);
    game.override.moveset([moveToUse]);
    game.override.enemyMoveset(MoveId.TACKLE);
  });

  test("check if fainted pokemon switched to base form on arena reset", async () => {
    const meteorForm = 0,
      coreForm = 7;
    game.override.startingWave(4);
    game.override.starterForms({
      [Species.MINIOR]: coreForm,
    });

    await game.classicMode.startBattle([Species.MAGIKARP, Species.MINIOR]);

    const minior = game.scene.getPlayerParty().find((p) => p.species.speciesId === Species.MINIOR)!;
    expect(minior).toBeDefined();
    expect(minior.formIndex).toBe(coreForm);

    minior.faint();
    expect(minior.isFainted()).toBe(true);

    game.move.select(MoveId.SPLASH);
    await game.doKillOpponents();
    await game.toEndOfTurn();
    game.doSelectModifier();
    await game.phaseInterceptor.to(QuietFormChangePhase);

    expect(minior.formIndex).toBe(meteorForm);
  });

  test("should ignore non-volatile status moves", async () => {
    game.override.enemyMoveset([MoveId.SPORE]);

    await game.classicMode.startBattle([Species.MINIOR]);
    game.move.use(MoveId.SPLASH);
    await game.toEndOfTurn();

    expect(game.field.getPlayerPokemon().getStatusEffect()).toBe(StatusEffect.NONE);
  });

  test("should still ignore non-volatile status moves used by a pokemon with mold breaker", async () => {
    game.override.enemyAbility(Abilities.MOLD_BREAKER);

    await game.classicMode.startBattle([Species.MINIOR]);

    game.move.use(MoveId.SPLASH);
    await game.move.forceEnemyMove(MoveId.SPORE);
    await game.toEndOfTurn();

    expect(game.field.getPlayerPokemon().getStatusEffect()).toBe(StatusEffect.NONE);
  });

  test("should ignore non-volatile secondary status effects", async () => {
    game.override.enemyMoveset([MoveId.NUZZLE]);

    await game.classicMode.startBattle([Species.MINIOR]);

    game.move.use(MoveId.SPLASH);
    await game.toEndOfTurn();

    expect(game.field.getPlayerPokemon().getStatusEffect()).toBe(StatusEffect.NONE);
  });

  test("should ignore status moves even through mold breaker", async () => {
    game.override.enemyMoveset([MoveId.SPORE]);
    game.override.enemyAbility(Abilities.MOLD_BREAKER);

    await game.classicMode.startBattle([Species.MINIOR]);

    game.move.use(MoveId.SPLASH);

    await game.toEndOfTurn();

    expect(game.field.getPlayerPokemon().getStatusEffect()).toBe(StatusEffect.NONE);
  });

  // toxic spikes currently does not poison flying types when gravity is in effect
  test.todo("should become poisoned by toxic spikes when grounded", async () => {
    game.override.enemyMoveset([MoveId.GRAVITY, MoveId.TOXIC_SPIKES, MoveId.SPLASH]);
    game.override.moveset([MoveId.GRAVITY, MoveId.SPLASH]);

    await game.classicMode.startBattle([Species.MAGIKARP, Species.MINIOR]);

    // turn 1
    game.move.use(MoveId.GRAVITY);
    await game.move.selectEnemyMove(MoveId.TOXIC_SPIKES);
    await game.toNextTurn();

    // turn 2
    game.doSwitchPokemon(1);
    await game.move.selectEnemyMove(MoveId.SPLASH);
    await game.toNextTurn();

    expect(game.field.getPlayerPokemon()!.species.speciesId).toBe(Species.MINIOR);
    expect(game.field.getPlayerPokemon()!.species.formIndex).toBe(0);
    expect(game.field.getPlayerPokemon().hasStatusEffect(StatusEffect.POISON)).toBe(true);
  });

  test("should ignore yawn", async () => {
    await game.classicMode.startBattle([Species.MAGIKARP, Species.MINIOR]);

    game.move.use(MoveId.SPLASH);
    await game.move.forceEnemyMove(MoveId.YAWN);

    await game.toEndOfTurn();
    expect(game.field.getPlayerPokemon().getTag(BattlerTagType.DROWSY)).toBeUndefined();
  });

  test("should not ignore volatile status effects", async () => {
    await game.classicMode.startBattle([Species.MINIOR]);

    game.move.use(MoveId.SPLASH);
    await game.move.forceEnemyMove(MoveId.CONFUSE_RAY);

    await game.toEndOfTurn();

    expect(game.field.getPlayerPokemon().getTag(BattlerTagType.CONFUSED)).toBeDefined();
  });

  // the `NoTransformAbilityAbAttr` attribute is not checked anywhere, so this test cannot pass.
  test.todo("ditto should not be immune to status after transforming", async () => {
    game.override.enemySpecies(Species.DITTO);
    game.override.enemyAbility(Abilities.IMPOSTER);
    game.override.moveset([MoveId.SPLASH, MoveId.SPORE]);

    await game.classicMode.startBattle([Species.MINIOR]);

    game.move.use(MoveId.SPORE);
    await game.move.selectEnemyMove(MoveId.SPLASH);

    await game.toEndOfTurn();
    expect(game.field.getPlayerPokemon().hasStatusEffect(StatusEffect.SLEEP)).toBe(true);
  });
});
