import axios from 'axios';
import * as canvas from 'canvas';

enum TextPosition {
	CENTER,
	TOP_CENTER,
	BOTTOM_CENTER,
}

interface TextOptions {
	position: TextPosition,
	font: string,
	size: number,
	color?: string | CanvasGradient | CanvasPattern,
	outlined?: boolean,
	outlineColor?: string | CanvasGradient | CanvasPattern
}

class CatImage {
	private readonly _imageBuffer: Buffer;
	constructor(imageBuffer: Buffer) {
		this._imageBuffer = imageBuffer;
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
			ctx.strokeStyle = textOptions.outlineColor ?? 'black';
			ctx.lineWidth = 7;
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
	private readonly CAT_GEN_API_URL = 'https://cataas.com/cat';

	private request(): Promise<Buffer> {
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

export { CatWithTextGenerator, TextPosition, TextOptions };
