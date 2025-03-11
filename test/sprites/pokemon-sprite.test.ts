import { getAppRootDir } from "#test/testUtils/testUtils";
import fs from "fs";
import path from "path";
import { beforeAll, describe, expect, it } from "vitest";
import _masterlist from "../../public/images/pokemon/variant/_masterlist.json";

type PokemonVariantMasterlist = typeof _masterlist;

const deepCopy = (data: any) => {
  return JSON.parse(JSON.stringify(data));
};

describe("check if every variant's sprite are correctly set", () => {
  let masterlist: PokemonVariantMasterlist;
  let femaleVariant: PokemonVariantMasterlist["female"];
  let backVariant: PokemonVariantMasterlist["back"];
  let rootDir: string;
  let variantDir: string;

  beforeAll(() => {
    rootDir = `${getAppRootDir()}${path.sep}public${path.sep}images${path.sep}pokemon${path.sep}`;
    variantDir = `${rootDir}variant${path.sep}`;
    masterlist = deepCopy(_masterlist);
    femaleVariant = masterlist.female;
    backVariant = masterlist.back;
    //@ts-ignore
    delete masterlist.female; //TODO: resolve ts-ignore
    //@ts-ignore
    delete masterlist.back; //TODO: resolve ts-ignore
  });

  it("data should not be undefined", () => {
    expect(masterlist).toBeDefined();
    expect(femaleVariant).toBeDefined();
    expect(backVariant).toBeDefined();
  });

  function getMissingMasterlist(mlist: any, dirpath: string, excludes: string[] = []): string[] {
    const errors: string[] = [];
    const trimmedDirpath = `${dirpath.split(rootDir)[1]}`;
    if (fs.existsSync(dirpath)) {
      const files = fs.readdirSync(dirpath).filter((filename) => !/^\..*/.test(filename));
      for (const filename of files) {
        const filePath = `${dirpath}${filename}`;
        const trimmedFilePath = `${trimmedDirpath}${filename}`;
        const name = filename.split(".")[0];
        if (excludes.includes(name)) {
          continue;
        }
        if (name.includes("_")) {
        } else if (!mlist.hasOwnProperty(name)) {
          errors.push(`[${name}] - missing key ${name} in masterlist for ${trimmedFilePath}`);
        } else {
          const raw = fs.readFileSync(filePath, { encoding: "utf8", flag: "r" });
          const data = JSON.parse(raw);
          for (const key of Object.keys(data)) {
            if (mlist[name][key] !== 1) {
              // if 2, json should NOT be there
              const urlSpriteJsonFile = `${dirpath}${name}_${parseInt(key, 10) + 1}.json`;
              if (fs.existsSync(urlSpriteJsonFile)) {
                errors.push(`[${name}] [${mlist[name]}] - Remove json file ${key} - ${trimmedFilePath}`);
              }
            }
          }
        }
      }
    }
    return errors;
  }

  function getMissingFiles(keys: Record<string, any>, dirPath: string): string[] {
    const errors: string[] = [];
    for (const key of Object.keys(keys)) {
      const row = keys[key];
      for (const [index, elm] of row.entries()) {
        let url: string;
        if (elm === 0) {
          continue;
        } else if (elm === 1) {
          errors.push(` masterlist value should be 2 for ${key} - ${dirPath}`);
        } else if (elm === 2) {
          url = `${key}_${parseInt(index, 10) + 1}.png`;
          const filePath = `${dirPath}${url}`;
          if (!fs.existsSync(filePath)) {
            errors.push(filePath);
          }
        }
      }
    }
    return errors;
  }

  // check if entries in masterlist correspond to existing files

  it("check root variant files", () => {
    const dirPath = variantDir;
    const errors = getMissingFiles(masterlist, dirPath);
    if (errors.length) {
      console.log("errors", errors);
    }
    expect(errors).toEqual([]);
  });

  it("check female variant files", () => {
    const dirPath = `${variantDir}female${path.sep}`;
    const errors = getMissingFiles(femaleVariant, dirPath);
    if (errors.length) {
      console.log("errors", errors);
    }
    expect(errors).toEqual([]);
  });

  it("check back female variant files", () => {
    const dirPath = `${variantDir}back${path.sep}female${path.sep}`;
    const errors = getMissingFiles(backVariant.female, dirPath);
    if (errors.length) {
      console.log("errors", errors);
    }
    expect(errors).toEqual([]);
  });

  it("check back male variant files", () => {
    const dirPath = `${variantDir}back${path.sep}`;
    const backMaleVariant = deepCopy(backVariant);
    delete backMaleVariant.female;
    const errors = getMissingFiles(backMaleVariant, dirPath);
    if (errors.length) {
      console.log("errors", errors);
    }
    expect(errors).toEqual([]);
  });

  // check over every file if it's correctly set in the masterlist

  it("look over every file in variant female and check if present in masterlist", () => {
    const dirPath = `${variantDir}female${path.sep}`;
    const errors = getMissingMasterlist(femaleVariant, dirPath);
    if (errors.length) {
      console.log("errors for ", dirPath, errors);
    }
    expect(errors).toEqual([]);
  });

  it("look over every file in variant back female and check if present in masterlist", () => {
    const dirPath = `${variantDir}back${path.sep}female${path.sep}`;
    const errors = getMissingMasterlist(backVariant.female, dirPath);
    if (errors.length) {
      console.log("errors for ", dirPath, errors);
    }
    expect(errors).toEqual([]);
  });

  it("look over every file in variant back male and check if present in masterlist", () => {
    const dirPath = `${variantDir}back${path.sep}`;
    const backMaleVariant = deepCopy(backVariant);
    const errors = getMissingMasterlist(backMaleVariant, dirPath, ["female"]);
    if (errors.length) {
      console.log("errors for ", dirPath, errors);
    }
    expect(errors).toEqual([]);
  });

  it("look over every file in variant root and check if present in masterlist", () => {
    const dirPath = `${variantDir}`;
    const errors = getMissingMasterlist(masterlist, dirPath, ["back", "female", "icons"]);
    if (errors.length) {
      console.log("errors for ", dirPath, errors);
    }
    expect(errors).toEqual([]);
  });
});
