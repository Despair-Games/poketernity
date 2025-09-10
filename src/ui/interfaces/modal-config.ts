import type { AnyFn } from "#types/utility-types";

export interface ModalConfig {
  buttonActions: AnyFn[];
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
