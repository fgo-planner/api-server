import { GameCharacter } from './game-character.type';
import { GameObjectSkillLevelable } from './game-object-skill-levelable.type';
import { GameObjectSkillUnlockable } from './game-object-skill-unlockable.type';
import { GameObjectSkill } from './game-object-skill.type';
import { GameServantAscension } from './game-servant-ascension.type';
import { GameServantDeck } from './game-servant-deck.enum';
import { GameServantNoblePhantasm } from './game-servant-noble-phantasm.type';
import { GameServantUpgrade } from './game-servant-upgrade.type';
import { GameSpiritOriginCollection } from './game-spirit-origin-collection.type';

export type GameServant = GameSpiritOriginCollection & GameCharacter & {

    cost: number;

    cards: {

        deck: GameServantDeck;

        hits: {

            buster: number[];

            arts: number[];

            quick: number[];

            extra: number[];

        };

    };

    activeSkills: {

        skill1: {

            base: GameObjectSkillLevelable;

            upgrade?: GameObjectSkillLevelable & GameObjectSkillUnlockable;

        };

        skill2: {

            base: GameObjectSkillLevelable & GameObjectSkillUnlockable;

            upgrade?: GameObjectSkillLevelable & GameObjectSkillUnlockable;

        };

        skill3: {

            base: GameObjectSkillLevelable & GameObjectSkillUnlockable;

            upgrade?: GameObjectSkillLevelable & GameObjectSkillUnlockable;

        };

        upgrade1: GameServantUpgrade;

        upgrade2: GameServantUpgrade;

        upgrade3: GameServantUpgrade;

        upgrade4: GameServantUpgrade;

        upgrade5: GameServantUpgrade;

        upgrade6: GameServantUpgrade;

        upgrade7: GameServantUpgrade;

        upgrade8: GameServantUpgrade;

        upgrade9: GameServantUpgrade;

    };

    noblePhantasm: {

        base: GameServantNoblePhantasm;

        upgrade?: GameServantNoblePhantasm & GameObjectSkillUnlockable;

    };

    passiveSkills: GameObjectSkill[];

    ascensions: {

        ascension1: GameServantAscension;

        ascension2: GameServantAscension;

        ascension3: GameServantAscension;

        ascension4: GameServantAscension;

    };

    bond: {

        max: number;

        points: number[];

    };

    stats: {

        power: number;

        defense: number;

        agility: number;

        magic: number;

        luck: number;

        noblePhantasm: number;

    };

    costumes: any[];

}
