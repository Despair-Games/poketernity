import { globalScene } from "#app/global-scene";
import {
  ExtraModifierModifier,
  HealShopCostModifier,
  TempExtraModifierModifier,
  type Modifier,
  type PokemonHeldItemModifier,
} from "#app/modifier/modifier";
import {
  getPlayerModifierTypeOptions,
  getPlayerShopModifierTypeOptionsForWave,
  PokemonModifierType,
  PokemonMoveModifierType,
  PokemonPpRestoreModifierType,
  PokemonPpUpModifierType,
  regenerateModifierPoolThresholds,
  RememberMoveModifierType,
  TmModifierType,
  type CustomModifierSettings,
  type ModifierType,
  type ModifierTypeOption,
} from "#app/modifier/modifier-type";
import Overrides from "#app/overrides";
import { BattlePhase } from "#app/phases/abstract-battle-phase";
import type { ModifierSelectUiHandler } from "#app/ui/handlers/modifier-select-ui-handler";
import { SHOP_OPTIONS_ROW_LIMIT } from "#app/ui/handlers/modifier-select-ui-handler";
import type { PartyUiHandler } from "#app/ui/handlers/party-ui-handler";
import type { ConfirmModeConfig } from "#app/ui/interfaces/confirm-menu-config";
import { NumberHolder } from "#app/utils";
import { FilterItemMaxStacks } from "#app/utils/item-utils";
import { ModifierPoolType } from "#enums/modifier-pool-type";
import type { ModifierTier } from "#enums/modifier-tier";
import { PartyOption } from "#enums/party-option";
import { PartyUiMode } from "#enums/party-ui-mode";
import { PhaseId } from "#enums/phase-id";
import { UiMode } from "#enums/ui-mode";
import i18next from "i18next";

//#region Types

interface SelectModifierPhaseOptions {
  rerollCount?: number;
  modifierTiers?: ModifierTier[];
  customModifierSettings?: CustomModifierSettings;
  isCopy?: boolean;
}

//#endregion

export class SelectModifierPhase extends BattlePhase {
  override readonly id = PhaseId.SELECT_MODIFIER;

  private readonly rerollCount: number;
  private readonly modifierTiers?: ModifierTier[];
  private readonly customModifierSettings?: CustomModifierSettings;
  private readonly isCopy: boolean;

  private typeOptions: ModifierTypeOption[];

  constructor({
    rerollCount = 0,
    modifierTiers,
    customModifierSettings,
    isCopy = false,
  }: SelectModifierPhaseOptions = {}) {
    super();

    this.rerollCount = rerollCount;
    this.modifierTiers = modifierTiers;
    this.customModifierSettings = customModifierSettings;
    this.isCopy = isCopy;
  }

