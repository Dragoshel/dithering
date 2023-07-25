interface Color {
  r: number;
  g: number;
  b: number;
}

function imageFromFile(file: File): HTMLImageElement {
  const image = new Image()!;
  const reader = new FileReader();

  reader.addEventListener("load", () => {
    image.src = reader.result as string;
  });
  reader.readAsDataURL(file);

  return image;
}

function hexToColor(hex: string): Color {
  hex = hex.replace("#", "");

  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  }

  return {
    r: parseInt(hex.slice(0, 2), 16),
    g: parseInt(hex.slice(2, 4), 16),
    b: parseInt(hex.slice(4, 6), 16)
  };
}

class Pallete {
  public colors: Color[] = [];

  constructor(picker: HTMLInputElement, display: HTMLElement) {
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

class DitheringCanvas {
  private context: CanvasRenderingContext2D;
  private width: number;
  private height: number;

  constructor(width: number, height: number, canvas: HTMLCanvasElement) {
    this.context = canvas.getContext("2d")!;
    this.width = width;
    this.height = height;
  }

  public dither(image: HTMLImageElement, pallete: Pallete, algorithm: number) {
    this.context.drawImage(image, 0, 0);

    let imageData = this.context.getImageData(0, 0, this.width, this.height);
    let data = imageData.data;
    switch (algorithm) {
      // Nearest
      case 0:
        this.ditherNearest(data, pallete);
        break;

      // Floyd-Steinberg
      case 1:
        this.ditherFloydSteinberg(data, pallete);
        break;

      default:
        break;
    }

    this.context.putImageData(imageData, 0, 0);
  }

  private ditherNearest(data: Uint8ClampedArray, pallete: Pallete) {
    for (let i = 0; i < data.length; i += 4) {
      const current: Color = { r: data[i], g: data[i + 1], b: data[i + 2] };
      const nearest = pallete.findNearestColor(current);

      data[i] = nearest.r;
      data[i + 1] = nearest.g;
      data[i + 2] = nearest.b;
    }
  }

  private ditherFloydSteinberg(data: Uint8ClampedArray, pallete: Pallete) {
    for (let i = 0; i < data.length; i += 4) {
      const current: Color = { r: data[i], g: data[i + 1], b: data[i + 2] };
      const nearest = pallete.findNearestColor(current);

      const error: Color = { r: current.r - nearest.r, g: current.g - nearest.g, b: current.b - nearest.b };

      data[i] = nearest.r;
      data[i + 1] = nearest.g;
      data[i + 2] = nearest.b;

      data[(i + 4)] += error.r * 7 / 16;
      data[(i + 4) + 1] += error.g * 7 / 16;
      data[(i + 4) + 2] += error.b * 7 / 16;

      data[i + (this.width - 1) * 4] += error.r * 3 / 16;
      data[i + (this.width - 1) * 4 + 1] += error.g * 3 / 16;
      data[i + (this.width - 1) * 4 + 2] += error.b * 3 / 16;

      data[i + (this.width) * 4] += error.r * 5 / 16;
      data[i + (this.width) * 4 + 1] += error.g * 5 / 16;
      data[i + (this.width) * 4 + 2] += error.b * 5 / 16;

      data[i + (this.width + 1) * 4] += error.r * 1 / 16;
      data[i + (this.width + 1) * 4 + 1] += error.g * 1 / 16;
      data[i + (this.width + 1) * 4 + 2] += error.b * 1 / 16;
    }
  }
}

const canvas = document.getElementById("canvas")! as HTMLCanvasElement;
const ditheringCanvas = new DitheringCanvas(1000, 800, canvas);

const display = document.getElementById("colorDisplay")!;
const picker = document.getElementById("colorPicker")! as HTMLInputElement;
const pallete = new Pallete(picker, display); 

const input = document.getElementById("input")! as HTMLInputElement;
const select = document.getElementById("select")! as HTMLSelectElement;
const form = document.getElementById("form")! as HTMLFormElement;

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (input.files!.length > 0) {
    const file = input.files![0];
    const image = imageFromFile(file);

    image.addEventListener("load", () => {
      ditheringCanvas.dither(image, pallete, select.selectedIndex);
    });
  }
});
