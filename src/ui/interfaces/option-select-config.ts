export interface OptionSelectConfig {
  xOffset?: number;
  yOffset?: number;
  options: OptionSelectItem[];
  maxOptions?: number;
  delay?: number;
  noCancel?: boolean;
  supportHover?: boolean;
}

export interface OptionSelectItem {
  label: string;
  handler: () => boolean;
  onHover?: () => void;
  keepOpen?: boolean;
  overrideSound?: boolean;
  item?: string;
  itemArgs?: any[];
}
