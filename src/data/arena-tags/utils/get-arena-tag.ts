import type { ArenaTag } from "#arena-tags/arena-tag";
import { AuroraVeilTag } from "#arena-tags/aurora-veil-tag";
import { CraftyShieldTag } from "#arena-tags/crafty-shield-tag";
import { DelayedAttackTag } from "#arena-tags/delayed-attack-tag";
import { FairyLockTag } from "#arena-tags/fairy-lock-tag";
import { FireGrassPledgeTag } from "#arena-tags/fire-grass-pledge-tag";
import { GrassWaterPledgeTag } from "#arena-tags/grass-water-pledge-tag";
import { GravityTag } from "#arena-tags/gravity-tag";
import { HappyHourTag } from "#arena-tags/happy-hour-tag";
import { IonDelugeTag } from "#arena-tags/ion-deluge-tag";
import { LightScreenTag } from "#arena-tags/light-screen-tag";
import { MatBlockTag } from "#arena-tags/mat-block-tag";
import { MistTag } from "#arena-tags/mist-tag";
import { MudSportTag } from "#arena-tags/mud-sport-tag";
import { NoCritTag } from "#arena-tags/no-crit-tag";
import { PendingHealTag } from "#arena-tags/pending-heal-tag";
import { QuickGuardTag } from "#arena-tags/quick-guard-tag";
import { ReflectTag } from "#arena-tags/reflect-tag";
import { SafeguardTag } from "#arena-tags/safeguard-tag";
import { SharpSteelTag } from "#arena-tags/sharp-steel-tag";
import { SpikesTag } from "#arena-tags/spikes-tag";
import { StealthRockTag } from "#arena-tags/stealth-rock-tag";
import { StickyWebTag } from "#arena-tags/sticky-web-tag";
import { TailwindTag } from "#arena-tags/tailwind-tag";
import { ToxicSpikesTag } from "#arena-tags/toxic-spikes-tag";
import { TrickRoomTag } from "#arena-tags/trick-room-tag";
import { TypeImmuneDamageOverTimeTag } from "#arena-tags/type-immune-damage-over-time-tag";
import { WaterFirePledgeTag } from "#arena-tags/water-fire-pledge-tag";
import { WaterSportTag } from "#arena-tags/water-sport-tag";
import { WideGuardTag } from "#arena-tags/wide-guard-tag";
import { WishTag } from "#arena-tags/wish-tag";
import { ArenaTagSide } from "#enums/arena-tag-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import { ElementalType } from "#enums/elemental-type";
import { MoveId } from "#enums/move-id";

/**
 * Generates an {@linkcode ArenaTag} of the given type.
 * @param tagType - The {@linkcode ArenaTagType | type} of tag to generate
 * @param sourceId - The ID of the {@linkcode Pokemon} creating the tag
 * @param turnCount - The number of turns the tag is active
 * @param sourceMoveId - (Optional) The {@linkcode MoveId} of the move that created the tag
 * @param side - (Default {@linkcode ArenaTagSide.BOTH}) The {@linkcode ArenaTagSide} where the tag resides
 * @returns the generated {@linkcode ArenaTag}, or `undefined` if an unsupported tag type is given
 * @todo Make `sourceId` and `turnCount` optional; Add an `options` interface
 */