  public override start(): void {
    super.start();

    const { currentBattle, money, ui } = globalScene;
    const { waveIndex } = currentBattle;

    if (!this.rerollCount && !this.isCopy) {
      this.updateSeed();
    } else if (this.rerollCount) {
      globalScene.reroll = false;
    }

    const party = globalScene.getPlayerParty();
    if (!this.isCopy) {
      regenerateModifierPoolThresholds(party, this.getPoolType(), this.rerollCount);
    }

    const modifierCount = new NumberHolder(3);
    globalScene.applyModifiers(ExtraModifierModifier, true, modifierCount);
    globalScene.applyModifiers(TempExtraModifierModifier, true, modifierCount);

    // If custom modifiers are specified, overrides default item count
    if (this.customModifierSettings) {
      const newItemCount =
        (this.customModifierSettings.guaranteedModifierTiers?.length ?? 0)
        + (this.customModifierSettings.guaranteedModifierTypeOptions?.length ?? 0)
        + (this.customModifierSettings.guaranteedModifierTypeFuncs?.length ?? 0);
      if (this.customModifierSettings.fillRemaining) {
        const originalCount = modifierCount.value;
        modifierCount.value = originalCount > newItemCount ? originalCount : newItemCount;
      } else {
        modifierCount.value = newItemCount;
      }
    }

    this.typeOptions = this.getModifierTypeOptions(modifierCount.value);

    const modifierSelectCallback = (rowCursor: number, cursor: number): boolean => {
      if (rowCursor < 0 || cursor < 0) {
        const skipRewardConfirmOptions: ConfirmModeConfig = {
          yesHandler: () => {
            ui.revertMode();
            ui.setMode(UiMode.MESSAGE);
            super.end();
          },
          noHandler: () => {
            ui.setMode<ModifierSelectUiHandler>(
              UiMode.MODIFIER_SELECT,
              this.isPlayer(),
              this.typeOptions,
              modifierSelectCallback,
              this.getRerollCost(globalScene.lockModifierTiers),
            );
          },
        };
        ui.showText(i18next.t("battle:skipItemQuestion"), null, () => {
          ui.setOverlayMode(UiMode.CONFIRM, skipRewardConfirmOptions);
        });
        return false;
      }

      let modifierType: ModifierType | undefined;
      let cost: number | undefined;
      const rerollCost = this.getRerollCost(globalScene.lockModifierTiers);

      switch (rowCursor) {
        // TODO: There must be a way to replace these magic numbers...
        case 0:
          switch (cursor) {
            case 0:
              if (rerollCost < 0 || money < rerollCost) {
                ui.playError();
                return false;
              } else {
                globalScene.reroll = true;
                globalScene.unshiftPhase(
                  new SelectModifierPhase({
                    rerollCount: this.rerollCount + 1,
                    modifierTiers: this.typeOptions.map((o) => o.type?.tier).filter((t) => t !== undefined),
                  }),
                );

                ui.clearText();
                ui.setMode(UiMode.MESSAGE).then(() => super.end());

                if (!Overrides.WAIVE_SHOP_FEES_OVERRIDE) {
                  globalScene.money -= rerollCost;
                  globalScene.updateMoneyText();
                  globalScene.animateMoneyChanged(false);
                }
                globalScene.audioManager.playSound("se/buy");
              }
              break;
            case 1:
              ui.setModeWithoutClear<PartyUiHandler>(
                UiMode.PARTY,
                PartyUiMode.MODIFIER_TRANSFER,
                -1,
                (fromSlotIndex: number, itemIndex: number, itemQuantity: number, toSlotIndex: number) => {
                  if (
                    toSlotIndex !== undefined
                    && fromSlotIndex < 6
                    && toSlotIndex < 6
                    && fromSlotIndex !== toSlotIndex
                    && itemIndex > -1
                  ) {
                    const itemModifiers = globalScene.findModifiers(
                      (m) =>
                        m.isPokemonHeldItemModifier() && m.isTransferable && m.pokemonId === party[fromSlotIndex].id,
                    ) as PokemonHeldItemModifier[];
                    const itemModifier = itemModifiers[itemIndex];
                    globalScene.tryTransferHeldItemModifier(
                      itemModifier,
                      party[toSlotIndex],
                      true,
                      itemQuantity,
                      undefined,
                      undefined,
                      false,
                    );
                  } else {
                    ui.setMode<ModifierSelectUiHandler>(
                      UiMode.MODIFIER_SELECT,
                      this.isPlayer(),
                      this.typeOptions,
                      modifierSelectCallback,
                      this.getRerollCost(globalScene.lockModifierTiers),
                    );
                  }
                },
                FilterItemMaxStacks,
              );
              break;
            case 2:
              ui.setModeWithoutClear(UiMode.PARTY, PartyUiMode.CHECK, -1, () => {
                ui.setMode<ModifierSelectUiHandler>(
                  UiMode.MODIFIER_SELECT,
                  this.isPlayer(),
                  this.typeOptions,
                  modifierSelectCallback,
                  this.getRerollCost(globalScene.lockModifierTiers),
                );
              });
              break;
            case 3:
              if (rerollCost < 0) {
                // Reroll lock button is also disabled when reroll is disabled
                ui.playError();
                return false;
              }

              globalScene.lockModifierTiers = !globalScene.lockModifierTiers;
              const uiHandler = ui.getHandler<ModifierSelectUiHandler>();
              uiHandler.setRerollCost(this.getRerollCost(globalScene.lockModifierTiers));
              uiHandler.updateLockRaritiesText();
              uiHandler.updateRerollCostText();
              return false;
          }
          return true;
        case 1:
          if (this.typeOptions.length === 0) {
            ui.clearText();
            ui.setMode(UiMode.MESSAGE);
            super.end();
            return true;
          }

          if (this.typeOptions[cursor].type) {
            modifierType = this.typeOptions[cursor].type;
          }
          break;
        default:
          const shopOptions = getPlayerShopModifierTypeOptionsForWave(waveIndex, globalScene.getWaveMoneyAmount(1));
          const shopOption =
            shopOptions[
              rowCursor > 2 || shopOptions.length <= SHOP_OPTIONS_ROW_LIMIT ? cursor : cursor + SHOP_OPTIONS_ROW_LIMIT
            ];
          if (shopOption.type) {
            modifierType = shopOption.type;
          }
          // Apply Black Sludge to healing item cost
          const healingItemCost = new NumberHolder(shopOption.cost);
          globalScene.applyModifier(HealShopCostModifier, true, healingItemCost);
          cost = healingItemCost.value;
          break;
      }

      if (cost && money < cost && !Overrides.WAIVE_SHOP_FEES_OVERRIDE) {
        ui.playError();
        return false;
      }

      const applyModifier = (modifier: Modifier, playSound: boolean = false): void => {
        const result = globalScene.addModifier(modifier, false, playSound, undefined, undefined, cost);
        // Queue a copy of this phase when applying a TM or Memory Mushroom.
        // If the player selects either of these, then escapes out of consuming them,
        // they are returned to a shop in the same state.
        if (modifier.type instanceof RememberMoveModifierType || modifier.type instanceof TmModifierType) {
          globalScene.unshiftPhase(this.copy());
        }

        if (cost && !(modifier.type instanceof RememberMoveModifierType)) {
          if (result) {
            if (!Overrides.WAIVE_SHOP_FEES_OVERRIDE) {
              globalScene.money -= cost;
              globalScene.updateMoneyText();
              globalScene.animateMoneyChanged(false);
            }

            globalScene.audioManager.playSound("se/buy");
            ui.getHandler<ModifierSelectUiHandler>().updateCostText();
          } else {
            ui.playError();
          }
        } else {
          ui.clearText();
          ui.setMode(UiMode.MESSAGE);
          super.end();
        }
      };

      if (modifierType instanceof PokemonModifierType) {
        const pokemonModifierType = modifierType as PokemonModifierType;
        const isMoveModifier = modifierType instanceof PokemonMoveModifierType;
        const isTmModifier = modifierType instanceof TmModifierType;
        const isRememberMoveModifier = modifierType instanceof RememberMoveModifierType;
        const isPpRestoreModifier =
          modifierType instanceof PokemonPpRestoreModifierType || modifierType instanceof PokemonPpUpModifierType;
        const partyUiMode = isMoveModifier
          ? PartyUiMode.MOVE_MODIFIER
          : isTmModifier
            ? PartyUiMode.TM_MODIFIER
            : isRememberMoveModifier
              ? PartyUiMode.REMEMBER_MOVE_MODIFIER
              : PartyUiMode.MODIFIER;
        const tmMoveId = isTmModifier ? (modifierType as TmModifierType).moveId : undefined;
        ui.setModeWithoutClear<PartyUiHandler>(
          UiMode.PARTY,
          partyUiMode,
          -1,
          (slotIndex: number, option: PartyOption) => {
            if (slotIndex < 6) {
              ui.setMode<ModifierSelectUiHandler>(UiMode.MODIFIER_SELECT, this.isPlayer()).then(() => {
                const modifier = !isMoveModifier
                  ? !isRememberMoveModifier
                    ? modifierType.newModifier(party[slotIndex])
                    : modifierType.newModifier(party[slotIndex], option as number)
                  : modifierType.newModifier(party[slotIndex], option - PartyOption.MOVE_1);
                applyModifier(modifier!, true); // TODO: is the bang correct?
              });
            } else {
              ui.setMode<ModifierSelectUiHandler>(
                UiMode.MODIFIER_SELECT,
                this.isPlayer(),
                this.typeOptions,
                modifierSelectCallback,
                this.getRerollCost(globalScene.lockModifierTiers),
              );
            }
          },
          pokemonModifierType.selectFilter,
          modifierType instanceof PokemonMoveModifierType
            ? (modifierType as PokemonMoveModifierType).moveSelectFilter
            : undefined,
          tmMoveId,
          isPpRestoreModifier,
        );
      } else {
        if (modifierType) {
          const newModifier = modifierType.newModifier();
          if (newModifier) {
            applyModifier(newModifier);
          }
        }
      }

      return !cost;
    };
    ui.setMode<ModifierSelectUiHandler>(
      UiMode.MODIFIER_SELECT,
      this.isPlayer(),
      this.typeOptions,
      modifierSelectCallback,
      this.getRerollCost(globalScene.lockModifierTiers),
    );
  }

