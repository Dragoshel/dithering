/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/dithering-canvas.ts":
/*!*********************************!*\
  !*** ./src/dithering-canvas.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Algorithm: () => (/* binding */ Algorithm),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nvar Algorithm;\n(function (Algorithm) {\n    Algorithm[Algorithm[\"NEAREST\"] = 0] = \"NEAREST\";\n    Algorithm[Algorithm[\"FLOYD_STEINBERG\"] = 1] = \"FLOYD_STEINBERG\";\n})(Algorithm || (Algorithm = {}));\nvar DitheringCanvas = /** @class */ (function () {\n    function DitheringCanvas() {\n        var _this = this;\n        this.scale = 1;\n        this.isDragging = false;\n        this.offsetX = 0;\n        this.offsetY = 0;\n        this.initialX = 0;\n        this.initialY = 0;\n        this._offscreenCanvas = document.getElementById(\"offscreenCanvas\");\n        this._offscreenContext = this._offscreenCanvas.getContext(\"2d\");\n        this._renderingImage = document.getElementById(\"renderingImage\");\n        this._renderingImageContainer = document.getElementById(\"renderingImageContainer\");\n        this._renderingImageContainer.addEventListener(\"wheel\", function (event) {\n            if (_this.scale >= 0.5) {\n                _this.scale -= event.deltaY / 1000;\n                _this._renderingImage.style.scale = _this.scale.toString();\n            }\n            else {\n                _this.scale = 0.5;\n            }\n        });\n        this._renderingImageContainer.addEventListener(\"mousedown\", function (event) {\n            _this.isDragging = true;\n            _this.initialX = event.clientX;\n            _this.initialY = event.clientY;\n            _this.offsetX = _this._renderingImage.offsetLeft;\n            _this.offsetY = _this._renderingImage.offsetTop;\n            _this._renderingImageContainer.style.cursor = \"grabbing\";\n        });\n        this._renderingImageContainer.addEventListener(\"mousemove\", function (event) {\n            if (_this.isDragging) {\n                var x = event.clientX - _this.initialX + _this.offsetX;\n                var y = event.clientY - _this.initialY + _this.offsetY;\n                _this._renderingImage.style.left = \"\".concat(x, \"px\");\n                _this._renderingImage.style.top = \"\".concat(y, \"px\");\n            }\n        });\n        this._renderingImageContainer.addEventListener(\"mouseup\", function () {\n            _this.isDragging = false;\n            _this._renderingImageContainer.style.cursor = \"grab\";\n        });\n    }\n    Object.defineProperty(DitheringCanvas.prototype, \"width\", {\n        get: function () {\n            return this._offscreenCanvas.width;\n        },\n        set: function (value) {\n            this._offscreenCanvas.width = value;\n        },\n        enumerable: false,\n        configurable: true\n    });\n    Object.defineProperty(DitheringCanvas.prototype, \"height\", {\n        get: function () {\n            return this._offscreenCanvas.height;\n        },\n        set: function (value) {\n            this._offscreenCanvas.height = value;\n        },\n        enumerable: false,\n        configurable: true\n    });\n    DitheringCanvas.prototype.drawImage = function (image) {\n        this._offscreenContext.drawImage(image, 0, 0);\n        this._renderingImage.src = this._offscreenCanvas.toDataURL();\n    };\n    DitheringCanvas.prototype.dither = function (image, pallete, algo) {\n        this._offscreenContext.drawImage(image, 0, 0);\n        var imageData = this._offscreenContext.getImageData(0, 0, this.width, this.height);\n        var data = imageData === null || imageData === void 0 ? void 0 : imageData.data;\n        if (pallete.colors.length > 0) {\n            switch (algo) {\n                // Nearest\n                case Algorithm.NEAREST:\n                    this.ditherNearest(data, pallete);\n                    break;\n                // Floyd-Steinberg\n                case Algorithm.FLOYD_STEINBERG:\n                    this.ditherFloydSteinberg(data, pallete, this.width, this.height);\n                    break;\n            }\n        }\n        this._offscreenContext.putImageData(imageData, 0, 0);\n        this._renderingImage.src = this._offscreenCanvas.toDataURL();\n    };\n    DitheringCanvas.prototype.ditherNearest = function (data, pallete) {\n        for (var i = 0; i < data.length; i += 4) {\n            var current = { r: data[i], g: data[i + 1], b: data[i + 2] };\n            var nearest = pallete.findNearestColor(current);\n            data[i] = nearest.r;\n            data[i + 1] = nearest.g;\n            data[i + 2] = nearest.b;\n        }\n    };\n    DitheringCanvas.prototype.ditherFloydSteinberg = function (data, pallete, width, height) {\n        for (var i = 0; i < data.length; i += 4) {\n            var current = { r: data[i], g: data[i + 1], b: data[i + 2] };\n            var nearest = pallete.findNearestColor(current);\n            var error = { r: current.r - nearest.r, g: current.g - nearest.g, b: current.b - nearest.b };\n            data[i] = nearest.r;\n            data[i + 1] = nearest.g;\n            data[i + 2] = nearest.b;\n            data[(i + 4)] += error.r * 7 / 16;\n            data[(i + 4) + 1] += error.g * 7 / 16;\n            data[(i + 4) + 2] += error.b * 7 / 16;\n            data[i + (width - 1) * 4] += error.r * 3 / 16;\n            data[i + (width - 1) * 4 + 1] += error.g * 3 / 16;\n            data[i + (width - 1) * 4 + 2] += error.b * 3 / 16;\n            data[i + (width) * 4] += error.r * 5 / 16;\n            data[i + (width) * 4 + 1] += error.g * 5 / 16;\n            data[i + (width) * 4 + 2] += error.b * 5 / 16;\n            data[i + (width + 1) * 4] += error.r * 1 / 16;\n            data[i + (width + 1) * 4 + 1] += error.g * 1 / 16;\n            data[i + (width + 1) * 4 + 2] += error.b * 1 / 16;\n        }\n    };\n    return DitheringCanvas;\n}());\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DitheringCanvas);\n\n\n//# sourceURL=webpack://dithering/./src/dithering-canvas.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _dithering_canvas__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dithering-canvas */ \"./src/dithering-canvas.ts\");\n/* harmony import */ var _pallete__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./pallete */ \"./src/pallete.ts\");\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils */ \"./src/utils.ts\");\n\n\n\nvar input = document.getElementById(\"input\");\nvar select = document.getElementById(\"select\");\nvar ditheringCanvas = new _dithering_canvas__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\nvar pallete = new _pallete__WEBPACK_IMPORTED_MODULE_1__[\"default\"]();\nfunction handleFileInput() {\n    if (input.files.length > 0) {\n        var file = input.files[0];\n        var image_1 = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.imageFromFile)(file);\n        image_1.addEventListener(\"load\", function () {\n            ditheringCanvas.width = image_1.width;\n            ditheringCanvas.height = image_1.height;\n            ditheringCanvas.drawImage(image_1);\n        });\n    }\n}\nfunction handleSelect() {\n    if (input.files.length > 0) {\n        var file = input.files[0];\n        var image_2 = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.imageFromFile)(file);\n        image_2.addEventListener(\"load\", function () {\n            ditheringCanvas.width = image_2.width;\n            ditheringCanvas.height = image_2.height;\n            ditheringCanvas.dither(image_2, pallete, select.selectedIndex);\n        });\n    }\n}\npallete.colorPicker.addEventListener(\"input\", handleSelect);\ninput.addEventListener(\"input\", handleFileInput);\nselect.addEventListener(\"change\", handleSelect);\n\n\n//# sourceURL=webpack://dithering/./src/index.ts?");

/***/ }),

/***/ "./src/pallete.ts":
/*!************************!*\
  !*** ./src/pallete.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ \"./src/utils.ts\");\n\nvar Pallete = /** @class */ (function () {\n    function Pallete() {\n        var _this = this;\n        this.colors = [];\n        this._colorDisplay = document.getElementById(\"colorDisplay\");\n        this._colorButton = document.getElementById(\"colorButton\");\n        this._colorPicker = document.getElementById(\"colorPicker\");\n        this._colorButton.addEventListener(\"click\", function () {\n            _this._colorPicker.click();\n        });\n        this._colorPicker.addEventListener(\"input\", function () {\n            var newColor = document.createElement(\"div\");\n            newColor.setAttribute(\"style\", \"background-color: \".concat(_this._colorPicker.value));\n            _this._colorDisplay.insertBefore(newColor, _this._colorButton);\n            var color = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.hexToColor)(_this._colorPicker.value);\n            _this.colors.push(color);\n        });\n    }\n    Object.defineProperty(Pallete.prototype, \"colorButton\", {\n        get: function () {\n            return this._colorButton;\n        },\n        enumerable: false,\n        configurable: true\n    });\n    Object.defineProperty(Pallete.prototype, \"colorPicker\", {\n        get: function () {\n            return this._colorPicker;\n        },\n        enumerable: false,\n        configurable: true\n    });\n    Pallete.prototype.findNearestColor = function (color) {\n        var minDistance = 99999;\n        var minIndex = 0;\n        var r1 = color.r;\n        var g1 = color.g;\n        var b1 = color.b;\n        for (var i = 0; i < this.colors.length; i++) {\n            var r2 = this.colors[i].r;\n            var g2 = this.colors[i].g;\n            var b2 = this.colors[i].b;\n            var distance = Math.floor(Math.sqrt((r2 - r1) * (r2 - r1) + (g2 - g1) * (g2 - g1) + (b2 - b1) * (b2 - b1)));\n            if (minDistance > distance) {\n                minDistance = distance;\n                minIndex = i;\n            }\n        }\n        return this.colors[minIndex];\n    };\n    return Pallete;\n}());\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Pallete);\n\n\n//# sourceURL=webpack://dithering/./src/pallete.ts?");

/***/ }),

/***/ "./src/utils.ts":
/*!**********************!*\
  !*** ./src/utils.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   hexToColor: () => (/* binding */ hexToColor),\n/* harmony export */   imageFromFile: () => (/* binding */ imageFromFile)\n/* harmony export */ });\nfunction imageFromFile(file) {\n    var image = new Image();\n    var reader = new FileReader();\n    reader.addEventListener(\"load\", function () {\n        image.src = reader.result;\n    });\n    reader.readAsDataURL(file);\n    return image;\n}\nfunction hexToColor(hex) {\n    hex = hex.replace(\"#\", \"\");\n    if (hex.length === 3) {\n        hex = hex\n            .split(\"\")\n            .map(function (c) { return c + c; })\n            .join(\"\");\n    }\n    return {\n        r: parseInt(hex.slice(0, 2), 16),\n        g: parseInt(hex.slice(2, 4), 16),\n        b: parseInt(hex.slice(4, 6), 16)\n    };\n}\n\n\n//# sourceURL=webpack://dithering/./src/utils.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;