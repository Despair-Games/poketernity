import type { Pokemon } from "#app/field/pokemon";
import type { Moves } from "#app/enums/moves";
import type BBCodeText from "phaser3-rex-plugins/plugins/bbcodetext";

export function retrieveMoveList(pokemon: Pokemon): Moves[] {
  return pokemon.getLearnableLevelMoves();
}

export function labelMoves(
  learnableLevelMoves: Moves[],
  moveListContainer: Phaser.GameObjects.Container,
  moveTextList: BBCodeText[],
) {
  return;
}
