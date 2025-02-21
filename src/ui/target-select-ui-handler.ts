import { BattlerIndex } from "#enums/battler-index";
import { UiMode } from "#enums/ui-mode";
import UiHandler from "./ui-handler";
import { isNullOrUndefined, fixedNumber } from "#app/utils";
import { getMoveTargets } from "../data/move";
import { isFieldTargeted } from "#app/utils/move-utils";
import { Button } from "#enums/buttons";
import type { MoveId } from "#enums/move-id";
import type { Pokemon } from "#app/field/pokemon";
import type { ModifierBar } from "#app/modifier/modifier";
import { globalScene } from "#app/global-scene";
import { BattlerTagType } from "#enums/battler-tag-type";

export type TargetSelectCallback = (targets: BattlerIndex[]) => void;

export default class TargetSelectUiHandler extends UiHandler {
  private fieldIndex: number;
  private moveId: MoveId;
  private targetSelectCallback: TargetSelectCallback;
  private cursor0: number; // associated with BattlerIndex.PLAYER
  private cursor1: number; // associated with BattlerIndex.PLAYER_2

  private isMultipleTargets: boolean = false;
  private isFieldTarget: boolean = false;
  private targets: BattlerIndex[];
  private targetsHighlighted: Pokemon[];
  private targetFlashTween: Phaser.Tweens.Tween | null;
  private enemyModifiers: ModifierBar;
  private targetBattleInfoMoveTween: Phaser.Tweens.Tween[] = [];

  constructor() {
    super(UiMode.TARGET_SELECT);

    this.cursor = -1;
  }

  setup(): void {}

  override show(args: any[]): boolean {
    if (args.length < 3) {
      return false;
    }

    super.show(args);

    this.fieldIndex = args[0] as number;
    this.moveId = args[1] as MoveId;
    this.targetSelectCallback = args[2] as TargetSelectCallback;
    const user = globalScene.getPlayerField()[this.fieldIndex];

    const moveTargets = getMoveTargets(user, this.moveId);
    this.targets = moveTargets.targets;
    this.isMultipleTargets = moveTargets.multiple ?? false;
    this.isFieldTarget = isFieldTargeted(this.targets);

    if (!this.targets.length) {
      return false;
    }

    this.enemyModifiers = globalScene.getModifierBar(true);

    if (this.fieldIndex === BattlerIndex.PLAYER) {
      this.resetCursor(this.cursor0, user);
    } else if (this.fieldIndex === BattlerIndex.PLAYER_2) {
      this.resetCursor(this.cursor1, user);
    }
    return true;
  }

  /**
   * Determines what value to assign the main cursor based on the previous turn's target or the user's status
   * @param cursorN the cursor associated with the user's field index
   * @param user the Pokemon using the move
   */
  resetCursor(cursorN: number, user: Pokemon): void {
    if (!isNullOrUndefined(cursorN)) {
      if ([BattlerIndex.PLAYER, BattlerIndex.PLAYER_2].includes(cursorN) || user.battleSummonData.waveTurnCount === 1) {
        // Reset cursor on the first turn of a fight or if an ally was targeted last turn
        cursorN = -1;
      }
    }
    this.setCursor(this.targets.includes(cursorN) ? cursorN : this.targets[0]);
  }

  processInput(button: Button): boolean {
    const ui = this.getUi();

    let success = false;

    if (button === Button.ACTION || button === Button.CANCEL) {
      const targetIndexes: BattlerIndex[] = this.isMultipleTargets || this.isFieldTarget ? this.targets : [this.cursor];
      this.targetSelectCallback(button === Button.ACTION ? targetIndexes : []);
      success = true;
      if (this.fieldIndex === BattlerIndex.PLAYER) {
        if (isNullOrUndefined(this.cursor0) || this.cursor0 !== this.cursor) {
          this.cursor0 = this.cursor;
        }
      } else if (this.fieldIndex === BattlerIndex.PLAYER_2) {
        if (isNullOrUndefined(this.cursor1) || this.cursor1 !== this.cursor) {
          this.cursor1 = this.cursor;
        }
      }
    } else if (this.isMultipleTargets || this.isFieldTarget) {
      success = false;
    } else {
      switch (button) {
        case Button.UP:
          if (this.cursor < BattlerIndex.ENEMY && this.targets.findIndex((t) => t >= BattlerIndex.ENEMY) > -1) {
            success = this.setCursor(this.targets.find((t) => t >= BattlerIndex.ENEMY)!); // TODO: is the bang correct here?
          }
          break;
        case Button.DOWN:
          if (this.cursor >= BattlerIndex.ENEMY && this.targets.findIndex((t) => t < BattlerIndex.ENEMY) > -1) {
            success = this.setCursor(this.targets.find((t) => t < BattlerIndex.ENEMY)!); // TODO: is the bang correct here?
          }
          break;
        case Button.LEFT:
          if (this.cursor % 2 && this.targets.findIndex((t) => t === this.cursor - 1) > -1) {
            success = this.setCursor(this.cursor - 1);
          }
          break;
        case Button.RIGHT:
          if (!(this.cursor % 2) && this.targets.findIndex((t) => t === this.cursor + 1) > -1) {
            success = this.setCursor(this.cursor + 1);
          }
          break;
      }
    }

    if (success) {
      ui.playSelect();
    }

    return success;
  }

