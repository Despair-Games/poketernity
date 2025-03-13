import { StatBoosterModifier } from "#app/modifier/modifier";
import { NumberHolder, randItem } from "#app/utils";
import { Species } from "#enums/species";
import { Stat } from "#enums/stat";
import { GameManager } from "#test/test-utils/gameManager";
import Phase from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Items - Eviolite", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;
  beforeAll(() => {
    phaserGame = new Phase.Game({
      type: Phaser.HEADLESS,
    });
  });

  afterEach(() => {
    game.phaseInterceptor.restoreOg();
  });

  beforeEach(() => {
    game = new GameManager(phaserGame);

    game.override.battleType("single").startingHeldItems([{ name: "EVIOLITE" }]);
  });

  it("should provide 50% boost to DEF and SPDEF for unevolved, unfused pokemon", async () => {
    await game.classicMode.startBattle([Species.PICHU]);

    const partyMember = game.scene.getPlayerPokemon()!;

    vi.spyOn(partyMember, "getEffectiveStat").mockImplementation((stat, _opponent?, _move?, _isCritical?) => {
      const statValue = new NumberHolder(partyMember.getStat(stat, false));
      game.scene.applyModifiers(StatBoosterModifier, partyMember.isPlayer(), partyMember, stat, statValue);

      // Ignore other calculations for simplicity

      return Math.floor(statValue.value);
    });

    const defStat = partyMember.getStat(Stat.DEF, false);
    const spDefStat = partyMember.getStat(Stat.SPDEF, false);

    expect(partyMember.getEffectiveStat(Stat.DEF)).toBe(Math.floor(defStat * 1.5));
    expect(partyMember.getEffectiveStat(Stat.SPDEF)).toBe(Math.floor(spDefStat * 1.5));
  });

  it("should not provide a boost for fully evolved, unfused pokemon", async () => {
    await game.classicMode.startBattle([Species.RAICHU]);

    const partyMember = game.scene.getPlayerPokemon()!;

    vi.spyOn(partyMember, "getEffectiveStat").mockImplementation((stat, _opponent?, _move?, _isCritical?) => {
      const statValue = new NumberHolder(partyMember.getStat(stat, false));
      game.scene.applyModifiers(StatBoosterModifier, partyMember.isPlayer(), partyMember, stat, statValue);

      // Ignore other calculations for simplicity

      return Math.floor(statValue.value);
    });

    const defStat = partyMember.getStat(Stat.DEF, false);
    const spDefStat = partyMember.getStat(Stat.SPDEF, false);

    expect(partyMember.getEffectiveStat(Stat.DEF)).toBe(defStat);
    expect(partyMember.getEffectiveStat(Stat.SPDEF)).toBe(spDefStat);
  });

  it("should not provide a boost for Gigantamax Pokémon", async () => {
    game.override.starterForms({
      [Species.PIKACHU]: 8,
      [Species.EEVEE]: 2,
      [Species.DURALUDON]: 1,
      [Species.MEOWTH]: 1,
    });

    const gMaxablePokemon = [Species.PIKACHU, Species.EEVEE, Species.DURALUDON, Species.MEOWTH];

    await game.classicMode.startBattle([randItem(gMaxablePokemon)]);

    const partyMember = game.scene.getPlayerPokemon()!;

    vi.spyOn(partyMember, "getEffectiveStat").mockImplementation((stat, _opponent?, _move?, _isCritical?) => {
      const statValue = new NumberHolder(partyMember.getStat(stat, false));
      game.scene.applyModifiers(StatBoosterModifier, partyMember.isPlayer(), partyMember, stat, statValue);

      // Ignore other calculations for simplicity

      return Math.floor(statValue.value);
    });

    const defStat = partyMember.getStat(Stat.DEF, false);
    const spDefStat = partyMember.getStat(Stat.SPDEF, false);

    expect(partyMember.getEffectiveStat(Stat.DEF)).toBe(defStat);
    expect(partyMember.getEffectiveStat(Stat.SPDEF)).toBe(spDefStat);
  });
});
