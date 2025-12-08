import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { handleTutorial } from "#app/tutorial";
import type { MistTag } from "#arena-tags/mist-tag";
import { CANVAS_SCALE } from "#constants/ui-constants";
import { ArenaTagType } from "#enums/arena-tag-type";
import type { FieldBattlerIndex } from "#enums/battler-index";
import { type BattleStat, getStatStageChangeDescriptionKey, Stat } from "#enums/stat";
import { Tutorial } from "#enums/tutorial";
import type { Pokemon } from "#field/pokemon";
import { ResetNegativeStatStageModifier } from "#modifier/modifier";
import { PokemonPhase } from "#phases/base/pokemon-phase";
import { settings } from "#system/settings-manager";
import { BooleanHolder, enumValueToKey, NumberHolder } from "#utils/common-utils";
import { getStatKey } from "#utils/i18n-utils";
import { inSpeedOrder } from "#utils/speed-order-generator";
import i18next from "i18next";

//#region Types

export type StatStageChangeCallback = (changed: BattleStat[], relativeChanges: number[], target?: Pokemon) => void;

interface StatStageChangePhaseOptions {
  showMessage?: boolean;
  ignoreAbilities?: boolean;
  canBeCopied?: boolean;
  bypassReflect?: boolean;
  isStickyWeb?: boolean;
  onChange?: StatStageChangeCallback;
}

//#endregion

export class StatStageChangePhase extends PokemonPhase {
  public override readonly phaseName = "StatStageChangePhase";

  protected readonly stats: BattleStat[];
  protected readonly source?: Pokemon;
  protected stages: number;
  protected readonly showMessage: boolean;
  protected readonly ignoreAbilities: boolean;
  protected readonly canBeCopied: boolean;
  protected readonly bypassReflect: boolean;
  protected readonly onChange?: StatStageChangeCallback;
  private readonly options: StatStageChangePhaseOptions;

  /**
   * Sticky Web has an edge case where its source gets ignored by Defiant/Competitive, but not Mirror Armor.
   *
   * TODO: Do other effects (Mist, Clear Body, etc.) also ignore the source of Sticky Web?
   */
  protected readonly isStickyWeb: boolean;

  constructor(
    battlerIndex: FieldBattlerIndex,
    source: Pokemon | undefined,
    stats: BattleStat[],
    stages: number,
    {
      showMessage = true,
      ignoreAbilities = false,
      canBeCopied = true,
      bypassReflect = false,
      isStickyWeb = false,
      onChange,
    }: StatStageChangePhaseOptions = {},
  ) {
    super(battlerIndex);

    this.source = source;
    this.stats = stats;
    this.stages = stages;
    this.showMessage = showMessage;
    this.ignoreAbilities = ignoreAbilities;
    this.canBeCopied = canBeCopied;
    this.bypassReflect = bypassReflect;
    this.isStickyWeb = isStickyWeb;
    this.onChange = onChange;
    this.options = { showMessage, ignoreAbilities, canBeCopied, bypassReflect, onChange };
  }