export function getArenaTag(
  tagType: ArenaTagType,
  sourceId: number,
  turnCount: number,
  sourceMoveId?: MoveId,
  side: ArenaTagSide = ArenaTagSide.BOTH,
): ArenaTag | undefined {
  switch (tagType) {
    case ArenaTagType.MIST:
      return new MistTag(turnCount, sourceId, side);
    case ArenaTagType.QUICK_GUARD:
      return new QuickGuardTag(sourceId, side);
    case ArenaTagType.WIDE_GUARD:
      return new WideGuardTag(sourceId, side);
    case ArenaTagType.MAT_BLOCK:
      return new MatBlockTag(sourceId, side);
    case ArenaTagType.CRAFTY_SHIELD:
      return new CraftyShieldTag(sourceId, side);
    case ArenaTagType.NO_CRIT:
      return new NoCritTag(turnCount, sourceMoveId!, sourceId, side); // TODO: is this bang correct?
    case ArenaTagType.MUD_SPORT:
      return new MudSportTag(turnCount, sourceId);
    case ArenaTagType.WATER_SPORT:
      return new WaterSportTag(turnCount, sourceId);
    case ArenaTagType.ION_DELUGE:
      return new IonDelugeTag(sourceMoveId);
    case ArenaTagType.SPIKES:
      return new SpikesTag(sourceId, side);
    case ArenaTagType.TOXIC_SPIKES:
      return new ToxicSpikesTag(sourceId, side);
    case ArenaTagType.DELAYED_ATTACK:
      return new DelayedAttackTag();
    case ArenaTagType.PENDING_HEAL:
      return new PendingHealTag();
    case ArenaTagType.WISH:
      return new WishTag(turnCount, sourceId, side);
    case ArenaTagType.STEALTH_ROCK:
      return new StealthRockTag(sourceId, side);
    case ArenaTagType.STICKY_WEB:
      return new StickyWebTag(sourceId, side);
    case ArenaTagType.TRICK_ROOM:
      return new TrickRoomTag(turnCount, sourceId);
    case ArenaTagType.GRAVITY:
      return new GravityTag(turnCount);
    case ArenaTagType.REFLECT:
      return new ReflectTag(turnCount, sourceId, side);
    case ArenaTagType.LIGHT_SCREEN:
      return new LightScreenTag(turnCount, sourceId, side);
    case ArenaTagType.AURORA_VEIL:
      return new AuroraVeilTag(turnCount, sourceId, side);
    case ArenaTagType.TAILWIND:
      return new TailwindTag(turnCount, sourceId, side);
    case ArenaTagType.HAPPY_HOUR:
      return new HappyHourTag(sourceId, side);
    case ArenaTagType.SAFEGUARD:
      return new SafeguardTag(turnCount, sourceId, side);
    case ArenaTagType.FIRE_GRASS_PLEDGE:
      return new FireGrassPledgeTag(sourceId, side);
    case ArenaTagType.WATER_FIRE_PLEDGE:
      return new WaterFirePledgeTag(sourceId, side);
    case ArenaTagType.GRASS_WATER_PLEDGE:
      return new GrassWaterPledgeTag(sourceId, side);
    case ArenaTagType.FAIRY_LOCK:
      return new FairyLockTag(turnCount, sourceId);
    case ArenaTagType.G_MAX_VINE_LASH:
      return new TypeImmuneDamageOverTimeTag(
        ArenaTagType.G_MAX_VINE_LASH,
        MoveId.G_MAX_VINE_LASH,
        sourceId,
        side,
        ElementalType.GRASS,
      );
    case ArenaTagType.G_MAX_WILDFIRE:
      return new TypeImmuneDamageOverTimeTag(
        ArenaTagType.G_MAX_WILDFIRE,
        MoveId.G_MAX_WILDFIRE,
        sourceId,
        side,
        ElementalType.FIRE,
      );
    case ArenaTagType.G_MAX_CANNONADE:
      return new TypeImmuneDamageOverTimeTag(
        ArenaTagType.G_MAX_CANNONADE,
        MoveId.G_MAX_CANNONADE,
        sourceId,
        side,
        ElementalType.WATER,
      );
    case ArenaTagType.G_MAX_VOLCALITH:
      return new TypeImmuneDamageOverTimeTag(
        ArenaTagType.G_MAX_VOLCALITH,
        MoveId.G_MAX_VOLCALITH,
        sourceId,
        side,
        ElementalType.ROCK,
      );
    case ArenaTagType.SHARP_STEEL:
      return new SharpSteelTag(sourceId, side);
    default:
      console.warn(`getArenaTag: Failed to generate tag of type ${ArenaTagType[tagType]}`);
      return;
  }
}
