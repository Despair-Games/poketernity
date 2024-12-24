import type { PlayerPokemon, PokemonMove } from "#app/field/pokemon";
import type { Pokemon } from "#app/field/pokemon";
import { addBBCodeTextObject, addTextObject, getTextColor, TextStyle } from "#app/ui/text";
import { Command } from "#app/ui/command-ui-handler";
import MessageUiHandler from "#app/ui/message-ui-handler";
import { Mode } from "#app/ui/ui";
import { BooleanHolder, toReadableString, randItem } from "#app/utils";
import { PokemonFormChangeItemModifier, PokemonHeldItemModifier } from "#app/modifier/modifier";
import { allMoves } from "#app/data/move";
import PokemonIconAnimHandler from "#app/ui/pokemon-icon-anim-handler";
import { pokemonEvolutions } from "#app/data/balance/pokemon-evolutions";
import { addWindow } from "#app/ui/ui-theme";
import { SpeciesFormChangeItemTrigger, FormChangeItem } from "#app/data/pokemon-forms";
import { Button } from "#enums/buttons";
import { applyChallenges, ChallengeType } from "#app/data/challenge";
import MoveInfoOverlay from "#app/ui/move-info-overlay";
import i18next from "i18next";
import type BBCodeText from "phaser3-rex-plugins/plugins/bbcodetext";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { getPokemonNameWithAffix } from "#app/messages";
import type { CommandPhase } from "#app/phases/command-phase";
import { SelectModifierPhase } from "#app/phases/select-modifier-phase";
import { globalScene } from "#app/global-scene";
import { determineMoveSource } from "./partyUtils/relearnMoveMode";
import { MoveSource } from "#enums/move-source";
import { PartySlot } from "./partyUtils/classes/party-slot";
import { PartyCancelButton } from "./partyUtils/classes/party-cancel-button";
import { PartyOption, PartyUiMode } from "#app/ui/partyUtils/definitions";
import type {
  PartySelectCallback,
  PartyModifierSpliceSelectCallback,
  PartyModifierTransferSelectCallback,
  PokemonModifierTransferSelectFilter,
  PokemonMoveSelectFilter,
  PokemonSelectFilter,
} from "#app/ui/partyUtils/definitions";
import { getSwitchOption } from "./partyUtils/switchMode";

const defaultMessage = i18next.t("partyUiHandler:choosePokemon");

export default class PartyUiHandler extends MessageUiHandler {
  private partyUiMode: PartyUiMode;
  private fieldIndex: number;

  private partyBg: Phaser.GameObjects.Image;
  private partyContainer: Phaser.GameObjects.Container;
  private partySlotsContainer: Phaser.GameObjects.Container;
  private partySlots: PartySlot[];
  private partyCancelButton: PartyCancelButton;
  private partyMessageBox: Phaser.GameObjects.NineSlice;
  private moveInfoOverlay: MoveInfoOverlay;

  private optionsMode: boolean;
  private optionsScroll: boolean;
  private optionsCursor: number = 0;
  private optionsScrollCursor: number = 0;
  private optionsScrollTotal: number = 0;
  /** This is only public for test/ui/transfer-item.test.ts */
  public optionsContainer: Phaser.GameObjects.Container;
  private optionsBg: Phaser.GameObjects.NineSlice;
  private optionsCursorObj: Phaser.GameObjects.Image | null;
  private options: number[];

  private transferMode: boolean;
  private transferOptionCursor: number;
  private transferCursor: number;
  /** Current quantity selection for every item held by the pokemon selected for the transfer */
  private transferQuantities: number[];
  /** Stack size of every item that the selected pokemon is holding */
  private transferQuantitiesMax: number[];
  /** Whether to transfer all items */
  private transferAll: boolean;

  private lastCursor: number = 0;
  private selectCallback: PartySelectCallback | PartyModifierTransferSelectCallback | null;
  private selectFilter: PokemonSelectFilter | PokemonModifierTransferSelectFilter;
  private moveSelectFilter: PokemonMoveSelectFilter;
  private tmMoveId: Moves;
  private showMovePp: boolean;

  private iconAnimHandler: PokemonIconAnimHandler;

  private blockInput: boolean;

  private static FilterAll = (_pokemon: PlayerPokemon) => null;

  public static FilterNonFainted = (pokemon: PlayerPokemon) => {
    if (pokemon.isFainted()) {
      return i18next.t("partyUiHandler:noEnergy", { pokemonName: getPokemonNameWithAffix(pokemon) });
    }
    return null;
  };

  public static FilterFainted = (pokemon: PlayerPokemon) => {
    if (!pokemon.isFainted()) {
      return i18next.t("partyUiHandler:hasEnergy", { pokemonName: getPokemonNameWithAffix(pokemon) });
    }
    return null;
  };

  /**
   * For consistency reasons, this looks like the above filters. However this is used only internally and is always enforced for switching.
   * @param pokemon The pokemon to check.
   * @returns
   */
  private FilterChallengeLegal = (pokemon: PlayerPokemon) => {
    const challengeAllowed = new BooleanHolder(true);
    applyChallenges(globalScene.gameMode, ChallengeType.POKEMON_IN_BATTLE, pokemon, challengeAllowed);
    if (!challengeAllowed.value) {
      return i18next.t("partyUiHandler:cantBeUsed", { pokemonName: getPokemonNameWithAffix(pokemon) });
    }
    return null;
  };

  private static FilterAllMoves = (_pokemonMove: PokemonMove) => null;

  public static FilterItemMaxStacks = (pokemon: PlayerPokemon, modifier: PokemonHeldItemModifier) => {
    const matchingModifier = globalScene.findModifier(
      (m) => m instanceof PokemonHeldItemModifier && m.pokemonId === pokemon.id && m.matchType(modifier),
    ) as PokemonHeldItemModifier;
    if (matchingModifier && matchingModifier.stackCount === matchingModifier.getMaxStackCount()) {
      return i18next.t("partyUiHandler:tooManyItems", { pokemonName: getPokemonNameWithAffix(pokemon) });
    }
    return null;
  };

  public static NoEffectMessage = i18next.t("partyUiHandler:anyEffect");

