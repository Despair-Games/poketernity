import type { Modifier } from "#app/modifier/modifier";

export type ModifierPredicate<T extends Modifier = Modifier> = (modifier: T) => boolean;
