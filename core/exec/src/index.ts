import path from 'path';
import Package from "@wxkzd-cli/package";
import log from '@wxkzd-cli/log';

module.exports = exec;

const SETTINGS = {
    init: '@wxkzd-cli/init'
}

const CACHE_DIR = 'dependencies/';

function exec() {
    let targetPath: string | undefined = process.env.CLI_TARGET_PATH;
    const homePath: string | undefined = process.env.CLI_HOME_PATH;
    let storeDir = '';
    let pkg;
    log.verbose("targetPath", targetPath);
    log.verbose("homePath", homePath);
    const cmdObj = arguments[arguments.length - 1];
    // const cmdOpt = arguments[arguments.length - 2];
    const cmdName = cmdObj.name();
    const packageName = SETTINGS[cmdName as keyof typeof SETTINGS];
    const packageVersion = 'latest';

    if (!targetPath) {
        targetPath = path.resolve(homePath as string, CACHE_DIR) // 生成缓存路径
        const storeDir = path.resolve(targetPath, 'node_modules');
        log.verbose('targetPath', targetPath);
        log.verbose('storeDir', storeDir);

        pkg = new Package({
            targetPath: targetPath,
            storeDir: storeDir,
            name: packageName,
            version: packageVersion
        });
        if (pkg.exists()) {
            // update package
        } else {
            // install package
        }
    } else {
        pkg = new Package({
            targetPath: targetPath,
            storeDir: storeDir,
            name: packageName,
            version: packageVersion
        });
    }
    const rootFile = pkg.getRootFilePath();
    require(rootFile).apply(null, arguments); // 执行init函数
}