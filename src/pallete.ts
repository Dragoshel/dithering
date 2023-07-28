import { hexToColor } from "./utils";

export type Color = {
  r: number;
  g: number;
  b: number;
}

export default class Pallete {
  public colors: Color[] = [];

  constructor() {
    const display = document.getElementById("display")!;
    const picker = document.getElementById("picker")! as HTMLInputElement;

    picker.addEventListener("change", () => {
      const div = document.createElement("div");
      div.setAttribute("style", `background-color: ${picker.value}`);
      display.append(div);

      const color = hexToColor(picker.value);
      this.colors.push(color);
    });
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