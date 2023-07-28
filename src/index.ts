import DitheringCanvas from "./dithering-canvas";
import Pallete from "./pallete";

import { imageFromFile } from "./utils";

const ditheringCanvas = new DitheringCanvas();
const pallete = new Pallete();

const input = document.getElementById("input")! as HTMLInputElement;
const select = document.getElementById("select")! as HTMLSelectElement;
const form = document.getElementById("form")! as HTMLFormElement;
  
form.addEventListener("submit", event => {
  event.preventDefault();

  if (input.files!.length > 0) {
    const file = input.files![0];
    const image = imageFromFile(file);

    image.addEventListener("load", () => {
      ditheringCanvas.width = image.width;
      ditheringCanvas.height = image.height;
      ditheringCanvas.dither(image, pallete, select.selectedIndex);
    });
  }
});
