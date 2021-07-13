import * as THREE from "three";

class Node extends THREE.Box2 {
    children = [];
    constructor(min, max) {
        super(min, max);
        this.key = `${this.center.x}_${this.center.y}`;
    }

    get size() {
        return this.getSize(new THREE.Vector2());
    }

    get center() {
        return this.getCenter(new THREE.Vector2());
    }
}

export class Quadtree {
    constructor(size, minNodeSize) {
        this._root = new Node(new THREE.Vector2(-size, -size), new THREE.Vector2(size, size));
        this._minNodeSize = minNodeSize;
    }

    getChildren() {
        const children = [];
        this._getChildren(this._root, children);
        return children;
    }

    _getChildren(node, arr) {
        if (node.children.length == 0) {
            arr.push(node);
            return;
        }

        for (let child of node.children) {
            this._getChildren(child, arr);
        }
    }

    createChildren(node) {
        const middle = node.center;

        // bottom left
        const bl = new Node(node.min, middle);

        // bottom right
        const br = new Node(new THREE.Vector2(middle.x, node.min.y), new THREE.Vector2(node.max.x, middle.y));

        // top left
        const tl = new Node(new THREE.Vector2(node.min.x, middle.y), new THREE.Vector2(middle.x, node.max.y));

        // top right
        const tr = new Node(middle, node.max);

        return [bl, br, tl, tr];
    }

    insert(pos) {
        this._insert(this._root, new THREE.Vector2(pos.x, pos.z));
    }

    _insert(node, pos) {
        const center = node.getCenter(new THREE.Vector2());
        const distance = center.distanceTo(pos);

        if (distance < node.size.x && node.size.x > this._minNodeSize) {
            node.children = this.createChildren(node);

            for (let child of node.children) {
                this._insert(child, pos);
            }
        }
    }
}
