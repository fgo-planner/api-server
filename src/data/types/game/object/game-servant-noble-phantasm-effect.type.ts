import { GameObjectSkillEffectValues } from './game-object-skill-effect-values.type';
import { GameObjectSkillEffect } from './game-object-skill-effect.type';

/**
 * Extends the `GameObjectSkillEffect` type by providing effect values for the
 * overcharge states of the noble phantasm.
 */
export type GameServantNoblePhantasmEffect = GameObjectSkillEffect & {

        /**
         * Turn count, use count, success rate, and values for the second (200%) 
         * overcharge level.
         */
        values2: GameObjectSkillEffectValues;

        /**
         * Turn count, use count, success rate, and values for the third (300%)
         * overcharge level.
         */
        values3: GameObjectSkillEffectValues;

        /**
         * Turn count, use count, success rate, and values for the fourth (400%)
         * overcharge level.
         */
        values4: GameObjectSkillEffectValues;

        /**
         * Turn count, use count, success rate, and values for the fifth (500%)
         * overcharge level.
         */
        values5: GameObjectSkillEffectValues;

}
