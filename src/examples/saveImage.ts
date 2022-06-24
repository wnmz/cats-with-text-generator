import { CatWithTextGenerator, TextOptions, TextPosition } from "../index";
import { writeFileSync } from "fs";

async function main() {
    try {
        const catGenerator = new CatWithTextGenerator();
        const image = await catGenerator.getImage();
        const text = 'Hello World';
        const textOptions: TextOptions = {
            position: TextPosition.CENTER,
            size: 64,
            font: 'Sans',
            outlined: true,
            color: 'white',
        };

        const imageWithText = await image.addText(text, textOptions);
        const imageBuffer = imageWithText.toBuffer();
        writeFileSync('./file.png', imageBuffer);
        console.log('Image saved!');
    } catch (e) {
        console.error(e);
    }
}

main();