  private localizedOptions = [
    PartyOption.SEND_OUT,
    PartyOption.SUMMARY,
    PartyOption.CANCEL,
    PartyOption.APPLY,
    PartyOption.RELEASE,
    PartyOption.TEACH,
    PartyOption.SPLICE,
    PartyOption.UNSPLICE,
    PartyOption.REVIVE,
    PartyOption.TRANSFER,
    PartyOption.UNPAUSE_EVOLUTION,
    PartyOption.PASS_BATON,
    PartyOption.RENAME,
    PartyOption.SELECT,
  ];

  constructor() {
    super(Mode.PARTY);
  }

  setup() {
    const ui = this.getUi();

    const partyContainer = globalScene.add.container(0, 0);
    partyContainer.setName("party");
    partyContainer.setVisible(false);
    ui.add(partyContainer);

    this.partyContainer = partyContainer;

    this.partyBg = globalScene.add.image(0, 0, "party_bg");
    this.partyBg.setName("img-party-bg");
    partyContainer.add(this.partyBg);

    this.partyBg.setOrigin(0, 1);

    const partySlotsContainer = globalScene.add.container(0, 0);
    partySlotsContainer.setName("party-slots");
    partyContainer.add(partySlotsContainer);

    this.partySlotsContainer = partySlotsContainer;

    const partyMessageBoxContainer = globalScene.add.container(0, -32);
    partyMessageBoxContainer.setName("party-msg-box");
    partyContainer.add(partyMessageBoxContainer);

    const partyMessageBox = addWindow(1, 31, 262, 30);
    partyMessageBox.setName("window-party-msg-box");
    partyMessageBox.setOrigin(0, 1);
    partyMessageBoxContainer.add(partyMessageBox);

    this.partyMessageBox = partyMessageBox;

    const partyMessageText = addTextObject(10, 8, defaultMessage, TextStyle.WINDOW, { maxLines: 2 });
    partyMessageText.setName("text-party-msg");

    partyMessageText.setOrigin(0, 0);
    partyMessageBoxContainer.add(partyMessageText);

    this.message = partyMessageText;

    const partyCancelButton = new PartyCancelButton(291, -16);
    partyContainer.add(partyCancelButton);

    this.partyCancelButton = partyCancelButton;

    this.optionsContainer = globalScene.add.container(globalScene.game.canvas.width / 6 - 1, -1);
    partyContainer.add(this.optionsContainer);

    this.iconAnimHandler = new PokemonIconAnimHandler();
    this.iconAnimHandler.setup();

    // prepare move overlay. in case it appears to be too big, set the overlayScale to .5
    const overlayScale = 1;
    this.moveInfoOverlay = new MoveInfoOverlay({
      scale: overlayScale,
      top: true,
      x: 1,
      y: -MoveInfoOverlay.getHeight(overlayScale) - 1,
      width: globalScene.game.canvas.width / 12 - 30,
    });
    ui.add(this.moveInfoOverlay);

    this.options = [];

    this.partySlots = [];
  }

  override show(args: any[]): boolean {
    if (!args.length || this.active) {
      return false;
    }

    super.show(args);

    // reset the infoOverlay
    this.moveInfoOverlay.clear();

    this.partyUiMode = args[0] as PartyUiMode;

    this.fieldIndex = args.length > 1 ? (args[1] as number) : -1;

    this.selectCallback = args.length > 2 && args[2] instanceof Function ? args[2] : undefined;
    this.selectFilter =
      args.length > 3 && args[3] instanceof Function ? (args[3] as PokemonSelectFilter) : PartyUiHandler.FilterAll;
    this.moveSelectFilter =
      args.length > 4 && args[4] instanceof Function
        ? (args[4] as PokemonMoveSelectFilter)
        : PartyUiHandler.FilterAllMoves;
    this.tmMoveId = args.length > 5 && args[5] ? args[5] : Moves.NONE;
    this.showMovePp = args.length > 6 && args[6];

    this.partyContainer.setVisible(true);
    this.partyBg.setTexture(`party_bg${globalScene.currentBattle.double ? "_double" : ""}`);
    this.populatePartySlots();
    this.setCursor(0);

    return true;
  }