  public override start(): void {
    const pokemon = this.getPokemon();
    const selfTarget = pokemon === this.source;

    const { add, arena, field, fieldSpritePipeline, tweens, time } = globalScene;

    if (!pokemon.isActive(true)) {
      super.end();
      return;
    }

    if (!this.ignoreAbilities && !this.bypassReflect) {
      const reflected = new BooleanHolder(false);
      applyAbAttrs("ReflectStatStageChangeAbAttr", pokemon, false, this.source, this.stats, this.stages, reflected);
      if (reflected.value) {
        super.end();
        return;
      }
    }

    // Check if multiple stats are being changed at the same time, then run SSCPhase for each of them
    if (this.stats.length > 1) {
      for (const stat of this.stats) {
        globalScene.phaseManager.createAndUnshiftPhase(
          "StatStageChangePhase",
          this.battlerIndex,
          this.source,
          [stat],
          this.stages,
          this.options,
        );
      }
      super.end();
      return;
    }

    const stages = new NumberHolder(this.stages);

    if (!this.ignoreAbilities) {
      applyAbAttrs("StatStageChangeMultiplierAbAttr", pokemon, false, stages);
    }

    let simulate = false;

    const filteredStats: BattleStat[] = this.stats.filter((stat) => {
      const cancelled = new BooleanHolder(false);

      if (!selfTarget && stages.value < 0) {
        arena.applyTags<MistTag>(ArenaTagType.MIST, pokemon.getArenaTagSide(), false, this.source, cancelled);
      }

      if (!cancelled.value && !selfTarget && stages.value < 0) {
        applyAbAttrs("ProtectStatAbAttr", pokemon, simulate, stat, cancelled);
      }

      // If one stat stage decrease is cancelled, simulate the rest of the applications
      if (cancelled.value) {
        simulate = true;
      }

      return !cancelled.value;
    });

    const relLevels = filteredStats.map(
      (s) =>
        (stages.value >= 1
          ? Math.min(pokemon.getStatStage(s) + stages.value, 6)
          : Math.max(pokemon.getStatStage(s) + stages.value, -6)) - pokemon.getStatStage(s),
    );

    this.onChange?.(filteredStats, relLevels, this.getPokemon());

    const end = (): void => {
      if (this.showMessage) {
        const messages: string[] = [];
        if (this.stages === 12 && filteredStats.length === 1) {
          messages.push(
            i18next.t("battle:statMaximized", {
              pokemonNameWithAffix: getPokemonNameWithAffix(this.getPokemon()),
              stats: i18next.t(getStatKey(this.stats[0])),
            }),
          );
        } else {
          messages.push(...this.getStatStageChangeMessages(filteredStats, stages.value, relLevels));
        }
        for (const message of messages) {
          globalScene.phaseManager.createAndUnshiftPhase("MessagePhase", message);
        }
      }

      for (const s of filteredStats) {
        if (stages.value > 0 && pokemon.getStatStage(s) < 6) {
          pokemon.turnData.statStagesIncreased = true;
        } else if (stages.value < 0 && pokemon.getStatStage(s) > -6) {
          pokemon.turnData.statStagesDecreased = true;
        }

        pokemon.setStatStage(s, pokemon.getStatStage(s) + stages.value);
      }

      if (stages.value > 0 && this.canBeCopied) {
        for (const opponent of inSpeedOrder(pokemon.getOpposingArenaTagSide())) {
          applyAbAttrs("StatStageChangeCopyAbAttr", opponent, false, this.stats, stages.value);
        }
      }

      applyAbAttrs(
        "PostStatStageChangeAbAttr",
        pokemon,
        false,
        filteredStats,
        this.stages,
        this.source,
        this.isStickyWeb,
      );

      // Look for any other stat change phases; if this is the last one, do White Herb check
      const phaseExists = globalScene.phaseManager.hasPhaseOfType(
        "StatStageChangePhase",
        (p) => p.battlerIndex === this.battlerIndex,
      );
      if (!phaseExists) {
        // Apply White Herb if needed
        const whiteHerb = globalScene.applyModifier(
          ResetNegativeStatStageModifier,
          this.isPlayer,
          pokemon,
        ) as ResetNegativeStatStageModifier;
        // If the White Herb was applied, consume it
        if (whiteHerb) {
          pokemon.loseHeldItem(whiteHerb);
          globalScene.updateModifiers(this.isPlayer);
        }
      }

      pokemon.updateInfo();

      handleTutorial(Tutorial.STAT_CHANGE).then(() => super.end());
    };

    if (relLevels.filter((l) => l).length && settings.display.enableMoveAnimations) {
      pokemon.enableMask();
      const pokemonMaskSprite = pokemon.maskSprite;

      const tileX = (this.isPlayer ? 106 : 236) * pokemon.getSpriteScale() * field.scale;
      const tileY =
        ((this.isPlayer ? 148 : 84) + (stages.value >= 1 ? 160 : 0)) * pokemon.getSpriteScale() * field.scale;
      const tileWidth = 156 * field.scale * pokemon.getSpriteScale();
      const tileHeight = 316 * field.scale * pokemon.getSpriteScale();

      // On increase, show the red sprite located at ATK
      // On decrease, show the blue sprite located at SPD
      const spriteColor = enumValueToKey(Stat, stages.value >= 1 ? Stat.ATK : Stat.SPD).toLowerCase();
      const statSprite = add.tileSprite(tileX, tileY, tileWidth, tileHeight, "battle_stats", spriteColor);
      statSprite.setPipeline(fieldSpritePipeline);
      statSprite.setAlpha(0);
      statSprite.setScale(CANVAS_SCALE);
      statSprite.setOrigin(0.5, 1);

      globalScene.audioManager.playSound(`se/stat_${stages.value >= 1 ? "up" : "down"}`);

      statSprite.setMask(new Phaser.Display.Masks.BitmapMask(globalScene, pokemonMaskSprite ?? undefined));

      tweens.add({
        targets: statSprite,
        duration: 250,
        alpha: 0.8375,
        onComplete: () => {
          tweens.add({
            targets: statSprite,
            delay: 1000,
            duration: 250,
            alpha: 0,
          });
        },
      });

      tweens.add({
        targets: statSprite,
        duration: 1500,
        y: `${stages.value >= 1 ? "-" : "+"}=${160 * 6}`,
      });

      time.delayedCall(1750, () => {
        pokemon.disableMask();
        end();
      });
    } else {
      end();
    }
  }

  protected getStatStageChangeMessages(stats: BattleStat[], stages: number, relStages: number[]): string[] {
    const messages: string[] = [];

    const relStageStatIndexes = {};
    for (let rl = 0; rl < relStages.length; rl++) {
      const relStage = relStages[rl];
      if (!relStageStatIndexes[relStage]) {
        relStageStatIndexes[relStage] = [];
      }
      relStageStatIndexes[relStage].push(rl);
    }

    Object.keys(relStageStatIndexes).forEach((rl) => {
      const relStageStats = stats.filter((_, i) => relStageStatIndexes[rl].includes(i));
      let statsFragment = "";

      if (relStageStats.length > 1) {
        statsFragment =
          relStageStats.length >= 5
            ? i18next.t("battle:stats")
            : `${relStageStats
                .slice(0, -1)
                .map((s) => i18next.t(getStatKey(s)))
                .join(
                  ", ",
                )}${relStageStats.length > 2 ? "," : ""} ${i18next.t("battle:statsAnd")} ${i18next.t(getStatKey(relStageStats.at(-1)!))}`;
      } else {
        statsFragment = i18next.t(getStatKey(relStageStats[0]));
      }

      messages.push(
        i18next.t(getStatStageChangeDescriptionKey(Math.abs(Number.parseInt(rl)), stages >= 1), {
          pokemonNameWithAffix: getPokemonNameWithAffix(this.getPokemon()),
          stats: statsFragment,
          count: relStageStats.length,
        }),
      );
    });

    return messages;
  }
}
