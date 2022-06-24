# cats-generator ![npm-image]
[npm-image]:https://img.shields.io/npm/v/cats-generator.svg?style=flat
Simple promise-based npm library made to get cat images with custom text 
---
---
## Install 
``` 
npm install cats-generator
```
----
## Docs
### Class — CatWithTextGenerator 
* `getImage()` - Makes request to 'https://cataas.com/cat' and returns `Promise<CatImage>`.
### Class — CatImage
* `width` - image width field.
* `height` - image height field.
* `toBuffer()` - Return cat image buffer.
* `addText(text, textOptions)` - Adds text to image and returns `Promise<CatImage>`.
* * text - string
* * textOptions - TextOptions
### Enum — TextPosition
* `CENTER,
CENTER_LEFT,
CENTER_RIGHT,
TOP_CENTER,
TOP_LEFT,
TOP_RIGHT,
BOTTOM_CENTER,
BOTTOM_LEFT,
BOTTOM_RIGHT,
CUSTOM`
* * When you use `CUSTOM` you must set 

### Interface — TextOptions
* position: TextPosition
* font: string
* size: number
* color?: string | CanvasGradient | CanvasPattern 
* *  Optional. Default: `white`
* outlined?: boolean
* * Optional. Default: `false`
* outlineColor?: string | CanvasGradient | CanvasPattern
* * Optional. Default: `black`
* 	outlineSize: number
* * Optional. Default: `7`
*	textPositionOffset: number,
* * Optional. Default: `10`
*	customPositionCoords: TextStartPoint
* * `Mandatory` with `TextPosition.CUSTOM` 

### Interface — TextStartPoint
* x: number
* y: number

## Example Usage
```js
const { CatWithTextGenerator, TextOptions, TextPosition } = require("cats-generator");
const { writeFileSync } =  require("fs");

async function main() {
    try {
        const catGenerator = new CatWithTextGenerator();
        const image = await catGenerator.getImage();
        const text = 'Hello World';
        const textOptions = {
            position: TextPosition.BOTTOM_CENTER,
            size: 64,
            font: 'Sans',
            outlined: true, 
            color: 'white',
        };
        const imageWithText = await image.addText(text, textOptions);
        const imageBuffer = imageWithText.toBuffer();
        writeFileSync('./file.png', imageBuffer);
        console.log('Image saved!');
    } catch(e) {
        console.error(e);
    }
}

main();
```