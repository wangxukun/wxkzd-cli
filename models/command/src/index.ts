import semver from "semver";
import colors from 'colors';
import log from '@wxkzd-cli/log';

const LOWEST_NODE_VERSION: string = '20.0.0';

class Command {
    protected _argv;
    protected _cmd: any;

    constructor(argv: any) {
        // log.verbose('Command constructor', argv);
        if (!argv) {
            throw new Error('参数不能为空！');
        }
        if (!Array.isArray(argv)) {
            throw new Error('参数必须为数组！');
        }
        if (argv.length < 1) {
            throw new Error('参数列表为空！');
        }
        this._argv = argv;

        let runner = new Promise((resolve, reject) => {
            let chain = Promise.resolve();
            chain = chain.then(() => this.checkNodeVersion());
            chain.then(() => this.initArgs());
            chain.then(() => this.init());
            chain.then(() => this.exec());
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

    protected init() {
        throw new Error('init必须实现');
    }

    protected exec() {
        throw new Error('exec必须实现');
    }

    private initArgs() {
        // console.log(this._argv);
        this._cmd = this._argv[this._argv.length - 1];
        this._argv = this._argv.slice(0, this._argv.length - 1);
    }
}

export default Command;