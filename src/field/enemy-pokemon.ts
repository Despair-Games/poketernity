import { globalScene } from "#app/global-scene";
import Overrides from "#app/overrides";
import type { EncoreTag } from "#battler-tags/encore-tag";
import { MOVE_LOCK_TAG_TYPES } from "#constants/battler-tag-constants";
import { DYNAMAX_DAMAGE_TAKEN_FACTOR, PLAYER_PARTY_MAX_SIZE } from "#constants/game-constants";
import { allMoves } from "#data/data-lists";
import { pokemonPreEvolutions } from "#data/pokemon-pre-evolutions";
import type PokemonSpecies from "#data/pokemon-species";
import { AbilityApplyMode } from "#enums/ability-apply-mode";
import { AiType } from "#enums/ai-type";
import { BattlerIndex, type FieldBattlerIndex } from "#enums/battler-index";
import { BattlerTagType } from "#enums/battler-tag-type";
import { Challenges } from "#enums/challenges";
import { ElementalType } from "#enums/elemental-type";
import { MoveCategory } from "#enums/move-category";
import { MoveId } from "#enums/move-id";
import { MoveTarget } from "#enums/move-target";
import type { PokeballType } from "#enums/pokeball-type";
import { SpeciesId } from "#enums/species-id";
import { EFFECTIVE_STATS, type EffectiveStat } from "#enums/stat";
import { TrainerSlot } from "#enums/trainer-slot";
import type { PlayerPokemon } from "#field/player-pokemon";
import { Pokemon } from "#field/pokemon";
import { PokemonMove } from "#field/pokemon-move";
import { SpeciesFormChangeActiveTrigger } from "#form-change-triggers/species-form-change-active-trigger";
import { CounterDamageAttr } from "#moves/counter-damage-attr";
import { CritOnlyAttr } from "#moves/crit-only-attr";
import { getMoveTargets } from "#moves/move";
import type PokemonData from "#system/pokemon-data";
import type { TurnMove } from "#types/move-types";
import { EnemyBattleInfo } from "#ui/battle-info";
import { isBetween, isNil, toDmgValue } from "#utils/common-utils";
import { randSeedInt, randSeedItem } from "#utils/random-utils";

export class EnemyPokemon extends Pokemon {
  public trainerSlot: TrainerSlot;
  public aiType: AiType;
  /** The amount of hp-segments the boss has (if the pokemon is a boss). */
  public bossSegments: number;
  /** The index of the current hp-segment (if the pokemon is a boss). E.g. if the boss has 5 segments and the first 2 are cleared, this will be 2 */
  public bossSegmentIndex: number;
  public initialTeamIndex: number;
  /** To indicate if the instance was populated with a dataSource -> e.g. loaded & populated from session data */
  public readonly isPopulatedFromDataSource: boolean;

