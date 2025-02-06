import { BaseItem } from "./base-item";

export abstract class ConsumableItem extends BaseItem {}

export abstract class TMItem extends ConsumableItem {}

export abstract class HealingItem extends ConsumableItem {}

export abstract class BallItem extends ConsumableItem {}

export abstract class FormChangeItem extends ConsumableItem {}
