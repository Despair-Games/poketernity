import type { ConfirmModeConfig } from "#app/ui/interfaces/confirm-menu-config";
import type { OptionSelectModeConfig } from "#app/ui/interfaces/option-select-config";
import OptionSelectUiHandler from "#app/ui/option-select-ui-handler";
import { Mode } from "#app/ui/ui";
import i18next from "i18next";

export default class ConfirmUiHandler extends OptionSelectUiHandler {
  // TODO remove and replace uses with getWindowWidth
  public static readonly windowWidth: number = 48;

  constructor() {
    super(Mode.CONFIRM);
  }

  override show(args: any[]): boolean {
    if (!args[0] || !args[0].hasOwnProperty("yesHandler") || !args[0].hasOwnProperty("noHandler")) {
      return false;
    }

    const config = args[0] as ConfirmModeConfig;
    const fullConfig: OptionSelectModeConfig = {
      ...config,
      options: [
        {
          label: i18next.t("menu:yes"),
          handler: () => {
            config.yesHandler();
            return true;
          },
        },
        {
          label: i18next.t("menu:no"),
          handler: () => {
            config.noHandler();
            return true;
          },
        },
      ],
    };

    return super.show([fullConfig]);
  }
}
