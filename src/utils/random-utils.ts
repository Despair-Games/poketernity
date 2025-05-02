export function randomString(length: number, seeded: boolean = false): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = seeded ? randSeedInt(characters.length) : Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }

  return result;
}

export function randGauss(stdev: number, mean: number = 0): number {
  if (!stdev) {
    return 0;
  }
  const u = 1 - Math.random();
  const v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return z * stdev + mean;
}

export function randSeedGauss(stdev: number, mean: number = 0): number {
  if (!stdev) {
    return 0;
  }
  const u = 1 - Phaser.Math.RND.realInRange(0, 1);
  const v = Phaser.Math.RND.realInRange(0, 1);
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return z * stdev + mean;
}

/**
 * Returns a random integer between `min` and `min + range`
 * @param range - The maximum integer (`min + range`)
 * @param min - (Default `0`) The minimum integer
 */
export function randInt(range: number, min: number = 0): number {
  if (range === 1) {
    return min;
  }
  return Math.floor(Math.random() * range) + min;
}

/**
 * Generates a random number using the global seed, or the current battle's seed if called via `Battle.randSeedInt`
 * @param range - How large of a range of random numbers to choose from. If {@linkcode range} <= 1, returns {@linkcode min}
 * @param min - (Default `0`) The minimum integer to pick
 * @returns A random integer between `min` and `min + range - 1`
 */
export function randSeedInt(range: number, min: number = 0): number {
  if (range <= 1) {
    return min;
  }
  return Phaser.Math.RND.integerInRange(min, range - 1 + min);
}

/**
 * Returns a random integer between min and max (non-inclusive)
 */
export function randIntRange(min: number, max: number): number {
  return randInt(max - min, min);
}

export function randItem<T>(items: T[]): T {
  return items.length === 1 ? items[0] : items[randInt(items.length)];
}

export function randSeedItem<T>(items: T[]): T {
  return items.length === 1 ? items[0] : Phaser.Math.RND.pick(items);
}

/**
 * This picks items out of an array with a higher weight for earlier entries
 *
 * Only used for Trainer `partyTemplateIndex` generation
 * @todo figure out how that actually works
 */
export function randSeedWeightedItem<T>(items: T[]): T {
  return items.length === 1 ? items[0] : Phaser.Math.RND.weightedPick(items);
}

/**
 * Function for picking an item out of a mapping based on the given weights
 * @param items - The mapping of item to weight
 * @returns a randomly picked item according to the weights
 */
export function weightedPick<T>(items: Map<T, number>): T {
  const totalWeight = [...items.values()].reduce((a: number, b: number) => a + b, 0);
  const randomNumber = randSeedInt(totalWeight);

  let totalWeightSoFar = 0;
  for (const [i, weight] of items) {
    totalWeightSoFar += weight;

    // This is a < and not a <= since the first item can have 0 weight
    if (randomNumber < totalWeightSoFar) {
      return i;
    }
  }

  // Failsafe if the above loop somehow failed (e.g., if all items have 0 weight)
  console.error("Random selection failed, selecting the first element instead. Original list of items:", items);
  return items.keys()[0];
}

/**
 * Shuffle a list using the seeded rng. Utilises the Fisher-Yates algorithm.
 * @param items - An array of items.
 * @returns A new shuffled array of items.
 */
export function randSeedShuffle<T>(items: T[]): T[] {
  if (items.length <= 1) {
    return items;
  }
  const newArray = items.slice(0);
  for (let i = items.length - 1; i > 0; i--) {
    const j = Phaser.Math.RND.integerInRange(0, i);
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
