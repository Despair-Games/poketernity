import { globalScene } from "#app/global-scene";
import { activeOverrides } from "#app/overrides";
import { Phase } from "#app/phase";
import { AbilityId } from "#enums/ability-id";
import { BattleCommand } from "#enums/battle-command";
import { BattlerTagType } from "#enums/battler-tag-type";
import { TrainerSlot } from "#enums/trainer-slot";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";

/**
 * Phase for determining an enemy AI's action for the next turn.
 *
 * During this phase, the enemy decides whether to switch (if it has a trainer)
 * or to use a move from its moveset.
 *
 * For more information on how the Enemy AI works, see [`enemy-ai.md`](../../docs/enemy-ai.md)
 *
 * @see {@linkcode Pokemon.getMatchupScore}
 * @see {@linkcode EnemyPokemon.getNextMove}
 */
export class EnemyCommandPhase extends Phase {
  public override readonly phaseName = "EnemyCommandPhase";

  public readonly fieldIndex: number;

  constructor(fieldIndex: number) {
    super();

    this.fieldIndex = fieldIndex;
  }

  public override start(): void {
    if (globalScene.currentBattle.mysteryEncounter?.skipEnemyBattleTurns) {
      this.end();
      return;
    }

    const pokemon = globalScene.getEnemyField()[this.fieldIndex];

    const { currentBattle } = globalScene;
    const { trainerData } = currentBattle;

    if (
      currentBattle.double
      && pokemon.hasAbility(AbilityId.COMMANDER)
      && pokemon.getAlly()?.hasTag(BattlerTagType.COMMANDED)
    ) {
      this.end();
      return;
    }

    /**
     * If the enemy has a trainer, decide whether or not the enemy should switch
     * to another member in its party.
     *
     * This block compares the active enemy Pokemon's {@linkcode Pokemon.getMatchupScore | matchup score}
     * against the active player Pokemon with the enemy party's other non-fainted Pokemon. If a party
     * member's matchup score is 3x the active enemy's score (or 2x for "boss" trainers),
     * the enemy will switch to that Pokemon.
     */
    if (trainerData && pokemon.trainerSlot !== TrainerSlot.NONE && !pokemon.getMoveQueue().length) {
      const opponents = pokemon.getOpponents();
      const { ai } = trainerData.trainers[pokemon.trainerSlot]!;

      if (!pokemon.isTrapped()) {
        const partyMemberScores = ai.getSortedPartyMemberMatchupScores(true);

        if (partyMemberScores.length) {
          const matchupScores = opponents.map((opp) => pokemon.getMatchupScore(opp));
          const matchupScore = matchupScores.reduce((total, score) => (total += score), 0) / matchupScores.length;

          const switchMultiplier =
            1 - (currentBattle.enemySwitchCounter ? Math.pow(0.1, 1 / currentBattle.enemySwitchCounter) : 0);

          if (partyMemberScores[0][1] * switchMultiplier >= matchupScore * (trainerData.isBoss ? 2 : 3)) {
            const index = ai.getNextSummonIndex();

            currentBattle.turnManager.addCommand({
              pokemon,
              command: BattleCommand.POKEMON,
              cursor: index,
              args: [false],
            });

            currentBattle.enemySwitchCounter++;

            this.end();
            return;
          }
        }
      }
    }

    const shouldTrainerTera =
      pokemon.trainerSlot !== TrainerSlot.NONE && trainerData?.trainers[pokemon.trainerSlot]?.ai.shouldTera(pokemon);

    const command =
      (activeOverrides.FORCE_ENEMY_TERA_OVERRIDE && !pokemon.isTerastallized) || shouldTrainerTera
        ? BattleCommand.TERA
        : BattleCommand.FIGHT;

    currentBattle.turnManager.addCommand({
      pokemon,
      command,
      turnMove: pokemon.getNextMove(),
    });

    currentBattle.enemySwitchCounter = Math.max(currentBattle.enemySwitchCounter - 1, 0);

    this.end();
  }
}