  public updateSeed(): void {
    globalScene.resetSeed();
  }

  public isPlayer(): boolean {
    return true;
  }

  public getRerollCost(lockRarities: boolean): number {
    const multiplier = this.customModifierSettings?.rerollMultiplier ?? 1;
    if (multiplier < 0) {
      // Override reroll cost to -1 to signify there is nothing to reroll
      return -1;
    }

    let baseValue = 0;
    if (Overrides.WAIVE_SHOP_FEES_OVERRIDE) {
      return baseValue;
    } else if (lockRarities) {
      const tierValues = [50, 125, 300, 750, 2000]; // TODO: this should be part of balance files
      for (const opt of this.typeOptions) {
        baseValue += tierValues[opt.type.tier ?? 0];
      }
    } else {
      baseValue = 250; // TODO: this should be part of balance files
    }

    const baseMultiplier = Math.min(
      Math.ceil(globalScene.currentBattle.waveIndex / 10) * baseValue * 2 ** this.rerollCount * multiplier,
      Number.MAX_SAFE_INTEGER,
    );

    // Apply Black Sludge to reroll cost
    const modifiedRerollCost = new NumberHolder(baseMultiplier);
    globalScene.applyModifier(HealShopCostModifier, true, modifiedRerollCost);
    return modifiedRerollCost.value;
  }

  public getPoolType(): ModifierPoolType {
    return ModifierPoolType.PLAYER;
  }

  public getModifierTypeOptions(modifierCount: number): ModifierTypeOption[] {
    return getPlayerModifierTypeOptions(
      modifierCount,
      globalScene.getPlayerParty(),
      globalScene.lockModifierTiers ? this.modifierTiers : undefined,
      this.customModifierSettings,
    );
  }

  protected copy(): SelectModifierPhase {
    return new SelectModifierPhase({
      rerollCount: this.rerollCount,
      modifierTiers: this.modifierTiers,
      customModifierSettings: {
        guaranteedModifierTypeOptions: this.typeOptions,
        rerollMultiplier: this.customModifierSettings?.rerollMultiplier,
        allowLuckUpgrades: false,
      },
      isCopy: true,
    });
  }
}
