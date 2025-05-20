import type { Modifier } from "#modifier/modifier";

export type ModifierPredicate<T extends Modifier = Modifier> = (modifier: T) => boolean;
