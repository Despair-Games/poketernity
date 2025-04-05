import type { TurnMove } from "#app/@types/TurnMove";
import { type FairyLockTag } from "#app/data/arena-tag";
import { speciesStarterCosts } from "#app/data/balance/starters";
import type { EncoreTag } from "#app/data/battler-tags/encore-tag";
import { type SkyDropTag } from "#app/data/battler-tags/sky-drop-tag";
import type { TrappedTag } from "#app/data/battler-tags/trapped-tag";
import { allMoves } from "#app/data/data-lists";
import { getMoveTargets, type MoveTargetSet } from "#app/data/moves/move";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { FieldPhase } from "#app/phases/abstract-field-phase";
import type { TurnCommand } from "#app/turn-command-manager";
import type { CommandUiHandler } from "#app/ui/handlers/command-ui-handler";
import type { FightUiHandler } from "#app/ui/handlers/fight-ui-handler";
import { isNullOrUndefined } from "#app/utils";
import { MoveLockTagTypes, TrappedBattlerTagTypes } from "#app/utils/battler-tag-type-utils";
import { isFieldTargeted } from "#app/utils/move-utils";
import { AbilityId } from "#enums/ability-id";
import { ArenaTagSide } from "#enums/arena-tag-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import { BattleCommand } from "#enums/battle-command";
import { BattleType } from "#enums/battle-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { BiomeId } from "#enums/biome-id";
import { FieldPosition } from "#enums/field-position";
import { MoveId } from "#enums/move-id";
import { MysteryEncounterMode } from "#enums/mystery-encounter-mode";
import { PhaseId } from "#enums/phase-id";
import { PokeballType } from "#enums/pokeball-type";
import { UiMode } from "#enums/ui-mode";
import i18next from "i18next";

/**
 * Handles the player's start-of-turn actions (`Fight/Ball/Pokemon/Run`) during a battle
 * @extends FieldPhase
 * @see {@linkcode handleCommand}
 */
export class CommandPhase extends FieldPhase {
  override readonly id = PhaseId.COMMAND;

  /** TODO: Is this supposed to be a {@linkcode FieldPosition} or a {@linkcode BattlerIndex}? */
  protected fieldIndex: number;

  constructor(fieldIndex: number) {
    super();

    this.fieldIndex = fieldIndex;
  }

  public override start(): void {
    super.start();

    const { currentBattle, ui } = globalScene;
    const { turnManager } = globalScene.currentBattle;

    const pokemon = this.getPokemon();

    globalScene.updateGameInfo();

    const commandUiHandler = globalScene.ui.handlers[UiMode.COMMAND];

    if (commandUiHandler) {
      if (currentBattle.turn === 1 || commandUiHandler.getCursor() === BattleCommand.POKEMON) {
        commandUiHandler.setCursor(BattleCommand.FIGHT);
      } else {
        commandUiHandler.setCursor(commandUiHandler.getCursor());
      }
    }

    if (this.fieldIndex) {
      // If we somehow are attempting to check the right pokemon but there's only one pokemon out
      // Switch back to the center pokemon. This can happen rarely in double battles with mid turn switching
      if (globalScene.getPlayerField().filter((p) => p.isActive()).length === 1) {
        this.fieldIndex = FieldPosition.CENTER;
      } else {
        const allyPokemon = pokemon.getAlly();
        if (allyPokemon) {
          const allyCommand = turnManager.findCommandFromPokemon(allyPokemon);
          if (allyCommand?.command === BattleCommand.BALL || allyCommand?.command === BattleCommand.RUN) {
            return this.end();
          }
        }
      }
    }

    // If the Pokemon has applied Commander's effects to its ally, skip this command
    if (currentBattle?.double && pokemon.getAlly()?.getTag(BattlerTagType.COMMANDED)?.getSourcePokemon() === pokemon) {
      return this.end();
    }

    // Checks if the Pokemon is under the effects of Encore. If so, Encore can end early if the encored move has no more PP.
    const encoreTag = pokemon.getTag(BattlerTagType.ENCORE) as EncoreTag;
    if (encoreTag) {
      pokemon.lapseTag(BattlerTagType.ENCORE);
    }

    const moveQueue = pokemon.getMoveQueue();

    while (
      moveQueue.length
      && moveQueue[0]
      && moveQueue[0].move.id !== MoveId.NONE
      && !moveQueue[0].virtual
      && !pokemon
        .getMoveset()
        .find((m) => m.moveId === moveQueue[0].move.id)
        ?.isUsable(pokemon, moveQueue[0].ignorePP)
    ) {
      moveQueue.shift();
    }

    if (moveQueue.length > 0) {
      const queuedMove = moveQueue[0];
      if (queuedMove.move.id === MoveId.NONE) {
        this.handleCommand(BattleCommand.FIGHT, -1);
      } else {
        const moveIndex = pokemon.getMoveset().findIndex((m) => m.moveId === queuedMove.move.id);
        if (
          (moveIndex > -1 && pokemon.getMoveset()[moveIndex].isUsable(pokemon, queuedMove.ignorePP))
          || queuedMove.virtual
        ) {
          MoveLockTagTypes.forEach((tagType) => pokemon.lapseTag(tagType));
          this.handleCommand(BattleCommand.FIGHT, moveIndex, queuedMove.ignorePP, queuedMove);
        } else {
          ui.setMode<CommandUiHandler>(UiMode.COMMAND, this.fieldIndex);
        }
      }
    } else {
      if (currentBattle.isBattleMysteryEncounter() && currentBattle.mysteryEncounter?.skipToFightInput) {
        ui.clearText();
        ui.setMode<FightUiHandler>(UiMode.FIGHT, this.fieldIndex);
      } else {
        ui.setMode<CommandUiHandler>(UiMode.COMMAND, this.fieldIndex);
      }
    }
  }

