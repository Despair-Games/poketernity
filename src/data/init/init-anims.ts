import {
  AnimFrame,
  AnimTimedAddBgEvent,
  AnimTimedSoundEvent,
  AnimTimedUpdateBgEvent,
  LegacyAnimConfig,
  type LegacyAnimTimedEvent,
} from "#animations/anim-config";
import { chargeAnims } from "#animations/charge-anims";
import { commonAnims } from "#animations/common-anims";
import { moveAnims } from "#animations/move-anims";
import type { AnimFocus } from "#enums/anim-focus";
import { ChargeAnim } from "#enums/charge-anim";
import { CommonAnim } from "#enums/common-anim";
import { MoveId } from "#enums/move-id";
import { getTSEnumKeys, getTSEnumValues } from "#utils/common-utils";

export async function populateAnims() {
  const commonAnimNames = getTSEnumKeys(CommonAnim).map((k) => k.toLowerCase());
  const commonAnimMatchNames = commonAnimNames.map((k) => k.replace(/\_/g, ""));
  const commonAnimIds: CommonAnim[] = getTSEnumValues(CommonAnim);
  const chargeAnimNames = getTSEnumKeys(ChargeAnim).map((k) => k.toLowerCase());
  const chargeAnimMatchNames = chargeAnimNames.map((k) => k.replace(/\_/g, " "));
  const chargeAnimIds: ChargeAnim[] = getTSEnumValues(ChargeAnim);
  const commonNamePattern = /name: (?:Common:)?(Opp )?(.*)/;
  const moveNameToId = {};
  for (const move of getTSEnumValues(MoveId).slice(1)) {
    const moveName = MoveId[move].toUpperCase().replace(/\_/g, "");
    moveNameToId[moveName] = move;
  }

  const seNames: string[] = []; //(await fs.readdir('./public/audio/se/battle_anims/')).map(se => se.toString());

  const animsData: any[] = []; //battleAnimRawData.split('!ruby/array:PBAnimation').slice(1); // TODO: add a proper type
  for (let a = 0; a < animsData.length; a++) {
    const fields = animsData[a].split("@").slice(1);

    const nameField = fields.find((f) => f.startsWith("name: "));

    let isOppMove: boolean | undefined;
    let commonAnimId: CommonAnim | undefined;
    let chargeAnimId: ChargeAnim | undefined;
    if (!nameField.startsWith("name: Move:") && !(isOppMove = nameField.startsWith("name: OppMove:"))) {
      const nameMatch = commonNamePattern.exec(nameField)!; // TODO: is this bang correct?
      const name = nameMatch[2].toLowerCase();
      if (commonAnimMatchNames.indexOf(name) > -1) {
        commonAnimId = commonAnimIds[commonAnimMatchNames.indexOf(name)];
      } else if (chargeAnimMatchNames.indexOf(name) > -1) {
        isOppMove = nameField.startsWith("name: Opp ");
        chargeAnimId = chargeAnimIds[chargeAnimMatchNames.indexOf(name)];
      }
    }
    const nameIndex = nameField.indexOf(":", 5) + 1;
    const animName = nameField.slice(nameIndex, nameField.indexOf("\n", nameIndex));
    if (!Object.hasOwn(moveNameToId, animName) && !commonAnimId && !chargeAnimId) {
      continue;
    }
    const anim = commonAnimId || chargeAnimId ? new LegacyAnimConfig() : new LegacyAnimConfig();
    if (anim instanceof LegacyAnimConfig) {
      (anim as LegacyAnimConfig).id = moveNameToId[animName];
    }
    if (commonAnimId) {
      commonAnims.set(commonAnimId, anim);
    } else if (chargeAnimId) {
      chargeAnims.set(chargeAnimId, !isOppMove ? anim : [chargeAnims.get(chargeAnimId) as LegacyAnimConfig, anim]);
    } else {
      moveAnims.set(
        moveNameToId[animName],
        !isOppMove
          ? (anim as LegacyAnimConfig)
          : [moveAnims.get(moveNameToId[animName]) as LegacyAnimConfig, anim as LegacyAnimConfig],
      );
    }
    for (let f = 0; f < fields.length; f++) {
      const field = fields[f];
      const fieldName = field.slice(0, field.indexOf(":"));
      const fieldData = field.slice(fieldName.length + 1, field.lastIndexOf("\n")).trim();
      switch (fieldName) {
        case "array": {
          const framesData = fieldData.split("  - - - ").slice(1);
          for (let fd = 0; fd < framesData.length; fd++) {
            anim.frames.push([]);
            const frameData = framesData[fd];
            const focusFramesData = frameData.split("    - - ");
            for (let tf = 0; tf < focusFramesData.length; tf++) {
              const values = focusFramesData[tf].replace(/ {6}\- /g, "").split("\n");
              const targetFrame = new AnimFrame(
                Number.parseFloat(values[0]),
                Number.parseFloat(values[1]),
                Number.parseFloat(values[2]),
                Number.parseFloat(values[11]),
                Number.parseFloat(values[3]),
                Number.parseInt(values[4]) === 1,
                Number.parseInt(values[6]) === 1,
                Number.parseInt(values[5]),
                Number.parseInt(values[7]),
                Number.parseInt(values[8]),
                Number.parseInt(values[12]),
                Number.parseInt(values[13]),
                Number.parseInt(values[14]),
                Number.parseInt(values[15]),
                Number.parseInt(values[16]),
                Number.parseInt(values[17]),
                Number.parseInt(values[18]),
                Number.parseInt(values[19]),
                Number.parseInt(values[21]),
                Number.parseInt(values[22]),
                Number.parseInt(values[23]),
                Number.parseInt(values[24]),
                Number.parseInt(values[20]) === 1,
                Number.parseInt(values[25]),
                Number.parseInt(values[26]) as AnimFocus,
              );
              anim.frames[fd].push(targetFrame);
            }
          }
          break;
        }
        case "graphic": {
          const graphic = fieldData !== "''" ? fieldData : "";
          anim.graphic = graphic.indexOf(".") > -1 ? graphic.slice(0, fieldData.indexOf(".")) : graphic;
          break;
        }
        case "timing": {
          const timingEntries = fieldData.split("- !ruby/object:PBAnimTiming ").slice(1);
          for (let t = 0; t < timingEntries.length; t++) {
            const timingData = timingEntries[t]
              .replace(/\n/g, " ")
              .replace(/[ ]{2,}/g, " ")
              .replace(/[a-z]+: ! '', /gi, "")
              .replace(/name: (.*?),/, 'name: "$1",')
              .replace(
                /flashColor: !ruby\/object:Color { alpha: ([\d\.]+), blue: ([\d\.]+), green: ([\d\.]+), red: ([\d\.]+)}/,
                "flashRed: $4, flashGreen: $3, flashBlue: $2, flashAlpha: $1",
              );
            const frameIndex = Number.parseInt(/frame: (\d+)/.exec(timingData)![1]); // TODO: is the bang correct?
            let resourceName = /name: "(.*?)"/.exec(timingData)![1].replace("''", ""); // TODO: is the bang correct?
            const timingType = Number.parseInt(/timingType: (\d)/.exec(timingData)![1]); // TODO: is the bang correct?
            let timedEvent: LegacyAnimTimedEvent | undefined;
            switch (timingType) {
              case 0:
                if (resourceName && resourceName.indexOf(".") === -1) {
                  let ext: string | undefined;
                  ["wav", "mp3", "m4a"].every((e) => {
                    if (seNames.indexOf(`${resourceName}.${e}`) > -1) {
                      ext = e;
                      return false;
                    }
                    return true;
                  });
                  if (!ext) {
                    ext = ".wav";
                  }
                  resourceName += `.${ext}`;
                }
                timedEvent = new AnimTimedSoundEvent(frameIndex, resourceName);
                break;
              case 1:
                timedEvent = new AnimTimedAddBgEvent(frameIndex, resourceName.slice(0, resourceName.indexOf(".")));
                break;
              case 2:
                timedEvent = new AnimTimedUpdateBgEvent(frameIndex, resourceName.slice(0, resourceName.indexOf(".")));
                break;
            }
            if (!timedEvent) {
              continue;
            }
            const propPattern = /([a-z]+): (.*?)(?:,|\})/gi;
            let propMatch: RegExpExecArray;
            while ((propMatch = propPattern.exec(timingData)!)) {
              // TODO: is this bang correct?
              const prop = propMatch[1];
              let value: any = propMatch[2];
              switch (prop) {
                case "bgX":
                case "bgY":
                  value = Number.parseFloat(value);
                  break;
                case "volume":
                case "pitch":
                case "opacity":
                case "colorRed":
                case "colorGreen":
                case "colorBlue":
                case "colorAlpha":
                case "duration":
                case "flashScope":
                case "flashRed":
                case "flashGreen":
                case "flashBlue":
                case "flashAlpha":
                case "flashDuration":
                  value = Number.parseInt(value);
                  break;
              }
              if (Object.hasOwn(timedEvent, prop)) {
                timedEvent[prop] = value;
              }
            }
            if (!anim.frameTimedEvents.has(frameIndex)) {
              anim.frameTimedEvents.set(frameIndex, []);
            }
            anim.frameTimedEvents.get(frameIndex)!.push(timedEvent); // TODO: is this bang correct?
          }
          break;
        }
        case "position":
          anim.position = Number.parseInt(fieldData);
          break;
        case "hue":
          anim.hue = Number.parseInt(fieldData);
          break;
      }
    }
  }
}
