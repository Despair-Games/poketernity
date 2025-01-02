import { BattlerIndex } from "#app/battle";
import { ArenaTagSide } from "#app/data/arena-tag";
import { SubstituteTag, TrappedTag } from "#app/data/battler-tags";
import { allMoves } from "#app/data/all-moves";
import { MoveResult } from "#app/field/pokemon";
import type { CommandPhase } from "#app/phases/command-phase";
import { GameManager } from "#test/testUtils/gameManager";
import { Command } from "#app/ui/command-ui-handler";
import { Mode } from "#app/ui/ui";
import { Abilities } from "#enums/abilities";
import { ArenaTagType } from "#enums/arena-tag-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { BerryType } from "#enums/berry-type";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { Stat } from "#enums/stat";
import { StatusEffect } from "#enums/status-effect";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { StealHeldItemChanceAttr } from "#app/data/move-attrs/steal-held-item-chance-attr";

describe("Moves - Substitute", () => {
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

    game.overridesHelper
      .battleType("single")
      .moveset([Moves.SUBSTITUTE, Moves.SWORDS_DANCE, Moves.TACKLE, Moves.SPLASH])
      .enemySpecies(Species.SNORLAX)
      .enemyAbility(Abilities.INSOMNIA)
      .enemyMoveset(Moves.SPLASH)
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should cause the user to take damage", async () => {
    await game.classicModeHelper.startBattle([Species.MAGIKARP]);

    const leadPokemon = game.scene.getPlayerPokemon()!;

    game.moveHelper.select(Moves.SUBSTITUTE);

    await game.phaseInterceptor.to("MoveEndPhase", false);

    expect(leadPokemon.hp).toBe(Math.ceil((leadPokemon.getMaxHp() * 3) / 4));
  });

  it("should redirect enemy attack damage to the Substitute doll", async () => {
    game.overridesHelper.enemyMoveset(Moves.TACKLE);

    await game.classicModeHelper.startBattle([Species.SKARMORY]);

    const leadPokemon = game.scene.getPlayerPokemon()!;

    game.moveHelper.select(Moves.SUBSTITUTE);

    await game.phaseInterceptor.to("MoveEndPhase", false);

    expect(leadPokemon.hp).toBe(Math.ceil((leadPokemon.getMaxHp() * 3) / 4));
    expect(leadPokemon.getTag(BattlerTagType.SUBSTITUTE)).toBeDefined();
    const postSubHp = leadPokemon.hp;

    await game.phaseInterceptor.to("BerryPhase", false);

    expect(leadPokemon.hp).toBe(postSubHp);
    expect(leadPokemon.getTag(BattlerTagType.SUBSTITUTE)).toBeDefined();
  });

  it("should fade after redirecting more damage than its remaining HP", async () => {
    // Giga Impact OHKOs Magikarp if substitute isn't up
    game.overridesHelper.enemyMoveset(Moves.GIGA_IMPACT);
    vi.spyOn(allMoves[Moves.GIGA_IMPACT], "accuracy", "get").mockReturnValue(100);

    await game.classicModeHelper.startBattle([Species.MAGIKARP]);

    const leadPokemon = game.scene.getPlayerPokemon()!;

    game.moveHelper.select(Moves.SUBSTITUTE);

    await game.phaseInterceptor.to("MoveEndPhase", false);

    expect(leadPokemon.hp).toBe(Math.ceil((leadPokemon.getMaxHp() * 3) / 4));
    expect(leadPokemon.getTag(BattlerTagType.SUBSTITUTE)).toBeDefined();
    const postSubHp = leadPokemon.hp;

    await game.phaseInterceptor.to("BerryPhase", false);

    expect(leadPokemon.hp).toBe(postSubHp);
    expect(leadPokemon.getTag(BattlerTagType.SUBSTITUTE)).toBeUndefined();
  });

  it("should block stat changes from status moves", async () => {
    game.overridesHelper.enemyMoveset(Moves.CHARM);

    await game.classicModeHelper.startBattle([Species.MAGIKARP]);

    const leadPokemon = game.scene.getPlayerPokemon()!;

    game.moveHelper.select(Moves.SUBSTITUTE);

    await game.phaseInterceptor.to("BerryPhase", false);

    expect(leadPokemon.getStatStage(Stat.ATK)).toBe(0);
    expect(leadPokemon.getTag(BattlerTagType.SUBSTITUTE)).toBeDefined();
  });

  it("should be bypassed by sound-based moves", async () => {
    game.overridesHelper.enemyMoveset(Moves.ECHOED_VOICE);

    await game.classicModeHelper.startBattle([Species.BLASTOISE]);

    const leadPokemon = game.scene.getPlayerPokemon()!;

    game.moveHelper.select(Moves.SUBSTITUTE);

    await game.phaseInterceptor.to("MoveEndPhase");

    expect(leadPokemon.getTag(BattlerTagType.SUBSTITUTE)).toBeDefined();
    const postSubHp = leadPokemon.hp;

    await game.phaseInterceptor.to("BerryPhase", false);

    expect(leadPokemon.getTag(BattlerTagType.SUBSTITUTE)).toBeDefined();
    expect(leadPokemon.hp).toBeLessThan(postSubHp);
  });

  it("should be bypassed by attackers with Infiltrator", async () => {
    game.overridesHelper.enemyMoveset(Moves.TACKLE);
    game.overridesHelper.enemyAbility(Abilities.INFILTRATOR);

    await game.classicModeHelper.startBattle([Species.BLASTOISE]);

    const leadPokemon = game.scene.getPlayerPokemon()!;

    game.moveHelper.select(Moves.SUBSTITUTE);

    await game.phaseInterceptor.to("MoveEndPhase");

    expect(leadPokemon.getTag(BattlerTagType.SUBSTITUTE)).toBeDefined();
    const postSubHp = leadPokemon.hp;

    await game.phaseInterceptor.to("BerryPhase", false);

    expect(leadPokemon.getTag(BattlerTagType.SUBSTITUTE)).toBeDefined();
    expect(leadPokemon.hp).toBeLessThan(postSubHp);
  });

  it("shouldn't block the user's own status moves", async () => {
    await game.classicModeHelper.startBattle([Species.BLASTOISE]);

    const leadPokemon = game.scene.getPlayerPokemon()!;

    game.moveHelper.select(Moves.SUBSTITUTE);

    await game.phaseInterceptor.to("MoveEndPhase");
    await game.toNextTurn();

    game.moveHelper.select(Moves.SWORDS_DANCE);

    await game.phaseInterceptor.to("MoveEndPhase", false);

    expect(leadPokemon.getStatStage(Stat.ATK)).toBe(2);
  });

  it("shouldn't block moves that target the user's side of the field", async () => {
    game.overridesHelper.moveset(Moves.LIGHT_SCREEN);

    await game.classicModeHelper.startBattle([Species.BLASTOISE]);

    const leadPokemon = game.scene.getPlayerPokemon()!;
    vi.spyOn(leadPokemon, "getMoveEffectiveness");

    leadPokemon.addTag(BattlerTagType.SUBSTITUTE, 0, Moves.NONE, leadPokemon.id);

    game.moveHelper.select(Moves.LIGHT_SCREEN);

    await game.toNextTurn();

    expect(leadPokemon.getMoveEffectiveness).not.toHaveReturnedWith(0);
    expect(game.scene.arena.getTagOnSide(ArenaTagType.LIGHT_SCREEN, ArenaTagSide.PLAYER)).toBeDefined();
  });

  it("shouldn't block the opponent from setting hazards", async () => {
    game.overridesHelper.enemyMoveset(Moves.STEALTH_ROCK);

    await game.classicModeHelper.startBattle([Species.BLASTOISE]);

    const leadPokemon = game.scene.getPlayerPokemon()!;
    vi.spyOn(leadPokemon, "getMoveEffectiveness");

    game.moveHelper.select(Moves.SUBSTITUTE);

    await game.toNextTurn();

    expect(leadPokemon.getMoveEffectiveness).not.toHaveReturnedWith(0);
    expect(game.scene.arena.getTagOnSide(ArenaTagType.STEALTH_ROCK, ArenaTagSide.PLAYER)).toBeDefined();
  });

  it("shouldn't block moves that target both sides of the field", async () => {
    game.overridesHelper.moveset(Moves.TRICK_ROOM).enemyMoveset(Moves.GRAVITY);

    await game.classicModeHelper.startBattle([Species.BLASTOISE]);

    const pokemon = game.scene.getField(true);
    pokemon.forEach((p) => {
      vi.spyOn(p, "getMoveEffectiveness");
      p.addTag(BattlerTagType.SUBSTITUTE, 0, Moves.NONE, p.id);
    });

    game.moveHelper.select(Moves.TRICK_ROOM);

    await game.toNextTurn();

    pokemon.forEach((p) => expect(p.getMoveEffectiveness).not.toHaveReturnedWith(0));
    expect(game.scene.arena.getTag(ArenaTagType.TRICK_ROOM)).toBeDefined();
    expect(game.scene.arena.getTag(ArenaTagType.GRAVITY)).toBeDefined();
  });

  it("should protect the user from flinching", async () => {
    game.overridesHelper.enemyMoveset(Moves.FAKE_OUT);
    game.overridesHelper.startingLevel(1); // Ensures the Substitute will break

    await game.classicModeHelper.startBattle([Species.BLASTOISE]);

    const leadPokemon = game.scene.getPlayerPokemon()!;
    const enemyPokemon = game.scene.getEnemyPokemon()!;

    leadPokemon.addTag(BattlerTagType.SUBSTITUTE, 0, Moves.NONE, leadPokemon.id);

    game.moveHelper.select(Moves.TACKLE);

    await game.phaseInterceptor.to("BerryPhase", false);

    expect(enemyPokemon.hp).toBeLessThan(enemyPokemon.getMaxHp());
  });

  it("should protect the user from being trapped", async () => {
    vi.spyOn(allMoves[Moves.SAND_TOMB], "accuracy", "get").mockReturnValue(100);
    game.overridesHelper.enemyMoveset(Moves.SAND_TOMB);

    await game.classicModeHelper.startBattle([Species.BLASTOISE]);

    const leadPokemon = game.scene.getPlayerPokemon()!;

    leadPokemon.addTag(BattlerTagType.SUBSTITUTE, 0, Moves.NONE, leadPokemon.id);

    game.moveHelper.select(Moves.SPLASH);

    await game.phaseInterceptor.to("BerryPhase", false);

    expect(leadPokemon.getTag(TrappedTag)).toBeUndefined();
  });

  it("should prevent the user's stats from being lowered", async () => {
    vi.spyOn(allMoves[Moves.LIQUIDATION], "chance", "get").mockReturnValue(100);
    game.overridesHelper.enemyMoveset(Moves.LIQUIDATION);

    await game.classicModeHelper.startBattle([Species.BLASTOISE]);

    const leadPokemon = game.scene.getPlayerPokemon()!;

    leadPokemon.addTag(BattlerTagType.SUBSTITUTE, 0, Moves.NONE, leadPokemon.id);

    game.moveHelper.select(Moves.SPLASH);

    await game.phaseInterceptor.to("BerryPhase", false);

    expect(leadPokemon.getStatStage(Stat.DEF)).toBe(0);
  });

  it("should protect the user from being afflicted with status effects", async () => {
    game.overridesHelper.enemyMoveset(Moves.NUZZLE);

    await game.classicModeHelper.startBattle([Species.BLASTOISE]);

    const leadPokemon = game.scene.getPlayerPokemon()!;

    leadPokemon.addTag(BattlerTagType.SUBSTITUTE, 0, Moves.NONE, leadPokemon.id);

    game.moveHelper.select(Moves.SPLASH);

    await game.phaseInterceptor.to("BerryPhase", false);

    expect(leadPokemon.status?.effect).not.toBe(StatusEffect.PARALYSIS);
  });

  it("should prevent the user's items from being stolen", async () => {
    game.overridesHelper.enemyMoveset(Moves.THIEF);
    vi.spyOn(allMoves[Moves.THIEF], "attrs", "get").mockReturnValue([new StealHeldItemChanceAttr(1.0)]); // give Thief 100% steal rate
    game.overridesHelper.startingHeldItems([{ name: "BERRY", type: BerryType.SITRUS }]);

    await game.classicModeHelper.startBattle([Species.BLASTOISE]);

    const leadPokemon = game.scene.getPlayerPokemon()!;

    leadPokemon.addTag(BattlerTagType.SUBSTITUTE, 0, Moves.NONE, leadPokemon.id);

    game.moveHelper.select(Moves.SPLASH);

    await game.phaseInterceptor.to("BerryPhase", false);

    expect(leadPokemon.getHeldItems().length).toBe(1);
  });

  it("should prevent the user's items from being removed", async () => {
    game.overridesHelper.moveset([Moves.KNOCK_OFF]);
    game.overridesHelper.enemyHeldItems([{ name: "BERRY", type: BerryType.SITRUS }]);

    await game.classicModeHelper.startBattle([Species.BLASTOISE]);

    const enemyPokemon = game.scene.getEnemyPokemon()!;

    enemyPokemon.addTag(BattlerTagType.SUBSTITUTE, 0, Moves.NONE, enemyPokemon.id);
    const enemyNumItems = enemyPokemon.getHeldItems().length;

    game.moveHelper.select(Moves.KNOCK_OFF);

    await game.phaseInterceptor.to("MoveEndPhase", false);

    expect(enemyPokemon.getHeldItems().length).toBe(enemyNumItems);
  });

  it("move effect should prevent the user's berries from being stolen and eaten", async () => {
    game.overridesHelper.enemyMoveset(Moves.BUG_BITE);
    game.overridesHelper.startingHeldItems([{ name: "BERRY", type: BerryType.SITRUS }]);

    await game.classicModeHelper.startBattle([Species.BLASTOISE]);

    const leadPokemon = game.scene.getPlayerPokemon()!;
    const enemyPokemon = game.scene.getEnemyPokemon()!;

    leadPokemon.addTag(BattlerTagType.SUBSTITUTE, 0, Moves.NONE, leadPokemon.id);

    game.moveHelper.select(Moves.TACKLE);

    await game.phaseInterceptor.to("MoveEndPhase", false);
    const enemyPostAttackHp = enemyPokemon.hp;

    await game.phaseInterceptor.to("BerryPhase", false);

    expect(leadPokemon.getHeldItems().length).toBe(1);
    expect(enemyPokemon.hp).toBe(enemyPostAttackHp);
  });

  it("should prevent the user's stats from being reset by Clear Smog", async () => {
    game.overridesHelper.enemyMoveset(Moves.CLEAR_SMOG);

    await game.classicModeHelper.startBattle([Species.BLASTOISE]);

    const leadPokemon = game.scene.getPlayerPokemon()!;

    leadPokemon.addTag(BattlerTagType.SUBSTITUTE, 0, Moves.NONE, leadPokemon.id);

    game.moveHelper.select(Moves.SWORDS_DANCE);

    await game.phaseInterceptor.to("BerryPhase", false);

    expect(leadPokemon.getStatStage(Stat.ATK)).toBe(2);
  });

  it("should prevent the user from becoming confused", async () => {
    game.overridesHelper.enemyMoveset(Moves.MAGICAL_TORQUE);
    vi.spyOn(allMoves[Moves.MAGICAL_TORQUE], "chance", "get").mockReturnValue(100);

    await game.classicModeHelper.startBattle([Species.BLASTOISE]);

    const leadPokemon = game.scene.getPlayerPokemon()!;

    leadPokemon.addTag(BattlerTagType.SUBSTITUTE, 0, Moves.NONE, leadPokemon.id);

    game.moveHelper.select(Moves.SWORDS_DANCE);

    await game.phaseInterceptor.to("BerryPhase", false);

    expect(leadPokemon.getTag(BattlerTagType.CONFUSED)).toBeUndefined();
    expect(leadPokemon.getStatStage(Stat.ATK)).toBe(2);
  });

  it("should transfer to the switched in Pokemon when the source uses Baton Pass", async () => {
    game.overridesHelper.moveset([Moves.SUBSTITUTE, Moves.BATON_PASS]);

    await game.classicModeHelper.startBattle([Species.BLASTOISE, Species.CHARIZARD]);

    const leadPokemon = game.scene.getPlayerPokemon()!;

    leadPokemon.addTag(BattlerTagType.SUBSTITUTE, 0, Moves.NONE, leadPokemon.id);

    // Simulate a Baton switch for the player this turn
    game.onNextPrompt("CommandPhase", Mode.COMMAND, () => {
      (game.scene.getCurrentPhase() as CommandPhase).handleCommand(Command.POKEMON, 1, true);
    });

    await game.phaseInterceptor.to("MovePhase", false);

    const switchedPokemon = game.scene.getPlayerPokemon()!;
    const subTag = switchedPokemon.getTag(SubstituteTag)!;
    expect(subTag).toBeDefined();
    expect(subTag.hp).toBe(Math.floor((leadPokemon.getMaxHp() * 1) / 4));
  });

  it("should prevent the source's Rough Skin from activating when hit", async () => {
    game.overridesHelper.enemyMoveset(Moves.TACKLE);
    game.overridesHelper.ability(Abilities.ROUGH_SKIN);

    await game.classicModeHelper.startBattle([Species.BLASTOISE]);

    const enemyPokemon = game.scene.getEnemyPokemon()!;

    game.moveHelper.select(Moves.SUBSTITUTE);

    await game.phaseInterceptor.to("BerryPhase", false);

    expect(enemyPokemon.hp).toBe(enemyPokemon.getMaxHp());
  });

  it("should prevent the source's Focus Punch from failing when hit", async () => {
    game.overridesHelper.enemyMoveset(Moves.TACKLE);
    game.overridesHelper.moveset([Moves.FOCUS_PUNCH]);

    // Make Focus Punch 40 power to avoid a KO
    vi.spyOn(allMoves[Moves.FOCUS_PUNCH], "calculateBattlePower").mockReturnValue(40);

    await game.classicModeHelper.startBattle([Species.BLASTOISE]);

    const playerPokemon = game.scene.getPlayerPokemon()!;
    const enemyPokemon = game.scene.getEnemyPokemon()!;

    playerPokemon.addTag(BattlerTagType.SUBSTITUTE, 0, Moves.NONE, playerPokemon.id);

    game.moveHelper.select(Moves.FOCUS_PUNCH);

    await game.phaseInterceptor.to("BerryPhase", false);

    expect(playerPokemon.getLastXMoves()[0].result).toBe(MoveResult.SUCCESS);
    expect(enemyPokemon.hp).toBeLessThan(enemyPokemon.getMaxHp());
  });

  it("should not allow Shell Trap to activate when attacked", async () => {
    game.overridesHelper.enemyMoveset(Moves.TACKLE);
    game.overridesHelper.moveset([Moves.SHELL_TRAP]);

    await game.classicModeHelper.startBattle([Species.BLASTOISE]);

    const playerPokemon = game.scene.getPlayerPokemon()!;

    playerPokemon.addTag(BattlerTagType.SUBSTITUTE, 0, Moves.NONE, playerPokemon.id);

    game.moveHelper.select(Moves.SHELL_TRAP);

    await game.phaseInterceptor.to("BerryPhase", false);

    expect(playerPokemon.getLastXMoves()[0].result).toBe(MoveResult.FAIL);
  });

  it("should not allow Beak Blast to burn opponents when hit", async () => {
    game.overridesHelper.enemyMoveset(Moves.TACKLE);
    game.overridesHelper.moveset([Moves.BEAK_BLAST]);

    await game.classicModeHelper.startBattle([Species.BLASTOISE]);

    const playerPokemon = game.scene.getPlayerPokemon()!;
    const enemyPokemon = game.scene.getEnemyPokemon()!;

    playerPokemon.addTag(BattlerTagType.SUBSTITUTE, 0, Moves.NONE, playerPokemon.id);

    game.moveHelper.select(Moves.BEAK_BLAST);

    await game.phaseInterceptor.to("MoveEndPhase");

    expect(enemyPokemon.status?.effect).not.toBe(StatusEffect.BURN);
  });

  it("should cause incoming attacks to not activate Counter", async () => {
    game.overridesHelper.enemyMoveset(Moves.TACKLE);
    game.overridesHelper.moveset([Moves.COUNTER]);

    await game.classicModeHelper.startBattle([Species.BLASTOISE]);

    const playerPokemon = game.scene.getPlayerPokemon()!;
    const enemyPokemon = game.scene.getEnemyPokemon()!;

    playerPokemon.addTag(BattlerTagType.SUBSTITUTE, 0, Moves.NONE, playerPokemon.id);

    game.moveHelper.select(Moves.COUNTER);

    await game.phaseInterceptor.to("BerryPhase", false);

    expect(playerPokemon.getLastXMoves()[0].result).toBe(MoveResult.FAIL);
    expect(enemyPokemon.hp).toBe(enemyPokemon.getMaxHp());
  });

  it("should prevent Sappy Seed from applying its Leech Seed effect to the user", async () => {
    game.overridesHelper.enemyMoveset(Moves.SAPPY_SEED);

    await game.classicModeHelper.startBattle([Species.CHARIZARD]);

    const playerPokemon = game.scene.getPlayerPokemon()!;

    playerPokemon.addTag(BattlerTagType.SUBSTITUTE, 0, Moves.NONE, playerPokemon.id);

    game.moveHelper.select(Moves.SPLASH);

    await game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]); // enemy uses Sappy Seed first
    await game.moveHelper.forceHit(); // forces Sappy Seed to hit
    await game.phaseInterceptor.to("MoveEndPhase");

    expect(playerPokemon.getTag(BattlerTagType.SEEDED)).toBeUndefined();
  });
});