  constructor(
    species: PokemonSpecies,
    level: number,
    trainerSlot: TrainerSlot,
    boss: boolean,
    shinyLock: boolean = false,
    dataSource?: PokemonData,
  ) {
    super(
      236,
      84,
      species,
      level,
      dataSource?.abilityIndex,
      dataSource?.formIndex,
      dataSource?.gender,
      !shinyLock && dataSource ? dataSource.shiny : false,
      !shinyLock && dataSource ? dataSource.variant : undefined,
      undefined,
      dataSource ? dataSource.nature : undefined,
      dataSource,
    );

    this.trainerSlot = trainerSlot;
    this.initialTeamIndex = globalScene.currentBattle?.enemyParty.length ?? 0;
    // if a dataSource is provided, then it was populated from dataSource
    this.isPopulatedFromDataSource = !!dataSource;
    if (boss) {
      this.setBoss(boss, dataSource?.bossSegments);
    }

    if (Overrides.ENEMY_STATUS_OVERRIDE) {
      this.setStatus(Overrides.ENEMY_STATUS_OVERRIDE, { sleepTurnsRemaining: 4 });
    }

    if (Overrides.ENEMY_GENDER_OVERRIDE) {
      this.gender = Overrides.ENEMY_GENDER_OVERRIDE;
    }

    const speciesId = this.species.speciesId;

    if (
      speciesId in Overrides.ENEMY_FORM_OVERRIDES
      && !isNil(Overrides.ENEMY_FORM_OVERRIDES[speciesId])
      && this.species.forms[Overrides.ENEMY_FORM_OVERRIDES[speciesId]]
    ) {
      this.formIndex = Overrides.ENEMY_FORM_OVERRIDES[speciesId];
    }

    if (!dataSource) {
      this.generateAndPopulateMoveset();

      if (shinyLock || Overrides.ENEMY_SHINY_OVERRIDE === false) {
        this.shiny = false;
      } else {
        this.trySetShiny();
      }

      if (!this.shiny && Overrides.ENEMY_SHINY_OVERRIDE) {
        this.shiny = true;
        this.initShinySparkle();
      }

      if (this.shiny) {
        this.variant = this.generateShinyVariant();
        if (Overrides.ENEMY_VARIANT_OVERRIDE !== null) {
          this.variant = Overrides.ENEMY_VARIANT_OVERRIDE;
        }
      }

      this.luck = this.shiny ? this.variant + 1 : 0;

      let preEvolution: SpeciesId;
      let speciesId = species.speciesId;
      while ((preEvolution = pokemonPreEvolutions[speciesId])) {
        speciesId = preEvolution;
      }

      this.teraType = randSeedItem(this.getTypes(false, false, true));
    }

    this.aiType = boss || this.hasTrainer() ? AiType.SMART : AiType.SMART_RANDOM;
  }

  initBattleInfo(): void {
    if (!this.battleInfo) {
      this.battleInfo = new EnemyBattleInfo();
      this.battleInfo.updateBossSegments(this);
      this.battleInfo.initInfo(this);
    } else {
      this.battleInfo.updateBossSegments(this);
    }
  }

  /**
   * Sets the pokemons boss status. If true initializes the boss segments either from the arguments
   * or through the the Scene.getEncounterBossSegments function
   *
   * @param boss if the pokemon is a boss
   * @param bossSegments amount of boss segments (health-bar segments)
   */
  setBoss(boss: boolean = true, bossSegments: number = 0): void {
    if (boss) {
      this.bossSegments =
        bossSegments
        || globalScene.getEncounterBossSegments(globalScene.currentBattle.waveIndex, this.level, this.species, true);
      this.bossSegmentIndex = this.bossSegments - 1;
    } else {
      this.bossSegments = 0;
      this.bossSegmentIndex = 0;
    }
  }

  override generateAndPopulateMoveset(formIndex?: number): void {
    switch (this.species.speciesId) {
      case SpeciesId.SMEARGLE:
        this.moveset = [
          new PokemonMove(MoveId.SKETCH),
          new PokemonMove(MoveId.SKETCH),
          new PokemonMove(MoveId.SKETCH),
          new PokemonMove(MoveId.SKETCH),
        ];
        break;
      case SpeciesId.ETERNATUS:
        this.moveset = (formIndex !== undefined ? formIndex : this.formIndex)
          ? [
              new PokemonMove(MoveId.DYNAMAX_CANNON),
              new PokemonMove(MoveId.CROSS_POISON),
              new PokemonMove(MoveId.FLAMETHROWER),
              new PokemonMove(MoveId.RECOVER, 0, -4),
            ]
          : [
              new PokemonMove(MoveId.ETERNABEAM),
              new PokemonMove(MoveId.SLUDGE_BOMB),
              new PokemonMove(MoveId.FLAMETHROWER),
              new PokemonMove(MoveId.COSMIC_POWER),
            ];
        if (globalScene.gameMode.hasChallenge(Challenges.INVERSE_BATTLE)) {
          this.moveset[2] = new PokemonMove(MoveId.THUNDERBOLT);
        }
        break;
      default:
        super.generateAndPopulateMoveset();
        break;
    }
  }

