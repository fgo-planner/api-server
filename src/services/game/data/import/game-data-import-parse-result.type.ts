import { GameServant, GameNpc, GameCraftEssence, GameCommandCode, GameMysticCode, GameEnhancementCard, GameItem, GameSkill, GameSkillEffect, GameSkillBuff } from 'data/types';

export type GameDataImportParseResult = {
    
    skillBuffs?: GameSkillBuff[];

    skillEffects?: GameSkillEffect[];
    
    skills?: GameSkill[];

    items?: GameItem[];

    servants?: GameServant[];

    npc?: GameNpc[];

    craftEssences?: GameCraftEssence[];

    enhancementCards?: GameEnhancementCard[];

    commandCodes?: GameCommandCode[];

    mysticCodes?: GameMysticCode[];

}
