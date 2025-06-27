// -- start tsdoc imports --
/* biome-ignore-start lint/correctness/noUnusedImports: tsdoc imports */
import type { EncounterPhase } from "#phases/encounter-phase";
import type { PostSummonPhase } from "#phases/post-summon-phase";
/* biome-ignore-end lint/correctness/noUnusedImports: tsdoc imports */
// -- end tsdoc imports --

import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { getPokeballAtlasKey, getPokeballTintColor } from "#data/pokeball";
import { BattleType } from "#enums/battle-type";
import type { BattlerIndex } from "#enums/battler-index";
import { FieldPosition } from "#enums/field-position";
import { MysteryEncounterMode } from "#enums/mystery-encounter-mode";
import { PlayerGender } from "#enums/player-gender";
import type { Pokemon } from "#field/pokemon";
import { SpeciesFormChangeActiveTrigger } from "#form-change-triggers/species-form-change-active-trigger";
import { PokemonPhase } from "#phases/base/pokemon-phase";
import { settings } from "#system/settings-manager";
import type { PhaseKey } from "#types/phase-types";
import { playTween } from "#utils/anim-utils";
import i18next from "i18next";

interface SummonPhaseOptions {
  loaded?: boolean;
  playTrainerAnim?: boolean;
  delayPostSummon?: boolean;
}

/**
 * Phase to visually summon the Pokemon at the given {@linkcode fieldIndex} onto the field.
 * @extends PokemonPhase
 */
export class SummonPhase extends PokemonPhase {
  /** @override */
  public override readonly phaseName: PhaseKey = "SummonPhase";

  /**
   * If `true`, summons the Pokemon as if loading into a wave
   * @defaultValue `false`
   */
  private readonly loaded: boolean;
  /**
   * If `true` for an enemy Trainer's switch, this phase will play
   * an animation on the Trainer before the "thrown Poke Ball" animation.
   * This does not affect summons on the Player's side since part of the
   * Player Trainer's animation is implemented in {@linkcode EncounterPhase}.
   * @defaultValue `true`
   */
  private readonly playTrainerAnim: boolean;
  /**
   * If `true`, this phase will push its corresponding {@linkcode PostSummonPhase}
   * to the phase manager instead of unshifting it.
   * @defaultValue `false`
   * @privateRemarks
   * This should be enabled whenever multiple Pokemon are summoned at the same
   * time outside of a turn in battle, e.g. at the start of a Trainer battle.
   */
  private readonly delayPostSummon: boolean;

  constructor(
    battlerIndex: BattlerIndex,
    { loaded = false, playTrainerAnim = true, delayPostSummon = false }: SummonPhaseOptions = {},
  ) {
    super(battlerIndex);

    this.loaded = loaded;
    this.playTrainerAnim = playTrainerAnim;
    this.delayPostSummon = delayPostSummon;
  }

  // #region Public Methods

  public override start(): void {
    super.start();

    this.playSummonSequence().then(() => this.end());
  }

  public override end(): void {
    const { waveIndex } = globalScene.currentBattle;
    const pokemon = this.getPokemon();

    if (pokemon.isShiny()) {
      globalScene.phaseManager.createAndUnshiftPhase("ShinySparklePhase", pokemon.getBattlerIndex());
    }

    // TODO: The conditions to apply post-summon effects here are inaccurate
    if (!this.loaded || waveIndex % 10 === 1) {
      globalScene.triggerPokemonFormChange(pokemon, SpeciesFormChangeActiveTrigger, true);
      this.queuePostSummon();
    }

    super.end();
  }

  // #endregion
  // #region Private Methods

  /**
   * Plays animations for the Trainer summoning the Pokemon, then plays
   * summon animations for the Pokemon.
   */
  private async playSummonSequence(): Promise<void> {
    const { currentBattle, pbTrayEnemy, trainer } = globalScene;
    if (this.isPlayer) {
      if (trainer.visible) {
        await this.playPlayerTrainerThrowSequence();
      }
      await this.playPokeBallSummonFX();
    } else if (
      currentBattle.battleType === BattleType.TRAINER
      || currentBattle.mysteryEncounter?.encounterMode === MysteryEncounterMode.TRAINER_BATTLE
    ) {
      if (this.playTrainerAnim) {
        await this.playEnemyTrainerThrowSequence();
      }
      await this.playPokeBallSummonFX();
    } else {
      // At the moment, this is only reached during Mystery Encounters where the Player
      // may battle "wild" Pokemon. The enemy's Poke Ball tray is shown during prior phases
      // of the encounter.
      pbTrayEnemy.hide();
      await this.playWildSummonFX();
    }
  }

