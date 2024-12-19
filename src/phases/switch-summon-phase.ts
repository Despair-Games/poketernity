import { PreSwitchOutAbAttr } from "#app/data/ab-attrs/pre-switch-out-ab-attr";
import { applyPreSwitchOutAbAttrs, PostDamageForceSwitchAbAttr } from "#app/data/ability";
import { SubstituteTag } from "#app/data/battler-tags";
import { allMoves, ForceSwitchOutAttr } from "#app/data/move";
import { getPokeballTintColor } from "#app/data/pokeball";
import { SpeciesFormChangeActiveTrigger } from "#app/data/pokemon-forms";
import { TrainerSlot } from "#app/data/trainer-config";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { SwitchEffectTransferModifier } from "#app/modifier/modifier";
import { Command } from "#app/ui/command-ui-handler";
import { SwitchType } from "#enums/switch-type";
import i18next from "i18next";
import { PostSummonPhase } from "./post-summon-phase";
import { SummonPhase } from "./summon-phase";

export class SwitchSummonPhase extends SummonPhase {
  private readonly switchType: SwitchType;
  private slotIndex: number;
  private readonly doReturn: boolean;

  private lastPokemon: Pokemon;

  /**
   * Constructor for creating a new SwitchSummonPhase
   * @param switchType the type of switch behavior
   * @param fieldIndex number representing position on the battle field
   * @param slotIndex number for the index of pokemon (in party of 6) to switch into
   * @param doReturn boolean whether to render "comeback" dialogue
   * @param player boolean if the switch is from the player
   */
  constructor(switchType: SwitchType, fieldIndex: number, slotIndex: number, doReturn: boolean, player?: boolean) {
    super(fieldIndex, player !== undefined ? player : true);

    this.switchType = switchType;
    this.slotIndex = slotIndex;
    this.doReturn = doReturn;
  }

  public override start(): void {
    super.start();
  }

  protected override preSummon(): void {
    const { currentBattle, pbTrayEnemy, time, tweens, ui } = globalScene;
    const { trainer } = currentBattle;

    if (!this.player) {
      if (this.slotIndex === -1 && trainer) {
        this.slotIndex = trainer.getNextSummonIndex(
          !this.fieldIndex ? TrainerSlot.TRAINER : TrainerSlot.TRAINER_PARTNER,
        );
      }

      if (this.slotIndex > -1) {
        this.showEnemyTrainer(!(this.fieldIndex % 2) ? TrainerSlot.TRAINER : TrainerSlot.TRAINER_PARTNER);
        pbTrayEnemy.showPbTray(globalScene.getEnemyParty());
      }
    }

    if (
      !this.doReturn
      || (this.slotIndex !== -1
        && !(this.player ? globalScene.getPlayerParty() : globalScene.getEnemyParty())[this.slotIndex])
    ) {
      if (this.player) {
        return this.switchAndSummon();
      } else {
        time.delayedCall(750, () => this.switchAndSummon());
        return;
      }
    }

    const pokemon = this.getPokemon();
    (this.player ? globalScene.getEnemyField() : globalScene.getPlayerField()).forEach((opposingPokemon: Pokemon) =>
      opposingPokemon.removeTagsBySourceId(pokemon.id),
    );

    if (this.switchType === SwitchType.SWITCH || this.switchType === SwitchType.INITIAL_SWITCH) {
      const substitute = pokemon.getTag(SubstituteTag);
      if (substitute) {
        tweens.add({
          targets: substitute.sprite,
          duration: 250,
          scale: substitute.sprite.scale * 0.5,
          ease: "Sine.easeIn",
          onComplete: () => substitute.sprite.destroy(),
        });
      }
    }

    ui.showText(
      this.player
        ? i18next.t("battle:playerComeBack", { pokemonName: getPokemonNameWithAffix(pokemon) })
        : i18next.t("battle:trainerComeBack", {
            trainerName: trainer?.getName(!(this.fieldIndex % 2) ? TrainerSlot.TRAINER : TrainerSlot.TRAINER_PARTNER),
            pokemonName: pokemon.getNameToRender(),
          }),
    );

    globalScene.playSound("se/pb_rel");
    pokemon.hideInfo();
    pokemon.tint(getPokeballTintColor(pokemon.pokeball), 1, 250, "Sine.easeIn");
    tweens.add({
      targets: pokemon,
      duration: 250,
      ease: "Sine.easeIn",
      scale: 0.5,
      onComplete: () => {
        pokemon.leaveField(this.switchType === SwitchType.SWITCH, false);
        time.delayedCall(750, () => this.switchAndSummon());
      },
    });
  }

