import { BaseOptionSelectUiHandler } from "#app/ui/handlers/base-option-select-ui-handler";
import type { OptionSelectItem, OptionSelectModeConfig } from "#app/ui/interfaces/option-select-config";
import { UiMode } from "#enums/ui-mode";

export class OptionSelectUiHandler extends BaseOptionSelectUiHandler<OptionSelectItem> {
  constructor(mode: UiMode = UiMode.OPTION_SELECT) {
    super(mode);
  }

  public override show(config?: OptionSelectModeConfig, ..._args: unknown[]): boolean {
    return super.show(config);
  }
}
