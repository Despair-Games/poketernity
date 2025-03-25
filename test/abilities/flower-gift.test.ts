import { BattlerIndex } from "#enums/battler-index";
import { AbilityId } from "#enums/ability-id";
import { Stat } from "#enums/stat";
import { WeatherType } from "#enums/weather-type";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Abilities - Flower Gift", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;
  const OVERCAST_FORM = 0;
  const SUNSHINE_FORM = 1;

  /**
   * Tests reverting to normal form when Cloud Nine/Air Lock is active on the field
   * @param game The game manager instance
   * @param ability The ability that is active on the field
   */
  const testRevertFormAgainstAbility = async (game: GameManager, ability: AbilityId) => {
    game.override.starterForms({ [SpeciesId.CHERRIM]: SUNSHINE_FORM }).enemyAbility(ability);
    await game.classicMode.startBattle([SpeciesId.CHERRIM]);

    game.move.select(MoveId.SPLASH);

    expect(game.field.getPlayerPokemon().formIndex).toBe(OVERCAST_FORM);
  };

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
      .moveset([MoveId.SPLASH, MoveId.RAIN_DANCE, MoveId.SUNNY_DAY, MoveId.SKILL_SWAP])
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyMoveset(MoveId.SPLASH)
      .enemyAbility(AbilityId.BALL_FETCH);
  });

  // TODO: Uncomment expect statements when the ability is fully implemented - currently does not increase stats of allies
  it("increases the ATK and SPDEF stat stages of the user and its allies by 1.5x during Sunny weather", async () => {
    game.override.battleType("double");
    await game.classicMode.startBattle([SpeciesId.CHERRIM, SpeciesId.MAGIKARP]);

    const [cherrim] = game.scene.getPlayerField();
    const cherrimAtkStat = cherrim.getEffectiveStat(Stat.ATK);
    const cherrimSpDefStat = cherrim.getEffectiveStat(Stat.SPDEF);

    // const magikarpAtkStat = magikarp.getEffectiveStat(Stat.ATK);;
    // const magikarpSpDefStat = magikarp.getEffectiveStat(Stat.SPDEF);

    game.move.select(MoveId.SUNNY_DAY, 0);
    game.move.select(MoveId.SPLASH, 1);

    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.PLAYER_2, BattlerIndex.ENEMY, BattlerIndex.ENEMY_2]);
    await game.toEndOfTurn();

    expect(cherrim.formIndex).toBe(SUNSHINE_FORM);
    expect(cherrim.getEffectiveStat(Stat.ATK)).toBe(Math.floor(cherrimAtkStat * 1.5));
    expect(cherrim.getEffectiveStat(Stat.SPDEF)).toBe(Math.floor(cherrimSpDefStat * 1.5));
    // expect(magikarp.getEffectiveStat(Stat.ATK)).toBe(Math.floor(magikarpAtkStat * 1.5));
    // expect(magikarp.getEffectiveStat(Stat.SPDEF)).toBe(Math.floor(magikarpSpDefStat * 1.5));
  });

  it("changes the Pokemon's form during the primal weather Harsh Sunlight", async () => {
    game.override.weather(WeatherType.HARSH_SUN);
    await game.classicMode.startBattle([SpeciesId.CHERRIM]);

    const cherrim = game.field.getPlayerPokemon();
    expect(cherrim.formIndex).toBe(SUNSHINE_FORM);

    game.move.select(MoveId.SPLASH);
  });

  it("reverts to Overcast Form if a Pokémon on the field has Air Lock", async () => {
    await testRevertFormAgainstAbility(game, AbilityId.AIR_LOCK);
  });

  it("reverts to Overcast Form if a Pokémon on the field has Cloud Nine", async () => {
    await testRevertFormAgainstAbility(game, AbilityId.CLOUD_NINE);
  });

  it("reverts to Overcast Form when the Pokémon loses Flower Gift, changes form under Harsh Sunlight/Sunny when it regains it", async () => {
    game.override.enemyMoveset([MoveId.SKILL_SWAP]).weather(WeatherType.HARSH_SUN);

    await game.classicMode.startBattle([SpeciesId.CHERRIM]);

    const cherrim = game.field.getPlayerPokemon();

    game.move.select(MoveId.SKILL_SWAP);

    await game.phaseInterceptor.to("TurnStartPhase");
    expect(cherrim.formIndex).toBe(SUNSHINE_FORM);

    await game.phaseInterceptor.to("MoveEndPhase");
    expect(cherrim.formIndex).toBe(OVERCAST_FORM);

    await game.phaseInterceptor.to("MoveEndPhase");
    expect(cherrim.formIndex).toBe(SUNSHINE_FORM);
  });

  it("reverts to Overcast Form when the Flower Gift is suppressed, changes form under Harsh Sunlight/Sunny when it regains it", async () => {
    game.override.enemyMoveset([MoveId.GASTRO_ACID]).weather(WeatherType.HARSH_SUN);

    await game.classicMode.startBattle([SpeciesId.CHERRIM, SpeciesId.MAGIKARP]);

    const cherrim = game.field.getPlayerPokemon();

    expect(cherrim.formIndex).toBe(SUNSHINE_FORM);

    game.move.select(MoveId.SPLASH);
    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.toEndOfTurn();

    expect(cherrim.summonData.abilitySuppressed).toBe(true);
    expect(cherrim.formIndex).toBe(OVERCAST_FORM);

    await game.toNextTurn();

    game.doSwitchPokemon(1);
    await game.toNextTurn();

    game.doSwitchPokemon(1);
    await game.phaseInterceptor.to("MovePhase");

    expect(cherrim.summonData.abilitySuppressed).toBe(false);
    expect(cherrim.formIndex).toBe(SUNSHINE_FORM);
  });

  it("should be in Overcast Form after the user is switched out", async () => {
    game.override.weather(WeatherType.SUNNY);

    await game.classicMode.startBattle([SpeciesId.CHERRIM, SpeciesId.MAGIKARP]);
    const cherrim = game.field.getPlayerPokemon();

    expect(cherrim.formIndex).toBe(SUNSHINE_FORM);

    game.doSwitchPokemon(1);
    await game.toNextTurn();

    expect(cherrim.formIndex).toBe(OVERCAST_FORM);
  });

  it("should revert to Overcast Form after Sunny weather ends", async () => {
    await game.classicMode.startBattle([SpeciesId.CHERRIM]);
    const cherrim = game.field.getPlayerPokemon();

    game.move.use(MoveId.SUNNY_DAY);
    await game.toNextTurn();

    expect(cherrim.formIndex).toBe(SUNSHINE_FORM);

    // Wait 4 more turns for Sunny weather to end
    for (let i = 0; i < 4; i++) {
      game.move.use(MoveId.SPLASH);
      await game.toNextTurn();
    }

    expect(cherrim.formIndex).toBe(OVERCAST_FORM);
  });

  it("should revert to Overcast Form after the primal weather Harsh Sunlight ends", async () => {
    game.override.battleType("double").starterForms({ [SpeciesId.GROUDON]: 1 }); // Primal Groudon
    await game.classicMode.startBattle([SpeciesId.CHERRIM, SpeciesId.GROUDON, SpeciesId.MAGIKARP]);
    const cherrim = game.field.getPlayerPokemon();

    expect(cherrim.formIndex).toBe(SUNSHINE_FORM);

    // Switch out Primal Groudon to end weather
    game.move.use(MoveId.SPLASH, 0);
    game.doSwitchPokemon(2);
    await game.toNextTurn();

    expect(cherrim.formIndex).toBe(OVERCAST_FORM);
  });
});
