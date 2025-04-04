export interface Stackable {
  readonly stackCount: number;
  readonly maxStackCount: number;

  onAdd?(): void;
  onRemove?(): void;
  onMax?(): void;
}
