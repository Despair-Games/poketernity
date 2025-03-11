import type {
  OptionMenuSettings,
  OptionSelectItem,
  OptionSelectModeConfig,
} from "#app/ui/interfaces/option-select-config";
import { UiMode } from "#enums/ui-mode";
import { NumberHolder, randInt } from "#app/utils";
import { Button } from "#enums/buttons";
import { getBBCodeFragment } from "#app/ui/text";
import AbstractOptionSelectUiHandler from "#app/ui/abstract-option-select-ui-handler";
import type { UIOptionSelectItem } from "./interfaces/option-select-ui-item";
import { TextStyle } from "#enums/text-style";

interface transferItemMenuConfig extends OptionMenuSettings {
  onItemSelected: (modifier: string, count: number) => void;
  onAllSelected: () => void;
  onCancel: () => void;
}

interface TransferItemOption extends OptionSelectItem {
  currentStack?: number;
  transferStack?: NumberHolder;
  maxStack?: number;
}

export default class TransferItemUiHandler extends AbstractOptionSelectUiHandler<TransferItemOption> {
  constructor() {
    super(UiMode.MODIFIER_SELECT);
    //super(UiMode.TRANSFER_ITEM);
  }

  override show(args: any[]): boolean {
    if (
      !args[0]
      || !args[0].hasOwnProperty("onItemSelected")
      || !args[0].hasOwnProperty("onAllSelected")
      || !args[0].hasOwnProperty("onCancel")
    ) {
      return false;
    }

    const config = args[0] as transferItemMenuConfig;
    const options: TransferItemOption[] = [];
    for (let i = 0; i < 55; i++) {
      const maxStack = randInt(2) ? randInt(99) : 1;
      const currentStack = randInt(2) ? randInt(15) : maxStack;
      const holder = new NumberHolder(currentStack);
      options.push({
        label: "Item " + i + "",
        maxStack: maxStack,
        currentStack: currentStack,
        transferStack: holder,
        handler: () => {
          config.onItemSelected("Item " + maxStack, holder.value);
          return true;
        },
      });
    }
    options.push({
      label: "All",
      handler: () => {
        config.onAllSelected();
        return true;
      },
    });
    options.push({
      label: "Cancel",
      handler: () => {
        config.onCancel();
        return true;
      },
    });

    console.log(options);

    const fullConfig: OptionSelectModeConfig<TransferItemOption> = {
      ...(config as OptionMenuSettings),
      options: options,
    };

    return super.show([fullConfig]);
  }

  override initializeOption(option: TransferItemOption & UIOptionSelectItem, _n, _d): void {
    if (option.transferStack && option.maxStack) {
      const stack = option.transferStack.value;
      let stackLabel = option.maxStack > 1 ? " (" + stack + ")" : "";
      if (option.maxStack === stack) {
        stackLabel = getBBCodeFragment(stackLabel, TextStyle.SUMMARY_RED, true);
      }
      option.displayLabel = option.label + stackLabel;
    }
    super.initializeOption(option, _n, _d);
  }

  override processInput(button: Button): boolean {
    const currentOption = super.getCurrentOption();
    if (
      (button === Button.RIGHT || button === Button.LEFT)
      && currentOption.currentStack
      && currentOption.maxStack
      && currentOption.transferStack
    ) {
      if (button === Button.RIGHT) {
        currentOption.transferStack.value =
          currentOption.transferStack.value < currentOption.currentStack ? currentOption.transferStack.value + 1 : 1;
      } else {
        currentOption.transferStack.value =
          currentOption.transferStack.value > 1 ? currentOption.transferStack.value - 1 : currentOption.currentStack;
      }
      currentOption.initialized = false;
      this.fullyInitialized = false;
      this.displayCurrentOptions();
      this.getUi().playSelect();
      return true;
    }

    return super.processInput(button);
  }
}
