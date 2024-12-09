import { VariantTier } from "#app/enums/variant-tier";

// Normal Shiny, Rare Shiny, Epic Shiny
export type Variant = 0 | 1 | 2;

/**
 * The mapping of which folder in \pokemon\variants to load the normal/rare/epic shiny
 * 0 - Official shiny
 * 1 - png and animation json
 * 2 - color swap json
 */
export type VariantSet = [Variant, Variant, Variant];

// The _masterlist.json but parsed/loaded
export const variantData: any = {};

// What the variant color json gets parsed into, see {@linkcode populateVariantColorCache}
export const variantColorCache = {};

/**
 * Function to get a color hex number representing a color for a Variant
 * @param variant - The Variant
 * @returns The hex representation of the color corresponding to the Variant
 */
export function getVariantTint(variant: Variant): number {
  switch (variant) {
    case 0:
      return 0xf8c020; // Yellow
    case 1:
      return 0x20f8f0; // Teal
    case 2:
      return 0xe81048; // Red
  }
}

/**
 * Function to convert a Variant to a VarientTier
 * @param variant - The Variant
 * @returns The corresponding VariantTier
 */
export function getVariantTierForVariant(variant: Variant): number {
  switch (variant) {
    case 0:
      return VariantTier.STANDARD;
    case 1:
      return VariantTier.RARE;
    case 2:
      return VariantTier.EPIC;
  }
}
