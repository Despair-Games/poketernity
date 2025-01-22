// -- start tsdoc imports --
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { UiMode } from "#enums/ui-mode";
// -- end tsdoc imports --
import type { OptionMenuSettings } from "#app/ui/interfaces/option-select-config";

/**
 * Customizations options for UI's {@linkcode UiMode.CONFIRM}
 */
export interface ConfirmModeConfig extends OptionMenuSettings {
  /** Handler called when the player selects the "Yes" option */
  yesHandler: () => void;
  /** Handler called when the player selects the "No" option, or cancels */
  noHandler: () => void;
}
