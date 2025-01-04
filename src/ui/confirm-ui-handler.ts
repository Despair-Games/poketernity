import type { OptionSelectConfig } from "#app/ui/interfaces/option-select-config";
import OptionSelectUiHandler from "#app/ui/option-select-ui-handler";
import { Mode } from "#app/ui/ui";
import i18next from "i18next";

export default class ConfirmUiHandler extends OptionSelectUiHandler {
  public static readonly windowWidth: number = 48;

  constructor() {
    super(Mode.CONFIRM);
  }

  override getWindowWidth(): number {
    // TODO remove once size is measured properly in parent
    return 48;
  }

  override show(args: any[]): boolean {
    if (
      args.length === 4
      && args[0] instanceof Function
      && args[1] instanceof Function
      && args[2] instanceof Function
      && args[3] === "fullParty"
    ) {
      const config: OptionSelectConfig = {
        options: [
          {
            label: i18next.t("partyUiHandler:SUMMARY"),
            handler: () => {
              args[0]();
              return true;
            },
          },
          {
            label: i18next.t("menu:yes"),
            handler: () => {
              args[1]();
              return true;
            },
          },
          {
            label: i18next.t("menu:no"),
            handler: () => {
              args[2]();
              return true;
            },
          },
        ],
        xOffset: args.length >= 6 && args[5] !== null ? (args[5] as number) : 0,
        yOffset: args.length >= 7 && args[6] !== null ? (args[6] as number) : 0,
        inputDelay: args.length >= 8 && args[7] !== null ? (args[7] as number) : 0,
      };

      return super.show([config]);
    } else if (args.length >= 2 && args[0] instanceof Function && args[1] instanceof Function) {
      const config: OptionSelectConfig = {
        options: [
          {
            label: i18next.t("menu:yes"),
            handler: () => {
              args[0]();
              return true;
            },
          },
          {
            label: i18next.t("menu:no"),
            handler: () => {
              args[1]();
              return true;
            },
          },
        ],
        inputDelay: args.length >= 6 && args[5] !== null ? (args[5] as number) : 0,
        noCancel: args.length >= 7 && args[6] !== null ? (args[6] as boolean) : false,
        canCancelDelay: args.length >= 3 && args[2] !== null ? (args[2] as boolean) : false,
        xOffset: args.length >= 4 && args[3] !== null ? (args[3] as number) : 0,
        yOffset: args.length >= 5 && args[4] !== null ? (args[4] as number) : 0,
      };

      return super.show([config]);
    }

    return false;
  }
}
