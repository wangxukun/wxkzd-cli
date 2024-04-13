import path from 'path';
import Package from "@wxkzd-cli/package";
import log from '@wxkzd-cli/log';

module.exports = exec;

const SETTINGS = {
    init: '@wxkzd-cli/init'
}

const CACHE_DIR = 'dependencies/';

async function exec() {
    let targetPath: string | undefined = process.env.CLI_TARGET_PATH;
    const homePath: string | undefined = process.env.CLI_HOME_PATH;
    let storeDir: string = '';
    let pkg;
    const cmdObj = arguments[arguments.length - 1];
    const cmdName = cmdObj.name();
    const packageName = SETTINGS[cmdName as keyof typeof SETTINGS];
    // 这里的latest更改为特定的版本号，Package类的下update才有可能被调用
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
        if (await pkg.exists()) {
            // update package
            log.verbose('cache-pkg', 'update');
            await pkg.update();
        } else {
            // install package
            log.verbose('cache-pkg', 'install');
            await pkg.install();
        }
    } else {
        pkg = new Package({
            targetPath: targetPath,
            storeDir: storeDir,
            name: packageName,
            version: packageVersion
        });
        log.verbose('targetPath', targetPath);
        log.verbose('storeDir', storeDir);
    }
    const rootFile = pkg.getRootFilePath();
    log.verbose('rootFile', rootFile);
    if (rootFile) {
        // 在当前进程中调用，动态加载子命令（模块）
        require(rootFile).apply(null, arguments); // 执行init函数
    }
}