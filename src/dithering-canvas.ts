import Pallete from "./pallete";
import { Color } from "./pallete";

export enum Algorithm {
  NEAREST = 0,
  FLOYD_STEINBERG = 1
}

export default class DitheringCanvas {
  private _offscreenCanvas: HTMLCanvasElement;
  private _offscreenContext: CanvasRenderingContext2D;

  private _renderingImage: HTMLImageElement;

  private scale: number;
  private isDragging: boolean;
  private offsetX: number;
  private offsetY: number;

  constructor() {
    this._offscreenCanvas = document.getElementById("offscreenCanvas")! as HTMLCanvasElement;
    this._offscreenContext = this._offscreenCanvas.getContext("2d")!;

    this._renderingImage = document.getElementById("renderingImage")! as HTMLImageElement;

    this.scale = 1;

    this.isDragging = false;

    this.offsetX = 0;
    this.offsetY = 0;

    this._renderingImage.addEventListener("wheel", event => {
      this.scale += event.deltaY / 1000;
      this._renderingImage.style.scale = this.scale.toString();
    }); 

    this._renderingImage.addEventListener("dragstart", event => {
      this.isDragging = true;
      this._renderingImage.addEventListener("mousemove", event => {
        if (this.isDragging) {
          this._renderingImage.style.transform = `translate(${event.offsetX / 10}px, ${event.offsetY / 10}px)`;
        }
        return false;
      });
    });

    this._renderingImage.addEventListener("dragend", event => {
      this.isDragging = false;
    });
  }

  get width(): number {
    return this._offscreenCanvas.width;
  }

  set width(value: number) {
    this._offscreenCanvas.width = value;
  }

  get height(): number {
    return this._offscreenCanvas.height;
  }

  set height(value: number) {
    this._offscreenCanvas.height = value;
  }

  public dither(image: HTMLImageElement, pallete: Pallete, algo: Algorithm) {
    this._offscreenContext.drawImage(image, 0, 0);

    const imageData = this._offscreenContext.getImageData(0, 0, this.width, this.height)!;

    const data = imageData?.data;
    if (pallete.colors.length > 0) {
      switch (algo) {

        // Nearest
        case Algorithm.NEAREST:
          this.ditherNearest(data, pallete);
          break;

        // Floyd-Steinberg
        case Algorithm.FLOYD_STEINBERG:
          this.ditherFloydSteinberg(data, pallete, this.width, this.height);
          break;
      }
    }

    this._offscreenContext.putImageData(imageData, 0, 0);
    this._renderingImage.src = this._offscreenCanvas.toDataURL();
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

  private ditherFloydSteinberg(data: Uint8ClampedArray, pallete: Pallete, width: number, height: number) {
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

      data[i + (width - 1) * 4] += error.r * 3 / 16;
      data[i + (width - 1) * 4 + 1] += error.g * 3 / 16;
      data[i + (width - 1) * 4 + 2] += error.b * 3 / 16;

      data[i + (width) * 4] += error.r * 5 / 16;
      data[i + (width) * 4 + 1] += error.g * 5 / 16;
      data[i + (width) * 4 + 2] += error.b * 5 / 16;

      data[i + (width + 1) * 4] += error.r * 1 / 16;
      data[i + (width + 1) * 4 + 1] += error.g * 1 / 16;
      data[i + (width + 1) * 4 + 2] += error.b * 1 / 16;
    }
  }
}