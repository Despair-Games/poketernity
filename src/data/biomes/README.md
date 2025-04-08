### How to add a biome

#### Pokemon Pool
A biome's pokemonPool consists of a mapping of a BiomePoolTier (common, uncommon, rare, super rare, ultra rare, boss, boss rare, boss super rare, boss ultra rare) to time of day (dawn, day, dusk, night all), and finally to the pokemon that appear. The current time of day is combined with the ALL pool to determine what Pokemon can appear. The rarirty is rolled first, and if there are no available selections in that tier, it is automatically downgraded according to the above order in BiomePoolTier.

Sam's general design philosophy had all the boss tiers contain Pokemon one tier higher than the non boss tier. Boss rare and uncommon would share Pokemon, Boss super rare and rare, Boss ultra rare and super rare, with Boss ultra rare being reserved for the truly rare Pokemon.

For the most part, there is no need to specify evolutions in the Pokemon pool since Pokemon will automatically evolve or de-evolve based on level. The only reason to specify an evolved form is wanting to guarantee that form shows up. (Specifying Gardevoir means Ralts, Kirlia, and Gardevoir can appear, but not Gallade). For Pokemon with specific forms, check the bottom section for how to determine that based on biome.

#### Trainer Pool
The trainer pool works much in the same way as the Pokemon Pool but does not factor in time of day. Gym leaders are exclusively found in the BOSS tier but there are a lot of unused tiers in the trainer pool. Also like the Pokemon Pool, if there are no available options then the tier is automatically downgraded. If there truly are no trainers aviailable but a trainer needs to spawn, then the default is a breeder.

The trainer chance is a number that represents the demoninator of how likely a trainer battle is. For this reason the chance can only be a fraction like 1/2, 1/3, 1/4, and so on. A trainer chance of 0 means no trainers can spawn.

#### Weather Pool and Terrain Pool
These represent the likelihood of weather/terrain being set when the player enters the biome. Keep in mind that the weight of Sun is automatically set to 0 in `arena.setRandomWeather` if the time of day is dusk or night.

### Assets

#### bgm and bgm loop point
The bgm is the spring representation of the background music of a biome saved as a mp3 like `public/audio/bgm/town.mp3`. Right now all the bgm's are named as the lowercase representation of the biome id, but this can be set to anything.

The loop point is a number that represents the loop point of a bgm in seconds.

#### Props and bg
TBD

TBD (talk about background tinting and indoor biomes)

biomeName_a represents the player's field circle.
biomeName_b represents the opponent's field circle.
biomeName_bg represents the background of the biome

Props are extra items that show up on the opponent's side of the field. They are labeled as biomeName_b_1 or biomeName_b_2 or biomeName_b_3

Power plant and end also have animated biome props that have associated json's

### Other code that needs updating
* Don't forget to add connections to and from the biome in `biome-link.ts`
* For Pokemon with specific forms in certain biomes, `arena.getSpeciesFormIndex` can set specific forms for specific biomes
* The move Camoflage uses the CopyBiomeTypeAttr which changes the user's type based on the current biome
* The move Secret Power uses the SecretPowerAttr which applies a secondary effect based on the current biome
* The move Nature Power uses the NaturePowerAttr which changes into a different attack depending on the current biome