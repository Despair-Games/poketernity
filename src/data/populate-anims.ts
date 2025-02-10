import {
  AnimConfig,
  AnimFrame,
  type AnimTimedEvent,
  AnimTimedSoundEvent,
  AnimTimedAddBgEvent,
  AnimTimedUpdateBgEvent,
} from "#app/data/anim-config";
import { commonAnims } from "./common-anims";
import { chargeAnims } from "./charge-anims";
import { moveAnims } from "./move-anims";
import { getEnumKeys, getEnumValues } from "#app/utils";
import type { AnimFocus } from "#enums/anim-focus";
import { ChargeAnim } from "#enums/charge-anim";
import { CommonAnim } from "#enums/common-anim";
import { MoveId } from "#enums/move-id";

export async function populateAnims() {
  const commonAnimNames = getEnumKeys(CommonAnim).map((k) => k.toLowerCase());
  const commonAnimMatchNames = commonAnimNames.map((k) => k.replace(/\_/g, ""));
  const commonAnimIds = getEnumValues(CommonAnim) as CommonAnim[];
  const chargeAnimNames = getEnumKeys(ChargeAnim).map((k) => k.toLowerCase());
  const chargeAnimMatchNames = chargeAnimNames.map((k) => k.replace(/\_/g, " "));
  const chargeAnimIds = getEnumValues(ChargeAnim) as ChargeAnim[];
  const commonNamePattern = /name: (?:Common:)?(Opp )?(.*)/;
  const moveNameToId = {};
  for (const move of getEnumValues(MoveId).slice(1)) {
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
    if (!moveNameToId.hasOwnProperty(animName) && !commonAnimId && !chargeAnimId) {
      continue;
    }
    const anim = commonAnimId || chargeAnimId ? new AnimConfig() : new AnimConfig();
    if (anim instanceof AnimConfig) {
      (anim as AnimConfig).id = moveNameToId[animName];
    }
    if (commonAnimId) {
      commonAnims.set(commonAnimId, anim);
    } else if (chargeAnimId) {
      chargeAnims.set(chargeAnimId, !isOppMove ? anim : [chargeAnims.get(chargeAnimId) as AnimConfig, anim]);
    } else {
      moveAnims.set(
        moveNameToId[animName],
        !isOppMove ? (anim as AnimConfig) : [moveAnims.get(moveNameToId[animName]) as AnimConfig, anim as AnimConfig],
      );
    }
    for (let f = 0; f < fields.length; f++) {
      const field = fields[f];
      const fieldName = field.slice(0, field.indexOf(":"));
      const fieldData = field.slice(fieldName.length + 1, field.lastIndexOf("\n")).trim();
      switch (fieldName) {
        case "array":
          const framesData = fieldData.split("  - - - ").slice(1);
          for (let fd = 0; fd < framesData.length; fd++) {
            anim.frames.push([]);
            const frameData = framesData[fd];
            const focusFramesData = frameData.split("    - - ");
            for (let tf = 0; tf < focusFramesData.length; tf++) {
              const values = focusFramesData[tf].replace(/      \- /g, "").split("\n");
              const targetFrame = new AnimFrame(
                parseFloat(values[0]),
                parseFloat(values[1]),
                parseFloat(values[2]),
                parseFloat(values[11]),
                parseFloat(values[3]),
                parseInt(values[4]) === 1,
                parseInt(values[6]) === 1,
                parseInt(values[5]),
                parseInt(values[7]),
                parseInt(values[8]),
                parseInt(values[12]),
                parseInt(values[13]),
                parseInt(values[14]),
                parseInt(values[15]),
                parseInt(values[16]),
                parseInt(values[17]),
                parseInt(values[18]),
                parseInt(values[19]),
                parseInt(values[21]),
                parseInt(values[22]),
                parseInt(values[23]),
                parseInt(values[24]),
                parseInt(values[20]) === 1,
                parseInt(values[25]),
                parseInt(values[26]) as AnimFocus,
              );
              anim.frames[fd].push(targetFrame);
            }
          }
          break;
        case "graphic":
          const graphic = fieldData !== "''" ? fieldData : "";
          anim.graphic = graphic.indexOf(".") > -1 ? graphic.slice(0, fieldData.indexOf(".")) : graphic;
          break;
        case "timing":
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
            const frameIndex = parseInt(/frame: (\d+)/.exec(timingData)![1]); // TODO: is the bang correct?
            let resourceName = /name: "(.*?)"/.exec(timingData)![1].replace("''", ""); // TODO: is the bang correct?
            const timingType = parseInt(/timingType: (\d)/.exec(timingData)![1]); // TODO: is the bang correct?
            let timedEvent: AnimTimedEvent | undefined;
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
                  value = parseFloat(value);
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
                  value = parseInt(value);
                  break;
              }
              if (timedEvent.hasOwnProperty(prop)) {
                timedEvent[prop] = value;
              }
            }
            if (!anim.frameTimedEvents.has(frameIndex)) {
              anim.frameTimedEvents.set(frameIndex, []);
            }
            anim.frameTimedEvents.get(frameIndex)!.push(timedEvent); // TODO: is this bang correct?
          }
          break;
        case "position":
          anim.position = parseInt(fieldData);
          break;
        case "hue":
          anim.hue = parseInt(fieldData);
          break;
      }
    }
  }
}
