### How to add a biome

#### Pokemon Pool
A biome's `pokemonPool` consists of a mapping of a `BiomePoolTier` (common, uncommon, rare, super rare, ultra rare, boss, boss rare, boss super rare, boss ultra rare) to time of day (dawn, day, dusk, night, all), and finally to the pokemon that appear. The current time of day is combined with the ALL pool to determine what Pokemon can appear. The rarity is rolled first, and if there are no available selections in that tier, it is automatically downgraded according to the above order in BiomePoolTier.

Sam's general design philosophy had all the boss tiers contain Pokemon one tier higher than the non boss tier. `BOSS` would use some Pokemon from `COMMON`, `UNCOMMON`, and `RARE`; `BOSS_RARE` would use some Pokemon from `RARE` and `SUPER_RARE`; `BOSS_SUPER_RARE` would use Pokemon from `ULTRA_RARE`; and `BOSS_ULTRA_RARE` would be reserved for the truly rare Pokemon (usually box legends).

For the most part, there is no need to specify evolutions in the Pokemon pool since Pokemon will automatically evolve or de-evolve based on level. The only reason to specify an evolved form is wanting to guarantee that form shows up. (Specifying Gardevoir means Ralts, Kirlia, and Gardevoir can appear, but not Gallade). For Pokemon with specific forms, check the bottom section for how to determine that based on biome.

#### Trainer Pool
The trainer pool works much in the same way as the Pokemon Pool but does not factor in time of day. Gym leaders are exclusively found in the `BOSS` tier but there are a lot of unused tiers in the trainer pool. Also like the Pokemon Pool, if there are no available options then the tier is automatically downgraded. If there truly are no trainers aviailable but a trainer needs to spawn, then the default is a breeder.

The trainer chance is a number that represents the demoninator of how likely a trainer battle is. For this reason the chance can only be a fraction like `1/2`, `1/3`, `1/4`, and so on. A trainer chance of `0` means no trainers can spawn.

#### Weather Pool and Terrain Pool
These represent the likelihood of weather/terrain being set when the player enters the biome. Keep in mind that the weight of Sun is automatically set to 0 in `arena.setRandomWeather` if the time of day is dusk or night.

### Assets

#### bgm and bgm loop point
All BGM files must be stored in the `public/audio/bgm` directory, then the `bgm` parameter passed into a biome's constructor should match the name of the BGM file. For example, if the file is saved as `public/audio/bgm/town.mp3`, the `bgm` parameter should be `town`. Right now all the bgm's are named as the lowercase representation of the biome ID. This can be set to anything, but make sure to update the corresponding keys in `bgm-name.json` translation files.

The loop point of a bgm, measured in seconds, should be set to ensure that the bgm loops/replays smoothly after the bgm file's ending.

#### Props and bg

`biomeName_a` represents the player's field circle.
`biomeName_b` represents the opponent's field circle.
`biomeName_bg` represents the background of the biome

Props are extra items that show up on the opponent's side of the field. They are labeled as `biomeName_b_1` or `biomeName_b_2` or `biomeName_b_3`

Power Plant and End also have animated biome props that have associated json files.

If a biome is NOT an indoor biome, then it is affected by tinting in `field-sprite.onBind`

### Other code that needs updating
* Don't forget to add connections to and from the biome in `biome-link.ts`
* For now, don't forget to update `arena.indoorBiomes` and `arena.biomeWithProps` to account for tinting and prop display
* For Pokemon with specific forms in certain biomes, `arena.getSpeciesFormIndex` can set specific forms for specific biomes
* The move Camoflage uses the [CopyBiomeTypeAttr](../moves/move-attrs/copy-biome-type-attr.ts) which changes the user's type based on the current biome
* The move Secret Power uses the [SecretPowerAttr](../moves/move-attrs/secret-power-attr.ts) which applies a secondary effect based on the current biome
* The move Nature Power uses the [NaturePowerAttr](../moves/move-attrs/nature-power-attr.ts) which changes into a different attack depending on the current biome