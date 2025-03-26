import { allMoves } from "#app/data/data-lists";
import { initMoveAnim } from "#app/data/init/init-move-anim";
import type { Move } from "#app/data/moves/move";
import { SpeciesFormChangeMoveLearnedTrigger } from "#app/data/species-form-change-triggers/species-form-change-move-learned-trigger";
import { type Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import Overrides from "#app/overrides";
import { PlayerPartyMemberPokemonPhase } from "#app/phases/abstract-player-party-member-pokemon-phase";
import { type SelectModifierPhase } from "#app/phases/select-modifier-phase";
import type { ConfirmUiHandler } from "#app/ui/handlers/confirm-ui-handler";
import { FormChangeSceneUiHandler } from "#app/ui/handlers/form-change-scene-ui-handler";
import type { MessageUiHandler } from "#app/ui/handlers/message-ui-handler";
import type { SummaryUiHandler } from "#app/ui/handlers/summary-ui-handler";
import type { ConfirmModeConfig } from "#app/ui/interfaces/confirm-menu-config";
import { loadMoveAnimAssets } from "#app/utils/move-anim-utils";
import { LearnMoveType } from "#enums/learn-move-type";
import { MoveId } from "#enums/move-id";
import { PhaseId } from "#enums/phase-id";
import { SummaryUiMode } from "#enums/summary-ui-mode";
import { UiMode } from "#enums/ui-mode";
import i18next from "i18next";

export class LearnMovePhase extends PlayerPartyMemberPokemonPhase {
  override readonly id = PhaseId.LEARN_MOVE;

  private readonly moveId: MoveId;
  private messageMode: UiMode;
  private readonly learnMoveType: LearnMoveType;
  private readonly cost: number;

  constructor(
    partyMemberIndex: number,
    moveId: MoveId,
    learnMoveType: LearnMoveType = LearnMoveType.LEARN_MOVE,
    cost: number = -1,
  ) {
    super(partyMemberIndex);

    this.moveId = moveId;
    this.learnMoveType = learnMoveType;
    this.cost = cost;
  }

  public override start(): void {
    super.start();

    const { ui } = globalScene;
    const pokemon = this.getPokemon();

    // This should never happen, but if there is no Pokemon learning the move, exit now to avoid crashes.
    if (!pokemon) {
      console.error("Pokemon is missing from LearnMovePhase!");
      return this.end();
    }

    const move = allMoves.get(this.moveId);
    const currentMoveset = pokemon.getMoveset();

    // The game first checks if the Pokemon already has the move and ends the phase if it does.
    const hasMoveAlready = currentMoveset.some((m) => m.moveId === move.id) && this.moveId !== MoveId.SKETCH;
    if (hasMoveAlready) {
      return this.end();
    }

    this.messageMode = ui.getHandler() instanceof FormChangeSceneUiHandler ? UiMode.FORM_CHANGE_SCENE : UiMode.MESSAGE;
    ui.setMode<MessageUiHandler>(this.messageMode);

    // If the Pokemon has less than 4 moves, the new move is added to the largest empty moveset index
    // If it has 4 moves, the phase then checks if the player wants to replace the move itself.
    if (currentMoveset.length < 4) {
      this.learnMove(currentMoveset.length, move, pokemon);
    } else {
      this.replaceMoveCheck(move, pokemon);
    }
  }

  /**
   * This displays a chain of messages (listed below) and asks if the user wishes to forget a move.
   *
   * ```markdown
   * > [Pokemon] wants to learn the move [MoveName]
   * > However, [Pokemon] already knows four moves.
   * > Should a move be forgotten and replaced with [MoveName]? --> `Mode.CONFIRM`
   * ```
   * - Yes: Go to {@linkcode forgetMoveProcess()}
   * - No: Go to {@linkcode rejectMoveAndEnd()}
   * @param move The Move to be learned
   * @param Pokemon The Pokemon learning the move
   */
  protected async replaceMoveCheck(move: Move, pokemon: Pokemon): Promise<void> {
    const { ui } = globalScene;

    const learnMovePrompt = i18next.t("battle:learnMovePrompt", {
      pokemonName: getPokemonNameWithAffix(pokemon),
      moveName: move.name,
    });
    const moveLimitReached = i18next.t("battle:learnMoveLimitReached", {
      pokemonName: getPokemonNameWithAffix(pokemon),
    });
    const shouldReplaceQ = i18next.t("battle:learnMoveReplaceQuestion", { moveName: move.name });
    const preQText = [learnMovePrompt, moveLimitReached].join("$");

    await ui.showTextPromise(preQText);
    await ui.showTextPromise(shouldReplaceQ, undefined, false);

    const options: ConfirmModeConfig = {
      yesHandler: () => {
        this.forgetMoveProcess(move, pokemon);
      },
      noHandler: () => {
        ui.setMode<MessageUiHandler>(this.messageMode);
        this.rejectMoveAndEnd(move, pokemon);
      },
    };
    await ui.setModeWithoutClear<ConfirmUiHandler>(UiMode.CONFIRM, options);
  }

  /**
   * This facilitates the process in which an old move is chosen to be forgotten.
   *
   * `> Which move should be forgotten?`
   *
   * The game then goes `Mode.SUMMARY` to select a move to be forgotten.
   * If a player does not select a move or chooses the new move (`moveIndex === 4`), the game goes to {@linkcode rejectMoveAndEnd()}.
   * If an old move is selected, the function then passes the `moveIndex` to {@linkcode learnMove()}
   * @param move The Move to be learned
   * @param Pokemon The Pokemon learning the move
   */
  protected async forgetMoveProcess(move: Move, pokemon: Pokemon): Promise<void> {
    const { ui } = globalScene;

    ui.setMode<MessageUiHandler>(this.messageMode);
    await ui.showTextPromise(i18next.t("battle:learnMoveForgetQuestion"), undefined, true);
    await ui.setModeWithoutClear<SummaryUiHandler>(
      UiMode.SUMMARY,
      pokemon,
      SummaryUiMode.LEARN_MOVE,
      move,
      (moveIndex: number) => {
        if (moveIndex === 4) {
          ui.setMode<MessageUiHandler>(this.messageMode).then(() => this.rejectMoveAndEnd(move, pokemon));
          return;
        }

        const forgetSuccessText = i18next.t("battle:learnMoveForgetSuccess", {
          pokemonName: getPokemonNameWithAffix(pokemon),
          moveName: pokemon.moveset[moveIndex]!.getName(),
        });
        const fullText = [i18next.t("battle:countdownPoof"), forgetSuccessText, i18next.t("battle:learnMoveAnd")].join(
          "$",
        );

        ui.setMode<MessageUiHandler>(this.messageMode).then(() => this.learnMove(moveIndex, move, pokemon, fullText));
      },
    );
  }

  /**
   * This asks the player if they wish to end the current move learning process.
   *
   * `> Stop trying to teach [MoveName]?` --> `Mode.CONFIRM` -->
   * - Yes: `> [Pokemon] did not learn the move [MoveName]`
   * - No: {@linkcode replaceMoveCheck()}
   *
   * If the player wishes to not teach the Pokemon the move, it displays a message and ends the phase.
   * If the player reconsiders, it repeats the process for a Pokemon with a full moveset once again.
   * @param move The Move to be learned
   * @param Pokemon The Pokemon learning the move
   */
  protected async rejectMoveAndEnd(move: Move, pokemon: Pokemon): Promise<void> {
    const { ui } = globalScene;

    await ui.showTextPromise(i18next.t("battle:learnMoveStopTeaching", { moveName: move.name }), undefined, false);

    const options: ConfirmModeConfig = {
      yesHandler: () => {
        ui.setMode<MessageUiHandler>(this.messageMode);
        ui.showTextPromise(
          i18next.t("battle:learnMoveNotLearned", {
            pokemonName: getPokemonNameWithAffix(pokemon),
            moveName: move.name,
          }),
          undefined,
          true,
        ).then(() => this.end());
        return true;
      },
      noHandler: () => {
        ui.setMode<MessageUiHandler>(this.messageMode);
        this.replaceMoveCheck(move, pokemon);
        return true;
      },
    };
    ui.setModeWithoutClear<ConfirmUiHandler>(UiMode.CONFIRM, options);
  }

  /**
   * This teaches the Pokemon the new move and ends the phase.
   * When a Pokemon forgets a move and learns a new one, its 'Learn Move' message is significantly longer.
   *
   * ```markdown
   * Pokemon with a `moveset.length < 4`:
   * > [Pokemon] learned [MoveName]
   *
   * Pokemon with a `moveset.length > 4`:
   * > 1... 2... and 3... and Poof!
   * > [Pokemon] forgot how to use [MoveName]
   * > And...
   * > [Pokemon] learned [MoveName]!
   * ```
   * @param move The Move to be learned
   * @param Pokemon The Pokemon learning the move
   */
  protected async learnMove(index: number, move: Move, pokemon: Pokemon, textMessage?: string): Promise<void> {
    const { ui } = globalScene;

    if (this.learnMoveType === LearnMoveType.TM) {
      if (!pokemon.usedTMs) {
        pokemon.usedTMs = [];
      }
      pokemon.usedTMs.push(this.moveId);
      globalScene.tryRemovePhase((phase) => phase.is<SelectModifierPhase>(PhaseId.SELECT_MODIFIER));
    } else if (this.learnMoveType === LearnMoveType.MEMORY) {
      if (this.cost !== -1) {
        if (!Overrides.WAIVE_SHOP_FEES_OVERRIDE) {
          globalScene.money -= this.cost;
          globalScene.updateMoneyText();
          globalScene.animateMoneyChanged(false);
        }
        globalScene.audioManager.playSound("se/buy");
      } else {
        globalScene.tryRemovePhase((phase) => phase.is<SelectModifierPhase>(PhaseId.SELECT_MODIFIER));
      }
    }

    pokemon.setMove(index, this.moveId);
    initMoveAnim(this.moveId).then(() => {
      loadMoveAnimAssets([this.moveId], true);
    });

    ui.setMode<MessageUiHandler>(this.messageMode);
    const learnMoveText = i18next.t("battle:learnMove", {
      pokemonName: getPokemonNameWithAffix(pokemon),
      moveName: move.name,
    });

    if (textMessage) {
      await ui.showTextPromise(textMessage);
    }

    globalScene.audioManager.playSound("level_up_fanfare"); // Sound loaded into game as is
    ui.showText(
      learnMoveText,
      null,
      () => {
        globalScene.triggerPokemonFormChange(pokemon, SpeciesFormChangeMoveLearnedTrigger, true);
        this.end();
      },
      this.messageMode === UiMode.FORM_CHANGE_SCENE ? 1000 : undefined,
      true,
    );
  }
}
