import { SpeciesCategories } from "#app/enums/pokemon-species-categories";
import { getSpecialSpeciesList } from "../pokemon-species";

/**
 * A list of all {@link https://bulbapedia.bulbagarden.net/wiki/Paradox_Pok%C3%A9mon | Paradox Pokemon}, NOT including the legendaries Miraidon and Koraidon.
 */
export const NON_LEGEND_PARADOX_POKEMON = getSpecialSpeciesList(SpeciesCategories.PARADOX, false);

/**
 * A list of all {@link https://bulbapedia.bulbagarden.net/wiki/Ultra_Beast | Ultra Beasts}, NOT including legendaries such as Necrozma or the Cosmog line.
 *
 * Note that all of these Ultra Beasts are still considered Sub-Legendary.
 */
export const NON_LEGEND_ULTRA_BEASTS = getSpecialSpeciesList(SpeciesCategories.ULTRA_BEAST, false);