  /**
   * Determines the move this Pokemon will use on the next turn, as well as
   * the Pokemon the move will target.
   * @returns this Pokemon's next move in the format {move, moveTargets}
   */
  getNextMove(): TurnMove {
    // If this Pokemon has a move already queued, return it.
    const moveQueue = this.getMoveQueue();
    if (moveQueue.length !== 0) {
      const queuedMove = moveQueue[0];
      if (queuedMove) {
        const moveIndex = this.getMoveset().findIndex((m) => m?.moveId === queuedMove.move.id);
        if (
          (moveIndex > -1 && this.getMoveset()[moveIndex]!.isUsable(this, queuedMove.ignorePP))
          || queuedMove.virtual
        ) {
          MOVE_LOCK_TAG_TYPES.forEach((tagType) => this.lapseTag(tagType));
          return queuedMove;
        }
        this.getMoveQueue().shift();
        return this.getNextMove();
      }
    }

    // Filter out any moves this Pokemon cannot use
    let movePool = this.getMoveset().filter((m) => m.isUsable(this));
    // If no moves are left, use Struggle. Otherwise, continue with move selection
    if (movePool.length) {
      // If there's only 1 move in the move pool, use it.
      if (movePool.length === 1) {
        const move = movePool[0].getMove();
        return { move, targets: this.getNextTargets(move.id), type: this.getMoveType(move) };
      }
      // If a move is forced because of Encore, use it.
      const encoreTag = this.getTag<EncoreTag>(BattlerTagType.ENCORE);
      if (encoreTag) {
        const encoreMove = movePool.find((m) => m.moveId === encoreTag.moveId);
        if (encoreMove) {
          const move = encoreMove.getMove();
          return { move, targets: this.getNextTargets(move.id), type: this.getMoveType(move) };
        }
      }
      switch (this.aiType) {
        // No enemy should spawn with this AI type in-game
        case AiType.RANDOM: {
          const move = movePool[globalScene.randBattleSeedInt(movePool.length)].getMove();
          return { move, targets: this.getNextTargets(move.id), type: this.getMoveType(move) };
        }
        case AiType.SMART_RANDOM:
        case AiType.SMART: {
          /**
           * Search this Pokemon's move pool for moves that will KO an opposing target.
           * If there are any moves that can KO an opponent (i.e. a player Pokemon),
           * those moves are the only ones considered for selection on this turn.
           */
          const koMoves = movePool.filter((pkmnMove) => {
            if (!pkmnMove) {
              return false;
            }

            const move = pkmnMove.getMove()!;
            if (move.moveTarget === MoveTarget.ATTACKER) {
              return false;
            }

            const moveTargets = getMoveTargets(this, move.id)
              .targets.map((ind) => globalScene.getPokemonByBattlerIndex(ind))
              .filter((p) => !isNil(p) && this.isPlayer() !== p.isPlayer()) as Pokemon[];
            // Only considers critical hits for crit-only moves or when this Pokemon is under the effect of Laser Focus
            const isCritical = move.hasAttr(CritOnlyAttr) || this.hasTag(BattlerTagType.ALWAYS_CRIT);

            return (
              move.category !== MoveCategory.STATUS
              && moveTargets.some((p) => {
                const doesNotFail =
                  move.applyConditions(this, p, move)
                  || [MoveId.SUCKER_PUNCH, MoveId.UPPER_HAND, MoveId.THUNDERCLAP].includes(move.id);
                return (
                  doesNotFail && p.getAttackDamage(this, move, AbilityApplyMode.REVEALED, isCritical).damage >= p.hp
                );
              })
            );
          }, this);

          if (koMoves.length > 0) {
            movePool = koMoves;
          }

          /**
           * Move selection is based on the move's calculated "benefit score" against the
           * best possible target(s) (as determined by {@linkcode getNextTargets}).
           * For more information on how benefit scores are calculated, see `docs/enemy-ai.md`.
           */
          const moveScores = movePool.map(() => 0);
          const moveTargets = Object.fromEntries(movePool.map((m) => [m.moveId, this.getNextTargets(m.moveId)]));
          for (const m in movePool) {
            const pokemonMove = movePool[m];
            const move = pokemonMove.getMove();

            let moveScore = moveScores[m];
            const targetScores: number[] = [];

            for (const mt of moveTargets[move.id]) {
              // Prevent a target score from being calculated when the target is whoever attacks the user
              if (mt === BattlerIndex.ATTACKER) {
                break;
              }

              const target = globalScene.getPokemonByBattlerIndex(mt)!;
              /**
               * The "target score" of a move is given by the move's user benefit score + the move's target benefit score.
               * If the target is an ally, the target benefit score is multiplied by -1.
               */
              let targetScore =
                move.getUserBenefitScore(this, target, move)
                + move.getTargetBenefitScore(this, target, move)
                  * (mt < BattlerIndex.ENEMY === this.isPlayer() ? 1 : -1);
              if (Number.isNaN(targetScore)) {
                console.error(`Move ${move.name} returned score of NaN`);
                targetScore = 0;
              }
              /**
               * If this move is unimplemented, or the move is known to fail when used, set its
               * target score to -20
               */
              if (
                (move.name.endsWith(" (N)") || !move.applyConditions(this, target, move))
                && ![MoveId.SUCKER_PUNCH, MoveId.UPPER_HAND, MoveId.THUNDERCLAP].includes(move.id)
              ) {
                targetScore = -20;
              } else if (move.isAttackMove()) {
                /**
                 * Attack moves are given extra multipliers to their base benefit score based on
                 * the move's type effectiveness against the target and whether the move is a STAB move.
                 */
                const effectiveness = target.getMoveEffectiveness(this, move, AbilityApplyMode.REVEALED);
                if (target.isPlayer() !== this.isPlayer()) {
                  targetScore *= effectiveness;
                  if (this.isOfType(move.type)) {
                    targetScore *= 1.5;
                  }
                } else if (effectiveness) {
                  targetScore /= effectiveness;
                  if (this.isOfType(move.type)) {
                    targetScore /= 1.5;
                  }
                }
                /** If a move has a base benefit score of 0, its benefit score is assumed to be unimplemented at this point */
                if (!targetScore) {
                  targetScore = -20;
                }
              }
              targetScores.push(targetScore);
            }
            // When a move has multiple targets, its score is equal to the maximum target score across all targets
            moveScore += Math.max(...targetScores);

            // could make smarter by checking opponent def/spdef
            moveScores[m] = moveScore;
          }

          console.log(moveScores);

          // Sort the move pool in decreasing order of move score
          const sortedMovePool = movePool.slice(0);
          sortedMovePool.sort((a, b) => {
            const scoreA = moveScores[movePool.indexOf(a)];
            const scoreB = moveScores[movePool.indexOf(b)];
            return scoreA < scoreB ? 1 : scoreA > scoreB ? -1 : 0;
          });
          let r = 0;
          if (this.aiType === AiType.SMART_RANDOM) {
            // Has a 5/8 chance to select the best move, and a 3/8 chance to advance to the next best move (and repeat this roll)
            while (r < sortedMovePool.length - 1 && globalScene.randBattleSeedInt(8) >= 5) {
              r++;
            }
          } else if (this.aiType === AiType.SMART) {
            // The chance to advance to the next best move increases when the compared moves' scores are closer to each other.
            while (
              r < sortedMovePool.length - 1
              && moveScores[movePool.indexOf(sortedMovePool[r + 1])] / moveScores[movePool.indexOf(sortedMovePool[r])]
                >= 0
              && globalScene.randBattleSeedInt(100)
                < Math.round(
                  (moveScores[movePool.indexOf(sortedMovePool[r + 1])]
                    / moveScores[movePool.indexOf(sortedMovePool[r])])
                    * 50,
                )
            ) {
              r++;
            }
          }
          console.log(
            movePool.map((m) => m.getName()),
            moveScores,
            r,
            sortedMovePool.map((m) => m.getName()),
          );
          const retMove = sortedMovePool[r].getMove();
          return { move: retMove, targets: moveTargets[retMove.id], type: this.getMoveType(retMove) };
        }
      }
    }
    return {
      move: allMoves.get(MoveId.STRUGGLE),
      targets: this.getNextTargets(MoveId.STRUGGLE),
      type: ElementalType.UNKNOWN,
    };
  }

