const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const form = document.getElementById("form");
const input = document.getElementById("input");
const select = document.getElementById("select");
const color = document.getElementById("color");
const colors = document.getElementById("colors");

const canvasWidth = 500;
const canvasHeight = 300;

function ditherFloydSteinberg(data, pallete) {
  for (var i = 0; i < data.length; i += 4) {
    const pixel = {
      red: data[i],
      green: data[i + 1],
      blue: data[i + 2]
    };
    const nearestPixel = findNearestPixel(pixel, pallete);
    const error = {
      red: pixel.red - nearestPixel.red,
      green: pixel.green - nearestPixel.green,
      blue: pixel.blue - nearestPixel.blue
    };

    data[i] = nearestPixel.red;
    data[i + 1] = nearestPixel.green;
    data[i + 2] = nearestPixel.blue;

    data[(i + 4)] += error.red * 7/16;
    data[(i + 4) + 1] += error.green * 7/16;
    data[(i + 4) + 2] += error.blue * 7/16;

    data[i + (canvasWidth - 1) * 4] += error.red * 3/16;
    data[i + (canvasWidth - 1) * 4 + 1] += error.green * 3/16;
    data[i + (canvasWidth - 1) * 4 + 2] += error.blue * 3/16;

    data[i + (canvasWidth) * 4] += error.red * 5/16;
    data[i + (canvasWidth) * 4 + 1] += error.green * 5/16;
    data[i + (canvasWidth) * 4 + 2] += error.blue * 5/16;

    data[i + (canvasWidth + 1) * 4] += error.red * 1/16;
    data[i + (canvasWidth + 1) * 4 + 1] += error.green * 1/16;
    data[i + (canvasWidth + 1) * 4 + 2] += error.blue * 1/16;
  }
}

function ditherNearest(data, pallete) {
  for (var i = 0; i < data.length; i += 4) {
    const pixel = {
      red: data[i],
      green: data[i + 1],
      blue: data[i + 2]
    };
    const nearestPixel = findNearestPixel(pixel, pallete);

    data[i] = nearestPixel.red;
    data[i + 1] = nearestPixel.green;
    data[i + 2] = nearestPixel.blue;
  }
}

function findNearestPixel(pixel, pallete) {
  var minDistance = 99999;
  var minIndex = 0;

  const r1 = pixel.red;
  const g1 = pixel.green;
  const b1 = pixel.blue;

  for (var i = 0; i < pallete.length; i++) {
    const r2 = pallete[i].red;
    const g2 = pallete[i].green;
    const b2 = pallete[i].blue;

    const distance = Math.floor(Math.sqrt((r2 - r1) * (r2 - r1) + (g2 - g1) * (g2 - g1) + (b2 - b1) * (b2 - b1)));

    if (minDistance > distance) {
      minDistance = distance;
      minIndex = i;
    }
  }

  return pallete[minIndex];
}

function extractPallete() {
  const collection = colors.getElementsByTagName("div");
  const pallete = [];

  for (var i = 0; i < collection.length; i++) {
    const element = collection[i];
    const color = window.getComputedStyle(element).backgroundColor;
    const values = color.match(/\d+/g).map(Number);

    const pixel = {
      red: values[0],
      green: values[1],
      blue: values[2]
    };

    pallete.push(pixel);
  }

  return pallete;
}

function readImage(file) {
  const image = new Image();
  const reader = new FileReader();

  reader.addEventListener("load", () => {
    image.src = reader.result;
  });
  reader.readAsDataURL(file);

  return image;
}

color.addEventListener("change", () => {
  const colorDisplay = document.createElement("div");
  colorDisplay.setAttribute("style", `background-color: ${color.value}`);
  colors.append(colorDisplay);
})

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (input.files.length > 0) {
    const file = input.files[0];
    const image = readImage(file);

    image.addEventListener("load", () => {
      context.drawImage(image, 0, 0);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const pallete = extractPallete();

      switch (select.selectedIndex) {
        // Nearest
        case 0:
          ditherNearest(imageData.data, pallete);
          break;
        // Floyd-Steinberg
        case 1:
          ditherFloydSteinberg(imageData.data, pallete);
          break;
        default:
          break;
      }

      context.putImageData(imageData, 0, 0);
    });
  }
});