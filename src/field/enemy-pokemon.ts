import type { TurnMove } from "#app/@types/TurnMove";
import { BAD_MOVE_PENALTY } from "#app/constants/ai-constants";
import { DYNAMAX_DAMAGE_TAKEN_FACTOR, PLAYER_PARTY_MAX_SIZE } from "#app/constants/game-constants";
import type { ConditionalCritAbAttr } from "#app/data/abilities/ab-attrs/conditional-crit-ab-attr";
import { applyAbAttrs } from "#app/data/abilities/apply-ab-attrs";
import { allMoves } from "#app/data/data-lists";
import { getMoveTargets, type Move } from "#app/data/moves/move";
import { CounterDamageAttr } from "#app/data/moves/move-attrs/counter-damage-attr";
import { CritOnlyAttr } from "#app/data/moves/move-attrs/crit-only-attr";
import { FixedDamageAttr } from "#app/data/moves/move-attrs/fixed-damage-attr";
import { pokemonPreEvolutions } from "#app/data/pokemon-pre-evolutions";
import type PokemonSpecies from "#app/data/pokemon-species";
import { SpeciesFormChangeActiveTrigger } from "#app/data/species-form-change-triggers/species-form-change-active-trigger";
import { Status } from "#app/data/status-effect";
import type { PlayerPokemon } from "#app/field/player-pokemon";
import { Pokemon, type TargetScoreData } from "#app/field/pokemon";
import { PokemonMove } from "#app/field/pokemon-move";
import { globalScene } from "#app/global-scene";
import Overrides from "#app/overrides";
import { StatStageChangePhase } from "#app/phases/stat-stage-change-phase";
import type PokemonData from "#app/system/pokemon-data";
import type { TurnCommand } from "#app/turn-command-manager";
import { EnemyBattleInfo } from "#app/ui/components/battle-info";
import { BooleanHolder, isBetween, isNil, toDmgValue } from "#app/utils/common-utils";
import { applyMoveAttrs } from "#app/utils/move-utils";
import { randSeedInt, randSeedItem, randSeedShuffle } from "#app/utils/random-utils";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { AbilityApplyMode } from "#enums/ability-apply-mode";
import { AbilityId } from "#enums/ability-id";
import { AiType } from "#enums/ai-type";
import { ArenaTagType } from "#enums/arena-tag-type";
import { BattleCommand } from "#enums/battle-command";
import { BattlerIndex } from "#enums/battler-index";
import { BattlerTagType } from "#enums/battler-tag-type";
import { Challenges } from "#enums/challenges";
import { ElementalType } from "#enums/elemental-type";
import { MoveId } from "#enums/move-id";
import { MoveTarget } from "#enums/move-target";
import type { PokeballType } from "#enums/pokeball-type";
import { SpeciesId } from "#enums/species-id";
import { EFFECTIVE_STATS, type EffectiveStat } from "#enums/stat";
import { TrainerSlot } from "#enums/trainer-slot";