  processInput(button: Button): boolean {
    const ui = this.getUi();

    if (this.pendingPrompt || this.blockInput) {
      return false;
    }

    if (this.awaitingActionInput) {
      if ((button === Button.ACTION || button === Button.CANCEL) && this.onActionInput) {
        ui.playSelect();
        const originalOnActionInput = this.onActionInput;
        this.onActionInput = null;
        originalOnActionInput();
        this.awaitingActionInput = false;
        return true;
      }
      return false;
    }

    let success = false;

    if (this.optionsMode) {
      const option = this.options[this.optionsCursor];
      if (button === Button.ACTION) {
        const pokemon = globalScene.getPlayerParty()[this.cursor];
        if (this.partyUiMode === PartyUiMode.MODIFIER_TRANSFER && !this.transferMode && option !== PartyOption.CANCEL) {
          this.startTransfer();

          let ableToTransfer: string;
          for (let p = 0; p < globalScene.getPlayerParty().length; p++) {
            // this for look goes through each of the party pokemon
            const newPokemon = globalScene.getPlayerParty()[p];
            // this next line gets all of the transferable items from pokemon [p]; it does this by getting all the held modifiers that are transferable and checking to see if they belong to pokemon [p]
            const getTransferrableItemsFromPokemon = (newPokemon: PlayerPokemon) =>
              globalScene.findModifiers(
                (m) =>
                  m instanceof PokemonHeldItemModifier
                  && (m as PokemonHeldItemModifier).isTransferable
                  && (m as PokemonHeldItemModifier).pokemonId === newPokemon.id,
              ) as PokemonHeldItemModifier[];
            // this next bit checks to see if the the selected item from the original transfer pokemon exists on the new pokemon [p]; this returns undefined if the new pokemon doesn't have the item at all, otherwise it returns the pokemonHeldItemModifier for that item
            const matchingModifier = globalScene.findModifier(
              (m) =>
                m instanceof PokemonHeldItemModifier
                && m.pokemonId === newPokemon.id
                && m.matchType(getTransferrableItemsFromPokemon(pokemon)[this.transferOptionCursor]),
            ) as PokemonHeldItemModifier;
            const partySlot = this.partySlots.filter((m) => m.getPokemon() === newPokemon)[0]; // this gets pokemon [p] for us
            if (p !== this.transferCursor) {
              // this skips adding the able/not able labels on the pokemon doing the transfer
              if (matchingModifier) {
                // if matchingModifier exists then the item exists on the new pokemon
                if (matchingModifier.getMaxStackCount() === matchingModifier.stackCount) {
                  // checks to see if the stack of items is at max stack; if so, set the description label to "Not able"
                  ableToTransfer = "Not able";
                } else {
                  // if the pokemon isn't at max stack, make the label "Able"
                  ableToTransfer = "Able";
                }
              } else {
                // if matchingModifier doesn't exist, that means the pokemon doesn't have any of the item, and we need to show "Able"
                ableToTransfer = "Able";
              }
            } else {
              // this else relates to the transfer pokemon. We set the text to be blank so there's no "Able"/"Not able" text
              ableToTransfer = "";
            }
            partySlot.slotHpBar.setVisible(false);
            partySlot.slotHpOverlay.setVisible(false);
            partySlot.slotHpText.setVisible(false);
            partySlot.slotDescriptionLabel.setText(ableToTransfer);
            partySlot.slotDescriptionLabel.setVisible(true);
          }

          this.hideOptions();
          ui.playSelect();
          return true;
        } else if (this.partyUiMode === PartyUiMode.REMEMBER_MOVE_MODIFIER && option !== PartyOption.CANCEL) {
          // clear overlay on cancel
          this.moveInfoOverlay.clear();
          const filterResult = (this.selectFilter as PokemonSelectFilter)(pokemon);
          if (filterResult === null) {
            this.selectCallback?.(this.cursor, option);
            this.hideOptions();
          } else {
            this.hideOptions();
            this.showText(filterResult as string, undefined, () => this.showText("", 0), undefined, true);
          }
          ui.playSelect();
          return true;
        } else if (
          (option !== PartyOption.SUMMARY
            && option !== PartyOption.UNPAUSE_EVOLUTION
            && option !== PartyOption.UNSPLICE
            && option !== PartyOption.RELEASE
            && option !== PartyOption.CANCEL
            && option !== PartyOption.RENAME)
          || (option === PartyOption.RELEASE && this.partyUiMode === PartyUiMode.RELEASE)
        ) {
          let filterResult: string | null;
          const getTransferrableItemsFromPokemon = (pokemon: PlayerPokemon) =>
            globalScene.findModifiers(
              (m) => m instanceof PokemonHeldItemModifier && m.isTransferable && m.pokemonId === pokemon.id,
            ) as PokemonHeldItemModifier[];
          if (option !== PartyOption.TRANSFER && option !== PartyOption.SPLICE) {
            filterResult = (this.selectFilter as PokemonSelectFilter)(pokemon);
            if (filterResult === null && (option === PartyOption.SEND_OUT || option === PartyOption.PASS_BATON)) {
              filterResult = this.FilterChallengeLegal(pokemon);
            }
            if (filterResult === null && this.partyUiMode === PartyUiMode.MOVE_MODIFIER) {
              filterResult = this.moveSelectFilter(pokemon.moveset[this.optionsCursor]);
            }
          } else {
            filterResult = (this.selectFilter as PokemonModifierTransferSelectFilter)(
              pokemon,
              getTransferrableItemsFromPokemon(globalScene.getPlayerParty()[this.transferCursor])[
                this.transferOptionCursor
              ],
            );
          }
          if (filterResult === null) {
            if (this.partyUiMode !== PartyUiMode.SPLICE) {
              this.hideOptions();
            }
            if (this.selectCallback && this.partyUiMode !== PartyUiMode.CHECK) {
              if (option === PartyOption.TRANSFER) {
                if (this.transferCursor !== this.cursor) {
                  if (this.transferAll) {
                    getTransferrableItemsFromPokemon(globalScene.getPlayerParty()[this.transferCursor]).forEach(
                      (_, i) =>
                        (this.selectCallback as PartyModifierTransferSelectCallback)(
                          this.transferCursor,
                          i,
                          this.transferQuantitiesMax[i],
                          this.cursor,
                        ),
                    );
                  } else {
                    (this.selectCallback as PartyModifierTransferSelectCallback)(
                      this.transferCursor,
                      this.transferOptionCursor,
                      this.transferQuantities[this.transferOptionCursor],
                      this.cursor,
                    );
                  }
                }
                this.clearTransfer();
              } else if (this.partyUiMode === PartyUiMode.SPLICE) {
                if (option === PartyOption.SPLICE) {
                  (this.selectCallback as PartyModifierSpliceSelectCallback)(this.transferCursor, this.cursor);
                  this.clearTransfer();
                } else {
                  this.startTransfer();
                }
                this.hideOptions();
              } else if (option === PartyOption.RELEASE) {
                this.doRelease(this.cursor);
              } else {
                const selectCallback = this.selectCallback;
                this.selectCallback = null;
                selectCallback(this.cursor, option);
              }
            } else {
              if (
                option >= PartyOption.FORM_CHANGE_ITEM
                && globalScene.getCurrentPhase() instanceof SelectModifierPhase
              ) {
                if (this.partyUiMode === PartyUiMode.CHECK) {
                  const formChangeItemModifiers = this.getFormChangeItemsModifiers(pokemon);
                  const modifier = formChangeItemModifiers[option - PartyOption.FORM_CHANGE_ITEM];
                  modifier.active = !modifier.active;
                  globalScene.triggerPokemonFormChange(pokemon, SpeciesFormChangeItemTrigger, false, true);
                }
              } else if (this.cursor) {
                (globalScene.getCurrentPhase() as CommandPhase).handleCommand(
                  Command.POKEMON,
                  this.cursor,
                  option === PartyOption.PASS_BATON,
                );
              }
            }
            if (
              this.partyUiMode !== PartyUiMode.MODIFIER
              && this.partyUiMode !== PartyUiMode.TM_MODIFIER
              && this.partyUiMode !== PartyUiMode.MOVE_MODIFIER
            ) {
              ui.playSelect();
            }
            return true;
          } else {
            this.hideOptions();
            this.showText(filterResult as string, undefined, () => this.showText("", 0), undefined, true);
          }
        } else if (option === PartyOption.SUMMARY) {
          ui.playSelect();
          ui.setModeWithoutClear(Mode.SUMMARY, pokemon).then(() => this.hideOptions());
          return true;
        } else if (option === PartyOption.UNPAUSE_EVOLUTION) {
          this.hideOptions();
          ui.playSelect();
          pokemon.pauseEvolutions = !pokemon.pauseEvolutions;
          this.showText(
            i18next.t(
              pokemon.pauseEvolutions ? "partyUiHandler:pausedEvolutions" : "partyUiHandler:unpausedEvolutions",
              { pokemonName: getPokemonNameWithAffix(pokemon) },
            ),
            undefined,
            () => this.showText("", 0),
            null,
            true,
          );
        } else if (option === PartyOption.UNSPLICE) {
          this.hideOptions();
          ui.playSelect();
          this.showText(
            i18next.t("partyUiHandler:unspliceConfirmation", {
              fusionName: pokemon.fusionSpecies?.name,
              pokemonName: pokemon.name,
            }),
            null,
            () => {
              ui.setModeWithoutClear(
                Mode.CONFIRM,
                () => {
                  const fusionName = pokemon.name;
                  pokemon.unfuse().then(() => {
                    this.clearPartySlots();
                    this.populatePartySlots();
                    ui.setMode(Mode.PARTY);
                    this.showText(
                      i18next.t("partyUiHandler:wasReverted", { fusionName: fusionName, pokemonName: pokemon.name }),
                      undefined,
                      () => {
                        ui.setMode(Mode.PARTY);
                        this.showText("", 0);
                      },
                      null,
                      true,
                    );
                  });
                },
                () => {
                  ui.setMode(Mode.PARTY);
                  this.showText("", 0);
                },
              );
            },
          );
        } else if (option === PartyOption.RELEASE) {
          this.hideOptions();
          ui.playSelect();
          if (this.cursor >= globalScene.currentBattle.getBattlerCount() || !pokemon.isAllowedInBattle()) {
            this.blockInput = true;
            this.showText(
              i18next.t("partyUiHandler:releaseConfirmation", { pokemonName: getPokemonNameWithAffix(pokemon) }),
              null,
              () => {
                this.blockInput = false;
                ui.setModeWithoutClear(
                  Mode.CONFIRM,
                  () => {
                    ui.setMode(Mode.PARTY);
                    this.doRelease(this.cursor);
                  },
                  () => {
                    ui.setMode(Mode.PARTY);
                    this.showText("", 0);
                  },
                );
              },
            );
          } else {
            this.showText(i18next.t("partyUiHandler:releaseInBattle"), null, () => this.showText("", 0), null, true);
          }
          return true;
        } else if (option === PartyOption.RENAME) {
          this.hideOptions();
          ui.playSelect();
          ui.setModeWithoutClear(
            Mode.RENAME_POKEMON,
            {
              buttonActions: [
                (nickname: string) => {
                  ui.playSelect();
                  pokemon.nickname = nickname;
                  pokemon.updateInfo();
                  this.clearPartySlots();
                  this.populatePartySlots();
                  ui.setMode(Mode.PARTY);
                },
                () => {
                  ui.setMode(Mode.PARTY);
                },
              ],
            },
            pokemon,
          );
          return true;
        } else if (option === PartyOption.CANCEL) {
          return this.processInput(Button.CANCEL);
        } else if (option === PartyOption.SELECT) {
          ui.playSelect();
          return true;
        }
      } else if (button === Button.CANCEL) {
        this.hideOptions();
        ui.playSelect();
        return true;
      } else {
        switch (button) {
          case Button.LEFT:
            /** Decrease quantity for the current item and update UI */
            if (this.partyUiMode === PartyUiMode.MODIFIER_TRANSFER) {
              this.transferQuantities[option] =
                this.transferQuantities[option] === 1
                  ? this.transferQuantitiesMax[option]
                  : this.transferQuantities[option] - 1;
              this.updateOptions();
              success = this.setCursor(
                this.optionsCursor,
              ); /** Place again the cursor at the same position. Necessary, otherwise the cursor disappears */
            }
            break;
          case Button.RIGHT:
            /** Increase quantity for the current item and update UI */
            if (this.partyUiMode === PartyUiMode.MODIFIER_TRANSFER) {
              this.transferQuantities[option] =
                this.transferQuantities[option] === this.transferQuantitiesMax[option]
                  ? 1
                  : this.transferQuantities[option] + 1;
              this.updateOptions();
              success = this.setCursor(
                this.optionsCursor,
              ); /** Place again the cursor at the same position. Necessary, otherwise the cursor disappears */
            }
            break;
          case Button.UP:
            /** If currently selecting items to transfer, reset quantity selection */
            if (this.partyUiMode === PartyUiMode.MODIFIER_TRANSFER) {
              if (option !== PartyOption.ALL) {
                this.transferQuantities[option] = this.transferQuantitiesMax[option];
              }
              this.updateOptions();
            }
            success = this.setCursor(
              this.optionsCursor ? this.optionsCursor - 1 : this.options.length - 1,
            ); /** Move cursor */
            break;
          case Button.DOWN:
            /** If currently selecting items to transfer, reset quantity selection */
            if (this.partyUiMode === PartyUiMode.MODIFIER_TRANSFER) {
              if (option !== PartyOption.ALL) {
                this.transferQuantities[option] = this.transferQuantitiesMax[option];
              }
              this.updateOptions();
            }
            success = this.setCursor(
              this.optionsCursor < this.options.length - 1 ? this.optionsCursor + 1 : 0,
            ); /** Move cursor */
            break;
        }

        // show move description
        if (this.partyUiMode === PartyUiMode.REMEMBER_MOVE_MODIFIER) {
          const option = this.options[this.optionsCursor];
          const move = allMoves[option];
          if (move) {
            this.moveInfoOverlay.show(move);
          } else {
            // or hide the overlay, in case it's the cancel button
            this.moveInfoOverlay.clear();
          }
        }
      }
    } else {
      if (button === Button.ACTION) {
        if (this.cursor < 6) {
          if (this.partyUiMode === PartyUiMode.MODIFIER_TRANSFER && !this.transferMode) {
            /** Initialize item quantities for the selected Pokemon */
            const itemModifiers = globalScene.findModifiers(
              (m) =>
                m instanceof PokemonHeldItemModifier
                && m.isTransferable
                && m.pokemonId === globalScene.getPlayerParty()[this.cursor].id,
            ) as PokemonHeldItemModifier[];
            this.transferQuantities = itemModifiers.map((item) => item.getStackCount());
            this.transferQuantitiesMax = itemModifiers.map((item) => item.getStackCount());
          }
          this.showOptions();
          ui.playSelect();
        } else if (
          this.partyUiMode === PartyUiMode.FORCED_SWITCH
          || this.partyUiMode === PartyUiMode.REVIVAL_BLESSING
        ) {
          ui.playError();
        } else {
          return this.processInput(Button.CANCEL);
        }
        return true;
      } else if (button === Button.CANCEL) {
        if (
          (this.partyUiMode === PartyUiMode.MODIFIER_TRANSFER || this.partyUiMode === PartyUiMode.SPLICE)
          && this.transferMode
        ) {
          this.clearTransfer();
          ui.playSelect();
        } else if (
          this.partyUiMode !== PartyUiMode.FORCED_SWITCH
          && this.partyUiMode !== PartyUiMode.REVIVAL_BLESSING
        ) {
          if (this.selectCallback) {
            const selectCallback = this.selectCallback;
            this.selectCallback = null;
            selectCallback(6, PartyOption.CANCEL);
            ui.playSelect();
          } else {
            ui.setMode(Mode.COMMAND, this.fieldIndex);
            ui.playSelect();
          }
        }

        return true;
      }

      const slotCount = this.partySlots.length;
      const battlerCount = globalScene.currentBattle.getBattlerCount();

      switch (button) {
        case Button.UP:
          success = this.setCursor(this.cursor ? (this.cursor < 6 ? this.cursor - 1 : slotCount - 1) : 6);
          break;
        case Button.DOWN:
          success = this.setCursor(this.cursor < 6 ? (this.cursor < slotCount - 1 ? this.cursor + 1 : 6) : 0);
          break;
        case Button.LEFT:
          if (this.cursor >= battlerCount && this.cursor <= 6) {
            success = this.setCursor(0);
          }
          break;
        case Button.RIGHT:
          if (slotCount === battlerCount) {
            success = this.setCursor(6);
            break;
          } else if (battlerCount >= 2 && slotCount > battlerCount && this.getCursor() === 0 && this.lastCursor === 1) {
            success = this.setCursor(2);
            break;
          } else if (slotCount > battlerCount && this.cursor < battlerCount) {
            success = this.setCursor(this.lastCursor < 6 ? this.lastCursor || battlerCount : battlerCount);
            break;
          }
      }
    }

    if (success) {
      ui.playSelect();
    }

    return success;
  }

