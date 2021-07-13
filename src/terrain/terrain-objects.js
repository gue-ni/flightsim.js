import * as THREE from "three";

const _RESOLUTION = 10;

class LookupTable {
    constructor() {
        this._chunkSize = 512;
        this._maxChunkSize = 1024;
        this._table = {};
    }

    _hash(pos) {
        const x = Math.floor(pos.x / this._chunkSize);
        const y = Math.floor(pos.y / this._chunkSize);
        return `${x}/${y}`;
    }

    insert(obj) {
        const key = this._hash(obj.pos);
        if (this._table[key]) {
            this._table[key].push(obj);
        } else {
            this._table[key] = [obj];
        }
    }

    _entry(pos) {
        return this._table[this._hash(pos)] || [];
    }

    lookup(pos, size) {
        if (size.x <= this._maxChunkSize) {
            if (size.x > this._chunkSize) {
                const offset = size.x / 4;
                const newSize = new THREE.Vector3(size.x / 2, size.y / 2);
                const p1 = this.lookup(new THREE.Vector2(pos.x + offset, pos.y + offset), newSize);
                const p2 = this.lookup(new THREE.Vector2(pos.x + offset, pos.y - offset), newSize);
                const p3 = this.lookup(new THREE.Vector2(pos.x - offset, pos.y + offset), newSize);
                const p4 = this.lookup(new THREE.Vector2(pos.x - offset, pos.y - offset), newSize);
                return [...p1, ...p2, ...p3, ...p4];
            } else {
                return this._entry(pos);
            }
        } else {
            return [];
        }
    }
}

const lookupTable = new LookupTable();
const radius = 100;
for (let i = 0; i < 50; i++) {
    lookupTable.insert({
        pos: new THREE.Vector2(radius * Math.random() - radius / 2, radius * Math.random() - radius / 2),
    });
}

/*
lookupTable.insert({
    pos: new THREE.Vector2(10, 10),
});
lookupTable.insert({
    pos: new THREE.Vector2(10, -10),
});
lookupTable.insert({
    pos: new THREE.Vector2(-10, 10),
});
lookupTable.insert({
    pos: new THREE.Vector2(-10, -10),
});
*/

export class TerrainObjects {
    constructor(root, offset, dimensions, heightmap, key) {
        const terrainObjects = lookupTable.lookup(offset, dimensions);

        if (terrainObjects.length > 0) {
            this._transform = new THREE.Group();

            for (const obj of terrainObjects) {
                const pos = obj.pos;
                const terrainObject = this.createBuilding();
                terrainObject.position.set(pos.x, heightmap.get(pos.x, pos.y), pos.y);
                terrainObject.rotateY(Math.random());
                this._transform.add(terrainObject);
            }

            root.add(this._transform);
        }
    }

    createBuilding() {
        const obj = new THREE.Mesh(
            new THREE.BoxGeometry(
                THREE.MathUtils.randInt(1, 3),
                THREE.MathUtils.randInt(1, 5),
                THREE.MathUtils.randInt(1, 3)
            ),
            new THREE.MeshStandardMaterial({
                color: 0x857f76,
            })
        );

        obj.castShadow = true;
        return obj;
    }

    destroy() {
        if (this._transform) {
            const parent = this._transform.parent;

            this._transform.traverse(function (child) {
                if (child.geometry) child.geometry.dispose();
                if (child.material) child.material.dispose();
            });

            parent.remove(this._transform);
        }
    }
}
