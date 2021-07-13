import * as THREE from "three";

export class FixedHeightMap {
    constructor() {}

    get(x, y) {
        return 0;
    }
}

export class ImageHeightMap {
    constructor(image) {
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const context = canvas.getContext("2d");
        context.drawImage(image, 0, 0);
        this._data = context.getImageData(0, 0, image.width, image.height);
    }

    get(x, y) {
        const pixel = (x, y) => {
            const position = (x + this._data.width * y) * 4;
            const data = this._data.data;
            return data[position] / 255.0;
        };
        const sat = (x) => {
            return Math.min(Math.max(x, 0.0), 1.0);
        };

        // where to place to heightmap image
        const offset = new THREE.Vector2(-16000, -16000);
        const dimensions = new THREE.Vector2(32000, 32000);

        const xf = 1.0 - sat((x - offset.x) / dimensions.x);
        const yf = sat((y - offset.y) / dimensions.y);
        const w = this._data.width - 1;
        const h = this._data.height - 1;
        const x1 = Math.floor(xf * w);
        const y1 = Math.floor(yf * h);
        const x2 = THREE.MathUtils.clamp(x1 + 1, 0, w);
        const y2 = THREE.MathUtils.clamp(y1 + 1, 0, h);
        const xp = xf * w - x1;
        const yp = yf * h - y1;
        const p11 = pixel(x1, y1);
        const p21 = pixel(x2, y1);
        const p12 = pixel(x1, y2);
        const p22 = pixel(x2, y2);
        const px1 = THREE.MathUtils.lerp(p11, p21, xp);
        const px2 = THREE.MathUtils.lerp(p12, p22, xp);
        return THREE.MathUtils.lerp(px1, px2, yp) * 500;
    }
}

export class RandomHeightMap {
    constructor() {
        this._values = [];
    }

    _rand(x, y) {
        const k = x + "." + y;
        if (!(k in this._values)) {
            this._values[k] = Math.random();
        }
        return this._values[k];
    }

    get(x, y) {
        const x1 = Math.floor(x);
        const y1 = Math.floor(y);
        const x2 = x1 + 1;
        const y2 = y1 + 1;
        const xp = x - x1;
        const yp = y - y1;
        const p11 = this._rand(x1, y1);
        const p21 = this._rand(x2, y1);
        const p12 = this._rand(x1, y2);
        const p22 = this._rand(x2, y2);
        const px1 = THREE.MathUtils.lerp(p11, p21, xp);
        const px2 = THREE.MathUtils.lerp(p12, p22, xp);
        return THREE.MathUtils.lerp(px1, px2, yp);
    }
}
