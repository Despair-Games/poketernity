import type { TurnCommand } from "#app/battle";
import { BattleType } from "#enums/battle-type";
import { type FairyLockTag } from "#app/data/arena-tag";
import { ArenaTagSide } from "#enums/arena-tag-side";
import { speciesStarterCosts } from "#app/data/balance/starters";
import type { EncoreTag } from "#app/data/battler-tags";
import { SkyDropTag, TrappedTag } from "#app/data/battler-tags";
import { getMoveTargets, type MoveTargetSet } from "#app/data/move";
import type { PlayerPokemon } from "#app/field/pokemon";
import { FieldPosition } from "#enums/field-position";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { FieldPhase } from "#app/phases/abstract-field-phase";
import { SelectTargetPhase } from "#app/phases/select-target-phase";
import { BattleCommand } from "#enums/battle-command";
import { UiMode } from "#enums/ui-mode";
import { isNullOrUndefined } from "#app/utils";
import { Abilities } from "#enums/abilities";
import { ArenaTagType } from "#enums/arena-tag-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { Biome } from "#enums/biome";
import { MoveId } from "#enums/move-id";
import { MysteryEncounterMode } from "#enums/mystery-encounter-mode";
import { PokeballType } from "#enums/pokeball";
import i18next from "i18next";

