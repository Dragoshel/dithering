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
  private _renderingImageContainer: HTMLImageElement;

  private scale: number = 1;
  private isDragging: boolean = false;

  private offsetX: number = 0;
  private offsetY: number = 0;

  private initialX: number = 0;
  private initialY: number = 0;

  constructor() {
    this._offscreenCanvas = document.getElementById("offscreenCanvas")! as HTMLCanvasElement;
    this._offscreenContext = this._offscreenCanvas.getContext("2d")!;

    this._renderingImage = document.getElementById("renderingImage")! as HTMLImageElement;
    this._renderingImageContainer = document.getElementById("renderingImageContainer")! as HTMLImageElement;

    this._renderingImageContainer.addEventListener("wheel", event => {
      if (this.scale >= 0.5) {
        this.scale -= event.deltaY / 1000;
        this._renderingImage.style.scale = this.scale.toString();
      } else {
        this.scale = 0.5;
      }
    }); 

    this._renderingImageContainer.addEventListener("mousedown", event => {
      this.isDragging = true;
      this.initialX = event.clientX;
      this.initialY = event.clientY;
      this.offsetX = this._renderingImage.offsetLeft;
      this.offsetY = this._renderingImage.offsetTop;

      this._renderingImageContainer.style.cursor = "grabbing";
    });

    this._renderingImageContainer.addEventListener("mousemove", event => {
      if (this.isDragging) {
        const x = event.clientX - this.initialX + this.offsetX;
        const y = event.clientY - this.initialY + this.offsetY;

        this._renderingImage.style.left = `${x}px`;
        this._renderingImage.style.top = `${y}px`;
      }
    });

    this._renderingImageContainer.addEventListener("mouseup", () => {
      this.isDragging = false;
      this._renderingImageContainer.style.cursor = "grab";
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

  public drawImage(image: HTMLImageElement) {
    this._offscreenContext.drawImage(image, 0, 0);
    this._renderingImage.src = this._offscreenCanvas.toDataURL();
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