  protected switchAndSummon(): void {
    const party = this.player ? this.getParty() : globalScene.getEnemyParty();
    const switchedInPokemon = party[this.slotIndex];
    this.lastPokemon = this.getPokemon();
    applyPreSwitchOutAbAttrs(PreSwitchOutAbAttr, this.lastPokemon);
    if (this.switchType === SwitchType.BATON_PASS && switchedInPokemon) {
      (this.player ? globalScene.getEnemyField() : globalScene.getPlayerField()).forEach((opposingPokemon: Pokemon) =>
        opposingPokemon.transferTagsBySourceId(this.lastPokemon.id, switchedInPokemon.id),
      );

      const baton = globalScene.findModifier(
        (m) => m instanceof SwitchEffectTransferModifier && m.pokemonId === switchedInPokemon.id,
      );

      if (!baton) {
        const batonPassModifier = globalScene.findModifier(
          (m) => m instanceof SwitchEffectTransferModifier && m.pokemonId === this.lastPokemon.id,
        ) as SwitchEffectTransferModifier;

        if (batonPassModifier) {
          globalScene.tryTransferHeldItemModifier(
            batonPassModifier,
            switchedInPokemon,
            false,
            undefined,
            undefined,
            undefined,
            false,
          );
        }
      }
    }

    if (switchedInPokemon) {
      party[this.slotIndex] = this.lastPokemon;
      party[this.fieldIndex] = switchedInPokemon;

      const showTextAndSummon = (): void => {
        globalScene.ui.showText(
          this.player
            ? i18next.t("battle:playerGo", { pokemonName: getPokemonNameWithAffix(switchedInPokemon) })
            : i18next.t("battle:trainerGo", {
                trainerName: globalScene.currentBattle.trainer?.getName(
                  !(this.fieldIndex % 2) ? TrainerSlot.TRAINER : TrainerSlot.TRAINER_PARTNER,
                ),
                pokemonName: this.getPokemon().getNameToRender(),
              }),
        );
        /**
         * If this switch is passing a Substitute, make the switched Pokemon match the returned Pokemon's state as it left.
         * Otherwise, clear any persisting tags on the returned Pokemon.
         */
        if (this.switchType === SwitchType.BATON_PASS || this.switchType === SwitchType.SHED_TAIL) {
          const substitute = this.lastPokemon.getTag(SubstituteTag);
          if (substitute) {
            switchedInPokemon.x += this.lastPokemon.getSubstituteOffset()[0];
            switchedInPokemon.y += this.lastPokemon.getSubstituteOffset()[1];
            switchedInPokemon.setAlpha(0.5);
          }
        } else {
          switchedInPokemon.resetSummonData();
        }
        this.summon();
      };
      if (this.player) {
        showTextAndSummon();
      } else {
        globalScene.time.delayedCall(1500, () => {
          this.hideEnemyTrainer();
          globalScene.pbTrayEnemy.hide();
          showTextAndSummon();
        });
      }
    } else {
      this.end();
    }
  }

  protected override onEnd(): void {
    super.onEnd();

    const pokemon = this.getPokemon();

    const moveId = globalScene.currentBattle.lastMove;
    const lastUsedMove = moveId ? allMoves[moveId] : undefined;

    const currentCommand = globalScene.currentBattle.turnCommands[this.fieldIndex]?.command;
    const lastPokemonIsForceSwitchedAndNotFainted =
      lastUsedMove?.hasAttr(ForceSwitchOutAttr) && !this.lastPokemon.isFainted();
    const lastPokemonHasForceSwitchAbAttr =
      this.lastPokemon.hasAbilityWithAttr(PostDamageForceSwitchAbAttr) && !this.lastPokemon.isFainted();

    // Compensate for turn spent summoning
    // Or compensate for force switch move if switched out pokemon is not fainted
    if (
      currentCommand === Command.POKEMON
      || lastPokemonIsForceSwitchedAndNotFainted
      || lastPokemonHasForceSwitchAbAttr
    ) {
      pokemon.battleSummonData.turnCount--;
      pokemon.battleSummonData.waveTurnCount--;
    }

    if (this.switchType === SwitchType.BATON_PASS && pokemon) {
      pokemon.transferSummon(this.lastPokemon);
    } else if (this.switchType === SwitchType.SHED_TAIL && pokemon) {
      const subTag = this.lastPokemon.getTag(SubstituteTag);
      if (subTag) {
        pokemon.summonData.tags.push(subTag);
      }
    }

    if (this.switchType !== SwitchType.INITIAL_SWITCH) {
      pokemon.resetTurnData();
      pokemon.turnData.switchedInThisTurn = true;
    }

    this.lastPokemon?.resetSummonData();

    globalScene.triggerPokemonFormChange(pokemon, SpeciesFormChangeActiveTrigger, true);
    // Reverts to weather-based forms when weather suppressors (Cloud Nine/Air Lock) are switched out
    globalScene.arena.triggerWeatherBasedFormChanges();
  }

  protected override queuePostSummon(): void {
    globalScene.unshiftPhase(new PostSummonPhase(this.getPokemon().getBattlerIndex()));
  }
}
