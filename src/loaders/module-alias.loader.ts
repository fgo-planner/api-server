import moduleAlias from 'module-alias';

/**
 * Resolve modules paths of application modules. This should be executed before
 * any applicaiton modules are imported.
 */
export default (tsConfig: any, rootPath: string) => {
    const paths = tsConfig.compilerOptions.paths;
    for (const path of Object.keys(paths)) {
        if (path === '*') {
            continue;
        }
        console.log(`${rootPath}/${path}`);
        moduleAlias.addAlias(path, `${rootPath}/${path}`);
    }
};
