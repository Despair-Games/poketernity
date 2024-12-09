import type { BattlerIndex } from "#enums/battler-index";
import { BattleType } from "#enums/battle-type";
import { globalScene } from "#app/global-scene";
import {
  applyPostFaintAbAttrs,
  applyPostKnockOutAbAttrs,
  applyPostVictoryAbAttrs,
  PostFaintAbAttr,
  PostKnockOutAbAttr,
  PostVictoryAbAttr,
} from "#app/data/ability";
import type { DestinyBondTag, GrudgeTag } from "#app/data/battler-tags";
import { BattlerTagLapseType } from "#app/data/battler-tags";
import { classicFinalBossDialogue } from "#app/data/dialogue";
import { allMoves, PostVictoryStatStageChangeAttr } from "#app/data/move";
import { SpeciesFormChangeActiveTrigger } from "#app/data/pokemon-forms";
import { StatusEffect } from "#app/enums/status-effect";
import type { EnemyPokemon } from "#app/field/pokemon";
import type Pokemon from "#app/field/pokemon";
import { PlayerPokemon, PokemonMove } from "#app/field/pokemon";
import { getPokemonNameWithAffix } from "#app/messages";
import { PokemonInstantReviveModifier } from "#app/modifier/modifier";
import { SwitchType } from "#enums/switch-type";
import i18next from "i18next";
import { DamageAnimPhase } from "./damage-anim-phase";
import { GameOverPhase } from "./game-over-phase";
import { PokemonPhase } from "./pokemon-phase";
import { SwitchPhase } from "./switch-phase";
import { SwitchSummonPhase } from "./switch-summon-phase";
import { ToggleDoublePositionPhase } from "./toggle-double-position-phase";
import { VictoryPhase } from "./victory-phase";
import { isNullOrUndefined } from "#app/utils";
import { FRIENDSHIP_LOSS_FROM_FAINT } from "#app/data/balance/starters";
import { HitResult } from "#app/enums/hit-result";

export class FaintPhase extends PokemonPhase {
  /**
   * Whether or not enduring (for this phase's purposes, Reviver Seed) should be prevented
   */
  private preventEndure: boolean;

  /**
   * Destiny Bond tag belonging to the currently fainting Pokemon, if applicable
   */
  private destinyTag?: DestinyBondTag | null;

  /**
   * Grudge tag belonging to the currently fainting Pokemon, if applicable
   */
  private grudgeTag?: GrudgeTag | null;

  /**
   * The source Pokemon that dealt fatal damage
   */
  private source?: Pokemon;

  constructor(
    battlerIndex: BattlerIndex,
    preventEndure: boolean = false,
    destinyTag?: DestinyBondTag | null,
    grudgeTag?: GrudgeTag | null,
    source?: Pokemon,
  ) {
    super(battlerIndex);

    this.preventEndure = preventEndure;
    this.destinyTag = destinyTag;
    this.grudgeTag = grudgeTag;
    this.source = source;
  }

  override start() {
    super.start();

    const faintPokemon = this.getPokemon();

    if (!isNullOrUndefined(this.destinyTag) && !isNullOrUndefined(this.source)) {
      this.destinyTag.lapse(this.source, BattlerTagLapseType.CUSTOM);
    }

    if (!isNullOrUndefined(this.grudgeTag) && !isNullOrUndefined(this.source)) {
      this.grudgeTag.lapse(faintPokemon, BattlerTagLapseType.CUSTOM, this.source);
    }

    if (!this.preventEndure) {
      const instantReviveModifier = globalScene.applyModifier(
        PokemonInstantReviveModifier,
        this.player,
        faintPokemon,
      ) as PokemonInstantReviveModifier;

      if (instantReviveModifier) {
        faintPokemon.loseHeldItem(instantReviveModifier);
        globalScene.updateModifiers(this.player);
        return this.end();
      }
    }

    /** In case the current pokemon was just switched in, make sure it is counted as participating in the combat */
    globalScene.getPlayerField().forEach((pokemon, _i) => {
      if (pokemon?.isActive(true)) {
        if (pokemon.isPlayer()) {
          globalScene.currentBattle.addParticipant(pokemon as PlayerPokemon);
        }
      }
    });

    if (globalScene.currentBattle.isClassicFinalBoss && !this.player) {
      this.handleFinalBossFaint();
    } else {
      this.doFaint();
    }
  }

