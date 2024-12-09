import type { TurnCommand } from "#app/battle";
import { BattleType } from "#app/battle";
import { ArenaTagSide, type ArenaTag } from "#app/data/arena-tag";
import { speciesStarterCosts } from "#app/data/balance/starters";
import type { EncoreTag } from "#app/data/battler-tags";
import { TrappedTag, type BattlerTag } from "#app/data/battler-tags";
import { getMoveTargets, type MoveTargetSet } from "#app/data/move";
import type { PlayerPokemon } from "#app/field/pokemon";
import { FieldPosition } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { FieldPhase } from "#app/phases/field-phase";
import { SelectTargetPhase } from "#app/phases/select-target-phase";
import { Command } from "#app/ui/command-ui-handler";
import { Mode } from "#app/ui/ui";
import { Abilities } from "#enums/abilities";
import { ArenaTagType } from "#enums/arena-tag-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { Biome } from "#enums/biome";
import { Moves } from "#enums/moves";
import { MysteryEncounterMode } from "#enums/mystery-encounter-mode";
import { PokeballType } from "#enums/pokeball";
import i18next from "i18next";

/**
 * Handles the player's start-of-turn actions (`Fight/Ball/Pokemon/Run`) during a battle
 * @see {@linkcode handleCommand}
 */
export class CommandPhase extends FieldPhase {
  /** TODO: Is this supposed to be a {@linkcode FieldPosition} or a {@linkcode BattlerIndex}? */
  protected fieldIndex: number;

  constructor(fieldIndex: number) {
    super();

    this.fieldIndex = fieldIndex;
  }

  public override start(): void {
    super.start();

    const { currentBattle, ui } = globalScene;

    globalScene.updateGameInfo();

    const commandUiHandler = globalScene.ui.handlers[Mode.COMMAND];

    if (commandUiHandler) {
      if (currentBattle.turn === 1 || commandUiHandler.getCursor() === Command.POKEMON) {
        commandUiHandler.setCursor(Command.FIGHT);
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
        const allyCommand = currentBattle.turnCommands[this.fieldIndex - 1];
        if (allyCommand?.command === Command.BALL || allyCommand?.command === Command.RUN) {
          currentBattle.turnCommands[this.fieldIndex] = { command: allyCommand?.command, skip: true };
        }
      }
    }

    // If the Pokemon has applied Commander's effects to its ally, skip this command
    if (
      currentBattle?.double
      && this.getPokemon().getAlly()?.getTag(BattlerTagType.COMMANDED)?.getSourcePokemon() === this.getPokemon()
    ) {
      currentBattle.turnCommands[this.fieldIndex] = {
        command: Command.FIGHT,
        move: { move: Moves.NONE, targets: [] },
        skip: true,
      };
    }

    // Checks if the Pokemon is under the effects of Encore. If so, Encore can end early if the encored move has no more PP.
    const encoreTag = this.getPokemon().getTag(BattlerTagType.ENCORE) as EncoreTag;
    if (encoreTag) {
      this.getPokemon().lapseTag(BattlerTagType.ENCORE);
    }

    if (currentBattle.turnCommands[this.fieldIndex]?.skip) {
      return this.end();
    }

    const playerPokemon = globalScene.getPlayerField()[this.fieldIndex];

    const moveQueue = playerPokemon.getMoveQueue();

    while (
      moveQueue.length
      && moveQueue[0]
      && moveQueue[0].move
      && (!playerPokemon.getMoveset().find((m) => m.moveId === moveQueue[0].move)
        || !playerPokemon
          .getMoveset()
          [
            playerPokemon.getMoveset().findIndex((m) => m.moveId === moveQueue[0].move)
          ].isUsable(playerPokemon, moveQueue[0].ignorePP))
    ) {
      moveQueue.shift();
    }

    if (moveQueue.length) {
      const queuedMove = moveQueue[0];
      if (!queuedMove.move) {
        this.handleCommand(Command.FIGHT, -1, false);
      } else {
        const moveIndex = playerPokemon.getMoveset().findIndex((m) => m.moveId === queuedMove.move);
        if (moveIndex > -1 && playerPokemon.getMoveset()[moveIndex].isUsable(playerPokemon, queuedMove.ignorePP)) {
          this.handleCommand(Command.FIGHT, moveIndex, queuedMove.ignorePP, {
            targets: queuedMove.targets,
            multiple: queuedMove.targets.length > 1,
          });
        } else {
          ui.setMode(Mode.COMMAND, this.fieldIndex);
        }
      }
    } else {
      if (currentBattle.isBattleMysteryEncounter() && currentBattle.mysteryEncounter?.skipToFightInput) {
        ui.clearText();
        ui.setMode(Mode.FIGHT, this.fieldIndex);
      } else {
        ui.setMode(Mode.COMMAND, this.fieldIndex);
      }
    }
  }

