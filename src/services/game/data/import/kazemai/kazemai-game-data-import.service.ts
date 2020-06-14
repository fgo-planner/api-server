import { Service } from 'typedi';
import { KazemaiGameDataParser } from './kazemai-game-data-parser.class';

type importOptions = { cleanImport?: boolean; updateExisting?: boolean; importNew?: boolean }

@Service()
export class KazemaiGameDataImportService {

    import(data: any, options = {}) {
        const parser = new KazemaiGameDataParser(data);
        const result = parser.parse();
        return result.servants;
    }

}
