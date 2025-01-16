import type { ConfirmModeConfig } from "#app/ui/interfaces/confirm-menu-config";
import type { OptionSelectModeConfig, OptionSelectItem } from "#app/ui/interfaces/option-select-config";
import OptionSelectUiHandler from "#app/ui/option-select-ui-handler";
import { Mode } from "#app/ui/ui";
import i18next from "i18next";

export default class ConfirmUiHandler extends OptionSelectUiHandler {
  constructor() {
    super(Mode.CONFIRM);
  }

  override show(args: any[]): boolean {
    if (!args[0] || !args[0].hasOwnProperty("yesHandler") || !args[0].hasOwnProperty("noHandler")) {
      return false;
    }

    const config = args[0] as ConfirmModeConfig;
    const fullConfig: OptionSelectModeConfig<OptionSelectItem> = {
      ...config,
      yOffset: config.yOffset ?? 48,
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