  /**
   * Plays all animations targeting the Player Trainer during the summon
   * sequence. This assumes the Player Trainer sprite is already visible and
   * on the field, e.g. after the animation sequence in {@linkcode EncounterPhase}
   */
  private async playPlayerTrainerThrowSequence(): Promise<void> {
    const { pbTray, time, trainer, tweens, ui } = globalScene;

    ui.showText(i18next.t("battle:playerGo", { pokemonName: getPokemonNameWithAffix(this.getPokemon()) }));
    pbTray.hide();
    trainer.setTexture(`trainer_${settings.display.playerGender === PlayerGender.FEMALE ? "f" : "m"}_back_pb`);

    time.delayedCall(562, () => {
      trainer.setFrame("2");
      time.delayedCall(64, () => {
        trainer.setFrame("3");
      });
    });

    tweens.add({
      targets: trainer,
      x: -36,
      duration: 1000,
      onComplete: () => trainer.setVisible(false),
    });

    // Resolve 750 ms into the above Tween animation
    await new Promise<void>((resolve) => time.delayedCall(750, resolve));
  }

  /**
   * Plays all animations targeting the Enemy Trainer during the summon
   * sequence. The Trainer first enters the field while showing its Poke Ball tray,
   * then hides itself as it announces the Pokemon entering the field.
   */
  private async playEnemyTrainerThrowSequence(): Promise<void> {
    const { currentBattle, pbTrayEnemy, ui } = globalScene;
    const { trainer } = currentBattle;
    if (!trainer) {
      console.warn("SummonPhase: Enemy Trainer is missing!");
      return;
    }

    if (!trainer.visible) {
      await this.playEnemyTrainerEntranceAnim();
    }

    await Promise.allSettled([this.hideEnemyTrainer, pbTrayEnemy.hide]);

    const trainerName = trainer.getName(this.getTrainerSlot());
    const pokemonName = this.getPokemon().getNameToRender();
    const message = i18next.t("battle:trainerSendOut", { trainerName, pokemonName });

    await new Promise<void>((resolve) => ui.showText(message, null, resolve));
  }

  /**
   * Plays an animation to move the enemy Trainer onto the field.
   * This, of course, assumes the Pokemon to switch in is an enemy
   */
  private async playEnemyTrainerEntranceAnim(): Promise<void> {
    await this.showEnemyTrainer(this.getTrainerSlot());
    await globalScene.pbTrayEnemy.showPbTray(globalScene.getEnemyParty());
    await new Promise<void>((resolve) => globalScene.time.delayedCall(1000, resolve));
  }

  /**
   * Plays animations to summon this phase's Pokemon from its Poke Ball.
   * More specifically, this animates the Poke Ball's movement to the Pokemon's field position,
   * the Pokemon exiting from the Poke Ball, and the Pokemon's entrance animation and cry.
   */
  private async playPokeBallSummonFX(): Promise<void> {
    const { add, currentBattle, field, time, animations } = globalScene;
    const pokemon = this.getPokemon();

    const pokeball = globalScene.addFieldSprite(
      this.isPlayer ? 36 : 248,
      this.isPlayer ? 80 : 44,
      "pb",
      getPokeballAtlasKey(pokemon.pokeball),
    );
    pokeball.setVisible(false);
    pokeball.setOrigin(0.5, 0.625);
    field.add(pokeball);

    if (this.fieldIndex === 1) {
      pokemon.setFieldPosition(FieldPosition.RIGHT, 0);
    } else {
      const availablePartyMembers = this.getAlliedParty().filter((p) => p.isAllowedInBattle()).length;
      pokemon.setFieldPosition(
        !currentBattle.double || availablePartyMembers === 1 ? FieldPosition.CENTER : FieldPosition.LEFT,
      );
    }

    const fpOffset = pokemon.getFieldPositionOffset();

    pokeball.setVisible(true);

    const pokeBallXAnimation = playTween({
      targets: pokeball,
      duration: 650,
      x: (this.isPlayer ? 100 : 236) + fpOffset[0],
    });

    const pokeBallYAnimation = async () => {
      await playTween({
        targets: pokeball,
        duration: 150,
        ease: "Cubic.easeOut",
        y: (this.isPlayer ? 70 : 34) + fpOffset[1],
      });

      await playTween({
        targets: pokeball,
        duration: 500,
        ease: "Cubic.easeIn",
        y: (this.isPlayer ? 132 : 86) + fpOffset[1],
      });
    };

    await Promise.allSettled([pokeBallXAnimation, pokeBallYAnimation()]);

    globalScene.audioManager.playSound("se/pb_rel");
    pokeball.destroy();
    add.existing(pokemon);
    field.add(pokemon);

    if (!this.isPlayer) {
      const playerPokemon = globalScene.getPlayerPokemon() as Pokemon;
      if (playerPokemon?.isOnField()) {
        field.moveBelow(pokemon, playerPokemon);
      }
      currentBattle.seenEnemyPartyMemberIds.add(pokemon.id);
    }

    animations.addPokeballOpenParticles(pokemon.x, pokemon.y - 16, pokemon.pokeball);
    globalScene.updateModifiers(this.isPlayer);
    globalScene.updateFieldScale();

    pokemon.showInfo();
    pokemon.playAnim();
    pokemon.setVisible(true);
    pokemon.getSprite().setVisible(true);
    pokemon.setScale(0.5);
    pokemon.tint(getPokeballTintColor(pokemon.pokeball));
    pokemon.untint(250, "Sine.easeIn");

    globalScene.updateFieldScale();

    await playTween({
      targets: pokemon,
      duration: 250,
      ease: "Sine.easeIn",
      scale: pokemon.getSpriteScale(),
    });

    pokemon.cry(pokemon.getHpRatio() > 0.25 ? undefined : { rate: 0.85 });
    pokemon.getSprite().clearTint();
    // required to load the proper assets when loading from save data
    if (pokemon.summonData.speciesForm) {
      pokemon.loadAssets(false);
    }

    await new Promise<void>((resolve) => time.delayedCall(1000, resolve));
  }

