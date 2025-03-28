import { biomeLinks } from "#app/data/biome-links";
import { getBiomeName } from "#app/data/biome-utils";
import { globalScene } from "#app/global-scene";
import { MapModifier, MoneyInterestModifier } from "#app/modifier/modifier";
import { BattlePhase } from "#app/phases/abstract-battle-phase";
import { PartyHealPhase } from "#app/phases/party-heal-phase";
import { SwitchBiomePhase } from "#app/phases/switch-biome-phase";
import type { OptionSelectUiHandler } from "#app/ui/handlers/option-select-ui-handler";
import type { OptionSelectItem, OptionSelectModeConfig } from "#app/ui/interfaces/option-select-config";
import { randSeedInt } from "#app/utils";
import { BiomeId } from "#enums/biome-id";
import { PhaseId } from "#enums/phase-id";
import { UiMode } from "#enums/ui-mode";

export class SelectBiomePhase extends BattlePhase {
  override readonly id = PhaseId.SELECT_BIOME;

  public override start(): void {
    super.start();

    const { arena, currentBattle, gameMode, ui } = globalScene;
    const { isClassic, isDaily, hasRandomBiomes, hasShortBiomes } = gameMode;
    const { waveIndex } = currentBattle;

    const currentBiome = arena.biomeId;

    const setNextBiome = (nextBiome: BiomeId): void => {
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
      setNextBiome(BiomeId.END);
    } else if (hasRandomBiomes) {
      setNextBiome(this.generateNextBiome());
    } else if (Array.isArray(biomeLinks[currentBiome])) {
      let biomes: BiomeId[] = [];
      globalScene.executeWithSeedOffset(() => {
        biomes = (biomeLinks[currentBiome] as (BiomeId | [BiomeId, number])[])
          .filter((b) => !Array.isArray(b) || !randSeedInt(b[1]))
          .map((b) => (!Array.isArray(b) ? b : b[0]));
      }, waveIndex);

      if (biomes.length > 1 && globalScene.findModifier((m) => m instanceof MapModifier)) {
        let biomeChoices: BiomeId[] = [];
        globalScene.executeWithSeedOffset(() => {
          biomeChoices = (
            !Array.isArray(biomeLinks[currentBiome])
              ? [biomeLinks[currentBiome] as BiomeId]
              : (biomeLinks[currentBiome] as (BiomeId | [BiomeId, number])[])
          )
            .filter((b, _i) => !Array.isArray(b) || !randSeedInt(b[1]))
            .map((b) => (Array.isArray(b) ? b[0] : b));
        }, waveIndex);
        const biomeSelectItems = biomeChoices.map((b) => {
          const ret: OptionSelectItem = {
            label: getBiomeName(b),
            handler: () => {
              ui.setMessageMode();
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

        ui.setMode<OptionSelectUiHandler>(UiMode.OPTION_SELECT, optionSelectConfig);
      } else {
        setNextBiome(biomes[randSeedInt(biomes.length)]);
      }
    } else if (biomeLinks.hasOwnProperty(currentBiome)) {
      setNextBiome(biomeLinks[currentBiome]);
    } else {
      setNextBiome(this.generateNextBiome());
    }
  }

  public generateNextBiome(): BiomeId {
    const { waveIndex } = globalScene.currentBattle;
    if (!(waveIndex % 50)) {
      return BiomeId.END;
    }
    return globalScene.generateRandomBiome(waveIndex);
  }
}
