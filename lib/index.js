"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextPosition = exports.CatWithTextGenerator = void 0;
const axios_1 = require("axios");
const canvas = require("canvas");
var TextPosition;
(function (TextPosition) {
    TextPosition[TextPosition["CENTER"] = 0] = "CENTER";
    TextPosition[TextPosition["TOP_CENTER"] = 1] = "TOP_CENTER";
    TextPosition[TextPosition["BOTTOM_CENTER"] = 2] = "BOTTOM_CENTER";
})(TextPosition || (TextPosition = {}));
exports.TextPosition = TextPosition;
class CatImage {
    constructor(imageBuffer) {
        this._imageBuffer = imageBuffer;
    }
    getCanvas() {
        return __awaiter(this, void 0, void 0, function* () {
            const image = yield canvas.loadImage(this._imageBuffer);
            const cnv = canvas.createCanvas(image.width, image.height);
            const ctx = cnv.getContext('2d');
            ctx.drawImage(image, 0, 0);
            return cnv;
        });
    }
    addText(text, textOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const cnv = yield this.getCanvas();
            const ctx = cnv.getContext("2d");
            ctx.font = `${textOptions.size}px "${textOptions.font}"`;
            const measure = ctx.measureText(text);
            const textCoords = { x: 0, y: 0 };
            switch (textOptions.position) {
                case TextPosition.CENTER:
                    textCoords.x = (cnv.width - measure.width) / 2;
                    textCoords.y = (cnv.height - ((text.split('\n').length - 1) * textOptions.size)) / 2;
                    break;
                case TextPosition.BOTTOM_CENTER:
                    textCoords.x = (cnv.width - measure.width) / 2;
                    textCoords.y = cnv.height - ((text.split('\n').length - 1) * textOptions.size) - 10;
                    break;
                case TextPosition.TOP_CENTER:
                    textCoords.x = (cnv.width - measure.width) / 2;
                    textCoords.y = textOptions.size + 10;
                    break;
            }
            if (textOptions.outlined) {
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 7;
                ctx.strokeText(text, textCoords.x, textCoords.y);
            }
            ctx.fillStyle = 'white';
            ctx.fillText(text, textCoords.x, textCoords.y);
            return new CatImage(cnv.toBuffer());
        });
    }
    toBuffer() {
        return this._imageBuffer;
    }
}
class CatWithTextGenerator {
    constructor() {
        this.CAT_GEN_API_URL = 'https://cataas.cdom/cat';
    }
    request() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(this.CAT_GEN_API_URL, { responseType: 'arraybuffer' });
                resolve(Buffer.from(response.data, 'utf-8'));
            }
            catch (e) {
                reject(e);
            }
        }));
    }
    getImage() {
        return __awaiter(this, void 0, void 0, function* () {
            const imageBuffer = yield this.request();
            return new CatImage(imageBuffer);
        });
    }
}
exports.CatWithTextGenerator = CatWithTextGenerator;
