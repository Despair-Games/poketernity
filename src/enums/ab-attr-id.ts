// -- start tsdoc imports --
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { AbAttr } from "#app/data/ab-attrs/ab-attr";
import type { UncopiableAbilityAbAttr } from "#app/data/ab-attrs/uncopiable-ability-ab-attr";
import type { UnsuppressableAbilityAbAttr } from "#app/data/ab-attrs/unsuppressable-ability-ab-attr";
import type { PostDefendAbilityGiveAbAttr } from "#app/data/ab-attrs/post-defend-ability-give-ab-attr";
import type { UnswappableAbilityAbAttr } from "#app/data/ab-attrs/unswappable-ability-ab-attr";
import type { PostDamageForceSwitchAbAttr } from "#app/data/ab-attrs/post-damage-force-switch-ab-attr";
import type { SuppressFieldAbilitiesAbAttr } from "#app/data/ab-attrs/suppress-field-abilities-ab-attr";
import type { NoFusionAbilityAbAttr } from "#app/data/ab-attrs/no-fusion-ability-ab-attr";
import type { BlockRedirectAbAttr } from "#app/data/ab-attrs/block-redirect-ab-attr";
import type { IgnoreMoveEffectsAbAttr } from "#app/data/ab-attrs/ignore-move-effect-ab-attr";
import type { IgnoreTypeImmunityAbAttr } from "#app/data/ab-attrs/ignore-type-immunity-ab-attr";
import type { CommanderAbAttr } from "#app/data/ab-attrs/commander-ab-attr";
import type { BlockNonDirectDamageAbAttr } from "#app/data/ab-attrs/block-non-direct-damage-ab-attr";
import type { ReverseDrainAbAttr } from "#app/data/ab-attrs/reverse-drain-ab-attr";
import type { IgnoreContactAbAttr } from "#app/data/ab-attrs/ignore-contact-ab-attr";
import type { MoveAbilityBypassAbAttr } from "#app/data/ab-attrs/move-ability-bypass-ab-attr";
import type { IgnoreProtectOnContactAbAttr } from "#app/data/ab-attrs/ignore-protect-on-contact-ab-attr";
import type { IncreasePpAbAttr } from "#app/data/ab-attrs/increase-pp-ab-attr";
import type { AlwaysHitAbAttr } from "#app/data/ab-attrs/always-hit-ab-attr";
import type { MaxMultiHitAbAttr } from "#app/data/ab-attrs/max-multi-hit-ab-attr";
/* eslint-enable @typescript-eslint/no-unused-vars */
// -- end tsdoc imports --

export enum AbAttrId {
  /** @see {@linkcode AbAttr} */
  UNSPECIFIED,
  /** @see {@linkcode UncopiableAbilityAbAttr} */
  UNCOPIABLE_ABILITY,
  /** @see {@linkcode UnsuppressableAbilityAbAttr} */
  UNSUPPRESSABLE_ABILITY,
  /** @see {@linkcode PostDefendAbilityGiveAbAttr} */
  POST_DEFEND_ABILITY_GIVE,
  /** @see {@linkcode UnswappableAbilityAbAttr} */
  UNSWAPPABLE_ABILITY,
  /** @see {@linkcode PostDamageForceSwitchAbAttr} */
  POST_DAMAGE_FORCE_SWITCH,
  /** @see {@linkcode SuppressFieldAbilitiesAbAttr} */
  SUPPRESS_FIELD_ABILITIES,
  /** @see {@linkcode NoFusionAbilityAbAttr} */
  NO_FUSION_ABILITY,
  /** @see {@linkcode BlockRedirectAbAttr} */
  BLOCK_REDIRECT,
  /** @see {@linkcode IgnoreMoveEffectsAbAttr} */
  IGNORE_MOVE_EFFECTS,
  /** @see {@linkcode IgnoreTypeImmunityAbAttr} */
  IGNORE_TYPE_IMMUNITY,
  /** @see {@linkcode CommanderAbAttr} */
  COMMANDER,
  /** @see {@linkcode BlockNonDirectDamageAbAttr} */
  BLOCK_NON_DIRECT_DAMAGE,
  /** @see {@linkcode ReverseDrainAbAttr} */
  REVERSE_DRAIN,
  /** @see {@linkcode IgnoreContactAbAttr} */
  IGNORE_CONTACT,
  /** @see {@linkcode MoveAbilityBypassAbAttr} */
  MOVE_ABILITY_BYPASS,
  /** @see {@linkcode IgnoreProtectOnContactAbAttr} */
  IGNORE_PROTECT_ON_CONTACT,
  /** @see {@linkcode IncreasePpAbAttr} */
  INCREASE_PP,
  /** @see {@linkcode AlwaysHitAbAttr} */
  ALWAYS_HIT,
  /** @see {@linkcode MaxMultiHitAbAttr} */
  MAX_MULTI_HIT,
}