  /**
   * Determines the Pokemon the given move would target if used by this Pokemon
   * @param moveId {@linkcode MoveId} The move to be used
   * @returns The indexes of the Pokemon the given move would target
   */
  getNextTargets(moveId: MoveId): BattlerIndex[] {
    const moveTargets = getMoveTargets(this, moveId);
    if (
      moveTargets.targets.some((t) =>
        [BattlerIndex.ATTACKER, BattlerIndex.PLAYER_SIDE, BattlerIndex.ENEMY_SIDE, BattlerIndex.BOTH_SIDES].includes(t),
      )
    ) {
      return moveTargets.targets;
    }
    const targets = globalScene.getField(true).filter((p) => moveTargets.targets.indexOf(p.getBattlerIndex()) > -1);
    // If the move is multi-target, return all targets' indexes
    if (moveTargets.multiple) {
      return targets.map((p) => p.getBattlerIndex());
    }

    const move = allMoves.get(moveId);

    /**
     * Get the move's target benefit score against each potential target.
     * For allies, this score is multiplied by -1.
     */
    const benefitScores = targets.map((p) => [
      p.getBattlerIndex(),
      move.getTargetBenefitScore(this, p, move) * (p.isPlayer() === this.isPlayer() ? 1 : -1),
    ]);

    const sortedBenefitScores = benefitScores.slice(0);
    sortedBenefitScores.sort((a, b) => {
      const scoreA = a[1];
      const scoreB = b[1];
      return scoreA < scoreB ? 1 : scoreA > scoreB ? -1 : 0;
    });

    if (!sortedBenefitScores.length) {
      // Set target to BattlerIndex.ATTACKER when using a counter move
      // This is the same as when the player does so
      if (move.hasAttr(CounterDamageAttr)) {
        return [BattlerIndex.ATTACKER];
      }

      return [];
    }

    let targetWeights = sortedBenefitScores.map((s) => s[1]);
    const lowestWeight = targetWeights[targetWeights.length - 1];

    // If the lowest target weight (i.e. benefit score) is negative, add abs(lowestWeight) to all target weights
    if (lowestWeight < 1) {
      for (let w = 0; w < targetWeights.length; w++) {
        targetWeights[w] += Math.abs(lowestWeight - 1);
      }
    }

    // Remove any targets whose weights are less than half the max of the target weights from consideration
    const benefitCutoffIndex = targetWeights.findIndex((s) => s < targetWeights[0] / 2);
    if (benefitCutoffIndex > -1) {
      targetWeights = targetWeights.slice(0, benefitCutoffIndex);
    }

    const thresholds: number[] = [];
    let totalWeight: number = 0;
    targetWeights.reduce((total: number, w: number) => {
      total += w;
      thresholds.push(total);
      totalWeight = total;
      return total;
    }, 0);

    /**
     * Generate a random number from 0 to (totalWeight-1),
     * then select the first target whose cumulative weight (with all previous targets' weights)
     * is greater than that random number.
     */
    const randValue = globalScene.randBattleSeedInt(totalWeight);
    let targetIndex: number = 0;

    thresholds.every((t, i) => {
      if (randValue >= t) {
        return true;
      }

      targetIndex = i;
      return false;
    });

    return [sortedBenefitScores[targetIndex][0]];
  }

