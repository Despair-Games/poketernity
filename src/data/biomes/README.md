### How to add a biome

#### Pokemon Pool
A biome's `pokemonPool` consists of a mapping of a `BiomePoolTier` (common, uncommon, rare, super rare, ultra rare, boss, boss rare, boss super rare, boss ultra rare) to time of day (dawn, day, dusk, night, all), and finally to the pokemon that appear. The current time of day is combined with the ALL pool to determine what Pokemon can appear. The rarity is rolled first, and if there are no available selections in that tier, it is automatically downgraded according to the above order in BiomePoolTier.

For the most part, there is no need to specify evolutions in the Pokemon pool since Pokemon will automatically evolve or de-evolve based on level. The only reason to specify an evolved form is wanting to guarantee that form shows up. (Specifying Gardevoir means Ralts, Kirlia, and Gardevoir can appear, but not Gallade). For Pokemon with specific forms, [check the bottom section](#other-code-that-needs-updating) for how to determine that based on biome.

#### Pokemon Pool Philosophy

Sam's general design philosophy had all the boss tiers contain Pokemon one tier higher than the non boss tier. `BOSS` would use some Pokemon from `COMMON`, `UNCOMMON`, and `RARE`; `BOSS_RARE` would use some Pokemon from `RARE` and `SUPER_RARE`; `BOSS_SUPER_RARE` would use Pokemon from `ULTRA_RARE`; and `BOSS_ULTRA_RARE` would be reserved for the truly rare Pokemon (usually box legends).

Here is a basic definition for which Pokemon belong in what pools

Common: These should be the most iconic Pokemon of the biome. Ones that you should expect to see a lot of.
Uncommon: Pokemon that would also make sense in the biome but not as much as often as the common pool.
Rare: This should be for Pokemon that are a step up from uncommon, be they rarer, stronger, or just generally more desirable.
Super rare: This should be reserved for Pokemon that are really rare but not quite to the level of sublegends. Psuedolegends would belong here.
Ultra rare: This should be where all sublegends belong. This includes sublegends, some mythics, ultra beasts, and paradoxes

Boss: Pokemon from the common/uncommon/rare pool but focusing on the common pool for iconic Pokemon
Boss Rare: Similar to Boss, but more focusing on the uncommon/rare pool
Boss Super Rare: This should be composed of Pokemon from the Super Rare and Ultra Rare pool so everything in here should be quite desirable.
Boss Ultra Rare: Reserved for legendaries (like the 600+bst box legends) and really rare mythics

#### Trainer Pool
The trainer pool works much in the same way as the Pokemon Pool but does not factor in time of day. Gym leaders are exclusively found in the `BOSS` tier but there are a lot of unused tiers in the trainer pool. Also like the Pokemon Pool, if there are no available options then the tier is automatically downgraded. If there truly are no trainers aviailable but a trainer needs to spawn, then the default is a breeder.

The trainer chance is a number that represents the demoninator of how likely a trainer battle is. For this reason the chance can only be a fraction like `1/2`, `1/3`, `1/4`, and so on. A trainer chance of `0` means no trainers can spawn.

#### Weather Pool and Terrain Pool
These represent the likelihood of weather/terrain being set when the player enters the biome. Keep in mind that the weight of Sun is automatically set to 0 in `arena.setRandomWeather` if the time of day is dusk or night.

### Assets

#### bgm and bgm loop point
All BGM files must be stored in the `public/audio/bgm` directory, then the `bgm` parameter passed into a biome's constructor should match the name of the BGM file. For example, if the file is saved as `public/audio/bgm/town.mp3`, the `bgm` parameter should be `town`. Right now all the bgm's are named as the lowercase representation of the biome ID. This can be set to anything, but make sure to update the corresponding keys in `bgm-name.json` translation files.

The loop point of a bgm, measured in seconds, should be set to ensure that the bgm loops/replays smoothly after the bgm file's ending.

#### locale
The biome needs to have a proper locale mapping defined in [the poketernity-locales repo](https://github.com/Despair-Games/poketernity-locales/tree/main) in the various [biome.json](https://github.com/Despair-Games/poketernity-locales/blob/main/en/biome.json) files or else the biome name will be displayed as the biomeId enum in all caps (e.g. `"TOWN"`)

#### Props and bg

`biomeName_a` represents the player's field circle.
`biomeName_b` represents the opponent's field circle.
`biomeName_bg` represents the background of the biome

Props are extra items that show up on the opponent's side of the field. They are labeled as `biomeName_b_1` or `biomeName_b_2` or `biomeName_b_3`

Power Plant and End also have animated biome props that have associated json files.

If a biome is NOT an indoor biome, then it is affected by tinting in `field-sprite.onBind`

### Other code that needs updating
* Don't forget to add connections to and from the biome in [biome-link.ts](../biome-links.ts)
* In order to enable MEs, the biome needs to be added to `mystery-encounter.mysteryEncountersByBiome` along with a list of MEs that are enabled. If the new biome falls under the categories of `EXTREME`, `NON_EXTREME`, `HUMAN_TRANSITABLE`, or `CIVILIZATION`, be sure to add the Biome to the corresponding lists in `biome-utils.ts` to enable MEs with those specific categories
* Don't forget to update `biome-utils.indoorBiomes` and `arena.biomeWithProps` to account for tinting and prop display
* For Pokemon with specific forms in certain biomes, `arena.getSpeciesFormIndex` can set specific forms for specific biomes
* Alcremie requires a specific biome to determine its form and those biomes are defined in [biome-utils.ts](../biome-utils.ts)
* There are also a few arrays of biomes used to determine specific MEs that need to be updated in [biome-utils.ts](../biome-utils.ts)
* The move Camouflage uses the [CopyBiomeTypeAttr](../moves/move-attrs/copy-biome-type-attr.ts) which changes the user's type based on the current biome
* The move Secret Power uses the [SecretPowerAttr](../moves/move-attrs/secret-power-attr.ts) which applies a secondary effect based on the current biome
* The move Nature Power uses the [NaturePowerAttr](../moves/move-attrs/nature-power-attr.ts) which changes into a different attack depending on the current biome