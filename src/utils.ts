import { Color } from "./pallete";

export function imageFromFile(file: File): HTMLImageElement {
  const image = new Image()!;
  const reader = new FileReader();

  reader.addEventListener("load", () => {
    image.src = reader.result as string;
  });
  reader.readAsDataURL(file);

  return image;
}

export function hexToColor(hex: string): Color {
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