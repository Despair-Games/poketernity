import { biomeLinks, getBiomeName } from "#app/data/balance/biomes";
import { globalScene } from "#app/global-scene";
import { MapModifier, MoneyInterestModifier } from "#app/modifier/modifier";
import type { OptionSelectItem, OptionSelectModeConfig } from "#app/ui/interfaces/option-select-config";
import { UiMode } from "#enums/ui-mode";
import { randSeedInt } from "#app/utils";
import { Biome } from "#enums/biome";
import { BattlePhase } from "./abstract-battle-phase";
import { PartyHealPhase } from "./party-heal-phase";
import { SwitchBiomePhase } from "./switch-biome-phase";
import { PhaseId } from "#enums/phase-id";

export class SelectBiomePhase extends BattlePhase {
  override readonly id = PhaseId.SELECT_BIOME;

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
              ui.setMode(UiMode.MESSAGE);
              setNextBiome(b);
              return true;
            },
          };
          return ret;
        });

        const optionSelectConfig: OptionSelectModeConfig = {
          options: biomeSelectItems,
          blockCancelButton: true,
          inputDelay: 1000,
          yOffset: 48,
        };

        ui.setMode(UiMode.OPTION_SELECT, optionSelectConfig);
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
