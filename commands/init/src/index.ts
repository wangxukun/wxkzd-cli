import log from '@wxkzd-cli/log';
import Command from "@wxkzd-cli/command";

class InitCommand extends Command {
    private projectName: string = '';
    private force: boolean = false;

    init() {
        this.projectName = this._argv[0];
        this.force = !!this._argv[1].force;
        log.verbose("projectName", this.projectName);
        log.verbose("force", this.force);
    }

    exec() {
        console.log('init的业务逻辑');
        // TODO console.log('init的业务逻辑')
    }

}

function init(argv: Array<any>) {
    return new InitCommand(argv);
}

module.exports = init;
module.exports.InitCommand = InitCommand;