import type { ConfirmModeConfig } from "#app/ui/interfaces/confirm-menu-config";
import type { OptionSelectModeConfig } from "#app/ui/interfaces/option-select-config";
import OptionSelectUiHandler from "#app/ui/option-select-ui-handler";
import { UiMode } from "#enums/ui-mode";
import i18next from "i18next";

/**
 * Handler that displays a simple Yes/No menu.
 * @extends OptionSelectUiHandler
 */
export default class ConfirmUiHandler extends OptionSelectUiHandler {
  constructor() {
    super(UiMode.CONFIRM);
  }

  override show(args: any[]): boolean {
    if (!args[0] || !args[0].yesHandler || !args[0].noHandler) {
      console.error("Missing `ConfirmModeConfig` argument for Mode.CONFIRM");
      return false;
    }

    const config = args[0] as ConfirmModeConfig;
    const fullConfig: OptionSelectModeConfig = {
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
