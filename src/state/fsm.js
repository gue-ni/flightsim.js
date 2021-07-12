// there cannot be two states of the same class
export class FiniteStateMachine {
	constructor() {
		this._states = {};
		this.current = null;
	}

	setState(type) {
		let id = type.name || State.name;

		if (!this._states[id]) {
			console.error(`state ${id} does not exist`);
			return;
		}
		const next = this._states[id];
		const previous = this.current;
		if (previous) previous.exit(next);

		next.enter(previous);
		this.current = next;
	}

	addState(state) {
		this._states[state.constructor.name] = state;
	}
}

// abstract base class for all states
export class State {
	constructor() {
		if (this.constructor == State) {
			throw new Error("Abstract class");
		}
	}

	enter(previous) {
		if (this == previous) return;
		console.log(`entering ${this.constructor.name}`);
	}

	exit(next) {
		if (this == next) return;
		console.log(`exiting ${this.constructor.name}`);
	}
}
