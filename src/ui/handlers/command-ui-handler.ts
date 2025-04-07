import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { CommandPhase } from "#app/phases/command-phase";
import { TEXT_SCALE } from "#app/ui-constants";
import { addTextObject } from "#app/ui/text/text-utils";
import { PartyFilterNonFainted } from "#app/utils/party-ui-utils";
import { BattleCommand } from "#enums/battle-command";
import { Button } from "#enums/buttons";
import { PartyUiMode } from "#enums/party-ui-mode";
import { TextStyle } from "#enums/text-style";
import { UiMode } from "#enums/ui-mode";
import i18next from "i18next";
import { UiHandler } from "./abstract-ui-handler";
import type { BallUiHandler } from "./ball-ui-handler";
import type { FightUiHandler } from "./fight-ui-handler";
import type { PartyUiHandler } from "./party-ui-handler";

export class CommandUiHandler extends UiHandler {
  private commandsContainer: Phaser.GameObjects.Container;
  private cursorObj: Phaser.GameObjects.Image | null;

  protected fieldIndex: number = 0;
  protected cursor2: number = 0;

  constructor() {
    super(UiMode.COMMAND);
  }

  setup() {
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

    for (let c = 0; c < commands.length; c++) {
      const commandText = addTextObject(c % 2 === 0 ? 0 : 55.8, c < 2 ? 0 : 16, commands[c], TextStyle.WINDOW);
      commandText.setName(commands[c]);
      this.commandsContainer.add(commandText);
    }
  }

  override show(fieldIndex: number = 0): boolean {
    super.show();

    this.fieldIndex = fieldIndex;

    this.commandsContainer.setVisible(true);

    let commandPhase: CommandPhase;
    const currentPhase = globalScene.phaseManager.getCurrentPhase();
    if (currentPhase instanceof CommandPhase) {
      commandPhase = currentPhase;
    } else {
      commandPhase = globalScene.phaseManager.getStandbyPhase() as CommandPhase;
    }

    const messageHandler = this.getUi().getMessageHandler();
    messageHandler.bg.setVisible(true);
    messageHandler.commandWindow.setVisible(true);
    messageHandler.movesWindowContainer.setVisible(false);
    messageHandler.message.setWordWrapWidth(185 * TEXT_SCALE);
    messageHandler.showText(
      i18next.t("commandUiHandler:actionMessage", { pokemonName: getPokemonNameWithAffix(commandPhase.getPokemon()) }),
      0,
    );
    if (this.getCursor() === BattleCommand.POKEMON) {
      this.setCursor(BattleCommand.FIGHT);
    } else {
      this.setCursor(this.getCursor());
    }

    return true;
  }

  processInput(button: Button): boolean {
    const ui = this.getUi();

    let success = false;

    const cursor = this.getCursor();

    if (button === Button.CANCEL || button === Button.ACTION) {
      if (button === Button.ACTION) {
        switch (cursor) {
          // Fight
          case BattleCommand.FIGHT:
            ui.setMode<FightUiHandler>(
              UiMode.FIGHT,
              (globalScene.phaseManager.getCurrentPhase() as CommandPhase).getFieldIndex(),
            );
            success = true;
            break;
          // Ball
          case BattleCommand.BALL:
            ui.setModeWithoutClear<BallUiHandler>(UiMode.BALL);
            success = true;
            break;
          // Pokemon
          case BattleCommand.POKEMON:
            ui.setMode<PartyUiHandler>(
              UiMode.PARTY,
              PartyUiMode.SWITCH,
              (globalScene.phaseManager.getCurrentPhase() as CommandPhase).getPokemon().getFieldIndex(),
              null,
              PartyFilterNonFainted,
            );
            success = true;
            break;
          // Run
          case BattleCommand.RUN:
            (globalScene.phaseManager.getCurrentPhase() as CommandPhase).handleCommand(BattleCommand.RUN, 0);
            success = true;
            break;
        }
      } else {
        (globalScene.phaseManager.getCurrentPhase() as CommandPhase).cancel();
      }
    } else {
      switch (button) {
        case Button.UP:
          if (cursor >= 2) {
            success = this.setCursor(cursor - 2);
          }
          break;
        case Button.DOWN:
          if (cursor < 2) {
            success = this.setCursor(cursor + 2);
          }
          break;
        case Button.LEFT:
          if (cursor % 2 === 1) {
            success = this.setCursor(cursor - 1);
          }
          break;
        case Button.RIGHT:
          if (cursor % 2 === 0) {
            success = this.setCursor(cursor + 1);
          }
          break;
      }
    }

    if (success) {
      ui.playSelect();
    }

    return success;
  }

  override getCursor(): number {
    return !this.fieldIndex ? this.cursor : this.cursor2;
  }

  override setCursor(cursor: number): boolean {
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

    this.cursorObj.setPosition(-5 + (cursor % 2 === 1 ? 56 : 0), 8 + (cursor >= 2 ? 16 : 0));

    return changed;
  }

  override clear(): void {
    super.clear();
    this.getUi().getMessageHandler().commandWindow.setVisible(false);
    this.commandsContainer.setVisible(false);
    this.getUi().getMessageHandler().clearText();
    this.eraseCursor();
  }

  eraseCursor(): void {
    if (this.cursorObj) {
      this.cursorObj.destroy();
    }
    this.cursorObj = null;
  }
}
