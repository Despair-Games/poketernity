import { BaseItem } from "./base-item";

/**
 * Consumable items represent items that are immediately used up upon selecting
 */
export abstract class ConsumableItem extends BaseItem {}

export abstract class LearnMoveItem extends ConsumableItem {}

export abstract class HealingItem extends ConsumableItem {}

export abstract class BallItem extends ConsumableItem {}

export abstract class FormChangeItem extends ConsumableItem {}

export abstract class EvolutionItem extends ConsumableItem {}
