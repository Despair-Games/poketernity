import { initMoveAnim, loadMoveAnimAssets } from "#app/data/battle-anims";
import type Move from "#app/data/move";
import { allMoves } from "#app/data/move";
import { SpeciesFormChangeMoveLearnedTrigger } from "#app/data/pokemon-forms";
import { type Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import Overrides from "#app/overrides";
import { PlayerPartyMemberPokemonPhase } from "#app/phases/abstract-player-party-member-pokemon-phase";
import { SelectModifierPhase } from "#app/phases/select-modifier-phase";
import FormChangeSceneHandler from "#app/ui/form-change-scene-handler";
import { SummaryUiMode } from "#app/ui/summary-ui-handler";
import { Mode } from "#app/ui/ui";
import { Moves } from "#enums/moves";
import i18next from "i18next";

export enum LearnMoveType {
  /** For learning a move via level-up, evolution, or other non-item-based event */
  LEARN_MOVE,
  /** For learning a move via Memory Mushroom */
  MEMORY,
  /** For learning a move via TM */
  TM,
}

export class LearnMovePhase extends PlayerPartyMemberPokemonPhase {
  private readonly moveId: Moves;
  private messageMode: Mode;
  private readonly learnMoveType: LearnMoveType;
  private readonly cost: number;

  constructor(
    partyMemberIndex: number,
    moveId: Moves,
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
    const move = allMoves[this.moveId];
    const currentMoveset = pokemon.getMoveset();

    // The game first checks if the Pokemon already has the move and ends the phase if it does.
    const hasMoveAlready = currentMoveset.some((m) => m.moveId === move.id) && this.moveId !== Moves.SKETCH;
    if (hasMoveAlready) {
      return this.end();
    }

    this.messageMode = ui.getHandler() instanceof FormChangeSceneHandler ? Mode.FORM_CHANGE_SCENE : Mode.MESSAGE;
    ui.setMode(this.messageMode);
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
    await ui.setModeWithoutClear(
      Mode.CONFIRM,
      () => this.forgetMoveProcess(move, pokemon), // Yes
      () => {
        // No
        ui.setMode(this.messageMode);
        this.rejectMoveAndEnd(move, pokemon);
      },
    );
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

    ui.setMode(this.messageMode);
    await ui.showTextPromise(i18next.t("battle:learnMoveForgetQuestion"), undefined, true);
    await ui.setModeWithoutClear(Mode.SUMMARY, pokemon, SummaryUiMode.LEARN_MOVE, move, (moveIndex: number) => {
      if (moveIndex === 4) {
        ui.setMode(this.messageMode).then(() => this.rejectMoveAndEnd(move, pokemon));
        return;
      }

      const forgetSuccessText = i18next.t("battle:learnMoveForgetSuccess", {
        pokemonName: getPokemonNameWithAffix(pokemon),
        moveName: pokemon.moveset[moveIndex]!.getName(),
      });
      const fullText = [i18next.t("battle:countdownPoof"), forgetSuccessText, i18next.t("battle:learnMoveAnd")].join(
        "$",
      );

      ui.setMode(this.messageMode).then(() => this.learnMove(moveIndex, move, pokemon, fullText));
    });
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

    ui.setModeWithoutClear(
      Mode.CONFIRM,
      () => {
        ui.setMode(this.messageMode);
        ui.showTextPromise(
          i18next.t("battle:learnMoveNotLearned", {
            pokemonName: getPokemonNameWithAffix(pokemon),
            moveName: move.name,
          }),
          undefined,
          true,
        ).then(() => this.end());
      },
      () => {
        ui.setMode(this.messageMode);
        this.replaceMoveCheck(move, pokemon);
      },
    );
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
      globalScene.tryRemovePhase((phase) => phase instanceof SelectModifierPhase);
    } else if (this.learnMoveType === LearnMoveType.MEMORY) {
      if (this.cost !== -1) {
        if (!Overrides.WAIVE_ROLL_FEE_OVERRIDE) {
          globalScene.money -= this.cost;
          globalScene.updateMoneyText();
          globalScene.animateMoneyChanged(false);
        }
        globalScene.playSound("se/buy");
      } else {
        globalScene.tryRemovePhase((phase) => phase instanceof SelectModifierPhase);
      }
    }

    pokemon.setMove(index, this.moveId);
    initMoveAnim(this.moveId).then(() => {
      loadMoveAnimAssets([this.moveId], true);
    });

    ui.setMode(this.messageMode);
    const learnMoveText = i18next.t("battle:learnMove", {
      pokemonName: getPokemonNameWithAffix(pokemon),
      moveName: move.name,
    });

    if (textMessage) {
      await ui.showTextPromise(textMessage);
    }

    globalScene.playSound("level_up_fanfare"); // Sound loaded into game as is
    ui.showText(
      learnMoveText,
      null,
      () => {
        globalScene.triggerPokemonFormChange(pokemon, SpeciesFormChangeMoveLearnedTrigger, true);
        this.end();
      },
      this.messageMode === Mode.FORM_CHANGE_SCENE ? 1000 : undefined,
      true,
    );
  }
}