/**
 * Handles the player's start-of-turn actions (`Fight/Ball/Pokemon/Run`) during a battle
 * @extends FieldPhase
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
        const allyCommand = currentBattle.turnCommands[this.fieldIndex - 1];
        if (allyCommand?.command === BattleCommand.BALL || allyCommand?.command === BattleCommand.RUN) {
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
        command: BattleCommand.FIGHT,
        move: { moveId: MoveId.NONE, targets: [] },
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
      && moveQueue[0].moveId
      && (!playerPokemon.getMoveset().find((m) => m.moveId === moveQueue[0].moveId)
        || !playerPokemon
          .getMoveset()
          [
            playerPokemon.getMoveset().findIndex((m) => m.moveId === moveQueue[0].moveId)
          ].isUsable(playerPokemon, moveQueue[0].ignorePP))
    ) {
      moveQueue.shift();
    }

    if (moveQueue.length) {
      const queuedMove = moveQueue[0];
      if (!queuedMove.moveId) {
        this.handleCommand(BattleCommand.FIGHT, -1, false);
      } else {
        const moveIndex = playerPokemon.getMoveset().findIndex((m) => m.moveId === queuedMove.moveId);
        if (moveIndex > -1 && playerPokemon.getMoveset()[moveIndex].isUsable(playerPokemon, queuedMove.ignorePP)) {
          this.handleCommand(BattleCommand.FIGHT, moveIndex, queuedMove.ignorePP, {
            targets: queuedMove.targets,
            multiple: queuedMove.targets.length > 1,
          });
        } else {
          ui.setMode(UiMode.COMMAND, this.fieldIndex);
        }
      }
    } else {
      if (currentBattle.isBattleMysteryEncounter() && currentBattle.mysteryEncounter?.skipToFightInput) {
        ui.clearText();
        ui.setMode(UiMode.FIGHT, this.fieldIndex);
      } else {
        ui.setMode(UiMode.COMMAND, this.fieldIndex);
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
   * @param ignorePp - `true` if the move shouldn't use PP
   * @param targets - (optional) {@linkcode MoveTargetSet} containing the queued moves targets (ie: from rollout, etc)
   * @returns `true` if the command was successful
   * @overload
   */
  public handleCommand(
    command: BattleCommand.FIGHT,
    cursor: number,
    ignorePp?: boolean,
    targets?: MoveTargetSet,
  ): boolean;
  /**
   * @param command - {@linkcode BattleCommand.POKEMON}
   * @param cursor - Cursor index for the selected Pokemon
   * @param isBaton - `true` if the pokemon being switched out is holding the Baton item
   * @returns `true` if the command was successful
   * @overload
   */
  public handleCommand(command: BattleCommand.POKEMON, cursor: number, isBaton: boolean): boolean;
  public handleCommand(command: BattleCommand, cursor: number, ...args: unknown[]): boolean {
    const playerPokemon = globalScene.getPlayerField()[this.fieldIndex];
    let success: boolean = false;

    const { arena, currentBattle, gameData, gameMode, ui } = globalScene;
    const { battleType, mysteryEncounter } = currentBattle;

    const failCatchRunCallback = (): void => {
      ui.showText("", 0);
      ui.setMode(UiMode.COMMAND, this.fieldIndex);
    };
    const failCatchRun = (i18nKey: string): void => {
      ui.setMode(UiMode.COMMAND, this.fieldIndex);
      ui.setMode(UiMode.MESSAGE);
      ui.showText(i18next.t(i18nKey), null, () => failCatchRunCallback(), null, true);
    };

    switch (command) {
      case BattleCommand.FIGHT:
        const ignorePp = args[0] as boolean | undefined;
        const targets = args[1] as MoveTargetSet | undefined;
        const useStruggle = cursor > -1 && !playerPokemon.getMoveset().filter((m) => m.isUsable(playerPokemon)).length;

        if (cursor === -1 || playerPokemon.trySelectMove(cursor, ignorePp) || useStruggle) {
          const moveId = !useStruggle
            ? cursor > -1
              ? playerPokemon.getMoveset()[cursor].moveId
              : MoveId.NONE
            : MoveId.STRUGGLE;
          const turnCommand: TurnCommand = {
            command: BattleCommand.FIGHT,
            cursor: cursor,
            move: { moveId: moveId, targets: [], ignorePP: ignorePp },
            args: args,
          };
          const moveTargets: MoveTargetSet = targets ?? getMoveTargets(playerPokemon, moveId);

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
          ui.setMode(UiMode.MESSAGE);

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
              ui.setMode(UiMode.FIGHT, this.fieldIndex);
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

        if (arena.biomeType === Biome.END && (!gameMode.isClassic || gameMode.isFreshStartChallenge() || notInDex)) {
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
              && !targetPokemon.hasAbility(Abilities.WONDER_GUARD, false, true)
              && cursor !== PokeballType.MASTER_BALL
            ) {
              failCatchRun("battle:noPokeballStrong");
            } else {
              currentBattle.turnCommands[this.fieldIndex] = {
                command: BattleCommand.BALL,
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
      case BattleCommand.RUN:
        if (arena.biomeType === Biome.END || mysteryEncounter?.fleeAllowed === false) {
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
                ui.setMode(UiMode.COMMAND, this.fieldIndex);
              }
            },
            null,
            true,
          );
        };

        if (batonPass || !playerPokemon.isTrapped(trappedAbMessages)) {
          currentBattle.turnCommands[this.fieldIndex] = isSwitch
            ? { command: BattleCommand.POKEMON, cursor: cursor, args: args }
            : { command: BattleCommand.RUN };
          success = true;
          if (!isSwitch && this.fieldIndex) {
            currentBattle.turnCommands[this.fieldIndex - 1]!.skip = true;
          }
        } else if (trappedAbMessages.length > 0) {
          if (!isSwitch) {
            ui.setMode(UiMode.MESSAGE);
          }
          showNoEscapeText(trappedAbMessages[0]);
        } else {
          const trapTag = playerPokemon.getTag(TrappedTag) ?? playerPokemon.getTag(SkyDropTag);
          const fairyLockTag = arena.getTagOnSide(ArenaTagType.FAIRY_LOCK, ArenaTagSide.PLAYER);

          if (!isSwitch) {
            ui.setMode(UiMode.COMMAND, this.fieldIndex);
            ui.setMode(UiMode.MESSAGE);
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
    globalScene.ui.setMode(UiMode.MESSAGE).then(() => super.end());
  }
}