  override isPlayer(): this is PlayerPokemon {
    return false;
  }

  override isEnemy(): this is EnemyPokemon {
    return true;
  }

  hasTrainer(): boolean {
    return this.trainerSlot !== TrainerSlot.NONE;
  }

  isBoss(): boolean {
    return this.bossSegments > 0;
  }

  getBossSegments(): number {
    return this.bossSegments;
  }

  getBossSegmentIndex(): number {
    return this.bossSegmentIndex;
  }

  protected override damage(
    amount: number,
    {
      ignoreSegments = false,
      preventEndure = false,
      ignoreFaintPhase = false,
      ignoreDynamaxReduction = false,
    }: {
      ignoreSegments?: boolean;
      preventEndure?: boolean;
      ignoreFaintPhase?: boolean;
      ignoreDynamaxReduction?: boolean;
    } = {},
  ): number {
    if (this.isFainted()) {
      return 0;
    }

    let clearedBossSegmentIndex = this.isBoss() ? this.bossSegmentIndex + 1 : 0;

    /**
     * Modify the damage with the {@linkcode DYNAMAX_DAMAGE_TAKEN_FACTOR} for the checks
     * involving whether or not HP bars should break
     */
    amount = this.isMax(false) && !ignoreDynamaxReduction ? toDmgValue(amount * DYNAMAX_DAMAGE_TAKEN_FACTOR) : amount;

    if (this.isBoss() && !ignoreSegments) {
      // To consider a boss Pokemon as 1-hit faint, the damage calculation is different and depends on the hp segments.
      // Every segment past the first one gets a `x SegmentIndex` multiplier.
      // E.g. if the boss has 3 segments and each with 10 hp, the damage for the 1-hit faint must be at least `60`,
      // because `10 * 1 + 10 * 2 + 10 * 3 = 60`.
      const segmentSize = this.getMaxHp() / this.bossSegments;
      for (let s = this.bossSegmentIndex; s > 0; s--) {
        const hpThreshold = segmentSize * s;
        const roundedHpThreshold = Math.round(hpThreshold);
        if (this.hp >= roundedHpThreshold) {
          if (this.hp - amount <= roundedHpThreshold) {
            const hpRemainder = this.hp - roundedHpThreshold;
            let segmentsBypassed = 0;
            while (
              segmentsBypassed < this.bossSegmentIndex
              && this.canBypassBossSegments(segmentsBypassed + 1)
              && amount - hpRemainder >= Math.round(segmentSize * Math.pow(2, segmentsBypassed + 1))
            ) {
              segmentsBypassed++;
            }

            amount = toDmgValue(this.hp - hpThreshold + segmentSize * segmentsBypassed);
            clearedBossSegmentIndex = s - segmentsBypassed;
          }
          break;
        }
      }
    }

    /**
     * The actual place that the dynamax damage taken factor is applied is in Pokemon.damage
     * so here we divide by the dynamax damage taken factor and then it will be the proper value
     * when it is multiplied there
     */
    amount = this.isMax(false) && !ignoreDynamaxReduction ? toDmgValue(amount / DYNAMAX_DAMAGE_TAKEN_FACTOR) : amount;

    if (globalScene.currentBattle.isClassicFinalBoss) {
      if (!this.formIndex && this.bossSegmentIndex < 1) {
        amount = Math.min(amount, this.hp - 1);
      }
    }

    const damage = super.damage(amount, { preventEndure, ignoreFaintPhase, ignoreDynamaxReduction });

    if (this.isBoss()) {
      if (ignoreSegments) {
        const segmentSize = this.getMaxHp() / this.bossSegments;
        clearedBossSegmentIndex = Math.ceil(this.hp / segmentSize);
      }
      if (clearedBossSegmentIndex <= this.bossSegmentIndex) {
        this.handleBossSegmentCleared(clearedBossSegmentIndex);
      }
      this.battleInfo.updateBossSegments(this);
    }

    return damage;
  }

