import { FiniteStateMachine, State } from "./fsm";
import { Game } from "../game";

export class Pause extends State {}

// TODO download assets
export class Loading extends State {}

export class GameState extends FiniteStateMachine {
	constructor() {
		super();
		this.addState(new Game());
		this.addState(new Pause());
		this.addState(new Loading());
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
