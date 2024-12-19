import { biomeLinks, getBiomeName } from "#app/data/balance/biomes";
import { globalScene } from "#app/global-scene";
import { MapModifier, MoneyInterestModifier } from "#app/modifier/modifier";
import type { OptionSelectItem } from "#app/ui/abstact-option-select-ui-handler";
import { Mode } from "#app/ui/ui";
import { randSeedInt } from "#app/utils";
import { Biome } from "#enums/biome";
import { BattlePhase } from "./battle-phase";
import { PartyHealPhase } from "./party-heal-phase";
import { SwitchBiomePhase } from "./switch-biome-phase";

export class SelectBiomePhase extends BattlePhase {
  public override start(): void {
    super.start();

    const { arena, currentBattle, gameMode, ui } = globalScene;
    const { isClassic, isDaily, hasRandomBiomes, hasShortBiomes } = gameMode;
    const { waveIndex } = currentBattle;

    const currentBiome = arena.biomeType;

    const setNextBiome = (nextBiome: Biome): void => {
      if (waveIndex % 10 === 1) {
        globalScene.applyModifiers(MoneyInterestModifier, true);
        globalScene.unshiftPhase(new PartyHealPhase(false));
      }
      globalScene.unshiftPhase(new SwitchBiomePhase(nextBiome));
      this.end();
    };

    if (
      (isClassic && gameMode.isWaveFinal(waveIndex + 9))
      || (isDaily && gameMode.isWaveFinal(waveIndex))
      || (hasShortBiomes && !(waveIndex % 50))
    ) {
      setNextBiome(Biome.END);
    } else if (hasRandomBiomes) {
      setNextBiome(this.generateNextBiome());
    } else if (Array.isArray(biomeLinks[currentBiome])) {
      let biomes: Biome[] = [];
      globalScene.executeWithSeedOffset(() => {
        biomes = (biomeLinks[currentBiome] as (Biome | [Biome, number])[])
          .filter((b) => !Array.isArray(b) || !randSeedInt(b[1]))
          .map((b) => (!Array.isArray(b) ? b : b[0]));
      }, waveIndex);

      if (biomes.length > 1 && globalScene.findModifier((m) => m instanceof MapModifier)) {
        let biomeChoices: Biome[] = [];
        globalScene.executeWithSeedOffset(() => {
          biomeChoices = (
            !Array.isArray(biomeLinks[currentBiome])
              ? [biomeLinks[currentBiome] as Biome]
              : (biomeLinks[currentBiome] as (Biome | [Biome, number])[])
          )
            .filter((b, _i) => !Array.isArray(b) || !randSeedInt(b[1]))
            .map((b) => (Array.isArray(b) ? b[0] : b));
        }, waveIndex);

        const biomeSelectItems = biomeChoices.map((b) => {
          const ret: OptionSelectItem = {
            label: getBiomeName(b),
            handler: () => {
              ui.setMode(Mode.MESSAGE);
              setNextBiome(b);
              return true;
            },
          };
          return ret;
        });

        ui.setMode(Mode.OPTION_SELECT, {
          options: biomeSelectItems,
          delay: 1000,
        });
      } else {
        setNextBiome(biomes[randSeedInt(biomes.length)]);
      }
    } else if (biomeLinks.hasOwnProperty(currentBiome)) {
      setNextBiome(biomeLinks[currentBiome]);
    } else {
      setNextBiome(this.generateNextBiome());
    }
  }

  public generateNextBiome(): Biome {
    const { waveIndex } = globalScene.currentBattle;
    if (!(waveIndex % 50)) {
      return Biome.END;
    }
    return globalScene.generateRandomBiome(waveIndex);
  }
}
