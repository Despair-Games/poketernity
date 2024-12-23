import type { BattlerIndex } from "#app/battle";
import { PostStatStageChangeAbAttr } from "#app/data/ab-attrs/post-stat-stage-change-ab-attr";
import { ProtectStatAbAttr } from "#app/data/ab-attrs/protect-stat-ab-attr";
import { StatStageChangeCopyAbAttr } from "#app/data/ab-attrs/stat-stage-change-copy-ab-attr";
import { StatStageChangeMultiplierAbAttr } from "#app/data/ab-attrs/stat-stage-change-multiplier-ab-attr";
import { applyAbAttrs, applyPostStatStageChangeAbAttrs, applyPreStatStageChangeAbAttrs } from "#app/data/ability";
import { MistTag } from "#app/data/arena-tag";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { ResetNegativeStatStageModifier } from "#app/modifier/modifier";
import { handleTutorial, Tutorial } from "#app/tutorial";
import { BooleanHolder, NumberHolder } from "#app/utils";
import { getStatKey, getStatStageChangeDescriptionKey, Stat, type BattleStat } from "#enums/stat";
import i18next from "i18next";
import { PokemonPhase } from "./abstract-pokemon-phase";

export type StatStageChangeCallback = (changed: BattleStat[], relativeChanges: number[], target?: Pokemon) => void;

interface SSCPhaseOptions {
  showMessage?: boolean;
  ignoreAbilities?: boolean;
  canBeCopied?: boolean;
  onChange?: StatStageChangeCallback;
}

export class StatStageChangePhase extends PokemonPhase {
  protected readonly stats: BattleStat[];
  protected readonly selfTarget: boolean;
  protected stages: number;
  protected readonly showMessage: boolean;
  protected readonly ignoreAbilities: boolean;
  protected readonly canBeCopied: boolean;
  protected readonly onChange?: StatStageChangeCallback;
  private readonly options?: SSCPhaseOptions;

  constructor(
    battlerIndex: BattlerIndex,
    selfTarget: boolean,
    stats: BattleStat[],
    stages: number,
    options?: SSCPhaseOptions,
  ) {
    super(battlerIndex);

    this.selfTarget = selfTarget;
    this.stats = stats;
    this.stages = stages;
    this.showMessage = options?.showMessage ?? true;
    this.ignoreAbilities = options?.ignoreAbilities ?? false;
    this.canBeCopied = options?.canBeCopied ?? true;
    this.onChange = options?.onChange;
    this.options = options;
  }

  public override start(): void {
    const pokemon = this.getPokemon();

    const { add, arena, field, fieldSpritePipeline, moveAnimations, tweens, time } = globalScene;

    if (!pokemon.isActive(true)) {
      return super.end();
    }

    // Check if multiple stats are being changed at the same time, then run SSCPhase for each of them
    if (this.stats.length > 1) {
      for (let i = 0; i < this.stats.length; i++) {
        const stat = [this.stats[i]];
        globalScene.unshiftPhase(
          new StatStageChangePhase(this.battlerIndex, this.selfTarget, stat, this.stages, this.options),
        );
      }
      return super.end();
    }

    const stages = new NumberHolder(this.stages);

    if (!this.ignoreAbilities) {
      applyAbAttrs(StatStageChangeMultiplierAbAttr, pokemon, null, false, stages);
    }

    let simulate = false;

    const filteredStats: BattleStat[] = this.stats.filter((stat) => {
      const cancelled = new BooleanHolder(false);

      if (!this.selfTarget && stages.value < 0) {
        // TODO: add a reference to the source of the stat change to fix Infiltrator interaction
        arena.applyTagsForSide(MistTag, pokemon.getArenaTagSide(), false, null, cancelled);
      }

      if (!cancelled.value && !this.selfTarget && stages.value < 0) {
        applyPreStatStageChangeAbAttrs(ProtectStatAbAttr, pokemon, stat, cancelled, simulate);
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

    this.onChange && this.onChange(filteredStats, relLevels, this.getPokemon());

    const end = (): void => {
      if (this.showMessage) {
        const messages = this.getStatStageChangeMessages(filteredStats, stages.value, relLevels);
        for (const message of messages) {
          globalScene.queueMessage(message);
        }
      }

      for (const s of filteredStats) {
        if (stages.value > 0 && pokemon.getStatStage(s) < 6) {
          if (!pokemon.turnData) {
            // Temporary fix for missing turn data struct on turn 1
            pokemon.resetTurnData();
          }
          pokemon.turnData.statStagesIncreased = true;
        } else if (stages.value < 0 && pokemon.getStatStage(s) > -6) {
          if (!pokemon.turnData) {
            // Temporary fix for missing turn data struct on turn 1
            pokemon.resetTurnData();
          }
          pokemon.turnData.statStagesDecreased = true;
        }

        pokemon.setStatStage(s, pokemon.getStatStage(s) + stages.value);
      }

      if (stages.value > 0 && this.canBeCopied) {
        for (const opponent of pokemon.getOpponents()) {
          applyAbAttrs(StatStageChangeCopyAbAttr, opponent, null, false, this.stats, stages.value);
        }
      }

      applyPostStatStageChangeAbAttrs(PostStatStageChangeAbAttr, pokemon, filteredStats, this.stages, this.selfTarget);

      // Look for any other stat change phases; if this is the last one, do White Herb check
      const existingPhase = globalScene.findPhase(
        (p) => p instanceof StatStageChangePhase && p.battlerIndex === this.battlerIndex,
      );
      if (!existingPhase) {
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

      handleTutorial(Tutorial.Stat_Change).then(() => super.end());
    };

    if (relLevels.filter((l) => l).length && moveAnimations) {
      pokemon.enableMask();
      const pokemonMaskSprite = pokemon.maskSprite;

      const tileX = (this.isPlayer ? 106 : 236) * pokemon.getSpriteScale() * field.scale;
      const tileY =
        ((this.isPlayer ? 148 : 84) + (stages.value >= 1 ? 160 : 0)) * pokemon.getSpriteScale() * field.scale;
      const tileWidth = 156 * field.scale * pokemon.getSpriteScale();
      const tileHeight = 316 * field.scale * pokemon.getSpriteScale();

      // On increase, show the red sprite located at ATK
      // On decrease, show the blue sprite located at SPD
      const spriteColor = stages.value >= 1 ? Stat[Stat.ATK].toLowerCase() : Stat[Stat.SPD].toLowerCase();
      const statSprite = add.tileSprite(tileX, tileY, tileWidth, tileHeight, "battle_stats", spriteColor);
      statSprite.setPipeline(fieldSpritePipeline);
      statSprite.setAlpha(0);
      statSprite.setScale(6);
      statSprite.setOrigin(0.5, 1);

      globalScene.playSound(`se/stat_${stages.value >= 1 ? "up" : "down"}`);

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
                )}${relStageStats.length > 2 ? "," : ""} ${i18next.t("battle:statsAnd")} ${i18next.t(getStatKey(relStageStats[relStageStats.length - 1]))}`;
      } else {
        statsFragment = i18next.t(getStatKey(relStageStats[0]));
      }

      messages.push(
        i18next.t(getStatStageChangeDescriptionKey(Math.abs(parseInt(rl)), stages >= 1), {
          pokemonNameWithAffix: getPokemonNameWithAffix(this.getPokemon()),
          stats: statsFragment,
          count: relStageStats.length,
        }),
      );
    });

    return messages;
  }
}