  /**
   * @param command - Which of {@linkcode BattleCommand.BALL} or {@linkcode BattleCommand.RUN} was chosen
   * @param cursor - Cursor index for the selected Pokeball
   * @returns `true` if the command was successful
   * @overload
   */
  public handleCommand(command: BattleCommand.BALL | BattleCommand.RUN, cursor: number): boolean;
  /**
   * @param command - {@linkcode BattleCommand.FIGHT}
   * @param cursor - Cursor index for the selected Move
   * @param ignorePp - (optional) `true` if the move shouldn't use PP
   * @param turnMove - (optional) A {@linkcode TurnMove} object for an existing queued move
   * @returns `true` if the command was successful
   * @overload
   */
  public handleCommand(command: BattleCommand.FIGHT, cursor: number, ignorePp?: boolean, turnMove?: TurnMove): boolean;
  /**
   * @param command - {@linkcode BattleCommand.POKEMON}
   * @param cursor - Cursor index for the selected Pokemon
   * @param isBaton - `true` if the pokemon being switched out is holding the Baton item
   * @returns `true` if the command was successful
   * @overload
   */
  public handleCommand(command: BattleCommand.POKEMON, cursor: number, isBaton: boolean): boolean;
  public handleCommand(command: BattleCommand, cursor: number, ...args: unknown[]): boolean {
    const pokemon = this.getPokemon();
    let success: boolean = false;

    const { arena, currentBattle, gameData, gameMode, ui } = globalScene;
    const { battleType, mysteryEncounter, turnManager, double } = currentBattle;

    const failCatchRunCallback = (): void => {
      ui.showText("", 0);
      ui.setMode<CommandUiHandler>(UiMode.COMMAND, this.fieldIndex);
    };
    const failCatchRun = (i18nKey: string): void => {
      ui.setMode<CommandUiHandler>(UiMode.COMMAND, this.fieldIndex);
      ui.setMessageMode();
      ui.showText(i18next.t(i18nKey), null, () => failCatchRunCallback(), null, true);
    };

    switch (command) {
      case BattleCommand.FIGHT:
        const ignorePp = args[0] as boolean | undefined;
        const turnMove: TurnMove | undefined = args.length === 2 ? (args[1] as TurnMove) : undefined;
        const useStruggle = cursor > -1 && !pokemon.getMoveset().filter((m) => m.isUsable(pokemon)).length;

        if (cursor === -1 || pokemon.trySelectMove(cursor, ignorePp) || useStruggle) {
          let moveId: MoveId;
          if (useStruggle) {
            moveId = MoveId.STRUGGLE;
          } else if (turnMove !== undefined) {
            moveId = turnMove.move.id;
          } else if (cursor > -1) {
            moveId = pokemon.getMoveset()[cursor]!.moveId;
          } else {
            moveId = MoveId.NONE;
          }

          const turnCommand: TurnCommand = {
            pokemon,
            command: BattleCommand.FIGHT,
            cursor,
            turnMove: {
              move: allMoves.get(moveId),
              targets: [],
              ignorePP: ignorePp,
              type: pokemon.getMoveType(allMoves.get(moveId)),
            },
            args,
          };
          const moveTargets: MoveTargetSet =
            turnMove === undefined
              ? getMoveTargets(pokemon, moveId)
              : { targets: turnMove.targets, multiple: turnMove.targets.length > 1 };

          if (!moveId) {
            turnCommand.targets = [this.fieldIndex];
          }

          console.log(moveTargets, getPokemonNameWithAffix(pokemon));
          if (
            (isFieldTargeted(moveTargets.targets) && double)
            || (moveTargets.targets.length > 1 && moveTargets.multiple)
          ) {
            globalScene.phaseManager.queueSelectTargetPhase(this.fieldIndex);
          }
          if (turnCommand.turnMove && (moveTargets.targets.length <= 1 || moveTargets.multiple)) {
            turnCommand.turnMove.targets = moveTargets.targets;
          } else if (
            turnCommand.turnMove
            && pokemon.getTag(BattlerTagType.CHARGING)
            && pokemon.getMoveQueue().length >= 1
          ) {
            turnCommand.turnMove.targets = pokemon.getMoveQueue()[0].targets;
          } else {
            globalScene.phaseManager.queueSelectTargetPhase(this.fieldIndex);
          }

          turnManager.addCommand(turnCommand);
          success = true;
        } else if (cursor < pokemon.getMoveset().length) {
          const move = pokemon.getMoveset()[cursor];
          ui.setMessageMode();

          let errorMessageKey: string;
          if (pokemon.isMoveRestricted(move.moveId, pokemon)) {
            errorMessageKey =
              pokemon.getRestrictingTag(move.moveId, pokemon)?.getSelectionDeniedText(pokemon, move.moveId)
              ?? "battle:moveDisabled";
          } else if (move.getName().endsWith(" (N)")) {
            errorMessageKey = "battle:moveNotImplemented";
          } else {
            errorMessageKey = "battle:moveNoPP";
          }
          const moveName = move.getName().replace(" (N)", ""); // Trims off the "unimplemented move" indicator

          ui.showText(
            i18next.t(errorMessageKey, { moveName: moveName }),
            null,
            () => {
              ui.clearText();
              ui.setMode<FightUiHandler>(UiMode.FIGHT, this.fieldIndex);
            },
            null,
            true,
          );
        }
        break;
      case BattleCommand.BALL:
        const notInDex =
          globalScene
            .getEnemyField()
            .filter((p) => p.isActive(true))
            .some((p) => !globalScene.gameData.dexData[p.species.speciesId].caughtAttr)
          && gameData.getStarterCount((d) => !!d.caughtAttr) < Object.keys(speciesStarterCosts).length - 1;

        if (arena.biomeId === BiomeId.END && (!gameMode.isClassic || gameMode.isFreshStartChallenge() || notInDex)) {
          failCatchRun("battle:noPokeballForce");
        } else if (battleType === BattleType.TRAINER) {
          failCatchRun("battle:noPokeballTrainer");
        } else if (currentBattle.isBattleMysteryEncounter() && !mysteryEncounter!.catchAllowed) {
          failCatchRun("battle:noPokeballMysteryEncounter");
        } else {
          const targets = globalScene
            .getEnemyField()
            .filter((p) => p.isActive(true))
            .map((p) => p.getBattlerIndex());

          if (targets.length > 1) {
            failCatchRun("battle:noPokeballMulti");
          } else if (cursor < Object.keys(globalScene.pokeballCounts).length) {
            const targetPokemon = globalScene.getEnemyField().find((p) => p.isActive(true));

            if (isNullOrUndefined(targetPokemon)) {
              console.warn("Enemy Pokemon is missing when trying to throw Pokeball!");
              failCatchRun("battle:noPokeballForce");
            } else if (
              targetPokemon.isBoss()
              && targetPokemon.bossSegmentIndex >= 1
              && !targetPokemon.hasAbility(AbilityId.WONDER_GUARD, false, true)
              && cursor !== PokeballType.MASTER_BALL
            ) {
              failCatchRun("battle:noPokeballStrong");
            } else {
              turnManager.addCommand({
                pokemon: pokemon,
                command: BattleCommand.BALL,
                cursor: cursor,
                targets: targets,
              });
              if (this.fieldIndex) {
                turnManager.tryRemoveCommand((tc) => tc.pokemon === pokemon.getAlly());
              }
              success = true;
            }
          }
        }
        break;
      case BattleCommand.RUN:
        if (arena.biomeId === BiomeId.END || mysteryEncounter?.fleeAllowed === false) {
          failCatchRun("battle:noEscapeForce");
          break;
        } else if (
          battleType === BattleType.TRAINER
          || mysteryEncounter?.encounterMode === MysteryEncounterMode.TRAINER_BATTLE
        ) {
          failCatchRun("battle:noEscapeTrainer");
          break;
        }
      case BattleCommand.POKEMON:
        const isSwitch = command === BattleCommand.POKEMON;
        const batonPass = isSwitch && (args[0] as boolean);
        const trappedAbMessages: string[] = [];

        const showNoEscapeText = (text: string): void => {
          ui.showText(
            text,
            null,
            () => {
              ui.showText("", 0);
              if (!isSwitch) {
                ui.setMode<CommandUiHandler>(UiMode.COMMAND, this.fieldIndex);
              }
            },
            null,
            true,
          );
        };

        if (batonPass || !pokemon.isTrapped(trappedAbMessages)) {
          const turnCommand: TurnCommand = isSwitch
            ? { pokemon: pokemon, command: BattleCommand.POKEMON, cursor: cursor, args: args }
            : { pokemon: pokemon, command: BattleCommand.RUN };
          turnManager.addCommand(turnCommand);
          success = true;
          if (!isSwitch && this.fieldIndex) {
            turnManager.tryRemoveCommand((tc) => tc.pokemon === pokemon.getAlly());
          }
        } else if (trappedAbMessages.length > 0) {
          if (!isSwitch) {
            ui.setMessageMode();
          }
          showNoEscapeText(trappedAbMessages[0]);
        } else {
          const trapTag =
            pokemon.getTag<TrappedTag>(...TrappedBattlerTagTypes)
            ?? pokemon.getTag<SkyDropTag>(BattlerTagType.SKY_DROP);
          const fairyLockTag = arena.getTagOnSide(ArenaTagType.FAIRY_LOCK, ArenaTagSide.PLAYER);

          if (!isSwitch) {
            ui.setMode<CommandUiHandler>(UiMode.COMMAND, this.fieldIndex);
            ui.setMessageMode();
          }

          const getNoEscapeText = (tag?: TrappedTag | SkyDropTag | FairyLockTag) => {
            if (!tag) {
              return i18next.t(`battle:noEscape${isSwitch ? "Switch" : "Flee"}`);
            }
            return i18next.t("battle:noEscapePokemon", {
              pokemonName:
                tag.sourceId && globalScene.getPokemonById(tag.sourceId)
                  ? getPokemonNameWithAffix(globalScene.getPokemonById(tag.sourceId))
                  : "",
              moveName: tag.getMoveName(),
              escapeVerb: isSwitch ? i18next.t("battle:escapeVerbSwitch") : i18next.t("battle:escapeVerbFlee"),
            });
          };

          showNoEscapeText(getNoEscapeText(trapTag ?? fairyLockTag));
        }
        break;
    }

    if (success) {
      this.end();
    }

    return success;
  }

  public cancel(): void {
    if (this.fieldIndex) {
      globalScene.phaseManager.unshiftPhase(new CommandPhase(0));
      globalScene.phaseManager.unshiftPhase(new CommandPhase(1));
      this.end();
    }
  }

  public getFieldIndex(): number {
    return this.fieldIndex;
  }

  public getPokemon(): Pokemon {
    return globalScene.getPlayerField()[this.fieldIndex];
  }

  public override end(): void {
    globalScene.ui.setMessageMode().then(() => super.end());
  }
}
