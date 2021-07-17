import { FiniteStateMachine, State } from "./fsm";
import { Game } from "../game";
import { AssetManager } from "../asset_manager";

class ScreenState extends State {
	constructor(fsm, element_id) {
		super();
		this.fsm = fsm;
		this.screen = document.querySelector(element_id);
	}

	enter(previous) {
		this.screen.style.display = "block";
		console.log(`ent ${this.constructor.name}`);
	}

	exit(next) {
		this.screen.style.display = "none";
		console.log(`ex ${this.constructor.name}`);
	}
}

export class Pause extends ScreenState {
	constructor(fsm) {
		super(fsm, "#pause-screen");
	}
}

export class Loading extends ScreenState {
	constructor(fsm) {
		super(fsm, "#loading-screen");
		this.fsm.assetManager = new AssetManager(() => this.fsm.setState(Splash));
	}
}

export class Splash extends ScreenState {
	constructor(fsm) {
		super(fsm, "#splash-screen");
		this.button = document.querySelector("#play");
		this.button.addEventListener("click", () => {
			this.fsm.setState(Game);
		});
	}
}

export class GameState extends FiniteStateMachine {
	constructor() {
		super();
		this.addState(new Game(this));
		this.addState(new Pause(this));
		this.addState(new Loading(this));
		this.addState(new Splash(this));
		this.setState(Loading);

		document.addEventListener("keydown", (e) => {
			switch (e.code) {
				case "Digit1":
					// console.log(1);
					this.setState(Game);
					break;
				case "Digit2":
					// console.log(2);
					this.setState(Pause);
					break;
			}
		});
	}
}