  /** @returns all valid target {@linkcode Pokemon} for the current target selection */
  protected getTargetsByIndex(): Pokemon[] {
    return this.targets
      .map((index) => globalScene.getFieldPokemonByBattlerIndex(index))
      .filter((p) => !isNullOrUndefined(p));
  }

  /** @returns the {@linkcode Pokemon} to highlight based on the move's targeting */
  protected getHighlightedPokemon(cursor: number): Pokemon[] {
    if (this.targets.includes(BattlerIndex.BOTH_SIDES)) {
      return globalScene.getField(true);
    } else if (this.targets.includes(BattlerIndex.ENEMY_SIDE)) {
      return globalScene.getEnemyField().filter((p) => p.isActive(true));
    } else if (this.targets.includes(BattlerIndex.PLAYER_SIDE)) {
      return globalScene.getPlayerField().filter((p) => p.isActive(true));
    } else if (this.isMultipleTargets) {
      return this.getTargetsByIndex();
    } else {
      return [globalScene.getFieldPokemonByBattlerIndex(cursor)!];
    }
  }

  override setCursor(cursor: number): boolean {
    const allTargets = this.getTargetsByIndex();
    this.targetsHighlighted = this.getHighlightedPokemon(cursor);

    const ret = super.setCursor(cursor);

    if (this.targetFlashTween) {
      this.targetFlashTween.stop();
      for (const pokemon of allTargets) {
        pokemon.setAlpha(!!pokemon.getTag(BattlerTagType.SUBSTITUTE) ? 0.5 : 1);
        this.highlightItems(pokemon.id, 1);
      }
    }

    this.targetFlashTween = globalScene.tweens.add({
      targets: this.targetsHighlighted,
      key: { start: 1, to: 0.25 },
      loop: -1,
      loopDelay: 150,
      duration: fixedNumber(450),
      ease: "Sine.easeInOut",
      yoyo: true,
      onUpdate: (t) => {
        for (const target of this.targetsHighlighted) {
          target.setAlpha(t.getValue());
          this.highlightItems(target.id, t.getValue());
        }
      },
    });

    if (this.targetBattleInfoMoveTween.length >= 1) {
      this.targetBattleInfoMoveTween.filter((t) => t !== undefined).forEach((tween) => tween.stop());
      for (const pokemon of allTargets) {
        pokemon.getBattleInfo().resetY();
      }
    }

    const targetsBattleInfo = this.targetsHighlighted.map((target) => target.getBattleInfo());

    targetsBattleInfo.map((info) => {
      this.targetBattleInfoMoveTween.push(
        globalScene.tweens.add({
          targets: [info],
          y: { start: info.getBaseY(), to: info.getBaseY() + 1 },
          loop: -1,
          duration: fixedNumber(250),
          ease: "Linear",
          yoyo: true,
        }),
      );
    });
    return ret;
  }

  eraseCursor() {
    if (this.targetFlashTween) {
      this.targetFlashTween.stop();
      this.targetFlashTween = null;
    }

    for (const pokemon of this.targetsHighlighted) {
      pokemon.setAlpha(!!pokemon.getTag(BattlerTagType.SUBSTITUTE) ? 0.5 : 1);
      this.highlightItems(pokemon.id, 1);
    }

    if (this.targetBattleInfoMoveTween.length >= 1) {
      this.targetBattleInfoMoveTween.filter((t) => t !== undefined).forEach((tween) => tween.stop());
      this.targetBattleInfoMoveTween = [];
    }
    for (const pokemon of this.targetsHighlighted) {
      pokemon.getBattleInfo().resetY();
    }
  }

  private highlightItems(targetId: number, val: number): void {
    const targetItems = this.enemyModifiers.getAll("name", targetId.toString());
    for (const item of targetItems as Phaser.GameObjects.Container[]) {
      item.setAlpha(val);
    }
  }

  override clear() {
    super.clear();
    this.eraseCursor();
  }
}
