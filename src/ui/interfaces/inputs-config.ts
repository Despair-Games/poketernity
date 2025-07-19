interface IconWithLabel {
  sprite: Phaser.GameObjects.Sprite;
  label?: Phaser.GameObjects.Text;
}

export interface InputsIcons {
  [key: string]: IconWithLabel;
}