  populatePartySlots() {
    const party = globalScene.getPlayerParty();

    if (this.cursor < 6 && this.cursor >= party.length) {
      this.cursor = party.length - 1;
    } else if (this.cursor === 6) {
      this.partyCancelButton.select();
    }
    if (this.lastCursor < 6 && this.lastCursor >= party.length) {
      this.lastCursor = party.length - 1;
    }

    for (const p in party) {
      const slotIndex = parseInt(p);
      const partySlot = new PartySlot(slotIndex, party[p], this.iconAnimHandler, this.partyUiMode, this.tmMoveId);
      globalScene.add.existing(partySlot);
      this.partySlotsContainer.add(partySlot);
      this.partySlots.push(partySlot);
      if (this.cursor === slotIndex) {
        partySlot.select();
      }
    }
  }

  override setCursor(cursor: number): boolean {
    let changed: boolean;

    if (this.optionsMode) {
      changed = this.optionsCursor !== cursor;
      let isScroll = false;
      if (changed && this.optionsScroll) {
        if (Math.abs(cursor - this.optionsCursor) === this.options.length - 1) {
          this.optionsScrollCursor = cursor ? this.optionsScrollTotal - 8 : 0;
          this.updateOptions();
        } else {
          const isDown = cursor && cursor > this.optionsCursor;
          if (isDown) {
            if (this.options[cursor] === PartyOption.SCROLL_DOWN) {
              isScroll = true;
              this.optionsScrollCursor++;
            }
          } else {
            if (!cursor && this.optionsScrollCursor) {
              isScroll = true;
              this.optionsScrollCursor--;
            }
          }
          if (isScroll && this.optionsScrollCursor === 1) {
            this.optionsScrollCursor += isDown ? 1 : -1;
          }
        }
      }
      if (isScroll) {
        this.updateOptions();
      } else {
        this.optionsCursor = cursor;
      }
      if (!this.optionsCursorObj) {
        this.optionsCursorObj = globalScene.add.image(0, 0, "cursor");
        this.optionsCursorObj.setOrigin(0, 0);
        this.optionsContainer.add(this.optionsCursorObj);
      }
      this.optionsCursorObj.setPosition(
        8 - this.optionsBg.displayWidth,
        -19 - 16 * (this.options.length - 1 - this.optionsCursor),
      );
    } else {
      changed = this.cursor !== cursor;
      if (changed) {
        this.lastCursor = this.cursor;
        this.cursor = cursor;
        if (this.lastCursor < 6) {
          this.partySlots[this.lastCursor].deselect();
        } else if (this.lastCursor === 6) {
          this.partyCancelButton.deselect();
        }
        if (cursor < 6) {
          this.partySlots[cursor].select();
        } else if (cursor === 6) {
          this.partyCancelButton.select();
        }
      }
    }

    return changed;
  }

