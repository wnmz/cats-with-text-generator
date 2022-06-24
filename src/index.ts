// TODO: Split everithing into file modules.
import axios from 'axios';
import * as canvas from 'canvas';
import * as bufferImageSize from 'buffer-image-size';

enum TextPosition {
	CENTER,
	TOP_CENTER,
	BOTTOM_CENTER,
	TOP_LEFT,
	TOP_RIGHT,
	CENTER_LEFT,
	CENTER_RIGHT,
	BOTTOM_LEFT,
	BOTTOM_RIGHT,
	CUSTOM
}

interface TextOptions {
	position: TextPosition,
	font: string,
	size: number,
	color?: string | CanvasGradient | CanvasPattern,
	outlined?: boolean,
	outlineColor?: string | CanvasGradient | CanvasPattern,
	outlineSize?: number,
	textPositionOffset?: number,
	customPositionCoords?: TextStartPoint
}

interface TextStartPoint {
	x: number;
	y: number;
}

class CatImage {
	private readonly _imageBuffer: Buffer;
	public width: number = 0;
	public height: number = 0;

	public constructor(imageBuffer: Buffer) {
		this._imageBuffer = imageBuffer;
		const size = bufferImageSize(this._imageBuffer);
		this.width = size.width;
		this.height = size.height;
	}

	private async getCanvas(): Promise<canvas.Canvas> {
		const image = await canvas.loadImage(this._imageBuffer);
		const cnv = canvas.createCanvas(image.width, image.height);
		const ctx = cnv.getContext('2d');
		ctx.drawImage(image, 0, 0);
		return cnv;
	}

	public async addText(text: string, textOptions: TextOptions): Promise<CatImage> {
		const cnv = await this.getCanvas();
		const ctx = cnv.getContext("2d");
		ctx.font = `${textOptions.size}px "${textOptions.font}"`;
		const measure = ctx.measureText(text);
		const textPositionOffset = textOptions.textPositionOffset ?? 10;
		const textCoords: TextStartPoint = { x: 0, y: 0 };
		const linesCount = (text.split('\n').length - 1);

		switch (textOptions.position) {
			case TextPosition.CENTER:
				textCoords.x = (cnv.width - measure.width) / 2;
				textCoords.y = (cnv.height - (linesCount * textOptions.size)) / 2;
				break;
			case TextPosition.CENTER_LEFT:
				textCoords.x = textPositionOffset;
				textCoords.y = (cnv.height - (linesCount * textOptions.size)) / 2;
				break;
			case TextPosition.CENTER_RIGHT:
				textCoords.x = cnv.width - measure.width - textPositionOffset;
				textCoords.y = (cnv.height - (linesCount * textOptions.size)) / 2;
				break;

			case TextPosition.BOTTOM_CENTER:
				textCoords.x = (cnv.width - measure.width) / 2;
				textCoords.y = cnv.height - (linesCount * textOptions.size) - textPositionOffset;
				break;
			case TextPosition.BOTTOM_LEFT:
				textCoords.x = textPositionOffset;
				textCoords.y = cnv.height - (linesCount * textOptions.size) - textPositionOffset;
				break;
			case TextPosition.BOTTOM_RIGHT:
				textCoords.x = cnv.width - measure.width - textPositionOffset;
				textCoords.y = cnv.height - (linesCount * textOptions.size) - textPositionOffset;
				break;

			case TextPosition.TOP_CENTER:
				textCoords.x = (cnv.width - measure.width) / 2;
				textCoords.y = textOptions.size + textPositionOffset;
				break;
			case TextPosition.TOP_LEFT:
				textCoords.x = textPositionOffset;
				textCoords.y = textOptions.size + textPositionOffset;
				break;
			case TextPosition.TOP_RIGHT:
				textCoords.x = cnv.width - measure.width - textPositionOffset;
				textCoords.y = textOptions.size + textPositionOffset;
				break;

			case TextPosition.CUSTOM:
				if(textOptions.customPositionCoords == undefined) 
					throw new Error('textPosition is "CUSTOM" but "customPositionCoords" is undefined');
				textCoords.x = textOptions.customPositionCoords.x;
				textCoords.y = textOptions.customPositionCoords.y;
			break;
		}

		if (textOptions.outlined) {
			ctx.strokeStyle = textOptions.outlineColor ?? 'black';
			ctx.lineWidth = textOptions.outlineSize ?? 7;
			ctx.strokeText(text, textCoords.x, textCoords.y);
		}

		ctx.fillStyle = textOptions.color ?? 'white';
		ctx.fillText(text, textCoords.x, textCoords.y);
		return new CatImage(cnv.toBuffer());
	}
	

	public toBuffer(): Buffer {
		return this._imageBuffer;
	}
}

class CatWithTextGenerator {
	public CAT_GEN_API_URL = 'https://cataas.com/cat';

	// Made it public so people can override it.
	public request(): Promise<Buffer> {
		return new Promise(async (resolve, reject) => {
			try {
				const response = await axios.get(this.CAT_GEN_API_URL, { responseType: 'arraybuffer' });
				resolve(Buffer.from(response.data, 'utf-8'));
			} catch (e) {
				reject(e);
			}
		});
	}


	public async getImage(): Promise<CatImage> {
		const imageBuffer = await this.request();
		return new CatImage(imageBuffer);
	}
}

export { CatWithTextGenerator, CatImage, TextPosition, TextOptions };