  doFaint(): void {
    const pokemon = this.getPokemon();

    // Track total times pokemon have been KO'd for supreme overlord/last respects
    if (pokemon.isPlayer()) {
      globalScene.currentBattle.playerFaints += 1;
      globalScene.currentBattle.playerFaintsHistory.push({ pokemon: pokemon, turn: globalScene.currentBattle.turn });
    } else {
      globalScene.currentBattle.enemyFaints += 1;
      globalScene.currentBattle.enemyFaintsHistory.push({ pokemon: pokemon, turn: globalScene.currentBattle.turn });
    }

    globalScene.queueMessage(
      i18next.t("battle:fainted", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
      null,
      true,
    );
    globalScene.triggerPokemonFormChange(pokemon, SpeciesFormChangeActiveTrigger, true);

    if (pokemon.turnData?.attacksReceived?.length) {
      const lastAttack = pokemon.turnData.attacksReceived[0];
      applyPostFaintAbAttrs(
        PostFaintAbAttr,
        pokemon,
        globalScene.getPokemonById(lastAttack.sourceId)!,
        new PokemonMove(lastAttack.move).getMove(),
        lastAttack.result,
      ); // TODO: is this bang correct?
    } else {
      //If killed by indirect damage, apply post-faint abilities without providing a last move
      applyPostFaintAbAttrs(PostFaintAbAttr, pokemon);
    }

    const alivePlayField = globalScene.getField(true);
    alivePlayField.forEach((p) => applyPostKnockOutAbAttrs(PostKnockOutAbAttr, p, pokemon));
    if (pokemon.turnData?.attacksReceived?.length) {
      const defeatSource = globalScene.getPokemonById(pokemon.turnData.attacksReceived[0].sourceId);
      if (defeatSource?.isOnField()) {
        applyPostVictoryAbAttrs(PostVictoryAbAttr, defeatSource);
        const pvmove = allMoves[pokemon.turnData.attacksReceived[0].move];
        const pvattrs = pvmove.getAttrs(PostVictoryStatStageChangeAttr);
        if (pvattrs.length) {
          for (const pvattr of pvattrs) {
            pvattr.applyPostVictory(defeatSource, defeatSource, pvmove);
          }
        }
      }
    }

    if (this.player) {
      /** The total number of Pokemon in the player's party that can legally fight */
      const legalPlayerPokemon = globalScene.getPokemonAllowedInBattle();
      /** The total number of legal player Pokemon that aren't currently on the field */
      const legalPlayerPartyPokemon = legalPlayerPokemon.filter((p) => !p.isActive(true));
      if (!legalPlayerPokemon.length) {
        /** If the player doesn't have any legal Pokemon, end the game */
        globalScene.unshiftPhase(new GameOverPhase());
      } else if (
        globalScene.currentBattle.double
        && legalPlayerPokemon.length === 1
        && legalPlayerPartyPokemon.length === 0
      ) {
        /**
         * If the player has exactly one Pokemon in total at this point in a double battle, and that Pokemon
         * is already on the field, unshift a phase that moves that Pokemon to center position.
         */
        globalScene.unshiftPhase(new ToggleDoublePositionPhase(true));
      } else if (legalPlayerPartyPokemon.length > 0) {
        /**
         * If previous conditions weren't met, and the player has at least 1 legal Pokemon off the field,
         * push a phase that prompts the player to summon a Pokemon from their party.
         */
        globalScene.pushPhase(new SwitchPhase(SwitchType.SWITCH, this.fieldIndex, true, false));
      }
    } else {
      globalScene.unshiftPhase(new VictoryPhase(this.battlerIndex));
      if ([BattleType.TRAINER, BattleType.MYSTERY_ENCOUNTER].includes(globalScene.currentBattle.battleType)) {
        const hasReservePartyMember = !!globalScene
          .getEnemyParty()
          .filter((p) => p.isActive() && !p.isOnField() && p.trainerSlot === (pokemon as EnemyPokemon).trainerSlot)
          .length;
        if (hasReservePartyMember) {
          globalScene.pushPhase(new SwitchSummonPhase(SwitchType.SWITCH, this.fieldIndex, -1, false, false));
        }
      }
    }

    // in double battles redirect potential moves off fainted pokemon
    if (globalScene.currentBattle.double) {
      const allyPokemon = pokemon.getAlly();
      globalScene.redirectPokemonMoves(pokemon, allyPokemon);
    }

    pokemon.faintCry(() => {
      if (pokemon instanceof PlayerPokemon) {
        pokemon.addFriendship(-FRIENDSHIP_LOSS_FROM_FAINT);
      }
      pokemon.hideInfo();
      globalScene.playSound("se/faint");
      globalScene.tweens.add({
        targets: pokemon,
        duration: 500,
        y: pokemon.y + 150,
        ease: "Sine.easeIn",
        onComplete: () => {
          pokemon.resetSprite();
          pokemon.lapseTags(BattlerTagLapseType.FAINT);
          globalScene
            .getField(true)
            .filter((p) => p !== pokemon)
            .forEach((p) => p.removeTagsBySourceId(pokemon.id));

          pokemon.y -= 150;
          pokemon.trySetStatus(StatusEffect.FAINT);
          if (pokemon.isPlayer()) {
            globalScene.currentBattle.removeFaintedParticipant(pokemon as PlayerPokemon);
          } else {
            globalScene.addFaintedEnemyScore(pokemon as EnemyPokemon);
            globalScene.currentBattle.addPostBattleLoot(pokemon as EnemyPokemon);
          }
          globalScene.field.remove(pokemon);
          this.end();
        },
      });
    });
  }

  handleFinalBossFaint(): void {
    const enemy = this.getPokemon();
    if (enemy.formIndex > 0) {
      globalScene.ui.showDialogue(classicFinalBossDialogue.secondStageWin, enemy.species.name, null, () =>
        this.doFaint(),
      );
    } else {
      // Final boss' HP threshold has been bypassed; cancel faint and force check for 2nd phase
      enemy.hp++;
      globalScene.unshiftPhase(new DamageAnimPhase(enemy.getBattlerIndex(), 0, HitResult.OTHER));
      this.end();
    }
  }
}
