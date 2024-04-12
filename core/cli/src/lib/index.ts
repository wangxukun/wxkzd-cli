module.exports = core;

import semver from 'semver';
import colors from 'colors/safe';
import rootCheck from "root-check";
import {homedir} from "node:os";
import pathExists from 'path-exists';
import dotenv from 'dotenv';
import path from 'path';
import {program} from '@commander-js/extra-typings';
// @ts-ignore
import pkg from '../package.json';
import log from '@wxkzd-cli/log';
import NpmInfo from "@wxkzd-cli/npm-info";
import {LOWEST_NODE_VERSION, DEFAULT_CLI_HOME} from './const';

const init = require('@wxkzd-cli/init');
const exec = require('@wxkzd-cli/exec');

/**
 * 定义cli配置对象类型
 */
interface CliConfig {
    [key: string]: any;
}


/**
 * 启动核心功能方法
 */
async function core(): Promise<any> {
    try {
        await prepare();
        registerCommand();
    } catch (e: any) {
        log.error("cli", e.message);
    }
}

/**
 * 注册脚手架
 * @private
 */
function registerCommand() {
    program
        .name(Object.keys(pkg.bin)[0])
        .usage('<command> [options]')
        .option('-d, --debug', 'whether to enable the debugging mode', true)
        .option('-tp, --targetPath <targetPath>', 'whether to specify the local debugging file path', '')
        .version(pkg.version);

    program
        .command('init')
        .argument('[projectName]')
        .option('-f, --force', 'initialize the project forcibly')
        .action(exec);

    /**
     * 对-d, --debug开启debug械监听
     */
    program.on('option:debug', () => {
        process.env.LOG_LEVEL = 'verbose';
        log.level = process.env.LOG_LEVEL;
    });

    /**
     * 指定targetPath到环境变量中
     */
    program.on('option:targetPath', (targetPath) => {
        process.env.CLI_TARGET_PATH = targetPath;
    });

    /**
     * 对未知命令监听
     */
    program.on('command:*', (obj) => {
        const availableCommands = program.commands.map(cmd => cmd.name());
        log.notice('cli', colors.red('unknown command :' + obj[0]));
        if (availableCommands.length > 0) {
            log.notice('cli', colors.red('available command :' + availableCommands.join(',')));
        }
    })

    program.parse(process.argv);

    // 当没有具体的命令或参数输入时，打印帮助信息
    if (program.args && program.args.length < 1) {
        program.outputHelp();
        console.log();
    }
}

/**
 * 封闭准备阶段代码
 * @private
 */
async function prepare() {
    checkPkgVersion();
    checkNodeVersion();
    checkRoot();
    checkUserHome();
    checkEnv();
    await checkGlobalUpdate();
}

/**
 * 检查软件更新
 * @private
 */
async function checkGlobalUpdate() {
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
function checkEnv() {
    const dotenvPath = path.resolve(homedir(), '.env');
    if (pathExists.sync(dotenvPath)) {
        dotenv.config(
            {path: dotenvPath}
        )
    }
    createDefaultConfig();
}

/**
 * 检查并创建默认配置
 * @private
 */
function createDefaultConfig() {
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
 * 检查用户主目录
 * @private
 */
function checkUserHome(): void {
    const dir = homedir();
    if (!dir || !pathExists.sync(dir)) {
        throw new Error(colors.red('当前登录用户主目录不存在！'));
    }
}

/**
 * 检查root用户并降级
 * @private
 */
function checkRoot(): void {
    rootCheck();
}

/**
 * 检查Nodejs version
 * @private
 */
function checkNodeVersion(): void {
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
function checkPkgVersion(): void {
    log.info('cli', pkg.version);
}
