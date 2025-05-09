import { UiMode } from "#enums/ui-mode";
import { BaseOptionSelectUiHandler } from "#ui/base-option-select-ui-handler";
import type { OptionSelectItem, OptionSelectModeConfig } from "#ui/option-select-config";

export class OptionSelectUiHandler extends BaseOptionSelectUiHandler<OptionSelectItem> {
  constructor(mode: UiMode = UiMode.OPTION_SELECT) {
    super(mode);
  }

  public override show(config?: OptionSelectModeConfig, ..._args: unknown[]): boolean {
    return super.show(config);
  }
}
