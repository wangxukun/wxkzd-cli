import Package from "@wxkzd-cli/package";
import log from '@wxkzd-cli/log';

module.exports = exec;

function exec() {
    const targetPath = process.env.CLI_TARGET_PATH;
    const homePath= process.env.CLI_HOME_PATH;
    log.verbose("targetPath",targetPath);
    log.verbose("homePath",homePath);
    console.log(arguments);
    // const pkg = new Package();
    // console.log(pkg);
}