  canBypassBossSegments(segmentCount: number = 1): boolean {
    if (globalScene.currentBattle.isClassicFinalBoss) {
      if (!this.formIndex && this.bossSegmentIndex - segmentCount < 1) {
        return false;
      }
    }

    return true;
  }

  /**
   * Go through a boss' health segments and give stats boosts for each newly cleared segment
   * The base boost is 1 to a random stat that's not already maxed out per broken shield
   * For Pokemon with 3 health segments or more, breaking the last shield gives +2 instead
   * For Pokemon with 5 health segments or more, breaking the last two shields give +2 each
   * @param segmentIndex index of the segment to get down to (0 = no shield left, 1 = 1 shield left, etc.)
   */
  handleBossSegmentCleared(segmentIndex: number): void {
    while (this.bossSegmentIndex > 0 && segmentIndex - 1 < this.bossSegmentIndex) {
      // Filter out already maxed out stat stages and weigh the rest based on existing stats
      const leftoverStats = EFFECTIVE_STATS.filter((s: EffectiveStat) => this.getStatStage(s) < 6);
      const statWeights = leftoverStats.map((s: EffectiveStat) => this.getStat(s, false));

      let boostedStat: EffectiveStat;
      const statThresholds: number[] = [];
      let totalWeight = 0;

      for (const i in statWeights) {
        totalWeight += statWeights[i];
        statThresholds.push(totalWeight);
      }

      // Pick a random stat from the leftover stats to increase its stages
      const randInt = randSeedInt(totalWeight);
      for (const i in statThresholds) {
        if (randInt < statThresholds[i]) {
          boostedStat = leftoverStats[i];
          break;
        }
      }

      let stages = 1;

      // increase the boost if the boss has at least 3 segments and we passed last shield
      if (this.bossSegments >= 3 && this.bossSegmentIndex === 1) {
        stages++;
      }
      // increase the boost if the boss has at least 5 segments and we passed the second to last shield
      if (this.bossSegments >= 5 && this.bossSegmentIndex === 2) {
        stages++;
      }

      globalScene.phaseManager.createAndUnshiftPhase(
        "StatStageChangePhase",
        this.getBattlerIndex(),
        this,
        [boostedStat!],
        stages,
        { ignoreAbilities: true },
      );
      this.bossSegmentIndex--;
    }
  }

