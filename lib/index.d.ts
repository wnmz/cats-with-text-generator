/// <reference types="node" />
declare enum TextPosition {
    CENTER = 0,
    TOP_CENTER = 1,
    BOTTOM_CENTER = 2
}
interface TextOptions {
    position: TextPosition;
    font: string;
    size: number;
    color: string | CanvasGradient | CanvasPattern;
    outlined?: boolean;
}
declare class CatImage {
    private readonly _imageBuffer;
    constructor(imageBuffer: Buffer);
    private getCanvas;
    addText(text: string, textOptions: TextOptions): Promise<CatImage>;
    toBuffer(): Buffer;
}
declare class CatWithTextGenerator {
    private readonly CAT_GEN_API_URL;
    private request;
    getImage(): Promise<CatImage>;
}
export { CatWithTextGenerator, TextPosition, TextOptions };
