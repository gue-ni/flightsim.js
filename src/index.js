import * as THREE from "three";
import { Sky } from "three/examples/jsm/objects/Sky";

import * as ECS from "lofi-ecs";
import { PlayerInputSystem } from "./systems/input.system";
import { Assemblage } from "./assemblage";
import { Physics } from "./systems/physics.system";
import { GameState } from "./state/game_state";

const gameState = new GameState();