  getFieldIndex(): number {
    return globalScene.getEnemyField().indexOf(this);
  }

  getBattlerIndex(): FieldBattlerIndex {
    return BattlerIndex.ENEMY + this.getFieldIndex();
  }

  /**
   * Add a new pokemon to the player's party (at `slotIndex` if set).
   * The new pokemon's visibility will be set to `false`.
   * @param pokeballType the type of pokeball the pokemon was caught with
   * @param slotIndex an optional index to place the pokemon in the party
   * @returns the pokemon that was added or `undefined` if the pokemon could not be added
   * @todo This feels like it can be improved...
   */
  addToParty(pokeballType: PokeballType, slotIndex: number = -1): PlayerPokemon | undefined {
    const party = globalScene.getPlayerParty();
    let ret: PlayerPokemon | undefined;

    if (party.length < PLAYER_PARTY_MAX_SIZE) {
      this.pokeball = pokeballType;
      this.metLevel = this.level;
      this.metBiome = globalScene.arena.biomeId;
      this.metWave = globalScene.currentBattle.waveIndex;
      this.metSpecies = this.species.speciesId;
      const newPokemon = globalScene.addPlayerPokemon(
        this.species,
        this.level,
        this.abilityIndex,
        this.formIndex,
        this.gender,
        this.shiny,
        this.variant,
        this.ivs,
        this.nature,
        this,
      );

      if (isBetween(slotIndex, 0, PLAYER_PARTY_MAX_SIZE - 1)) {
        party.splice(slotIndex, 0, newPokemon);
      } else {
        party.push(newPokemon);
      }

      // Hide the Pokemon since it is not on the field
      newPokemon.setVisible(false);

      ret = newPokemon;
      globalScene.triggerPokemonFormChange(newPokemon, SpeciesFormChangeActiveTrigger, true);
    }

    return ret;
  }
}
