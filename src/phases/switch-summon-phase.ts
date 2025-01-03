import { globalScene } from "#app/global-scene";
import { applyPreSwitchOutAbAttrs } from "#app/data/ability";
import { PreSwitchOutAbAttr } from "#app/data/ab-attrs/pre-switch-out-ab-attr";
import { getPokeballTintColor } from "#app/data/pokeball";
import { SpeciesFormChangeActiveTrigger } from "#app/data/pokemon-forms";
import { TrainerSlot } from "#app/data/trainer-config";
import type { Pokemon } from "#app/field/pokemon";
import { getPokemonNameWithAffix } from "#app/messages";
import { SwitchEffectTransferModifier } from "#app/modifier/modifier";
import i18next from "i18next";
import { PostSummonPhase } from "./post-summon-phase";
import { SummonPhase } from "./summon-phase";
import { SubstituteTag } from "#app/data/battler-tags";
import { SwitchType } from "#enums/switch-type";

export class SwitchSummonPhase extends SummonPhase {
  private readonly switchType: SwitchType;
  private readonly slotIndex: number;
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

  override start(): void {
    super.start();
  }

  override preSummon(): void {
    if (!this.player) {
      if (this.slotIndex === -1) {
        //@ts-ignore
        this.slotIndex = globalScene.currentBattle.trainer?.getNextSummonIndex(
          !this.fieldIndex ? TrainerSlot.TRAINER : TrainerSlot.TRAINER_PARTNER,
        ); // TODO: what would be the default trainer-slot fallback?
      }
      if (this.slotIndex > -1) {
        this.showEnemyTrainer(!(this.fieldIndex % 2) ? TrainerSlot.TRAINER : TrainerSlot.TRAINER_PARTNER);
        globalScene.pbTrayEnemy.showPbTray(globalScene.getEnemyParty());
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
        globalScene.time.delayedCall(750, () => this.switchAndSummon());
        return;
      }
    }

    const pokemon = this.getPokemon();
    (this.player ? globalScene.getEnemyField() : globalScene.getPlayerField()).forEach((enemyPokemon) =>
      enemyPokemon.removeTagsBySourceId(pokemon.id),
    );
    if (this.switchType === SwitchType.SWITCH || this.switchType === SwitchType.INITIAL_SWITCH) {
      const substitute = pokemon.getTag(SubstituteTag);
      if (substitute) {
        globalScene.tweens.add({
          targets: substitute.sprite,
          duration: 250,
          scale: substitute.sprite.scale * 0.5,
          ease: "Sine.easeIn",
          onComplete: () => substitute.sprite.destroy(),
        });
      }
    }

    globalScene.ui.showText(
      this.player
        ? i18next.t("battle:playerComeBack", { pokemonName: getPokemonNameWithAffix(pokemon) })
        : i18next.t("battle:trainerComeBack", {
            trainerName: globalScene.currentBattle.trainer?.getName(
              !(this.fieldIndex % 2) ? TrainerSlot.TRAINER : TrainerSlot.TRAINER_PARTNER,
            ),
            pokemonName: pokemon.getNameToRender(),
          }),
    );
    globalScene.playSound("se/pb_rel");
    pokemon.hideInfo();
    pokemon.tint(getPokeballTintColor(pokemon.pokeball), 1, 250, "Sine.easeIn");
    globalScene.tweens.add({
      targets: pokemon,
      duration: 250,
      ease: "Sine.easeIn",
      scale: 0.5,
      onComplete: () => {
        pokemon.leaveField(this.switchType === SwitchType.SWITCH, false);
        globalScene.time.delayedCall(750, () => this.switchAndSummon());
      },
    });
  }

  switchAndSummon() {
    const party = this.player ? this.getParty() : globalScene.getEnemyParty();
    const switchedInPokemon = party[this.slotIndex];
    this.lastPokemon = this.getPokemon();
    applyPreSwitchOutAbAttrs(PreSwitchOutAbAttr, this.lastPokemon);
    if (this.switchType === SwitchType.BATON_PASS && switchedInPokemon) {
      (this.player ? globalScene.getEnemyField() : globalScene.getPlayerField()).forEach((enemyPokemon) =>
        enemyPokemon.transferTagsBySourceId(this.lastPokemon.id, switchedInPokemon.id),
      );
      if (
        !globalScene.findModifier(
          (m) =>
            m instanceof SwitchEffectTransferModifier
            && (m as SwitchEffectTransferModifier).pokemonId === switchedInPokemon.id,
        )
      ) {
        const batonPassModifier = globalScene.findModifier(
          (m) =>
            m instanceof SwitchEffectTransferModifier
            && (m as SwitchEffectTransferModifier).pokemonId === this.lastPokemon.id,
        ) as SwitchEffectTransferModifier;
        if (
          batonPassModifier
          && !globalScene.findModifier(
            (m) =>
              m instanceof SwitchEffectTransferModifier
              && (m as SwitchEffectTransferModifier).pokemonId === switchedInPokemon.id,
          )
        ) {
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
      const showTextAndSummon = () => {
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

  override onEnd(): void {
    super.onEnd();

    const pokemon = this.getPokemon();

    // Compensate for turn spent summoning
    // Or compensate for force switch move if switched out pokemon is not fainted
    if (this.switchType !== SwitchType.INITIAL_SWITCH) {
      pokemon.battleSummonData.turnCount--;
      pokemon.battleSummonData.waveTurnCount--;
      pokemon.resetTurnData();
      pokemon.turnData.switchedInThisTurn = true;
    }

    if (this.switchType === SwitchType.BATON_PASS && pokemon) {
      pokemon.transferSummon(this.lastPokemon);
    } else if (this.switchType === SwitchType.SHED_TAIL && pokemon) {
      const subTag = this.lastPokemon.getTag(SubstituteTag);
      if (subTag) {
        pokemon.summonData.tags.push(subTag);
      }
    }

    this.lastPokemon?.resetSummonData();

    globalScene.triggerPokemonFormChange(pokemon, SpeciesFormChangeActiveTrigger, true);
    // Reverts to weather-based forms when weather suppressors (Cloud Nine/Air Lock) are switched out
    globalScene.arena.triggerWeatherBasedFormChanges();
  }

  override queuePostSummon(): void {
    globalScene.unshiftPhase(new PostSummonPhase(this.getPokemon().getBattlerIndex()));
  }
}
