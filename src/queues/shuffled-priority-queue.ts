import { globalScene } from "#app/global-scene";
import { randSeedShuffle } from "#utils/random-utils";

type ComparatorFunc<T> = (a: T, b: T) => number;

/**
 * Stores a list of elements.
 *
 * The ordering of this queue is dynamically updated such that the
 * highest-"priority" element is always popped first. \
 * Sorting order is based on the provided {@linkcode comparator} function. \
 * All elements that have the same priority (i.e. `comparator(A, B) === 0`)
 * are ordered randomly within the queue.
 */
export class ShuffledPriorityQueue<T> {
  protected queue: T[] = [];
  public readonly comparator: ComparatorFunc<T>;

  constructor(comparator: ComparatorFunc<T>) {
    this.comparator = comparator;
  }

  /**
   * Shuffles the elements in the queue, then sorts them based on the class'
   * {@linkcode comparator}.
   * @sealed
   */
  private reorder(): void {
    this.shuffle();
    this.queue.sort(this.comparator);
  }

  /**
   * Randomly shuffles the elements in the queue.
   * @todo Should this be made abstract and defined in subclasses? This coupling the class
   * with `globalScene` seems weird.
   */
  private shuffle(): void {
    // This is seeded with the current turn to prevent an inconsistency where it
    // was varying based on how long since you last reloaded
    globalScene.executeWithSeedOffset(
      () => {
        this.queue = randSeedShuffle(this.queue);
      },
      globalScene.currentBattle.turn * 1000 + this.queue.length,
      globalScene.waveSeed,
    );
  }

  /**
   * @returns `true` if the queue is empty
   * @sealed
   */
  public isEmpty(): boolean {
    return this.queue.length === 0;
  }

  /**
   * {@linkcode reorder | reorders} the queue, then removes the first element.
   * @returns The removed element, or `undefined` if the queue is empty.
   * @sealed
   */
  public pop(): T | undefined {
    if (this.isEmpty()) {
      return;
    }

    this.reorder();
    return this.queue.shift();
  }

  /**
   * Adds one or more elements to the queue.
   * @param elements - The elements to add
   * @sealed
   */
  public push(...elements: [T, ...T[]]): void {
    this.queue.push(...elements);
  }

  /**
   * Removes all elements from the queue.
   * @sealed
   */
  public clear(): void {
    this.queue.splice(0, this.queue.length);
  }

  /**
   * Removes the first element meeting the given condition
   * @param condition - The condition an element must meet to be removed
   * @returns The removed element, or `undefined` if no element was removed
   * @sealed
   */
  public remove(condition: (t: T) => boolean): T | undefined {
    // Reorder to remove the first element
    this.reorder();
    const index = this.queue.findIndex(condition);
    if (index === -1) {
      return;
    }

    return this.queue.splice(index, 1)[0];
  }

  /**
   * @returns The first element meeting the given condition
   * @sealed
   */
  public find(condition: (t: T) => boolean): T | undefined {
    return this.queue.find(condition);
  }

  /**
   * @returns `true` if an element meeting the given condition exists
   * @sealed
   */
  public has(condition: (t: T) => boolean): boolean {
    return this.queue.some(condition);
  }

  /** Executes the given callback function on each entry in the priority queue */
  public forEach(callbackFn: (value: T, index: number) => void): void {
    this.queue.forEach(callbackFn);
  }

  /** @returns `true` if all elements in the queue satisfy the given predicate */
  public every(predicate: (value: T, index: number) => boolean): boolean {
    return this.queue.every(predicate);
  }
}