  /**
   * @param command - Which of {@linkcode Command.BALL} or {@linkcode Command.RUN} was chosen
   * @param cursor - Cursor index for the selected Pokeball
   * @returns `true` if the command was successful
   */
  public handleCommand(command: Command.BALL | Command.RUN, cursor: number): boolean;
  /**
   * @param command - {@linkcode Command.FIGHT}
   * @param cursor - Cursor index for the selected Move
   * @param ignorePp - `true` if the move shouldn't use PP
   * @param targets - (optional, unused) {@linkcode MoveTargetSet} containing the queued moves targets (ie: from rollout, etc)
   * @returns `true` if the command was successful
   */
  public handleCommand(command: Command.FIGHT, cursor: number, ignorePp?: boolean, targets?: MoveTargetSet): boolean;
  /**
   * @param command - {@linkcode Command.POKEMON}
   * @param cursor - Cursor index for the selected Pokemon
   * @param isBaton - `true` if the pokemon being switched out is holding the Baton item
   * @returns `true` if the command was successful
   */
  public handleCommand(command: Command.POKEMON, cursor: number, isBaton: boolean): boolean;
  public handleCommand(command: Command, cursor: number, ...args: any[]): boolean {
    const playerPokemon = globalScene.getPlayerField()[this.fieldIndex];
    let success: boolean = false;

    const { arena, currentBattle, gameData, gameMode, ui } = globalScene;
    const { battleType, mysteryEncounter } = currentBattle;

    switch (command) {
      case Command.FIGHT:
        const ignorePp: boolean = args[0];
        const useStruggle = cursor > -1 && !playerPokemon.getMoveset().filter((m) => m.isUsable(playerPokemon)).length;

        if (cursor === -1 || playerPokemon.trySelectMove(cursor, ignorePp) || useStruggle) {
          const moveId = !useStruggle
            ? cursor > -1
              ? playerPokemon.getMoveset()[cursor].moveId
              : Moves.NONE
            : Moves.STRUGGLE;
          const turnCommand: TurnCommand = {
            command: Command.FIGHT,
            cursor: cursor,
            move: { move: moveId, targets: [], ignorePP: ignorePp },
            args: args,
          };
          const moveTargets = getMoveTargets(playerPokemon, moveId);

          if (!moveId) {
            turnCommand.targets = [this.fieldIndex];
          }

          console.log(moveTargets, getPokemonNameWithAffix(playerPokemon));
          if (moveTargets.targets.length > 1 && moveTargets.multiple) {
            globalScene.unshiftPhase(new SelectTargetPhase(this.fieldIndex));
          }
          if (turnCommand.move && (moveTargets.targets.length <= 1 || moveTargets.multiple)) {
            turnCommand.move.targets = moveTargets.targets;
          } else if (
            turnCommand.move
            && playerPokemon.getTag(BattlerTagType.CHARGING)
            && playerPokemon.getMoveQueue().length >= 1
          ) {
            turnCommand.move.targets = playerPokemon.getMoveQueue()[0].targets;
          } else {
            globalScene.unshiftPhase(new SelectTargetPhase(this.fieldIndex));
          }

          currentBattle.turnCommands[this.fieldIndex] = turnCommand;
          success = true;
        } else if (cursor < playerPokemon.getMoveset().length) {
          const move = playerPokemon.getMoveset()[cursor];
          ui.setMode(Mode.MESSAGE);

          let errorMessageKey: string;
          if (playerPokemon.isMoveRestricted(move.moveId, playerPokemon)) {
            errorMessageKey =
              playerPokemon
                .getRestrictingTag(move.moveId, playerPokemon)
                ?.selectionDeniedText(playerPokemon, move.moveId) ?? "battle:moveDisabled";
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
              ui.setMode(Mode.FIGHT, this.fieldIndex);
            },
            null,
            true,
          );
        }
        break;
      case Command.BALL:
        const notInDex =
          globalScene
            .getEnemyField()
            .filter((p) => p.isActive(true))
            .some((p) => !globalScene.gameData.dexData[p.species.speciesId].caughtAttr)
          && gameData.getStarterCount((d) => !!d.caughtAttr) < Object.keys(speciesStarterCosts).length - 1;

        if (arena.biomeType === Biome.END && (!gameMode.isClassic || gameMode.isFreshStartChallenge() || notInDex)) {
          ui.setMode(Mode.COMMAND, this.fieldIndex);
          ui.setMode(Mode.MESSAGE);
          ui.showText(
            i18next.t("battle:noPokeballForce"),
            null,
            () => {
              ui.showText("", 0);
              ui.setMode(Mode.COMMAND, this.fieldIndex);
            },
            null,
            true,
          );
        } else if (battleType === BattleType.TRAINER) {
          ui.setMode(Mode.COMMAND, this.fieldIndex);
          ui.setMode(Mode.MESSAGE);
          ui.showText(
            i18next.t("battle:noPokeballTrainer"),
            null,
            () => {
              ui.showText("", 0);
              ui.setMode(Mode.COMMAND, this.fieldIndex);
            },
            null,
            true,
          );
        } else if (currentBattle.isBattleMysteryEncounter() && !mysteryEncounter!.catchAllowed) {
          ui.setMode(Mode.COMMAND, this.fieldIndex);
          ui.setMode(Mode.MESSAGE);
          ui.showText(
            i18next.t("battle:noPokeballMysteryEncounter"),
            null,
            () => {
              ui.showText("", 0);
              ui.setMode(Mode.COMMAND, this.fieldIndex);
            },
            null,
            true,
          );
        } else {
          const targets = globalScene
            .getEnemyField()
            .filter((p) => p.isActive(true))
            .map((p) => p.getBattlerIndex());
          if (targets.length > 1) {
            ui.setMode(Mode.COMMAND, this.fieldIndex);
            ui.setMode(Mode.MESSAGE);
            ui.showText(
              i18next.t("battle:noPokeballMulti"),
              null,
              () => {
                ui.showText("", 0);
                ui.setMode(Mode.COMMAND, this.fieldIndex);
              },
              null,
              true,
            );
          } else if (cursor < 5) {
            // TODO: when would `cursor` be greater than 4?
            const targetPokemon = globalScene.getEnemyField().find((p) => p.isActive(true));
            if (
              targetPokemon?.isBoss()
              && targetPokemon?.bossSegmentIndex >= 1
              && !targetPokemon?.hasAbility(Abilities.WONDER_GUARD, false, true)
              && cursor < PokeballType.MASTER_BALL
            ) {
              ui.setMode(Mode.COMMAND, this.fieldIndex);
              ui.setMode(Mode.MESSAGE);
              ui.showText(
                i18next.t("battle:noPokeballStrong"),
                null,
                () => {
                  ui.showText("", 0);
                  ui.setMode(Mode.COMMAND, this.fieldIndex);
                },
                null,
                true,
              );
            } else {
              currentBattle.turnCommands[this.fieldIndex] = {
                command: Command.BALL,
                cursor: cursor,
                targets: targets,
              };
              if (this.fieldIndex) {
                currentBattle.turnCommands[this.fieldIndex - 1]!.skip = true;
              }
              success = true;
            }
          }
        }
        break;
      case Command.RUN:
        if (arena.biomeType === Biome.END || mysteryEncounter?.fleeAllowed === false) {
          ui.setMode(Mode.COMMAND, this.fieldIndex);
          ui.setMode(Mode.MESSAGE);
          ui.showText(
            i18next.t("battle:noEscapeForce"),
            null,
            () => {
              ui.showText("", 0);
              ui.setMode(Mode.COMMAND, this.fieldIndex);
            },
            null,
            true,
          );
        } else if (
          battleType === BattleType.TRAINER
          || mysteryEncounter?.encounterMode === MysteryEncounterMode.TRAINER_BATTLE
        ) {
          ui.setMode(Mode.COMMAND, this.fieldIndex);
          ui.setMode(Mode.MESSAGE);
          ui.showText(
            i18next.t("battle:noEscapeTrainer"),
            null,
            () => {
              ui.showText("", 0);
              ui.setMode(Mode.COMMAND, this.fieldIndex);
            },
            null,
            true,
          );
        }
      case Command.POKEMON:
        const isSwitch = command === Command.POKEMON;
        const batonPass = isSwitch && (args[0] as boolean);
        const trappedAbMessages: string[] = [];
        if (batonPass || !playerPokemon.isTrapped(trappedAbMessages)) {
          currentBattle.turnCommands[this.fieldIndex] = isSwitch
            ? { command: Command.POKEMON, cursor: cursor, args: args }
            : { command: Command.RUN };
          success = true;
          if (!isSwitch && this.fieldIndex) {
            currentBattle.turnCommands[this.fieldIndex - 1]!.skip = true;
          }
        } else if (trappedAbMessages.length > 0) {
          if (!isSwitch) {
            ui.setMode(Mode.MESSAGE);
          }
          ui.showText(
            trappedAbMessages[0],
            null,
            () => {
              ui.showText("", 0);
              if (!isSwitch) {
                ui.setMode(Mode.COMMAND, this.fieldIndex);
              }
            },
            null,
            true,
          );
        } else {
          const trapTag = playerPokemon.getTag(TrappedTag);
          const fairyLockTag = arena.getTagOnSide(ArenaTagType.FAIRY_LOCK, ArenaTagSide.PLAYER);

          if (!trapTag && !fairyLockTag) {
            i18next.t(`battle:noEscape${isSwitch ? "Switch" : "Flee"}`);
            break;
          }
          if (!isSwitch) {
            ui.setMode(Mode.COMMAND, this.fieldIndex);
            ui.setMode(Mode.MESSAGE);
          }
          const showNoEscapeText = (tag: BattlerTag | ArenaTag): void => {
            ui.showText(
              i18next.t("battle:noEscapePokemon", {
                pokemonName:
                  tag.sourceId && globalScene.getPokemonById(tag.sourceId)
                    ? getPokemonNameWithAffix(globalScene.getPokemonById(tag.sourceId))
                    : "",
                moveName: tag.getMoveName(),
                escapeVerb: isSwitch ? i18next.t("battle:escapeVerbSwitch") : i18next.t("battle:escapeVerbFlee"),
              }),
              null,
              () => {
                ui.showText("", 0);
                if (!isSwitch) {
                  ui.setMode(Mode.COMMAND, this.fieldIndex);
                }
              },
              null,
              true,
            );
          };

          if (trapTag) {
            showNoEscapeText(trapTag);
          } else if (fairyLockTag) {
            showNoEscapeText(fairyLockTag);
          }
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
      globalScene.unshiftPhase(new CommandPhase(0));
      globalScene.unshiftPhase(new CommandPhase(1));
      this.end();
    }
  }

  public getFieldIndex(): number {
    return this.fieldIndex;
  }

  public getPokemon(): PlayerPokemon {
    return globalScene.getPlayerField()[this.fieldIndex];
  }

  public override end(): void {
    globalScene.ui.setMode(Mode.MESSAGE).then(() => super.end());
  }
}
