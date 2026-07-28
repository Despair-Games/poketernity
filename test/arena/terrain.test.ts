import { allMoves } from "#app/data/data-lists";
import { getPokemonNameWithAffix } from "#app/messages";
import { getTerrainName } from "#data/terrain";
import { AbilityId } from "#enums/ability-id";
import { BattlerIndex } from "#enums/battler-index";
import { BattlerTagType } from "#enums/battler-tag-type";
import { ElementalType } from "#enums/elemental-type";
import { MoveId } from "#enums/move-id";
import { MoveResult } from "#enums/move-result";
import { SpeciesId } from "#enums/species-id";
import { StatusEffect } from "#enums/status-effect";
import { TerrainType } from "#enums/terrain-type";
import { WeatherType } from "#enums/weather-type";
import { GameManager } from "#test/test-utils/game-manager";
import { enumValueToKey } from "#utils/common-utils";
import { toTitleCase } from "#utils/string-utils";
import i18next from "i18next";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Terrain -", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;

  beforeAll(() => {
    phaserGame = new Phaser.Game({
      type: Phaser.HEADLESS,
    });
  });

  beforeEach(() => {
    game = new GameManager(phaserGame);
    game.override
      .battleType("single")
      .disableCrits()
      .startingLevel(100)
      .enemyLevel(100)
      .enemySpecies(SpeciesId.SHUCKLE)
      .enemyMoveset(MoveId.SPLASH)
      .enemyAbility(AbilityId.STURDY)
      .passiveAbility(AbilityId.NO_GUARD);
  });

  afterEach(() => {
    game.phaseInterceptor.restoreOg();
  });

  describe.each<{ name: string; moveType: ElementalType; terrain: TerrainType; moveId: MoveId }>([
    { name: "Electric", moveType: ElementalType.ELECTRIC, terrain: TerrainType.ELECTRIC, moveId: MoveId.THUNDERBOLT },
    { name: "Psychic", moveType: ElementalType.PSYCHIC, terrain: TerrainType.PSYCHIC, moveId: MoveId.PSYCHIC },
    { name: "Grassy", moveType: ElementalType.GRASS, terrain: TerrainType.GRASSY, moveId: MoveId.ENERGY_BALL },
    { name: "Misty", moveType: ElementalType.FAIRY, terrain: TerrainType.MISTY, moveId: MoveId.DRAGON_BREATH },
  ])("Common Tests - $name Terrain", ({ moveType, terrain, moveId }) => {
    beforeEach(() => {
      game.override //
        .terrain(terrain)
        .enemyPassiveAbility(AbilityId.LEVITATE);
    });

    const typeStr = toTitleCase(enumValueToKey(ElementalType, moveType));

    if (terrain === TerrainType.MISTY) {
      it("should cut power of grounded Dragon-type moves in half, even from ungrounded users", async () => {
        await game.classicMode.startBattle(SpeciesId.BLISSEY);

        const powerSpy = vi.spyOn(allMoves.get(moveId), "calculateBattlePower");
        game.move.use(moveId);
        await game.move.forceEnemyMove(moveId);
        game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
        await game.toEndOfTurn();

        // Enemy dragon breath got nerfed against grounded player; player dragon breath did not
        expect(powerSpy).toHaveLastReturnedWith(allMoves.get(moveId).power);
        expect(powerSpy).toHaveNthReturnedWith(1, allMoves.get(moveId).power * 0.5);
      });
    } else {
      it(`should boost power of grounded ${typeStr}-type moves by 1.3x, even against ungrounded targets`, async () => {
        await game.classicMode.startBattle(SpeciesId.BLISSEY);

        const powerSpy = vi.spyOn(allMoves.get(moveId), "calculateBattlePower");

        game.move.use(moveId);
        await game.move.forceEnemyMove(moveId);
        game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
        await game.toEndOfTurn();

        // Player grounded attack got boosted while enemy ungrounded attack didn't
        expect(powerSpy).toHaveLastReturnedWith(allMoves.get(moveId).power * 1.3);
        expect(powerSpy).toHaveNthReturnedWith(1, allMoves.get(moveId).power);
      });
    }

    // TODO: Move to a dedicated terrain pulse test file
    it(`should change Terrain Pulse into a ${typeStr}-type move and double its base power`, async () => {
      await game.classicMode.startBattle(SpeciesId.BLISSEY);

      const powerSpy = vi.spyOn(allMoves.get(MoveId.TERRAIN_PULSE), "calculateBattlePower");
      const playerTypeSpy = vi.spyOn(game.field.getPlayerPokemon(), "getMoveType");
      const enemyTypeSpy = vi.spyOn(game.field.getEnemyPokemon(), "getMoveType");

      game.move.use(MoveId.TERRAIN_PULSE);
      await game.move.forceEnemyMove(MoveId.TERRAIN_PULSE);
      game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
      await game.toEndOfTurn();

      // player grounded terrain pulse was boosted & type converted; enemy ungrounded one wasn't
      expect(powerSpy).toHaveLastReturnedWith(
        allMoves.get(MoveId.TERRAIN_PULSE).power * 2 * (terrain === TerrainType.MISTY ? 1 : 1.3),
      );
      expect(playerTypeSpy).toHaveLastReturnedWith(moveType);
      expect(powerSpy).toHaveNthReturnedWith(1, allMoves.get(MoveId.TERRAIN_PULSE).power);
      expect(enemyTypeSpy).toHaveNthReturnedWith(1, allMoves.get(MoveId.TERRAIN_PULSE).type);
    });
  });

  describe("Grassy Terrain", () => {
    beforeEach(() => {
      game.override.terrain(TerrainType.GRASSY);
    });

    it("should heal all grounded, non semi-invulnerable Pokemon for 1/16th max HP at end of turn", async () => {
      await game.classicMode.startBattle(SpeciesId.BLISSEY);

      // blissey is grounded, shuckle isn't
      const blissey = game.field.getPlayerPokemon();
      const shuckle = game.field.getEnemyPokemon();
      game.field.mockAbility(shuckle, AbilityId.LEVITATE);
      blissey.hp /= 2;
      shuckle.hp /= 2;

      game.move.use(MoveId.SPLASH);
      await game.toNextTurn();

      expect(game.phaseInterceptor.log).toContain("PokemonHealPhase");
      expect(blissey.getHpRatio()).toBeCloseTo(0.5625, 1);
      expect(shuckle.getHpRatio()).toBeCloseTo(0.5, 1);

      game.phaseInterceptor.clearLogs();

      game.move.use(MoveId.DIG);
      await game.toNextTurn();

      // shuckle is airborne and blissey is semi-invulnerable, so nobody gets healed
      expect(game.phaseInterceptor.log).not.toContain("PokemonHealPhase");
      expect(blissey.getHpRatio()).toBeCloseTo(0.5625, 1);
      expect(shuckle.getHpRatio()).toBeCloseTo(0.5, 1);
    });

    // TODO: Move to Earthquake & co.'s test files if/when they get one
    // (maybe merge with Rising Voltage)
    it.each<{ name: string; moveId: MoveId; basePower?: number }>([
      { name: "Bulldoze", moveId: MoveId.BULLDOZE },
      { name: "Earthquake", moveId: MoveId.EARTHQUAKE },
      { name: "Magnitude", moveId: MoveId.MAGNITUDE, basePower: 150 }, // magnitude 10
    ])(
      "should halve $name's base power against grounded, on-field targets",
      async ({ moveId, basePower = allMoves.get(moveId).power }) => {
        await game.classicMode.startBattle(SpeciesId.FEEBAS);

        // force high rolls for guaranteed magnitude 10s
        vi.spyOn(Phaser.Math.RND, "integerInRange").mockImplementation((_min, max) => max);

        const powerSpy = vi.spyOn(allMoves.get(moveId), "calculateBattlePower");

        // Turn 1: attack with grassy terrain active; 0.5x
        game.move.use(moveId);
        await game.toNextTurn();

        expect(powerSpy).toHaveLastReturnedWith(basePower / 2);
        powerSpy.mockClear();

        // Turn 2: Make shuckle semi-invulnerable & hit through No Guard; 1x
        game.move.use(moveId);
        await game.move.forceEnemyMove(MoveId.DIG);
        game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
        await game.toEndOfTurn();

        expect(powerSpy).toHaveLastReturnedWith(basePower);
      },
    );
  });

  describe("Electric Terrain", () => {
    beforeEach(() => {
      game.override.terrain(TerrainType.ELECTRIC);
    });

    it("should prevent all grounded Pokemon from being put to sleep", async () => {
      await game.classicMode.startBattle(SpeciesId.PIDGEOT);

      game.move.use(MoveId.SPORE);
      await game.move.forceEnemyMove(MoveId.SPORE);
      await game.toEndOfTurn();

      const pidgeot = game.field.getPlayerPokemon();
      const shuckle = game.field.getEnemyPokemon();
      expect(pidgeot).toHaveStatusEffect(StatusEffect.SLEEP);
      expect(shuckle).toHaveStatusEffect(StatusEffect.NONE);
      // TODO: These don't work due to how move failures are propagated
      // expect(pidgeot).toHaveUsedMove({ move: MoveId.SPORE, result: MoveResult.FAIL });
      // expect(shuckle).toHaveUsedMove({ move: MoveId.SPORE, result: MoveResult.SUCCESS });

      // TODO: port https://github.com/pagefaultgames/pokerogue/pull/5931
      // expect(game).toHaveShownMessage(
      //   i18next.t("terrain:defaultBlockMessage", {
      //     pokemonNameWithAffix: getPokemonNameWithAffix(shuckle),
      //     terrainName: getTerrainName(TerrainType.ELECTRIC),
      //   }),
      // );
    });

    it("should prevent attack moves from applying sleep without showing text/failing move", async () => {
      vi.spyOn(allMoves.get(MoveId.RELIC_SONG), "chance", "get").mockReturnValue(100);
      await game.classicMode.startBattle(SpeciesId.BLISSEY);

      const blissey = game.field.getPlayerPokemon();
      const shuckle = game.field.getEnemyPokemon();
      const statusSpy = vi.spyOn(shuckle, "canSetStatus");

      game.move.use(MoveId.RELIC_SONG);
      await game.move.forceEnemyMove(MoveId.SPLASH);
      await game.toEndOfTurn();

      expect(shuckle).toHaveStatusEffect(StatusEffect.NONE);
      expect(statusSpy).toHaveLastReturnedWith(false);
      expect(blissey).toHaveUsedMove({ moveId: MoveId.RELIC_SONG, result: MoveResult.SUCCESS });

      expect(game).not.toHaveShownMessage(
        i18next.t("terrain:defaultBlockMessage", {
          pokemonNameWithAffix: getPokemonNameWithAffix(shuckle),
          terrainName: getTerrainName(TerrainType.ELECTRIC),
        }),
      );
    });
  });

  describe("Misty Terrain", () => {
    beforeEach(() => {
      game.override //
        .terrain(TerrainType.MISTY)
        .enemyPassiveAbility(AbilityId.LEVITATE);
    });

    it("should prevent all grounded Pokemon from gaining non-volatile status conditions", async () => {
      await game.classicMode.startBattle(SpeciesId.BLISSEY);

      game.move.use(MoveId.TOXIC);
      await game.move.forceEnemyMove(MoveId.TOXIC);
      await game.toNextTurn();

      const blissey = game.field.getPlayerPokemon();
      const shuckle = game.field.getEnemyPokemon();
      // blissey is grounded & protected, shuckle isn't
      expect(blissey).toHaveStatusEffect(StatusEffect.NONE);
      expect(shuckle).toHaveStatusEffect(StatusEffect.TOXIC);
      // TODO: These don't work due to how move failures are propagated
      // expect(blissey).toHaveUsedMove({ move: MoveId.TOXIC, result: MoveResult.SUCCESS });
      // expect(shuckle).toHaveUsedMove({ move: MoveId.TOXIC, result: MoveResult.FAIL });

      // TODO: port https://github.com/pagefaultgames/pokerogue/pull/5931
      // expect(game).toHaveShownMessage(
      //   i18next.t("terrain:mistyBlockMessage", {
      //     pokemonNameWithAffix: getPokemonNameWithAffix(blissey),
      //   }),
      // );
    });

    it("should block confusion and display message", async () => {
      game.override.statusActivation(false); // prevent self hits from cancelling move
      await game.classicMode.startBattle(SpeciesId.BLISSEY);

      game.move.use(MoveId.CONFUSE_RAY);
      await game.move.forceEnemyMove(MoveId.CONFUSE_RAY);
      await game.toNextTurn();

      const blissey = game.field.getPlayerPokemon();
      const shuckle = game.field.getEnemyPokemon();
      // blissey is grounded & protected, shuckle isn't
      expect(blissey).not.toHaveBattlerTag(BattlerTagType.CONFUSED);
      expect(shuckle).toHaveBattlerTag(BattlerTagType.CONFUSED);
      // TODO: port https://github.com/pagefaultgames/pokerogue/pull/5931 and https://github.com/pagefaultgames/pokerogue/pull/6987
      // expect(game).toHaveShownMessage(
      //   i18next.t("terrain:mistyBlockMessage", {
      //     pokemonNameWithAffix: getPokemonNameWithAffix(blissey),
      //   }),
      // );
    });

    it.each<{ status: string; moveId: MoveId }>([
      { status: "Sleep", moveId: MoveId.RELIC_SONG },
      { status: "Burn", moveId: MoveId.SACRED_FIRE },
      { status: "Freeze", moveId: MoveId.ICE_BEAM },
      { status: "Paralysis", moveId: MoveId.NUZZLE },
      { status: "Poison", moveId: MoveId.SLUDGE_BOMB },
      { status: "Toxic Poison", moveId: MoveId.MALIGNANT_CHAIN },
      { status: "Confusion", moveId: MoveId.MAGICAL_TORQUE },
    ])("should prevent attack moves from applying $status without showing text/failing move", async ({ moveId }) => {
      vi.spyOn(allMoves.get(moveId), "chance", "get").mockReturnValue(100);
      await game.classicMode.startBattle(SpeciesId.BLISSEY);

      game.move.use(MoveId.SPLASH);
      await game.move.forceEnemyMove(moveId);
      await game.toEndOfTurn();

      const blissey = game.field.getPlayerPokemon();
      const shuckle = game.field.getEnemyPokemon();
      // Blissey was grounded and protected from effect, but still took damage
      expect(blissey).not.toHaveFullHp();
      expect(blissey).not.toHaveBattlerTag(BattlerTagType.CONFUSED);
      expect(blissey).toHaveStatusEffect(StatusEffect.NONE);
      expect(shuckle).toHaveUsedMove({ moveId, result: MoveResult.SUCCESS });

      expect(game).not.toHaveShownMessage(
        i18next.t("terrain:mistyBlockMessage", {
          pokemonNameWithAffix: getPokemonNameWithAffix(blissey),
        }),
      );
    });
  });

  describe("Psychic Terrain", () => {
    beforeEach(() => {
      game.override.terrain(TerrainType.PSYCHIC);
    });

    it("should block all opponent-targeted priority moves", async () => {
      await game.classicMode.startBattle(SpeciesId.BLISSEY);

      game.move.use(MoveId.QUICK_ATTACK);
      await game.move.forceEnemyMove(MoveId.WIDE_GUARD);
      await game.toEndOfTurn();

      const blissey = game.field.getPlayerPokemon();
      const shuckle = game.field.getEnemyPokemon();
      expect(blissey).toHaveUsedMove({ moveId: MoveId.QUICK_ATTACK, result: MoveResult.FAIL });
      expect(shuckle).toHaveUsedMove({ moveId: MoveId.WIDE_GUARD, result: MoveResult.SUCCESS });
      expect(game).toHaveShownMessage(
        i18next.t("terrain:defaultBlockMessage", {
          pokemonNameWithAffix: getPokemonNameWithAffix(shuckle),
          terrainName: getTerrainName(TerrainType.PSYCHIC),
        }),
      );
    });

    it("should affect moves that only become priority due to abilities", async () => {
      game.override //
        .ability(AbilityId.PRANKSTER)
        .enemyAbility(AbilityId.PRANKSTER);
      await game.classicMode.startBattle(SpeciesId.BLISSEY);

      game.move.use(MoveId.FEATHER_DANCE);
      await game.move.forceEnemyMove(MoveId.SWORDS_DANCE);
      await game.toEndOfTurn();

      const blissey = game.field.getPlayerPokemon();
      const shuckle = game.field.getEnemyPokemon();
      expect(blissey).toHaveUsedMove({ moveId: MoveId.FEATHER_DANCE, result: MoveResult.FAIL });
      expect(shuckle).toHaveUsedMove({ moveId: MoveId.SWORDS_DANCE, result: MoveResult.SUCCESS });
      expect(game).toHaveShownMessage(
        i18next.t("terrain:defaultBlockMessage", {
          pokemonNameWithAffix: getPokemonNameWithAffix(shuckle),
          terrainName: getTerrainName(TerrainType.PSYCHIC),
        }),
      );
    });

    it.each<{ category: string; moveId: MoveId; effect: () => void }>([
      {
        category: "Field-targeted",
        moveId: MoveId.RAIN_DANCE,
        effect: () => {
          expect(game).toHaveWeather(WeatherType.RAIN);
        },
      },
      {
        // TODO: Review if this is actually how it works in mainline
        category: "Enemy-targeting spread",
        moveId: MoveId.DARK_VOID,
        effect: () => {
          expect(game.field.getEnemyPokemon()).toHaveStatusEffect(StatusEffect.SLEEP);
        },
      },
    ])("should not block $category moves that become priority", async ({ moveId, effect }) => {
      await game.classicMode.startBattle(SpeciesId.BLISSEY);

      game.move.use(moveId);
      await game.move.forceEnemyMove(MoveId.SPLASH);
      await game.toEndOfTurn();

      const blissey = game.field.getPlayerPokemon();
      expect(blissey).toHaveUsedMove({ moveId, result: MoveResult.SUCCESS });
      effect();
    });

    // TODO: enable after porting https://github.com/pagefaultgames/pokerogue/pull/6732
    it.todo("should not block non-priority moves boosted by Quick Claw/Quick Draw", async () => {
      await game.classicMode.startBattle(SpeciesId.FEEBAS);

      const feebas = game.field.getPlayerPokemon();
      feebas.addTag(BattlerTagType.BYPASS_SPEED);
      expect(allMoves.get(MoveId.POUND).getPriority(feebas)).toBe(0);
      // expect(allMoves.get(MoveId.POUND).getPriorityModifier(feebas)).toBe(MovePriorityInBracket.FIRST);

      game.move.use(MoveId.POUND);
      await game.toEndOfTurn();

      const shuckle = game.field.getEnemyPokemon();
      expect(shuckle).not.toHaveFullHp();
    });

    it.todo("should block priority moves boosted by Quick Claw/Quick Draw", async () => {
      await game.classicMode.startBattle(SpeciesId.FEEBAS);

      const feebas = game.field.getPlayerPokemon();
      feebas.addTag(BattlerTagType.BYPASS_SPEED);
      expect(allMoves.get(MoveId.QUICK_ATTACK).getPriority(feebas)).toBe(1);
      // expect(allMoves.get(MoveId.QUICK_ATTACK).getPriorityModifier(feebas)).toBe(MovePriorityInBracket.FIRST);

      game.move.use(MoveId.QUICK_ATTACK);
      await game.toEndOfTurn();

      const shuckle = game.field.getEnemyPokemon();
      expect(shuckle).toHaveFullHp();
    });
  });
});