  override showText(
    text: string,
    delay?: number | null,
    callback?: Function | null,
    callbackDelay?: number | null,
    prompt?: boolean | null,
    promptDelay?: number | null,
  ) {
    if (text.length === 0) {
      text = defaultMessage;
    }

    if (text?.indexOf("\n") === -1) {
      this.partyMessageBox.setSize(262, 30);
      this.message.setY(10);
    } else {
      this.partyMessageBox.setSize(262, 42);
      this.message.setY(-5);
    }

    super.showText(text, delay, callback, callbackDelay, prompt, promptDelay);
  }

  showOptions() {
    if (this.cursor === 6) {
      return;
    }

    this.optionsMode = true;

    let optionsMessage: string;

    switch (this.partyUiMode) {
      case PartyUiMode.MOVE_MODIFIER:
        optionsMessage = i18next.t("partyUiHandler:selectAMove");
        break;
      case PartyUiMode.MODIFIER_TRANSFER:
        if (!this.transferMode) {
          optionsMessage = i18next.t("partyUiHandler:changeQuantity");
        }
        /** When an item is being selected for transfer, the message box is taller as the message occupies two lines */
        this.partyMessageBox.setSize(262 - Math.max(this.optionsBg.displayWidth - 56, 0), 42);
        break;
      case PartyUiMode.SPLICE:
        if (!this.transferMode) {
          optionsMessage = i18next.t("partyUiHandler:selectAnotherPokemonToSplice");
        }
        break;
      default:
        optionsMessage = i18next.t("partyUiHandler:doWhatWithThisPokemon");
        break;
    }

    this.showText(optionsMessage!, 0);

    this.updateOptions();

    /** When an item is being selected for transfer, the message box is taller as the message occupies two lines */
    if (this.partyUiMode !== PartyUiMode.MODIFIER_TRANSFER) {
      this.partyMessageBox.setSize(262 - Math.max(this.optionsBg.displayWidth - 56, 0), 30);
    }
    this.setCursor(0);
  }

