// -- start tsdoc imports --
/* eslint-disable @typescript-eslint/no-unused-vars */
import { type BattlerTag } from "#app/data/battler-tags/battler-tag";
import { type GameOverPhase } from "#app/phases/game-over-phase";
import { type MovePhase } from "#app/phases/move-phase";
/* eslint-enable @typescript-eslint/no-unused-vars */
// -- end tsdoc imports --

import type { PostFaintAbAttr } from "#app/data/abilities/ab-attrs/post-faint-ab-attr";
import type { PostKnockOutAbAttr } from "#app/data/abilities/ab-attrs/post-knock-out-ab-attr";
import type { PostVictoryAbAttr } from "#app/data/abilities/ab-attrs/post-victory-ab-attr";
import { applyAbAttrs } from "#app/data/abilities/apply-ab-attrs";
import type { DestinyBondTag } from "#app/data/battler-tags/destiny-bond-tag";
import type { GrudgeTag } from "#app/data/battler-tags/grudge-tag";
import { type SkyDropTag } from "#app/data/battler-tags/sky-drop-tag";
import { allMoves } from "#app/data/data-lists";
import { classicFinalBossDialogue } from "#app/data/dialogue";
import { PostVictoryStatStageChangeAttr } from "#app/data/moves/move-attrs/post-victory-stat-stage-change-attr";
import { SpeciesFormChangeActiveTrigger } from "#app/data/species-form-change-triggers/species-form-change-active-trigger";
import type { EnemyPokemon, Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { PokemonInstantReviveModifier } from "#app/modifier/modifier";
import { PokemonPhase } from "#app/phases/abstract-pokemon-phase";
import { DamageAnimPhase } from "#app/phases/damage-anim-phase";
import { SwitchPhase } from "#app/phases/switch-phase";
import { SwitchSummonPhase } from "#app/phases/switch-summon-phase";
import { ToggleDoublePositionPhase } from "#app/phases/toggle-double-position-phase";
import { VictoryPhase } from "#app/phases/victory-phase";
import { isNullOrUndefined } from "#app/utils";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { BattleType } from "#enums/battle-type";
import type { BattlerIndex } from "#enums/battler-index";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { HitResult } from "#enums/hit-result";
import { PhaseId } from "#enums/phase-id";
import { SwitchType } from "#enums/switch-type";
import i18next from "i18next";
import { FRIENDSHIP_LOST_FROM_FAINTING } from "#app/constants";

/**
 * Handles the effects of a pokemon fainting:
 * - Triggers the effects of Destiny Bond and Grudge
 * - Triggers Reviver Seed
 * - Handles final boss transformation to phase 2 and defeat
 * - Increments the Last Respects / Supreme Overload counters
 * - Displays the "pokemon fainted" message
 * - Triggers form changes
 * - Applies {@linkcode PostFaintAbAttr}s
 * - Applies {@linkcode PostKnockOutAbAttr}s
 * - Applies {@linkcode PostVictoryAbAttr}s
 * - If the fainted pokemon was the player's:
 *   - If the player's last valid pokemon just fainted then unshift a {@linkcode GameOverPhase},
 *     otherwise push a {@linkcode SwitchPhase} or {@linkcode ToggleDoublePositionPhase} as needed.
 * - If the fainted pokemon was the AI's:
 *   - Unshift a {@linkcode VictoryPhase}, then if this is a trainer battle and the AI
 *     has unfainted pokemon in reserve, push a {@linkcode SwitchSummonPhase}
 * - Redirect moves off of fainted targets in doubles (TODO: handle this in {@linkcode MovePhase}?)
 * - Play the pokemon's faint cry
 * - Handle friendship loss for player pokemon
 * - Lapse {@linkcode BattlerTagLapseType.FAINT} tags
 * - Clear {@linkcode BattlerTag}s from the fainted pokemon
 *
 * @extends PokemonPhase
 */
export class FaintPhase extends PokemonPhase {
  override readonly id = PhaseId.FAINT;

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

    if (!isNullOrUndefined(this.source)) {
      if (!isNullOrUndefined(this.destinyTag)) {
        this.destinyTag.lapse(this.source, BattlerTagLapseType.CUSTOM);
      }

      if (!isNullOrUndefined(this.grudgeTag)) {
        this.grudgeTag.lapse(faintPokemon, BattlerTagLapseType.CUSTOM, this.source);
      }
    }

    faintPokemon.getTag<SkyDropTag>(BattlerTagType.SKY_DROP)?.clearSkyDropEffects();
    faintPokemon.destroySubstitute();
    faintPokemon.lapseTag(BattlerTagType.COMMANDED);
    faintPokemon.resetSummonData();

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
        globalScene.currentBattle.addParticipant(pokemon);
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

    if (this.source && pokemon.turnData?.attacksReceived?.length) {
      const lastAttack = pokemon.turnData.attacksReceived[0];
      applyAbAttrs<PostFaintAbAttr>(
        AbAttrFlag.POST_FAINT,
        pokemon,
        false,
        this.source,
        allMoves.get(lastAttack.moveId),
      );
    } else {
      //If killed by indirect damage, apply post-faint abilities without providing the source of fatal damage
      applyAbAttrs<PostFaintAbAttr>(AbAttrFlag.POST_FAINT, pokemon, false);
    }

    const alivePlayField = globalScene.getField(true);
    alivePlayField.forEach((p) => applyAbAttrs<PostKnockOutAbAttr>(AbAttrFlag.POST_KNOCK_OUT, p, false, pokemon));
    if (pokemon.turnData?.attacksReceived?.length) {
      const defeatSource = globalScene.getPokemonById(pokemon.turnData.attacksReceived[0].sourceId);
      if (defeatSource?.isOnField()) {
        applyAbAttrs<PostVictoryAbAttr>(AbAttrFlag.POST_VICTORY, defeatSource, false);
        // TODO: Refactor Fell Stinger
        const pvmove = allMoves.get(pokemon.turnData.attacksReceived[0].moveId);
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
        globalScene.gameOver({ clearPhaseQueue: false });
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
    const allyPokemon = pokemon.getAlly();
    if (double && allyPokemon) {
      globalScene.redirectPokemonMoves(pokemon, allyPokemon);
    }

    pokemon.faintCry(() => {
      if (pokemon.isPlayer()) {
        pokemon.addFriendship(-1 * FRIENDSHIP_LOST_FROM_FAINTING);
      }
      pokemon.hideInfo();
      globalScene.audioManager.playSound("se/faint");
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
          pokemon.faint();
          if (pokemon.isPlayer()) {
            currentBattle.removeFaintedParticipant(pokemon);
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
