import { globalScene } from "#app/global-scene";
import { GAME_WIDTH, TEXT_SCALE } from "#constants/ui-constants";
import { TextStyle } from "#enums/text-style";
import { addTextObject } from "#ui/text-utils";
import { playTween } from "#utils/anim-utils";
import i18next from "i18next";

const ABILITY_BAR_WIDTH = 118;

const PLAYER_SHOWN_X = 0;
const PLAYER_HIDDEN_X = PLAYER_SHOWN_X - ABILITY_BAR_WIDTH;
const PLAYER_BASE_Y = -116;

const ENEMY_SHOWN_X = GAME_WIDTH - ABILITY_BAR_WIDTH;
const ENEMY_HIDDEN_X = ENEMY_SHOWN_X + ABILITY_BAR_WIDTH;
const ENEMY_BASE_Y = -130;

export class AbilityBar extends Phaser.GameObjects.Container {
  private bg: Phaser.GameObjects.Image;
  private abilityBarText: Phaser.GameObjects.Text;
  /** The x-value of the flyout when displayed */
  private readonly shownX: number;
  /** The x-value of the flyout when hidden */
  private readonly hiddenX: number;
  /** The y-value of the flyout */
  private readonly baseY: number;

  public shown: boolean;

  constructor(player: boolean = true) {
    const shownX = player ? PLAYER_SHOWN_X : ENEMY_SHOWN_X;
    const hiddenX = player ? PLAYER_HIDDEN_X : ENEMY_HIDDEN_X;
    const baseY = player ? PLAYER_BASE_Y : ENEMY_BASE_Y;

    super(globalScene, hiddenX, baseY);

    this.shownX = shownX;
    this.hiddenX = hiddenX;
    this.baseY = baseY;
  }

  setup(): void {
    this.bg = globalScene.add.image(0, 0, "ability_bar_left");
    this.bg.setOrigin(0, 0);

    this.add(this.bg);

    this.abilityBarText = addTextObject(15, 3, "", TextStyle.NOTIFICATION_BAR_LIGHT);
    this.abilityBarText.setOrigin(0, 0);
    this.abilityBarText.setWordWrapWidth(100 * TEXT_SCALE, true);
    this.add(this.abilityBarText);

    this.setVisible(false);
    this.shown = false;
  }

  /**
   * Displays the Ability Bar flyout with the given text.
   * @param pokemonName - The name of the {@linkcode Pokemon} whose ability activated the flyout
   * @param abilityName - The name of the {@linkcode Ability} that activated the flyout
   * @param passive - (Default `false`) `true` if the Ability that activated is the source Pokemon's Passive
   */
  public async show(pokemonName: string, abilityName: string, passive: boolean = false): Promise<void> {
    this.abilityBarText.setText(
      i18next.t("fightUiHandler:abilityFlyInText", {
        pokemonName,
        passive: passive ? i18next.t("fightUiHandler:passive") : "",
        abilityName,
      }),
    );

    if (this.shown) {
      return;
    }

    globalScene.fieldUI.bringToTop(this);

    this.y = this.baseY + (globalScene.currentBattle.double ? 14 : 0);
    this.setVisible(true);
    this.shown = true;

    await playTween({
      targets: this,
      x: this.shownX,
      duration: 500,
      ease: "Sine.easeOut",
    });
  }

  /** Hides the Ability Bar flyout */
  public async hide(): Promise<void> {
    if (!this.shown) {
      return;
    }

    await playTween({
      targets: this,
      x: this.hiddenX,
      duration: 500,
      ease: "Sine.easeIn",
    });

    this.setVisible(false);
    this.shown = false;
  }
}
