/* biome-ignore-start lint/correctness/noUnusedImports: tsdoc imports */
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
/* biome-ignore-end lint/correctness/noUnusedImports: tsdoc imports */

import { globalScene } from "#app/global-scene";
import Overrides from "#app/overrides";
import { AbilityId } from "#enums/ability-id";
import { BattleCommand } from "#enums/battle-command";
import { BattlerTagType } from "#enums/battler-tag-type";
import { FieldPhase } from "#phases/base/field-phase";

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
export class EnemyCommandPhase extends FieldPhase {
  public override readonly phaseName = "EnemyCommandPhase";

  public readonly fieldIndex: number;

  constructor(fieldIndex: number) {
    super();

    this.fieldIndex = fieldIndex;
  }

  public override start(): void {
    super.start();

    if (globalScene.currentBattle.mysteryEncounter?.skipEnemyBattleTurns) {
      this.end();
      return;
    }

    const pokemon = globalScene.getEnemyField()[this.fieldIndex];

    const battle = globalScene.currentBattle;

    const trainer = battle.trainer;

    if (
      battle.double
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
    if (trainer && !pokemon.getMoveQueue().length) {
      const opponents = pokemon.getOpponents();

      if (!pokemon.isTrapped()) {
        const partyMemberScores = trainer.getPartyMemberMatchupScores(pokemon.trainerSlot, true);

        if (partyMemberScores.length) {
          const matchupScores = opponents.map((opp) => pokemon.getMatchupScore(opp));
          const matchupScore = matchupScores.reduce((total, score) => (total += score), 0) / matchupScores.length;

          const sortedPartyMemberScores = trainer.getSortedPartyMemberMatchupScores(partyMemberScores);

          const switchMultiplier = 1 - (battle.enemySwitchCounter ? Math.pow(0.1, 1 / battle.enemySwitchCounter) : 0);

          if (sortedPartyMemberScores[0][1] * switchMultiplier >= matchupScore * (trainer.config.isBoss ? 2 : 3)) {
            const index = trainer.getNextSummonIndex(pokemon.trainerSlot, partyMemberScores);

            battle.turnManager.addCommand({
              pokemon,
              command: BattleCommand.POKEMON,
              cursor: index,
              args: [false],
            });

            battle.enemySwitchCounter++;

            this.end();
            return;
          }
        }
      }
    }

    const command =
      (Overrides.FORCE_ENEMY_TERA_OVERRIDE && !pokemon.isTerastallized) || trainer?.shouldTera(pokemon)
        ? BattleCommand.TERA
        : BattleCommand.FIGHT;

    battle.turnManager.addCommand({
      pokemon,
      command,
      turnMove: pokemon.getNextMove(),
    });

    battle.enemySwitchCounter = Math.max(battle.enemySwitchCounter - 1, 0);

    this.end();
  }
}
