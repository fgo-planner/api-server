import { GameServant, GameNpc, GameCraftEssence, GameCommandCode, GameMysticCode, GameEnhancementCard, GameItem, GameSkill, GameSkillEffect, GameSkillBuff } from 'data/types';

export class GameDataImportParseResult {
    
    readonly logs: any; // TODO Implement this

    readonly skillBuffs: GameSkillBuff[] = [];

    readonly skillEffects: GameSkillEffect[] = [];
    
    readonly skills: GameSkill[] = [];

    readonly items: GameItem[] = [];

    readonly servants: GameServant[] = [];

    readonly npc: GameNpc[] = [];

    readonly craftEssences: GameCraftEssence[] = [];

    readonly enhancementCards: GameEnhancementCard[] = [];

    readonly commandCodes: GameCommandCode[] = [];

    readonly mysticCodes: GameMysticCode[] = [];

    constructor(public readonly parserName: string) {

    }

}
