import { globalScene } from "#app/global-scene";
import type { EntryHazardTag } from "#arena-tags/entry-hazard-tag";
import { ENTRY_HAZARD_ARENA_TAG_TYPES } from "#constants/arena-tag-constants";
import type { AiType } from "#enums/ai-type";
import { ArenaTagSide } from "#enums/arena-tag-side";
import { TeraAIMode } from "#enums/tera-ai-mode";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { TrainerData } from "#trainers/trainer-data";
import { randSeedItem } from "#utils/random-utils";

export class TrainerAi {
  private readonly trainer: TrainerData;
  // TODO: should this be a separate enum from Pokemon AI type?
  public readonly aiType: AiType;
  public readonly teraMode: TeraAIMode;

  constructor(trainer: TrainerData, aiType: AiType, teraMode: TeraAIMode) {
    this.trainer = trainer;
    this.aiType = aiType;
    this.teraMode = teraMode;
  }

  public getPartyMemberMatchupScores(forSwitch: boolean = false): [number, number][] {
    const party = this.trainer.party;
    const nonFaintedLegalPartyMembers = party
      .slice(globalScene.currentBattle.getBattlerCount())
      .filter((p) => p.isAllowedInBattle());

    const partyMemberScores = nonFaintedLegalPartyMembers.map((pkmn) => {
      const playerField = globalScene.getPlayerField().filter((p) => p.isAllowedInBattle());
      let score = 0;

      playerField.forEach((p) => {
        score += pkmn.getMatchupScore(p);
        // TODO: why is this a thing
        if (p.species.isLegendary()) {
          score /= 2;
        }
      });

      score /= playerField.length;
      if (forSwitch) {
        globalScene.arena
          .getTags<EntryHazardTag>((t) => ENTRY_HAZARD_ARENA_TAG_TYPES.includes(t.tagType), ArenaTagSide.ENEMY)
          ?.map((t) => {
            score *= t.getMatchupScoreMultiplier(pkmn);
          });
      }

      return [party.indexOf(pkmn), score] as [number, number];
    });

    return partyMemberScores;
  }

  public getSortedPartyMemberMatchupScores(forSwitch: boolean = false): [number, number][] {
    return this.getPartyMemberMatchupScores(forSwitch).sort(([, scoreA], [, scoreB]) => scoreA - scoreB);
  }

  public getNextSummonIndex(): number {
    const sortedPartyMemberScores = this.getSortedPartyMemberMatchupScores();
    const candidates = sortedPartyMemberScores
      .filter(([, score]) => score === sortedPartyMemberScores[0][1])
      .map(([index]) => index);

    if (candidates.length > 1) {
      let result: number;
      globalScene.executeWithSeedOffset(() => {
        result = randSeedItem(candidates);
      }, globalScene.currentBattle.turn << 2);
      return result!;
    }

    return candidates[0];
  }

  public shouldTera(pokemon: EnemyPokemon): boolean {
    if (this.teraMode === TeraAIMode.INSTANT) {
      return pokemon.instantTera;
    }
    // TODO: Add support for other Tera modes
    return false;
  }
}
