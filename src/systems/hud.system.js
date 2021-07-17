import * as ECS from "lofi-ecs";
import { HUD } from "../components/aircraft/hud.component";
import { Velocity } from "../components/velocity.component";
import { Airplane } from "../components/physics/airplane.component";

export class HUDSystem extends ECS.System {
	constructor() {
		super([HUD, Airplane, Velocity]);
	}

	updateEntity(entity, dt, params) {
		const hud = entity.getComponent(HUD);
		const airplane = entity.getComponent(Airplane);
		const velocity = entity.getComponent(Velocity);

		const canvas = hud.canvas;
		const ctx = hud.ctx;
		const style = "rgba(0, 255, 0, 1.0)";

		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas
		ctx.beginPath();

		let x, y;

		// width
		let w = 200;
		let h = 5;

		// speed
		ctx.save();
		ctx.font = "25px Arial";
		ctx.fillStyle = style;
		ctx.fillText(`${(velocity.speed * 10.0).toFixed(1)}`, 40, 40);
		ctx.restore();

		// altitude
		ctx.save();
		ctx.font = "25px Arial";
		ctx.fillStyle = style;
		ctx.fillText(`${velocity.speed.toFixed(1)}`, canvas.width - 50, 40);
		ctx.restore();

		// pitch ladder
		ctx.save();

		let off = Math.sin(airplane.pitch) * 1150;

		x = canvas.width / 2;
		let cy = canvas.height / 2;

		ctx.translate(x, cy);
		ctx.rotate(airplane.bank);
		ctx.translate(-x, -cy);
		ctx.translate(0, off);

		for (let i = -90; i < 90; i++) {
			y = cy + i * 100;

			ctx.beginPath();
			if (i > 0) {
				ctx.setLineDash([5, 2]);
			} else {
				ctx.setLineDash([]);
			}
			ctx.moveTo(x - 20, y);
			ctx.lineTo(x - 60, y);
			ctx.lineTo(x - 60, y - 10 * Math.sign(i));
			ctx.lineWidth = 4;
			ctx.strokeStyle = style;
			ctx.stroke();

			ctx.beginPath();
			ctx.moveTo(x + 20, y);
			ctx.lineTo(x + 60, y);
			ctx.lineTo(x + 60, y - 10 * Math.sign(i));
			ctx.lineWidth = 4;
			ctx.strokeStyle = style;
			ctx.stroke();

			ctx.font = "25px Arial";
			ctx.fillStyle = style;
			ctx.fillText(`${Math.abs(i * 5)}`, x - w / 2, y);

			ctx.font = "25px Arial";
			ctx.fillStyle = style;
			ctx.fillText(`${Math.abs(i * 5)}`, x + w / 2, y);
		}
		ctx.restore();

		hud.plane.material.map.needsUpdate = true;
	}
}
