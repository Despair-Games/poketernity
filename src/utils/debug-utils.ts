/**
 * Prints the type and name of all game objects in a container for debugging purposes
 * @param container - The container with game objects inside it
 */
export function printContainerList(container: Phaser.GameObjects.Container): void {
  console.log(
    container.list.map((go) => {
      return { type: go.type, name: go.name };
    }),
  );
}
