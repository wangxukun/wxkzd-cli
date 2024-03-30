import semver from 'semver';
import colors from 'colors/safe';
import rootCheck from "root-check";
import {homedir} from "node:os";
import pathExists from 'path-exists';
import minimist from "minimist";
import dotenv from 'dotenv';
import path from 'path';
// @ts-ignore
import pkg from '../package.json';
import log from '@wxkzd-cli/log';
import NpmInfo from "@wxkzd-cli/npm-info";
import {LOWEST_NODE_VERSION, DEFAULT_CLI_HOME} from './const';

/**
 * 定义cli配置对象类型
 */
interface CliConfig {
    [key: string]: any;
}

/**
 * 核心功能类
 */
class Core {
    private args: minimist.ParsedArgs = {_: []};
    private config: dotenv.DotenvConfigOutput = {};

    constructor() {
    }

    /**
     * 启动核心功能方法
     */
    public async start(): Promise<any> {
        try {
            this.checkPkgVersion();
            this.checkNodeVersion();
            this.checkRoot();
            this.checkUserHome();
            this.checkInputArgs();
            this.checkEnv();
            await this.checkGlobalUpdate();
        } catch (e: any) {
            log.error("cli", e.message);
        }
    }

    /**
     * 检查软件更新
     * @private
     */
    private async checkGlobalUpdate() {
        // 1. 获取当前版本号和模块名
        // 2. 调用npm API，获取所有的版本号:https://registry.npmjs.org/@wxkzd-cli/core
        // 3. 提取所有版本号，绎哪些版本号是大于当前版本号
        // 4. 获取最新的版本号，提示用户更新到该版本
        const currentVersion = pkg.version;
        const npmName = pkg.name;
        const npmInfo = new NpmInfo();
        // const versions = await npmInfo.getNpmVersions(npmName);
        const lastVersion = await npmInfo.getNpmSemverVersion(currentVersion, npmName);
        if (lastVersion && semver.gt(lastVersion, currentVersion)) {
            log.warn("更新提示", colors.yellow(`请手动更新${npmName}，当前版本：${currentVersion}，最新版本：${lastVersion}
            更新命令：npm install -g ${npmName}`));
        }
    }

    /**
     * 检查环境变量
     * @private
     */
    private checkEnv() {
        const dotenvPath = path.resolve(homedir(), '.env');
        if (pathExists.sync(dotenvPath)) {
            dotenv.config(
                {path: dotenvPath}
            )
        }
        this.createDefaultConfig();
        log.verbose('环境变量', process.env.CLI_HOME_PATH);
    }

    /**
     * 检查并创建默认配置
     * @private
     */
    private createDefaultConfig() {
        const cliConfig: CliConfig = {
            home: homedir()
        };
        if (process.env.CLI_HOME) {
            cliConfig['cliHome'] = path.join(homedir(), process.env.CLI_HOME);
        } else {
            cliConfig['cliHome'] = path.join(homedir(), DEFAULT_CLI_HOME);
        }
        process.env.CLI_HOME_PATH = cliConfig.cliHome;
    }

    /**
     * 检查输入参数
     * @private
     */
    private checkInputArgs(): void {
        this.args = minimist(process.argv.slice(2));
        this.checkArgs();
    }

    // 检查输入参数
    private checkArgs() {
        if (this.args.debug) {
            process.env.LOG_LEVEL = 'verbose';
        } else {
            process.env.LOG_LEVEL = 'info';
        }
        log.level = process.env.LOG_LEVEL;
    }

    /**
     * 检查用户主目录
     * @private
     */
    private checkUserHome(): void {
        const dir = homedir();
        if (!dir || !pathExists.sync(dir)) {
            throw new Error(colors.red('当前登录用户主目录不存在！'));
        }
    }

    /**
     * 检查root用户并降级
     * @private
     */
    private checkRoot(): void {
        rootCheck();
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

    /**
     * 检查package version
     * @private
     */
    private checkPkgVersion(): void {
        log.notice('cli', pkg.version);
    }
}

export default Core;