  clearOptions(): void {
    this.options.splice(0, this.options.length);
    this.optionsContainer.removeAll(true);
    this.eraseOptionsCursor();
  }

  retrieveOptions(pokemon: Pokemon) {
    switch (this.partyUiMode) {
      case PartyUiMode.REMEMBER_MOVE_MODIFIER:
        const learnableLevelMoves = pokemon.getLearnableLevelMoves();
        this.options.push(...learnableLevelMoves);
        if (this.options.length > 0) {
          this.moveInfoOverlay.show(allMoves[learnableLevelMoves[0]]);
        }
        return;
    }
  }

  updateOptions(): void {
    if (this.options.length > 0) {
      this.clearOptions();
    }

    const pokemon = globalScene.getPlayerParty()[this.cursor];

    if (this.partyUiMode === PartyUiMode.REMEMBER_MOVE_MODIFIER) {
      const learnableLevelMoves = pokemon.getLearnableLevelMoves();
      this.options.push(...learnableLevelMoves);
      if (this.options.length > 0) {
        this.moveInfoOverlay.show(allMoves[learnableLevelMoves[this.cursor]]);
      }
      this.optionsScrollTotal = this.options.length;
      let optionStartIndex = this.optionsScrollCursor;
      let optionEndIndex = Math.min(
        this.optionsScrollTotal,
        optionStartIndex + (!optionStartIndex || this.optionsScrollCursor + 8 >= this.optionsScrollTotal ? 8 : 7),
      );

      this.optionsScroll = this.optionsScrollTotal > 9;

      if (this.optionsScroll) {
        this.options.splice(optionEndIndex, this.optionsScrollTotal);
        this.options.splice(0, optionStartIndex);
        if (optionStartIndex) {
          this.options.unshift(PartyOption.SCROLL_UP);
        }
        if (optionEndIndex < this.optionsScrollTotal) {
          this.options.push(PartyOption.SCROLL_DOWN);
        }
      }
      this.options.push(PartyOption.CANCEL);
      this.optionsBg = addWindow(0, 0, 0, 16 * this.options.length + 13);
      this.optionsBg.setOrigin(1, 1);

      this.optionsContainer.add(this.optionsBg);

      optionStartIndex = 0;
      optionEndIndex = this.options.length;

      let widestOptionWidth = 0;
      const optionTexts: BBCodeText[] = [];

      for (let o = optionStartIndex; o < optionEndIndex; o++) {
        const option = this.options[this.options.length - (o + 1)];
        // let altTextColor = false;
        let optionName: string = "";
        if ([PartyOption.CANCEL, PartyOption.SCROLL_UP, PartyOption.SCROLL_DOWN].includes(option)) {
          optionName = this.getPartyOptionName(option);
        } else {
          optionName = allMoves[option].name;
          const moveSource = determineMoveSource(pokemon, allMoves[option].id);
          if (moveSource !== MoveSource.LEVEL_UP) {
            // altTextColor = true;
          }
        }
        const yCoord = -6 - 16 * o;
        const optionText = addBBCodeTextObject(0, yCoord - 16, optionName, TextStyle.WINDOW, { maxLines: 1 });
        optionText.setOrigin(0, 0);
        optionText.setText(`[shadow]${optionText.text}[/shadow]`);

        optionTexts.push(optionText);

        widestOptionWidth = Math.max(optionText.displayWidth, widestOptionWidth);

        this.optionsContainer.add(optionText);
      }

      this.optionsBg.width = Math.max(widestOptionWidth + 24, 94);
      for (const optionText of optionTexts) {
        optionText.x = 15 - this.optionsBg.width;
      }
      return;
    }

    const itemModifiers =
      this.partyUiMode === PartyUiMode.MODIFIER_TRANSFER
        ? (globalScene.findModifiers(
            (m) => m instanceof PokemonHeldItemModifier && m.isTransferable && m.pokemonId === pokemon.id,
          ) as PokemonHeldItemModifier[])
        : [];

    let formChangeItemModifiers: PokemonFormChangeItemModifier[] | undefined;

    if (
      this.partyUiMode !== PartyUiMode.MOVE_MODIFIER
      && (this.transferMode || this.partyUiMode !== PartyUiMode.MODIFIER_TRANSFER)
    ) {
      switch (this.partyUiMode) {
        case PartyUiMode.SWITCH:
        case PartyUiMode.FORCED_SWITCH:
        case PartyUiMode.POST_BATTLE_SWITCH:
          getSwitchOption(this.partyUiMode);
          break;
        case PartyUiMode.REVIVAL_BLESSING:
          this.options.push(PartyOption.REVIVE);
          break;
        case PartyUiMode.MODIFIER:
          this.options.push(PartyOption.APPLY);
          break;
        case PartyUiMode.TM_MODIFIER:
          this.options.push(PartyOption.TEACH);
          break;
        case PartyUiMode.MODIFIER_TRANSFER:
          this.options.push(PartyOption.TRANSFER);
          break;
        case PartyUiMode.SPLICE:
          if (this.transferMode) {
            if (this.cursor !== this.transferCursor) {
              this.options.push(PartyOption.SPLICE);
            }
          } else {
            this.options.push(PartyOption.APPLY);
          }
          break;
        case PartyUiMode.RELEASE:
          this.options.push(PartyOption.RELEASE);
          break;
        case PartyUiMode.CHECK:
          if (globalScene.getCurrentPhase() instanceof SelectModifierPhase) {
            formChangeItemModifiers = this.getFormChangeItemsModifiers(pokemon);
            for (let i = 0; i < formChangeItemModifiers.length; i++) {
              this.options.push(PartyOption.FORM_CHANGE_ITEM + i);
            }
          }
          break;
        case PartyUiMode.SELECT:
          this.options.push(PartyOption.SELECT);
          break;
      }

      this.options.push(PartyOption.SUMMARY);
      this.options.push(PartyOption.RENAME);

      if (
        pokemonEvolutions.hasOwnProperty(pokemon.species.speciesId)
        || (pokemon.isFusion()
          && pokemon.fusionSpecies
          && pokemonEvolutions.hasOwnProperty(pokemon.fusionSpecies.speciesId))
      ) {
        this.options.push(PartyOption.UNPAUSE_EVOLUTION);
      }

      if (this.partyUiMode === PartyUiMode.SWITCH) {
        if (pokemon.isFusion()) {
          this.options.push(PartyOption.UNSPLICE);
        }
        this.options.push(PartyOption.RELEASE);
      } else if (this.partyUiMode === PartyUiMode.SPLICE && pokemon.isFusion()) {
        this.options.push(PartyOption.UNSPLICE);
      }
    } else if (this.partyUiMode === PartyUiMode.MOVE_MODIFIER) {
      for (let m = 0; m < pokemon.moveset.length; m++) {
        this.options.push(PartyOption.MOVE_1 + m);
      }
    } else {
      for (let im = 0; im < itemModifiers.length; im++) {
        this.options.push(im);
      }
      if (itemModifiers.length > 1) {
        this.options.push(PartyOption.ALL);
      }
    }

    this.optionsScrollTotal = this.options.length;
    let optionStartIndex = this.optionsScrollCursor;
    let optionEndIndex = Math.min(
      this.optionsScrollTotal,
      optionStartIndex + (!optionStartIndex || this.optionsScrollCursor + 8 >= this.optionsScrollTotal ? 8 : 7),
    );

    this.optionsScroll = this.optionsScrollTotal > 9;

    if (this.optionsScroll) {
      this.options.splice(optionEndIndex, this.optionsScrollTotal);
      this.options.splice(0, optionStartIndex);
      if (optionStartIndex) {
        this.options.unshift(PartyOption.SCROLL_UP);
      }
      if (optionEndIndex < this.optionsScrollTotal) {
        this.options.push(PartyOption.SCROLL_DOWN);
      }
    }

    this.options.push(PartyOption.CANCEL);

    this.optionsBg = addWindow(0, 0, 0, 16 * this.options.length + 13);
    this.optionsBg.setOrigin(1, 1);

    this.optionsContainer.add(this.optionsBg);

    optionStartIndex = 0;
    optionEndIndex = this.options.length;

    let widestOptionWidth = 0;
    const optionTexts: BBCodeText[] = [];

    for (let o = optionStartIndex; o < optionEndIndex; o++) {
      const option = this.options[this.options.length - (o + 1)];
      const altText = false;
      let optionName: string;
      if (option === PartyOption.SCROLL_UP) {
        optionName = "↑";
      } else if (option === PartyOption.SCROLL_DOWN) {
        optionName = "↓";
      } else if (
        this.partyUiMode !== PartyUiMode.MODIFIER_TRANSFER
        || this.transferMode
        || option === PartyOption.CANCEL
      ) {
        switch (option) {
          case PartyOption.MOVE_1:
          case PartyOption.MOVE_2:
          case PartyOption.MOVE_3:
          case PartyOption.MOVE_4:
            const move = pokemon.moveset[option - PartyOption.MOVE_1];
            if (this.showMovePp) {
              const maxPP = move.getMovePp();
              const currPP = maxPP - move.ppUsed;
              optionName = `${move.getName()} ${currPP}/${maxPP}`;
            } else {
              optionName = move.getName();
            }
            break;
          default:
            if (formChangeItemModifiers && option >= PartyOption.FORM_CHANGE_ITEM) {
              const modifier = formChangeItemModifiers[option - PartyOption.FORM_CHANGE_ITEM];
              optionName = `${modifier.active ? i18next.t("partyUiHandler:DEACTIVATE") : i18next.t("partyUiHandler:ACTIVATE")} ${modifier.type.name}`;
            } else if (option === PartyOption.UNPAUSE_EVOLUTION) {
              optionName = `${pokemon.pauseEvolutions ? i18next.t("partyUiHandler:UNPAUSE_EVOLUTION") : i18next.t("partyUiHandler:PAUSE_EVOLUTION")}`;
            } else {
              if (this.localizedOptions.includes(option)) {
                optionName = i18next.t(`partyUiHandler:${PartyOption[option]}`);
              } else {
                optionName = toReadableString(PartyOption[option]);
              }
            }
            break;
        }
      } else if (option === PartyOption.ALL) {
        optionName = i18next.t("partyUiHandler:ALL");
      } else {
        const itemModifier = itemModifiers[option];
        optionName = itemModifier.type.name;
      }

      const yCoord = -6 - 16 * o;
      const optionText = addBBCodeTextObject(0, yCoord - 16, optionName, TextStyle.WINDOW, { maxLines: 1 });
      if (altText) {
        optionText.setColor("#40c8f8");
        optionText.setShadowColor("#006090");
      }
      optionText.setOrigin(0, 0);

      /** For every item that has stack bigger than 1, display the current quantity selection */
      const itemModifier = itemModifiers[option];
      if (
        this.partyUiMode === PartyUiMode.MODIFIER_TRANSFER
        && this.transferQuantitiesMax[option] > 1
        && !this.transferMode
        && itemModifier !== undefined
        && itemModifier.type.name === optionName
      ) {
        let amountText = ` (${this.transferQuantities[option]})`;

        /** If the amount held is the maximum, display the count in red */
        if (this.transferQuantitiesMax[option] === itemModifier.getMaxHeldItemCount(undefined)) {
          amountText = `[color=${getTextColor(TextStyle.SUMMARY_RED)}]${amountText}[/color]`;
        }

        optionText.setText(optionName + amountText);
      }

      optionText.setText(`[shadow]${optionText.text}[/shadow]`);

      optionTexts.push(optionText);

      widestOptionWidth = Math.max(optionText.displayWidth, widestOptionWidth);

      this.optionsContainer.add(optionText);
    }

    this.optionsBg.width = Math.max(widestOptionWidth + 24, 94);
    for (const optionText of optionTexts) {
      optionText.x = 15 - this.optionsBg.width;
    }
  }

