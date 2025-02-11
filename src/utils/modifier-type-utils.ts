import type { ModifierType, ModifierTypeFunc } from "#app/modifier/modifier-type";
import { modifierTypes } from "#app/modifier/modifier-types";

export function getModifierType(modifierTypeFunc: ModifierTypeFunc): ModifierType {
  const modifierType = modifierTypeFunc();
  if (!modifierType.id) {
    modifierType.id = Object.keys(modifierTypes).find((k) => modifierTypes[k] === modifierTypeFunc)!; // TODO: is this bang correct?
  }
  return modifierType;
}
