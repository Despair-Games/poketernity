import { AbstractOptionSelectUiHandler } from "#app/ui/handlers/abstract-option-select-ui-handler";
import type { OptionSelectItem, OptionSelectModeConfig } from "#app/ui/interfaces/option-select-config";

export class OptionSelectUiHandler extends AbstractOptionSelectUiHandler<OptionSelectItem> {
  override show(config?: OptionSelectModeConfig, ..._args: unknown[]): boolean {
    return super.show(config);
  }
}
