import semver from "semver";
import colors from 'colors';
import log from '@wxkzd-cli/log';

const LOWEST_NODE_VERSION: string = '20.0.0';

class Command {
    private _argv: string[];

    constructor(argv: string[]) {
        // console.log('command constructor...', argv);
        this._argv = argv;

        let runner = new Promise((resolve, reject) => {
            let chain = Promise.resolve();
            chain = chain.then(() => this.checkNodeVersion());
            chain.then(() => this.initArgs());
            chain.catch(err => {
                log.error("cli", err.message);
            })
        })
    }

    /**
     * 检查Nodejs version
     * @private
     */
    private checkNodeVersion(): void {
        const currentVersion: string = process.version;
        const lowestVersion: string = LOWEST_NODE_VERSION;
        if (!semver.gte(currentVersion, lowestVersion)) {
            throw new Error(colors.red(`wxkzd-cli需要安装v${lowestVersion}以上版本的Node.js`));
        }
    }

    init() {
        throw new Error('init必须实现')
    }

    exec() {
        throw new Error('exec必须实现')
    }

    private initArgs() {
        // TODO initArgs...
        return undefined;
    }
}

export default Command;