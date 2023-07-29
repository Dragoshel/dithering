import DitheringCanvas from "./dithering-canvas";
import Pallete from "./pallete";

import { imageFromFile } from "./utils";

const input = document.getElementById("input")! as HTMLInputElement;
const select = document.getElementById("select")! as HTMLSelectElement;

const ditheringCanvas = new DitheringCanvas();
const pallete = new Pallete();

function handleFileInput() {
  if (input.files!.length > 0) {
    const file = input.files![0];
    const image = imageFromFile(file);

    image.addEventListener("load", () => {
      ditheringCanvas.width = image.width;
      ditheringCanvas.height = image.height;
      ditheringCanvas.drawImage(image);
    });
  }
}

function handleSelect() {
  if (input.files!.length > 0) {
    const file = input.files![0];
    const image = imageFromFile(file);

    image.addEventListener("load", () => {
      ditheringCanvas.width = image.width;
      ditheringCanvas.height = image.height;
      ditheringCanvas.dither(image, pallete, select.selectedIndex);
    });
  }
}

pallete.colorPicker.addEventListener("input", handleSelect);
input.addEventListener("input", handleFileInput);
select.addEventListener("change", handleSelect);
