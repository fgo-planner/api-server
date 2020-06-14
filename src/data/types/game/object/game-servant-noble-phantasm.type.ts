import { GameCharacterNoblePhantasm } from './game-character-noble-phantasm.type';
import { GameServantNoblePhantasmEffect } from './game-servant-noble-phantasm-effect.type';

export type GameServantNoblePhantasm = GameCharacterNoblePhantasm & {

    effects: GameServantNoblePhantasmEffect[];

}
