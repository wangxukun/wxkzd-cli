import log from '@wxkzd-cli/log';
import Command from "@wxkzd-cli/command";

interface myOptions {
    "force": boolean;
}

class InitCommand extends Command {

}

function init(argv: string[]) {
    // console.log('init', projectName, options.force, process.env.CLI_TARGET_PATH);
    return new InitCommand(argv);
}

module.exports = init;
module.exports.InitCommand = InitCommand;