export class EnemyPokemon extends Pokemon {
  public trainerSlot: TrainerSlot;
  public aiType: AiType;
  public bossSegments: number;
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
      this.status = new Status(Overrides.ENEMY_STATUS_OVERRIDE, 0, 4);
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
    switch (true) {
      case this.species.speciesId === SpeciesId.SMEARGLE:
        this.moveset = [
          new PokemonMove(MoveId.SKETCH),
          new PokemonMove(MoveId.SKETCH),
          new PokemonMove(MoveId.SKETCH),
          new PokemonMove(MoveId.SKETCH),
        ];
        break;
      case this.species.speciesId === SpeciesId.ETERNATUS:
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
   * Obtains the total score for the given move when used by this Pokemon
   * against the given target. A move's total score is based on attack score (AS)
   * and effect score (ES)
   * @param opponent the {@linkcode Pokemon} the move is evaluated against
   * @param move the {@linkcode Move} being evaluated
   * @returns the sum of the move's AS and ES against the given opponent
   */
  public getMoveScore(opponent: Pokemon, move: Move): number {
    const meetsConditions =
      move.applyConditions(this, opponent, move)
      || [MoveId.SUCKER_PUNCH, MoveId.UPPER_HAND, MoveId.THUNDERCLAP].includes(move.id);

    const attackScore = this.getAttackScore(opponent, move);
    const isKnockOut = attackScore >= 4;
    const isFail = attackScore === -1 || !meetsConditions;

    const critBonus = this.getCriticalHitBonus(opponent, move, attackScore);

    return (
      (isFail ? BAD_MOVE_PENALTY : attackScore + critBonus) + move.getEffectScore(this, opponent, isKnockOut, isFail)
    );
  }

  /**
   * Calculates the bonus granted to the given move based on its critical hit chance
   * when used by this Pokemon against the given opponent.
   * @param opponent the {@linkcode Pokemon} targeted by the move
   * @param move the {@linkcode Move} being evaluated
   * @param attackScore the previously calculated attack score (optional)
   * @returns the score bonus from critical hit chance
   */
  protected getCriticalHitBonus(opponent: Pokemon, move: Move, attackScore?: number) {
    const { damage: critDamage } = opponent.getAttackDamage(this, move, AbilityApplyMode.REVEALED, true);
    if ((isNil(attackScore) || attackScore < 4) && critDamage >= opponent.hp) {
      const critChance = this.getSimulatedCriticalHitChance(opponent, move);
      /**
       * Only grant a bonus if the calculated critical hit chance is over 10%
       * (i.e. the user has 1 or more crit stages)
       */
      if (critChance > 10) {
        return 1 + (this.randSeedInt(100) < critChance ? 1 : 0);
      }
    }

    return 0;
  }

  /**
   * Calculates the chance (%, rounded down) of the given move critically hitting
   * the given target when used by this Pokemon.
   * @param target the {@linkcode Pokemon} targeted by the move
   * @param move the {@linkcode Move} being evaluated
   * @returns the chance of the move hitting
   */
  protected getSimulatedCriticalHitChance(target: Pokemon, move: Move): number {
    const defendingSide = this.getArenaTagSide();
    const noCritTag = globalScene.arena.hasTag(ArenaTagType.NO_CRIT, defendingSide);

    if (noCritTag || move.hasAttr(FixedDamageAttr) || target.hasAbilityWithAttr(AbAttrFlag.BLOCK_CRIT)) {
      return -1;
    }

    const isCritical = new BooleanHolder(!!this.getTag(BattlerTagType.ALWAYS_CRIT));
    applyMoveAttrs(CritOnlyAttr, this, target, move, isCritical);
    applyAbAttrs<ConditionalCritAbAttr>(AbAttrFlag.CONDITIONAL_CRIT, this, true, isCritical, target, move);

    if (isCritical.value) {
      return 100;
    }

    const critChance = [24, 8, 2, 1][Phaser.Math.Clamp(target.getCritStage(this, move, true), 0, 3)];
    return Math.floor(100 / critChance);
  }

  /**
   * Obtains this Pokemon's next action for the turn based on
   * {@linkcode getMatchupScore | Matchup Score} and {@linkcode getMoveScore | Move Score}.
   * @returns this Pokemon's {@linkcode TurnCommand} for next turn, or `undefined` if this
   * Pokemon's turn is skipped.
   */
  public getNextCommand(): TurnCommand | undefined {
    const battle = globalScene.currentBattle;
    const trainer = battle.trainer;

    // If the current Mystery Encounter is configured to disable enemy moves,
    // skip this command fetch.
    if (battle.mysteryEncounter?.skipEnemyBattleTurns) {
      return undefined;
    }

    // If this Pokemon is hidden by its Commander ability, skip this command fetch.
    if (
      battle.double
      && this.hasAbility(AbilityId.COMMANDER)
      && this.getAlly()?.getTag(BattlerTagType.COMMANDED)?.sourceId === this.id
    ) {
      return undefined;
    }

    if (
      trainer
      && !this.isTrapped()
      && this.getParty().some((p) => p.isActive() && !p.isOnField())
      && this.getMoveQueue().length === 0
    ) {
      const switchCommand = this.getSwitchCommand();
      if (switchCommand) {
        return switchCommand;
      }
    }

    const nextMove = this.getNextMove();
    console.log(
      `${BattlerIndex[this.getBattlerIndex()]}: selecting ${MoveId[nextMove.move.id]} against ${nextMove.targets.map((i) => BattlerIndex[i])}`,
    );

    return {
      pokemon: this,
      command: BattleCommand.FIGHT,
      turnMove: nextMove,
      targets: nextMove.targets,
    };
  }

  /**
   * Determines if this Pokemon should switch out with another Pokemon
   * in its party and, if so, returns the command to do so
   * @returns the {@linkcode TurnCommand} to switch, or `undefined` if
   * this Pokemon should not switch out.
   * @todo Finalize the MUS threshold for switching
   */
  public getSwitchCommand(): TurnCommand | undefined {
    if (Overrides.ENEMY_DISABLE_SWITCHING_OVERRIDE) {
      return undefined;
    }

    const nonActiveParty = this.getParty().filter((p) => p.isActive() && !p.isOnField());
    const matchupScore = this.getAverageMatchupScore();

    // If this Pokemon can safely KO at least 1 opponent, it gains an average MUS
    // of Infinity and should never switch out.
    if (matchupScore === Infinity) {
      return undefined;
    }

    // The switch candidate is the inactive Pokemon with the highest average MUS.
    const [candIndex, candScore] = nonActiveParty
      .map((p) => [this.getParty().indexOf(p), p.getAverageMatchupScore()])
      .reduce((cand, entry) => (cand[1] < entry[1] ? entry : cand));

    // To qualify for switching in, the candidate must have an MUS that exceeds
    // whichever's higher between this Pokemon's MUS + 2 or twice this Pokemon's MUS.
    if (candScore > Math.max(matchupScore + 2, matchupScore * 2)) {
      return {
        pokemon: this,
        command: BattleCommand.POKEMON,
        cursor: candIndex,
        args: [false],
      };
    } else {
      return undefined;
    }
  }

  /**
   * Generates the move action to be performed by this Pokemon on the upcoming turn.
   * In most cases, this is done by finding the best target for each usable move
   * according to {@linkcode getMoveScore | Move Score}, then selecting the move
   * action with the highest overall score. If there is a tie for the highest
   * score, then the final move selection is random between the tied move actions.
   * @returns The {@linkcode QueuedMove} representing the optimal move action.
   */
  public getNextMove(): TurnMove {
    // If this Pokemon has already queued a move before this turn, it will try to use it.
    const queuedMove = this.getMoveQueue()[0];
    if (queuedMove) {
      const queuedMovesetMove = this.getMoveset().find((m) => m.moveId === queuedMove.move.id);
      if (queuedMovesetMove?.isUsable(this, queuedMove.ignorePP)) {
        return {
          move: queuedMovesetMove.getMove(),
          targets: queuedMove.targets,
          type: ElementalType.UNKNOWN,
          ignorePP: queuedMove.ignorePP,
        };
      } else {
        this.getMoveQueue().shift();
        return this.getNextMove();
      }
    }

    const movePool = this.getMoveset().filter((m) => m.isUsable(this));

    // If this Pokemon has no usable moves, it will use Struggle.
    if (movePool.length === 0) {
      return {
        move: allMoves.get(MoveId.STRUGGLE),
        targets: getMoveTargets(this, MoveId.STRUGGLE).targets,
        type: ElementalType.UNKNOWN,
      };
    }

    /**
     * Contains the "optimal" action for each move in this Pokemon's move pool.
     * This accumulates scores and resolves move targeting based on those scores.
     * @todo Resolve issues with {@linkcode BattlerIndex.ATTACKER} targeting
     */
    const moveActions = movePool.map((mv) => this.getOptimalMoveAction(mv.getMove()));

    /**
     * Shuffle and sort {@linkcode moveActions} to obtain the best overall
     * move action among all entries in the move pool.
     */
    const optMoveAction = randSeedShuffle(moveActions).sort((actionA, actionB) => actionB.score - actionA.score)[0];

    return {
      move: allMoves.get(optMoveAction.moveId),
      targets: optMoveAction.targets,
      type: ElementalType.UNKNOWN,
    };
  }

  /**
   * Calculates the optimal use case for the given move among
   * all valid targets on the current field.
   * @param move the {@linkcode Move} being evaluated
   * @returns A {@linkcode TargetScoreData} object with the following data:
   * - `move`: The {@linkcode Moves | identifier} for the evaluated move
   * - `targets`: The {@linkcode BattlerIndex} of the target(s) for which
   * the evaluated move scores highest.
   * - `score`: The {@linkcode getMoveScore | score} corresponding to the optimal target(s)
   */
  private getOptimalMoveAction(move: Move): TargetScoreData {
    if (move.moveTarget === MoveTarget.ATTACKER) {
      /**
       * Counter-attacks (e.g. Metal Burst) are scored entirely
       * based on their effect score.
       */
      const score = move.getEffectScore(this, this.getOpponents()[0]);

      return {
        moveId: move.id,
        targets: [BattlerIndex.ATTACKER],
        score,
      };
    } else if (move.isFieldTarget()) {
      /**
       * Field-targeting effects are internally self-targeted when
       * evaluating score.
       */
      const score = move.getEffectScore(this, this);

      return {
        moveId: move.id,
        targets: getMoveTargets(this, move.id).targets,
        score,
      };
    }

    const { targets, multiple } = getMoveTargets(this, move.id);

    /**
     * The {@linkcode BattlerIndex | BattlerIndexes} of active Pokemon that
     * can legally be targeted with this move.
     */
    const activeTargets = targets.filter((bi) => !isNil(globalScene.getPokemonByBattlerIndex(bi)));
    if (activeTargets.length === 0) {
      /** Moves with no valid targets are given a "fail penalty" of (-5). */
      return {
        moveId: move.id,
        targets: [],
        score: -5,
      };
    }

    /**
     * A mapping between {@linkcode BattlerIndex} and the move score for this
     * move against the Pokemon at that index.
     */
    const targetScores = activeTargets.map(
      (bi) => [bi, this.getMoveScore(globalScene.getPokemonByBattlerIndex(bi)!, move)], // TODO: find a way to get rid of this bang
    );

    if (multiple) {
      /**
       * Multi-targeted moves use the full target set and the sum of move scores
       * for each target.
       */
      return {
        moveId: move.id,
        targets: targets,
        score: targetScores.map((ts) => ts[1]).reduce((total, score) => total + score),
      };
    } else if (move.moveTarget === MoveTarget.RANDOM_NEAR_ENEMY) {
      /**
       * Moves with random targeting resolve their final target within {@linkcode getMoveTargets},
       * but calculate score based on the average move score between all legal targets
       */
      const averageScore =
        this.getOpponents()
          .map((p) => this.getMoveScore(p, move))
          .reduce((total, score) => total + score, 0) / this.getOpponents().length;

      return {
        moveId: move.id,
        targets: targets,
        score: averageScore,
      };
    } else {
      /**
       * Single-target moves form an optimal move action with the highest-scoring
       * {@linkcode BattlerIndex}. {@linkcode targetScores} is shuffled here so
       * that a target is randomly selected from the highest-scoring indexes in
       * the event of a tie.
       */
      const optTarget = randSeedShuffle(targetScores).sort((aScore, bScore) => bScore[1] - aScore[1])[0];

      return {
        moveId: move.id,
        targets: [optTarget[0]],
        score: optTarget[1],
      };
    }
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

      globalScene.phaseManager.unshiftPhase(
        new StatStageChangePhase(this.getBattlerIndex(), this, [boostedStat!], stages, { ignoreAbilities: true }),
      );
      this.bossSegmentIndex--;
    }
  }

  getFieldIndex(): number {
    return globalScene.getEnemyField().indexOf(this);
  }

  getBattlerIndex(): BattlerIndex {
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
