import type { BattlerIndex } from "#app/battle";
import { BattleType } from "#app/battle";
import { PostFaintAbAttr } from "#app/data/ab-attrs/post-faint-ab-attr";
import { PostKnockOutAbAttr } from "#app/data/ab-attrs/post-knock-out-ab-attr";
import { PostVictoryAbAttr } from "#app/data/ab-attrs/post-victory-ab-attr";
import { applyPostFaintAbAttrs, applyPostKnockOutAbAttrs, applyPostVictoryAbAttrs } from "#app/data/ability";
import { FRIENDSHIP_LOSS_FROM_FAINT } from "#app/data/balance/starters";
import type { DestinyBondTag, GrudgeTag } from "#app/data/battler-tags";
import { BattlerTagLapseType } from "#app/data/battler-tags";
import { classicFinalBossDialogue } from "#app/data/dialogue";
import { allMoves } from "#app/data/all-moves";
import { PostVictoryStatStageChangeAttr } from "#app/data/move-attrs/post-victory-stat-stage-change-attr";
import { SpeciesFormChangeActiveTrigger } from "#app/data/pokemon-forms";
import type { EnemyPokemon, Pokemon } from "#app/field/pokemon";
import { HitResult, PlayerPokemon, PokemonMove } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { PokemonInstantReviveModifier } from "#app/modifier/modifier";
import { isNullOrUndefined } from "#app/utils";
import { StatusEffect } from "#enums/status-effect";
import { SwitchType } from "#enums/switch-type";
import i18next from "i18next";
import { DamageAnimPhase } from "./damage-anim-phase";
import { GameOverPhase } from "./game-over-phase";
import { PokemonPhase } from "./abstract-pokemon-phase";
import { SwitchPhase } from "./switch-phase";
import { SwitchSummonPhase } from "./switch-summon-phase";
import { ToggleDoublePositionPhase } from "./toggle-double-position-phase";
import { VictoryPhase } from "./victory-phase";

export class FaintPhase extends PokemonPhase {
  /** Whether or not enduring (for this phase's purposes, Reviver Seed) should be prevented */
  private readonly preventEndure: boolean;

  /** Destiny Bond tag belonging to the currently fainting Pokemon, if applicable */
  private readonly destinyTag?: DestinyBondTag | null;

  /** Grudge tag belonging to the currently fainting Pokemon, if applicable */
  private readonly grudgeTag?: GrudgeTag | null;

  /** The source Pokemon that dealt fatal damage */
  private readonly source?: Pokemon;

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

  public override start(): void {
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
        this.isPlayer,
        faintPokemon,
      ) as PokemonInstantReviveModifier;

      if (instantReviveModifier) {
        faintPokemon.loseHeldItem(instantReviveModifier);
        globalScene.updateModifiers(this.isPlayer);
        return this.end();
      }
    }

    // In case the current pokemon was just switched in, make sure it is counted as participating in the combat
    globalScene.getPlayerField().forEach((pokemon) => {
      if (pokemon?.isActive(true)) {
        if (pokemon.isPlayer()) {
          globalScene.currentBattle.addParticipant(pokemon as PlayerPokemon);
        }
      }
    });

    if (globalScene.currentBattle.isClassicFinalBoss && !this.isPlayer) {
      this.handleFinalBossFaint();
    } else {
      this.doFaint();
    }
  }

  protected doFaint(): void {
    const { currentBattle, field, tweens } = globalScene;
    const { battleType, double, enemyFaintsHistory, playerFaintsHistory, turn } = currentBattle;
    const pokemon = this.getPokemon();

    // Track total times pokemon have been KO'd for supreme overlord/last respects
    if (pokemon.isPlayer()) {
      currentBattle.playerFaints += 1;
      playerFaintsHistory.push({ pokemon: pokemon, turn: turn });
    } else {
      currentBattle.enemyFaints += 1;
      enemyFaintsHistory.push({ pokemon: pokemon, turn: turn });
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
        globalScene.getPokemonById(lastAttack.sourceId)!, // TODO: is this bang correct?
        new PokemonMove(lastAttack.move).getMove(),
        lastAttack.result,
      );
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
        // TODO: Refactor Fell Stinger
        const pvmove = allMoves[pokemon.turnData.attacksReceived[0].move];
        const pvattrs = pvmove.getAttrs(PostVictoryStatStageChangeAttr);
        if (pvattrs.length) {
          for (const pvattr of pvattrs) {
            pvattr.applyPostVictory(defeatSource, defeatSource, pvmove);
          }
        }
      }
    }

    if (this.isPlayer) {
      /** The total number of Pokemon in the player's party that can legally fight */
      const legalPlayerPokemon = globalScene.getPokemonAllowedInBattle();
      /** The total number of legal player Pokemon that aren't currently on the field */
      const legalPlayerPartyPokemon = legalPlayerPokemon.filter((p) => !p.isActive(true));
      if (!legalPlayerPokemon.length) {
        globalScene.unshiftPhase(new GameOverPhase());
      } else if (double && legalPlayerPokemon.length === 1 && legalPlayerPartyPokemon.length === 0) {
        /**
         * If the player has exactly one Pokemon in total at this point in a double battle, and that Pokemon
         * is already on the field, push a phase that moves that Pokemon to center position.
         */
        globalScene.pushPhase(new ToggleDoublePositionPhase(true));
      } else if (legalPlayerPartyPokemon.length > 0) {
        /**
         * If previous conditions weren't met, and the player has at least 1 legal Pokemon off the field,
         * push a phase that prompts the player to summon a Pokemon from their party.
         */
        globalScene.pushPhase(new SwitchPhase(SwitchType.SWITCH, this.fieldIndex, true, false));
      }
    } else {
      globalScene.unshiftPhase(new VictoryPhase(this.battlerIndex));
      if ([BattleType.TRAINER, BattleType.MYSTERY_ENCOUNTER].includes(battleType)) {
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
    if (double) {
      const allyPokemon = pokemon.getAlly();
      globalScene.redirectPokemonMoves(pokemon, allyPokemon);
    }

    pokemon.faintCry(() => {
      if (pokemon instanceof PlayerPokemon) {
        pokemon.addFriendship(-FRIENDSHIP_LOSS_FROM_FAINT);
      }
      pokemon.hideInfo();
      globalScene.playSound("se/faint");
      tweens.add({
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
            currentBattle.removeFaintedParticipant(pokemon as PlayerPokemon);
          } else {
            globalScene.addFaintedEnemyScore(pokemon as EnemyPokemon);
            currentBattle.addPostBattleLoot(pokemon as EnemyPokemon);
          }
          field.remove(pokemon);
          this.end();
        },
      });
    });
  }

  protected handleFinalBossFaint(): void {
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