  getPartyOptionName(option: PartyOption): string {
    switch (option) {
      case PartyOption.SCROLL_UP:
        return "↑";
      case PartyOption.SCROLL_DOWN:
        return "↓";
      default:
        return i18next.t(`partyUiHandler:${PartyOption[option]}`);
    }
  }

  startTransfer(): void {
    this.transferMode = true;
    this.transferCursor = this.cursor;
    this.transferOptionCursor = this.getOptionsCursorWithScroll();
    this.transferAll = this.options[this.optionsCursor] === PartyOption.ALL;

    this.partySlots[this.transferCursor].setTransfer(true);
  }

  clearTransfer(): void {
    this.transferMode = false;
    this.transferAll = false;
    this.partySlots[this.transferCursor].setTransfer(false);
    for (let i = 0; i < this.partySlots.length; i++) {
      this.partySlots[i].slotDescriptionLabel.setVisible(false);
      this.partySlots[i].slotHpBar.setVisible(true);
      this.partySlots[i].slotHpOverlay.setVisible(true);
      this.partySlots[i].slotHpText.setVisible(true);
    }
  }

  doRelease(slotIndex: number): void {
    this.showText(
      this.getReleaseMessage(getPokemonNameWithAffix(globalScene.getPlayerParty()[slotIndex])),
      null,
      () => {
        this.clearPartySlots();
        globalScene.removePartyMemberModifiers(slotIndex);
        const releasedPokemon = globalScene.getPlayerParty().splice(slotIndex, 1)[0];
        releasedPokemon.destroy();
        this.populatePartySlots();
        if (this.cursor >= globalScene.getPlayerParty().length) {
          this.setCursor(this.cursor - 1);
        }
        if (this.partyUiMode === PartyUiMode.RELEASE) {
          const selectCallback = this.selectCallback;
          this.selectCallback = null;
          selectCallback && selectCallback(this.cursor, PartyOption.RELEASE);
        }
        this.showText("", 0);
      },
      null,
      true,
    );
  }

