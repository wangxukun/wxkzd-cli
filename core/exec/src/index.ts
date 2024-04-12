import Package from "@wxkzd-cli/package";
import log from '@wxkzd-cli/log';

module.exports = exec;

const SETTINGS = {
    init: '@wxkzd-cli/init'
}

function exec() {
    let targetPath: string | undefined = process.env.CLI_TARGET_PATH;
    const homePath: string | undefined = process.env.CLI_HOME_PATH;
    log.verbose("targetPath", targetPath);
    log.verbose("homePath", homePath);
    const cmdObj = arguments[arguments.length - 1];
    // const cmdOpt = arguments[arguments.length - 2];
    const cmdName = cmdObj.name();
    const packageName = SETTINGS[cmdName as keyof typeof SETTINGS];
    const packageVersion = 'latest';

    if (!targetPath) {
        targetPath = '' // 生成缓存路径
    }

    const pkg = new Package({
        targetPath: targetPath,
        name: packageName,
        version: packageVersion
    });
    console.log(pkg.getRootFilePath());
}