import { hexToColor } from "./utils";

export type Color = {
  r: number;
  g: number;
  b: number;
}

export default class Pallete {
  public colors: Color[] = [];

  private _colorButton: HTMLButtonElement;
  private _colorDisplay: HTMLElement;
  private _colorPicker: HTMLInputElement;

  constructor() {
    this._colorDisplay = document.getElementById("colorDisplay")!;
    this._colorButton = document.getElementById("colorButton")! as HTMLButtonElement;
    this._colorPicker = document.getElementById("colorPicker")! as HTMLInputElement;

    this._colorButton.addEventListener("click", () => {
      this._colorPicker.click();
    });

    this._colorPicker.addEventListener("input", () => {
      const newColor = document.createElement("div");
      newColor.setAttribute("style", `background-color: ${this._colorPicker.value}`);
      this._colorDisplay.insertBefore(newColor, this._colorButton);

      const color = hexToColor(this._colorPicker.value);
      this.colors.push(color);
    });
  }

  get colorButton(): HTMLButtonElement {
    return this._colorButton;
  }

  get colorPicker(): HTMLInputElement {
    return this._colorPicker;
  }

  public findNearestColor(color: Color): Color {
    let minDistance = 99999;
    let minIndex = 0;

    const r1 = color.r;
    const g1 = color.g;
    const b1 = color.b;
    for (let i = 0; i < this.colors.length; i++) {
      const r2 = this.colors[i].r;
      const g2 = this.colors[i].g;
      const b2 = this.colors[i].b;
      const distance = Math.floor(Math.sqrt((r2 - r1) * (r2 - r1) + (g2 - g1) * (g2 - g1) + (b2 - b1) * (b2 - b1)));

      if (minDistance > distance) {
        minDistance = distance;
        minIndex = i;
      }
    }

    return this.colors[minIndex];
  } 
}