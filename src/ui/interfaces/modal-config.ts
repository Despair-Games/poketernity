export interface ModalConfig {
  buttonActions: Function[];
  fadeOut?: () => void;
}

export interface FormModalConfig extends ModalConfig {
  errorMessage?: string;
}

export interface InputFieldConfig {
  label: string;
  isPassword?: boolean;
  isReadOnly?: boolean;
}
