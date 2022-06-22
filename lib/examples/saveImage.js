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
const index_1 = require("../index");
const fs_1 = require("fs");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const catGenerator = new index_1.CatWithTextGenerator();
            const image = yield catGenerator.getImage();
            const text = 'Hello World';
            const textOptions = {
                position: index_1.TextPosition.BOTTOM_CENTER,
                size: 64,
                font: 'Sans',
                outlined: true,
                color: 'white'
            };
            const imageWithText = yield image.addText(text, textOptions);
            const imageBuffer = imageWithText.toBuffer();
            (0, fs_1.writeFileSync)('./file.png', imageBuffer);
            console.log('Image saved!');
        }
        catch (e) {
            console.error(e);
        }
    });
}
main();
