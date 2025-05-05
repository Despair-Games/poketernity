import { getTypeRgb } from "#app/data/type";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { TerastallizeAccessModifier } from "#app/modifier/modifier";
import { CommandPhase } from "#app/phases/command-phase";
import { TEXT_SCALE } from "#app/constants/ui-constants";
import { UiHandler } from "#app/ui/handlers/abstract-ui-handler";
import type { BallUiHandler } from "#app/ui/handlers/ball-ui-handler";
import type { FightUiHandler } from "#app/ui/handlers/fight-ui-handler";
import type { PartyUiHandler } from "#app/ui/handlers/party-ui-handler";
import { addTextObject } from "#app/ui/text/text-utils";
import { PartyFilterNonFainted } from "#app/utils/party-ui-utils";
import { BattleCommand } from "#enums/battle-command";
import { Button } from "#enums/buttons";
import { ElementalType } from "#enums/elemental-type";
import { PartyUiMode } from "#enums/party-ui-mode";
import { SpeciesId } from "#enums/species-id";
import { TextStyle } from "#enums/text-style";
import { UiMode } from "#enums/ui-mode";
import i18next from "i18next";

export class CommandUiHandler extends UiHandler {
  private commandsContainer: Phaser.GameObjects.Container;
  private cursorObj: Phaser.GameObjects.Image | null;
  private teraButton: Phaser.GameObjects.Sprite;

  protected fieldIndex: number = 0;
  protected cursor2: number = 0;

  constructor() {
    super(UiMode.COMMAND);
  }

  protected override setup() {
    const ui = this.getUi();
    const commands = [
      i18next.t("commandUiHandler:fight"),
      i18next.t("commandUiHandler:ball"),
      i18next.t("commandUiHandler:pokemon"),
      i18next.t("commandUiHandler:run"),
    ];

    this.commandsContainer = globalScene.add.container(217, -38.7);
    this.commandsContainer.setName("commands");
    this.commandsContainer.setVisible(false);
    ui.add(this.commandsContainer);

    this.teraButton = globalScene.add.sprite(-32, 15, "button_tera");
    this.teraButton.setName("terastallize-button");
    this.teraButton.setScale(1.3);
    this.teraButton.setFrame("fire");
    this.teraButton.setPipeline(globalScene.spritePipeline, {
      tone: [0.0, 0.0, 0.0, 0.0],
      ignoreTimeTint: true,
      teraColor: getTypeRgb(ElementalType.FIRE),
      isTerastallized: false,
    });
    this.commandsContainer.add(this.teraButton);

    for (let c = 0; c < commands.length; c++) {
      const commandText = addTextObject(c % 2 === 0 ? 0 : 55.8, c < 2 ? 0 : 16, commands[c], TextStyle.WINDOW);
      commandText.setName(commands[c]);
      this.commandsContainer.add(commandText);
    }
  }

  protected override tearDown(): void {
    this.commandsContainer.destroy();
  }

  public override show(fieldIndex: number = 0): boolean {
    this.fieldIndex = fieldIndex;

    this.commandsContainer.setVisible(true);

    const commandPhase = this.getCommandPhase();

    if (this.canTera()) {
      this.teraButton.setVisible(true);
      this.teraButton.setFrame(ElementalType[globalScene.getField()[this.fieldIndex].teraType].toLowerCase());
    } else {
      this.teraButton.setVisible(false);
      if (this.getCursor() === BattleCommand.TERA) {
        this.setCursor(BattleCommand.FIGHT);
      }
    }
    this.toggleTeraButton();

    const messageHandler = this.getUi().getMessageHandler();
    messageHandler.bg.setVisible(true);
    messageHandler.commandWindow.setVisible(true);
    messageHandler.movesWindowContainer.setVisible(false);
    messageHandler.message.setWordWrapWidth((this.canTera() ? 152 : 185) * TEXT_SCALE);
    messageHandler.showText(
      i18next.t("commandUiHandler:actionMessage", { pokemonName: getPokemonNameWithAffix(commandPhase.getPokemon()) }),
      0,
    );

    // If this is the first turn of battle, default to the fight command. TODO: add setting to disable this behavior
    const isFirstAction = !this.active && globalScene.currentBattle.turn === 1;
    if (isFirstAction || this.getCursor() === BattleCommand.POKEMON) {
      this.setCursor(BattleCommand.FIGHT);
    } else {
      this.setCursor(this.getCursor());
    }

    return true;
  }

