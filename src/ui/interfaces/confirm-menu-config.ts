import type { UiMode } from "#enums/ui-mode";
import type { OptionMenuSettings } from "#ui/option-select-config";

/**
 * Customizations options for UI's {@linkcode UiMode.CONFIRM}
 */
export interface ConfirmModeConfig extends OptionMenuSettings {
  /** Handler called when the player selects the "Yes" option */
  yesHandler: () => void;
  /** Handler called when the player selects the "No" option, or cancels */
  noHandler: () => void;
}
