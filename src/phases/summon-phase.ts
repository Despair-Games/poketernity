import { BattleType } from "#app/battle";
import { getPokeballAtlasKey, getPokeballTintColor } from "#app/data/pokeball";
import { SpeciesFormChangeActiveTrigger } from "#app/data/pokemon-forms";
import { TrainerSlot } from "#app/data/trainer-config";
import { addPokeballOpenParticles } from "#app/field/anims";
import { FieldPosition, type Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { MysteryEncounterMode } from "#enums/mystery-encounter-mode";
import { PlayerGender } from "#enums/player-gender";
import i18next from "i18next";
import { GameOverPhase } from "./game-over-phase";
import { PartyMemberPokemonPhase } from "./abstract-party-member-pokemon-phase";
import { PostSummonPhase } from "./post-summon-phase";
import { ShinySparklePhase } from "./shiny-sparkle-phase";

export class SummonPhase extends PartyMemberPokemonPhase {
  private readonly loaded: boolean;

  constructor(fieldIndex: number, player: boolean = true, loaded: boolean = false) {
    super(fieldIndex, player);

    this.loaded = loaded;
  }

  public override start(): void {
    super.start();

    this.preSummon();
  }

  /**
   * Sends out a Pokemon before the battle begins and shows the appropriate messages
   */
  protected preSummon(): void {
    const { currentBattle, gameData, pbTray, pbTrayEnemy, time, trainer, tweens, ui } = globalScene;

    const partyMember = this.getPokemon();
    // If the Pokemon about to be sent out is fainted, illegal under a challenge, or no longer in the party for some reason, switch to the first non-fainted legal Pokemon
    if (!partyMember.isAllowedInBattle() || (this.isPlayer && !this.getParty().some((p) => p.id === partyMember.id))) {
      console.warn(
        "The Pokemon about to be sent out is fainted or illegal under a challenge. Attempting to resolve...",
      );

      // First check if they're somehow still in play, if so remove them.
      if (partyMember.isOnField()) {
        partyMember.leaveField();
      }

      const party = this.getParty();

      // Find the first non-fainted Pokemon index above the current one
      const legalIndex = party.findIndex((p, i) => i > this.partyMemberIndex && p.isAllowedInBattle());
      if (legalIndex === -1) {
        console.error("Party Details:\n", party);
        console.error("All available Pokemon were fainted or illegal!");
        globalScene.clearPhaseQueue();
        globalScene.unshiftPhase(new GameOverPhase());
        return this.end();
      }

      // Swaps the fainted Pokemon and the first non-fainted legal Pokemon in the party
      [party[this.partyMemberIndex], party[legalIndex]] = [party[legalIndex], party[this.partyMemberIndex]];
      console.warn(
        "Swapped %s %O with %s %O",
        getPokemonNameWithAffix(partyMember),
        partyMember,
        getPokemonNameWithAffix(party[0]),
        party[0],
      );
    }

    if (this.isPlayer) {
      ui.showText(i18next.t("battle:playerGo", { pokemonName: getPokemonNameWithAffix(this.getPokemon()) }));
      pbTray.hide();
      trainer.setTexture(`trainer_${gameData.gender === PlayerGender.FEMALE ? "f" : "m"}_back_pb`);

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

      time.delayedCall(750, () => this.summon());
    } else if (
      currentBattle.battleType === BattleType.TRAINER
      || currentBattle.mysteryEncounter?.encounterMode === MysteryEncounterMode.TRAINER_BATTLE
    ) {
      const trainerName = currentBattle.trainer?.getName(this.getTrainerSlot());
      const pokemonName = this.getPokemon().getNameToRender();
      const message = i18next.t("battle:trainerSendOut", { trainerName, pokemonName });

      pbTrayEnemy.hide();
      ui.showText(message, null, () => this.summon());
    } else if (currentBattle.isBattleMysteryEncounter()) {
      pbTrayEnemy.hide();
      this.summonWild();
    }
  }

  /**
   * Enemy trainer or player trainer will do animations to throw Pokeball and summon a Pokemon to the field.
   */
  protected summon(): void {
    const { add, currentBattle, field, time, tweens } = globalScene;
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
      const availablePartyMembers = this.getParty().filter((p) => p.isAllowedInBattle()).length;
      pokemon.setFieldPosition(
        !currentBattle.double || availablePartyMembers === 1 ? FieldPosition.CENTER : FieldPosition.LEFT,
      );
    }

    const fpOffset = pokemon.getFieldPositionOffset();

    pokeball.setVisible(true);

    tweens.add({
      targets: pokeball,
      duration: 650,
      x: (this.isPlayer ? 100 : 236) + fpOffset[0],
    });

    tweens.add({
      targets: pokeball,
      duration: 150,
      ease: "Cubic.easeOut",
      y: (this.isPlayer ? 70 : 34) + fpOffset[1],
      onComplete: () => {
        tweens.add({
          targets: pokeball,
          duration: 500,
          ease: "Cubic.easeIn",
          angle: 1440,
          y: (this.isPlayer ? 132 : 86) + fpOffset[1],
          onComplete: () => {
            globalScene.playSound("se/pb_rel");
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

            addPokeballOpenParticles(pokemon.x, pokemon.y - 16, pokemon.pokeball);

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
            tweens.add({
              targets: pokemon,
              duration: 250,
              ease: "Sine.easeIn",
              scale: pokemon.getSpriteScale(),
              onComplete: () => {
                pokemon.cry(pokemon.getHpRatio() > 0.25 ? undefined : { rate: 0.85 });
                pokemon.getSprite().clearTint();
                pokemon.resetSummonData();
                time.delayedCall(1000, () => this.end());
              },
            });
          },
        });
      },
    });
  }

  /**
   * Handles tweening and battle setup for a wild Pokemon that appears outside of the normal screen transition.
   * Wild Pokemon will ease and fade in onto the field, then perform standard summon behavior.
   * Currently only used by Mystery Encounters, as all other battle types pre-summon wild pokemon before screen transitions.
   */
  protected summonWild(): void {
    const { add, currentBattle, field, time, tweens } = globalScene;
    const pokemon = this.getPokemon();

    if (this.fieldIndex === 1) {
      pokemon.setFieldPosition(FieldPosition.RIGHT, 0);
    } else {
      const availablePartyMembers = this.getParty().filter((p) => !p.isFainted()).length;
      pokemon.setFieldPosition(
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
    tweens.add({
      targets: pokemon,
      x: "-=16",
      y: "+=16",
      alpha: 1,
      duration: 1000,
      ease: "Sine.easeIn",
      scale: pokemon.getSpriteScale(),
      onComplete: () => {
        pokemon.cry(pokemon.getHpRatio() > 0.25 ? undefined : { rate: 0.85 });
        pokemon.getSprite().clearTint();
        pokemon.resetSummonData();
        globalScene.updateFieldScale();
        time.delayedCall(1000, () => this.end());
      },
    });
  }

  protected onEnd(): void {
    const pokemon = this.getPokemon();

    if (pokemon.isShiny()) {
      globalScene.unshiftPhase(new ShinySparklePhase(pokemon.getBattlerIndex()));
    }

    pokemon.resetTurnData();

    if (
      !this.loaded
      || [BattleType.TRAINER, BattleType.MYSTERY_ENCOUNTER].includes(globalScene.currentBattle.battleType)
      || globalScene.currentBattle.waveIndex % 10 === 1
    ) {
      globalScene.triggerPokemonFormChange(pokemon, SpeciesFormChangeActiveTrigger, true);
      this.queuePostSummon();
    }
  }

  protected queuePostSummon(): void {
    globalScene.pushPhase(new PostSummonPhase(this.getPokemon().getBattlerIndex()));
  }

  public getTrainerSlot(): TrainerSlot {
    return !(this.fieldIndex % 2) ? TrainerSlot.TRAINER : TrainerSlot.TRAINER_PARTNER;
  }

  public override end(): void {
    this.onEnd();

    super.end();
  }
}