  public override processInput(button: Button): boolean {
    const ui = this.getUi();

    let success = false;

    const cursor = this.getCursor();

    if (button === Button.CANCEL || button === Button.ACTION) {
      if (button === Button.ACTION) {
        switch (cursor) {
          case BattleCommand.FIGHT:
            ui.setMode<FightUiHandler>(
              UiMode.FIGHT,
              globalScene.phaseManager.getCurrentPhase<CommandPhase>()?.getFieldIndex(),
            );
            success = true;
            break;
          case BattleCommand.BALL:
            ui.setModeWithoutClear<BallUiHandler>(UiMode.BALL);
            success = true;
            break;
          case BattleCommand.POKEMON:
            ui.setMode<PartyUiHandler>(
              UiMode.PARTY,
              PartyUiMode.SWITCH,
              globalScene.phaseManager.getCurrentPhase<CommandPhase>()?.getPokemon().getFieldIndex(),
              null,
              PartyFilterNonFainted,
            );
            success = true;
            break;
          case BattleCommand.RUN:
            globalScene.phaseManager.getCurrentPhase<CommandPhase>()?.handleCommand(BattleCommand.RUN, 0);
            success = true;
            break;
          case BattleCommand.TERA:
            ui.setMode<FightUiHandler>(
              UiMode.FIGHT,
              globalScene.phaseManager.getCurrentPhase<CommandPhase>()?.getFieldIndex(),
              BattleCommand.TERA,
            );
            success = true;
            break;
        }
      } else {
        (globalScene.phaseManager.getCurrentPhase() as CommandPhase).cancel();
      }
    } else {
      switch (button) {
        case Button.UP:
          if ([BattleCommand.POKEMON, BattleCommand.RUN].includes(cursor)) {
            success = this.setCursor(cursor - 2);
          }
          break;
        case Button.DOWN:
          if ([BattleCommand.FIGHT, BattleCommand.BALL].includes(cursor)) {
            success = this.setCursor(cursor + 2);
          }
          break;
        case Button.LEFT:
          if ([BattleCommand.BALL, BattleCommand.RUN].includes(cursor)) {
            success = this.setCursor(cursor - 1);
          } else if ([BattleCommand.FIGHT, BattleCommand.POKEMON].includes(cursor) && this.canTera()) {
            success = this.setCursor(BattleCommand.TERA);
            this.toggleTeraButton();
          }
          break;
        case Button.RIGHT:
          if ([BattleCommand.FIGHT, BattleCommand.POKEMON].includes(cursor)) {
            success = this.setCursor(cursor + 1);
          } else if ([BattleCommand.TERA].includes(cursor)) {
            success = this.setCursor(BattleCommand.FIGHT);
            this.toggleTeraButton();
          }
          break;
      }
    }

    if (success) {
      ui.playSelect();
    }

    return success;
  }

  /**
   * Determines if the player is allowed to Terastallize their Pokemon.
   *
   * Requirements:
   * - The player has a Tera Orb
   * - The player's Pokemon is not Mega, GMax, or Ultra Necrozma
   * - The player has not yet Terastallized any Pokemon since the last Tera Orb refresh
   * @returns `true` if the player is allowed to Terastallize
   */
  public canTera(): boolean {
    const hasTeraOrb = globalScene.getModifiers(TerastallizeAccessModifier).length > 0;

    const activePokemon = globalScene.getField()[this.fieldIndex];

    const isUltraNecrozma =
      activePokemon.species.speciesId === SpeciesId.NECROZMA && activePokemon.getFormKey() === "ultra";
    const isBlockedForm = activePokemon.isMega() || activePokemon.isMax() || isUltraNecrozma;

    const { playerTerasUsed } = globalScene;

    const ally = activePokemon.getAlly();
    const teraCommand = ally ? globalScene.currentBattle.turnManager.findCommandFromPokemon(ally) : undefined;
    const plannedTera = teraCommand?.command === BattleCommand.TERA && this.fieldIndex > 0 ? 1 : 0;

    return hasTeraOrb && !isBlockedForm && playerTerasUsed + plannedTera < 1;
  }

  private toggleTeraButton(): void {
    // todo: we don't need to set the whole pipeline again. `setPipelineData` should be enough
    this.teraButton.setPipeline(globalScene.spritePipeline, {
      tone: [0.0, 0.0, 0.0, 0.0],
      ignoreTimeTint: true,
      teraColor: getTypeRgb(globalScene.getField()[this.fieldIndex].teraType),
      isTerastallized: this.getCursor() === BattleCommand.TERA,
    });
  }

  public override getCursor(): number {
    return !this.fieldIndex ? this.cursor : this.cursor2;
  }

  public override setCursor(cursor: number): boolean {
    const changed = this.getCursor() !== cursor;
    if (changed) {
      if (!this.fieldIndex) {
        this.cursor = cursor;
      } else {
        this.cursor2 = cursor;
      }
    }

    if (!this.cursorObj) {
      this.cursorObj = globalScene.add.image(0, 0, "cursor");
      this.commandsContainer.add(this.cursorObj);
    }

    if (cursor === BattleCommand.TERA) {
      this.cursorObj.setVisible(false);
    } else {
      this.cursorObj.setPosition(-5 + (cursor % 2 === 1 ? 56 : 0), 8 + (cursor >= 2 ? 16 : 0));
      this.cursorObj.setVisible(true);
    }

    return changed;
  }

  protected override clear(): void {
    this.commandsContainer.setVisible(false);
    const messageHandler = this.getUi().getMessageHandler();
    if (messageHandler.ready) {
      messageHandler.commandWindow.setVisible(false);
      messageHandler.clearText();
    }
    this.eraseCursor();
  }

  private eraseCursor(): void {
    if (this.cursorObj) {
      this.cursorObj.destroy();
    }
    this.cursorObj = null;
  }

  private getCommandPhase(): CommandPhase {
    let commandPhase: CommandPhase;
    const currentPhase = globalScene.phaseManager.getCurrentPhase();
    if (currentPhase instanceof CommandPhase) {
      commandPhase = currentPhase;
    } else {
      commandPhase = globalScene.phaseManager.getStandbyPhase() as CommandPhase;
    }
    return commandPhase;
  }
}
