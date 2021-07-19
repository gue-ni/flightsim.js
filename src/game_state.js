import { FiniteStateMachine, State } from "./state/fsm";
import { Game } from "./game";
import { AssetManager } from "./asset_manager";

class ScreenState extends State {
	constructor(fsm, element_id) {
		super();
		this.fsm = fsm;
		this.screen = document.querySelector(element_id);
	}

	enter(previous) {
		this.screen.style.display = "block";
	}

	exit(next) {
		this.screen.style.display = "none";
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

	enter(previous) {
		this.screen.style.display = "block";
		document.body.style.backgroundColor = "black";
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

	enter(previous) {
		this.screen.style.display = "block";
		document.body.style.backgroundImage = "url('./assets/images/falcon.png')";
		document.body.style.backgroundPosition = "center";
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

		document.addEventListener("keydown", (event) => {
			switch (event.code) {
				case "KeyP":
					if (this.current.constructor == Pause) {
						this.setState(Game);
					} else if (this.current.constructor == Game) {
						this.setState(Pause);
					}
					break;
			}
		});
	}
}