  /**
   * Handles tweening and battle setup for a wild Pokemon that appears outside of the normal screen transition.
   * Wild Pokemon will ease and fade in onto the field, then perform standard summon behavior.
   * Currently only used by Mystery Encounters, as all other battle types pre-summon wild pokemon before screen transitions.
   * @todo Are any of these animations recycled from other phases? If so, can they be
   * implemented as `Pokemon` methods?
   */
  private async playWildSummonFX(): Promise<void> {
    const { add, currentBattle, field, time } = globalScene;
    const pokemon = this.getPokemon();

    if (this.fieldIndex === 1) {
      await pokemon.setFieldPosition(FieldPosition.RIGHT);
    } else {
      const availablePartyMembers = this.getAlliedParty().filter((p) => !p.isFainted()).length;
      await pokemon.setFieldPosition(
        !currentBattle.double || availablePartyMembers === 1 ? FieldPosition.CENTER : FieldPosition.LEFT,
      );
    }

    add.existing(pokemon);
    field.add(pokemon);

    if (!this.isPlayer) {
      const playerPokemon = globalScene.getPlayerPokemon() as Pokemon;
      if (playerPokemon?.isOnField()) {
        field.moveBelow(pokemon, playerPokemon);
      }
      currentBattle.seenEnemyPartyMemberIds.add(pokemon.id);
    }

    globalScene.updateModifiers(this.isPlayer);
    globalScene.updateFieldScale();

    pokemon.showInfo();
    pokemon.playAnim();
    pokemon.setVisible(true);
    pokemon.getSprite().setVisible(true);
    pokemon.setScale(0.75);
    pokemon.tint(getPokeballTintColor(pokemon.pokeball));
    pokemon.untint(250, "Sine.easeIn");
    globalScene.updateFieldScale();
    pokemon.x += 16;
    pokemon.y -= 20;
    pokemon.alpha = 0;

    // Ease pokemon in
    await playTween({
      targets: pokemon,
      x: "-=16",
      y: "+=16",
      alpha: 1,
      duration: 1000,
      ease: "Sine.easeIn",
      scale: pokemon.getSpriteScale(),
    });

    pokemon.cry(pokemon.getHpRatio() > 0.25 ? undefined : { rate: 0.85 });
    pokemon.getSprite().clearTint();
    /** @todo Should this be removed? */
    pokemon.resetSummonData();
    globalScene.updateFieldScale();

    await new Promise((resolve) => time.delayedCall(1000, resolve));
  }

  private queuePostSummon(): void {
    const { phaseManager } = globalScene;
    if (this.delayPostSummon) {
      phaseManager.createAndPushPhase("PostSummonPhase", this.battlerIndex);
    } else {
      phaseManager.createAndUnshiftPhase("PostSummonPhase", this.battlerIndex);
    }
  }

  // #endregion
}