  /**
   * This selects a random message to display when a player releases a Pokemon
   * @param pokemonName
   * @returns string containing the farewell message
   */
  getReleaseMessage(pokemonName: string): string {
    const goodbyeKeys = [
      "partyUiHandler:goodbye",
      "partyUiHandler:byebye",
      "partyUiHandler:farewell",
      "partyUiHandler:soLong",
      "partyUiHandler:thisIsWhereWePart",
      "partyUiHandler:illMissYou",
      "partyUiHandler:illNeverForgetYou",
      "partyUiHandler:untilWeMeetAgain",
      "partyUiHandler:sayonara",
      "partyUiHandler:smellYaLater",
    ];
    return i18next.t(randItem(goodbyeKeys), { pokemonName: pokemonName });
  }

  getFormChangeItemsModifiers(pokemon: Pokemon) {
    let formChangeItemModifiers = globalScene.findModifiers(
      (m) => m instanceof PokemonFormChangeItemModifier && m.pokemonId === pokemon.id,
    ) as PokemonFormChangeItemModifier[];
    const ultraNecrozmaModifiers = formChangeItemModifiers.filter(
      (m) => m.active && m.formChangeItem === FormChangeItem.ULTRANECROZIUM_Z,
    );
    if (ultraNecrozmaModifiers.length > 0) {
      // ULTRANECROZIUM_Z is active and deactivating it should be the only option
      return ultraNecrozmaModifiers;
    }
    if (formChangeItemModifiers.find((m) => m.active)) {
      // a form is currently active. the user has to disable the form or activate ULTRANECROZIUM_Z
      formChangeItemModifiers = formChangeItemModifiers.filter(
        (m) => m.active || m.formChangeItem === FormChangeItem.ULTRANECROZIUM_Z,
      );
    } else if (pokemon.species.speciesId === Species.NECROZMA) {
      // no form is currently active. the user has to activate some form, except ULTRANECROZIUM_Z
      formChangeItemModifiers = formChangeItemModifiers.filter(
        (m) => m.formChangeItem !== FormChangeItem.ULTRANECROZIUM_Z,
      );
    }
    return formChangeItemModifiers;
  }

  getOptionsCursorWithScroll(): number {
    return (
      this.optionsCursor
      + this.optionsScrollCursor
      + (this.options && this.options[0] === PartyOption.SCROLL_UP ? -1 : 0)
    );
  }

  hideOptions() {
    // hide the overlay
    this.moveInfoOverlay.clear();
    this.optionsMode = false;
    this.optionsScroll = false;
    this.optionsScrollCursor = 0;
    this.optionsScrollTotal = 0;
    this.options.splice(0, this.options.length);
    this.optionsContainer.removeAll(true);
    this.eraseOptionsCursor();

    this.partyMessageBox.setSize(262, 30);
    this.showText("", 0);
  }

  eraseOptionsCursor() {
    if (this.optionsCursorObj) {
      this.optionsCursorObj.destroy();
    }
    this.optionsCursorObj = null;
  }

  override clear() {
    super.clear();
    // hide the overlay
    this.moveInfoOverlay.clear();
    this.partyContainer.setVisible(false);
    this.clearPartySlots();
  }

  clearPartySlots() {
    this.partySlots.splice(0, this.partySlots.length);
    this.partySlotsContainer.removeAll(true);
  }
}
