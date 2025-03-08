import { addTextObject } from "#app/ui/text";
import { TextStyle } from "#enums/text-style";
import type { DamageResult } from "./pokemon";
import type { Pokemon } from "./pokemon";
import { HitResult } from "#enums/hit-result";
import { formatStat, fixedNumber } from "#app/utils";
import type { BattlerIndex } from "#enums/battler-index";
import { globalScene } from "#app/global-scene";
import { settings } from "#app/system/settings/settings-manager";
import { DamageNumbersMode } from "#enums/damage-numbers-mode";
import { GAME_HEIGHT } from "#app/ui-constants";
import { CommonColor, ShadowColor } from "#enums/color";

type TextAndShadowArr = [string | null, string | null];

export default class DamageNumberHandler {
  private damageNumbers: Map<BattlerIndex, Phaser.GameObjects.Text[]>;

  constructor() {
    this.damageNumbers = new Map();
  }

  add(
    target: Pokemon,
    amount: number,
    result: DamageResult | HitResult.HEAL = HitResult.EFFECTIVE,
    critical: boolean = false,
  ): void {
    if (settings.display.damageNumbersMode === DamageNumbersMode.OFF) {
      return;
    }

    const battlerIndex = target.getBattlerIndex();
    const damageNumber = addTextObject(
      target.x,
      -GAME_HEIGHT + target.y - target.getSprite().height / 2,
      formatStat(amount, true),
      TextStyle.SUMMARY,
    );
    const baseScale = target.getSpriteScale() * damageNumber.scale;

    damageNumber.setName("text-damage-number");
    damageNumber.setOrigin(0.5, 1);
    damageNumber.setScale(baseScale);

    let [textColor, shadowColor]: TextAndShadowArr = [null, null];

    switch (result) {
      case HitResult.SUPER_EFFECTIVE:
        [textColor, shadowColor] = [CommonColor.GOLD_YELLOW, ShadowColor.MUTED_GOLD];
        break;
      case HitResult.NOT_VERY_EFFECTIVE:
        [textColor, shadowColor] = [CommonColor.BRIGHT_ORANGE, ShadowColor.DARK_RED];
        break;
      case HitResult.ONE_HIT_KO:
        [textColor, shadowColor] = [CommonColor.VIBRANT_PURPLE, ShadowColor.DARK_PURPLE];
        break;
      case HitResult.HEAL:
        [textColor, shadowColor] = [CommonColor.LIGHT_GREEN, ShadowColor.MUTED_GREEN];
        break;
      default:
        [textColor, shadowColor] = [CommonColor.WHITE, ShadowColor.GREY];
        break;
    }

    if (textColor) {
      damageNumber.setColor(textColor);
    }
    if (shadowColor) {
      // Only moves that deal damage should display critical animation
      if (critical && result !== HitResult.HEAL && amount > 0) {
        damageNumber.setShadowOffset(0, 0);
        damageNumber.setStroke(shadowColor, 12);
      } else {
        damageNumber.setShadowColor(shadowColor);
      }
    }

    globalScene.fieldUI.add(damageNumber);

    if (!this.damageNumbers.has(battlerIndex)) {
      this.damageNumbers.set(battlerIndex, []);
    }

    const yOffset = this.damageNumbers.get(battlerIndex)!.length * -10;
    if (yOffset) {
      damageNumber.y += yOffset;
    }

    this.damageNumbers.get(battlerIndex)!.push(damageNumber);

    if (settings.display.damageNumbersMode === DamageNumbersMode.SIMPLE) {
      globalScene.tweens.add({
        targets: damageNumber,
        duration: fixedNumber(750),
        alpha: 1,
        y: "-=32",
      });
      globalScene.tweens.add({
        delay: 375,
        targets: damageNumber,
        duration: fixedNumber(625),
        alpha: 0,
        ease: "Sine.easeIn",
        onComplete: () => {
          this.damageNumbers.get(battlerIndex)!.splice(this.damageNumbers.get(battlerIndex)!.indexOf(damageNumber), 1);
          damageNumber.destroy(true);
        },
      });
      return;
    }

    damageNumber.setAlpha(0);

    globalScene.tweens.chain({
      targets: damageNumber,
      tweens: [
        {
          duration: fixedNumber(250),
          alpha: 1,
          scaleX: 0.75 * baseScale,
          scaleY: 1.25 * baseScale,
          y: "-=16",
          ease: "Cubic.easeOut",
        },
        {
          duration: fixedNumber(175),
          alpha: 1,
          scaleX: 0.875 * baseScale,
          scaleY: 1.125 * baseScale,
          y: "+=16",
          ease: "Cubic.easeIn",
        },
        {
          duration: fixedNumber(100),
          scaleX: 1.25 * baseScale,
          scaleY: 0.75 * baseScale,
          ease: "Cubic.easeOut",
        },
        {
          duration: fixedNumber(175),
          scaleX: 0.875 * baseScale,
          scaleY: 1.125 * baseScale,
          y: "-=8",
          ease: "Cubic.easeOut",
        },
        {
          duration: fixedNumber(50),
          scaleX: 0.925 * baseScale,
          scaleY: 1.075 * baseScale,
          y: "+=8",
          ease: "Cubic.easeIn",
        },
        {
          duration: fixedNumber(100),
          scaleX: 1.125 * baseScale,
          scaleY: 0.875 * baseScale,
          ease: "Cubic.easeOut",
        },
        {
          duration: fixedNumber(175),
          scaleX: 0.925 * baseScale,
          scaleY: 1.075 * baseScale,
          y: "-=4",
          ease: "Cubic.easeOut",
        },
        {
          duration: fixedNumber(50),
          scaleX: 0.975 * baseScale,
          scaleY: 1.025 * baseScale,
          y: "+=4",
          ease: "Cubic.easeIn",
        },
        {
          duration: fixedNumber(100),
          scaleX: 1.075 * baseScale,
          scaleY: 0.925 * baseScale,
          ease: "Cubic.easeOut",
        },
        {
          duration: fixedNumber(25),
          scaleX: baseScale,
          scaleY: baseScale,
          ease: "Cubic.easeOut",
        },
        {
          delay: fixedNumber(500),
          alpha: 0,
          onComplete: () => {
            this.damageNumbers
              .get(battlerIndex)!
              .splice(this.damageNumbers.get(battlerIndex)!.indexOf(damageNumber), 1);
            damageNumber.destroy(true);
          },
        },
      ],
    });
  }
}
