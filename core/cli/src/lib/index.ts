module.exports = core;

import semver from 'semver';
import colors from 'colors/safe';
import rootCheck from "root-check";
import {homedir} from "node:os";

const pathExists = require('path-exists').sync;
// @ts-ignore
import pkg from '../package.json';
// @ts-ignore
import log from '@wxkzd-cli/log';
// @ts-ignore
import {LOWEST_NODE_VERSION} from './const';

function core(): void {
    try {
        checkPkgVersion();
        checkNodeVersion();
        checkRoot();
        checkUserHome();

    } catch (e: any) {
        log.error("cli", e.message);
    }
}

// 检查用户主目录
function checkUserHome() {
    const dir = homedir();
    if (!dir || !pathExists(dir)) {
        throw new Error(colors.red('当前登录用户主目录不存在！'));
    }
}

// 检查root用户，并降级
function checkRoot() {
    rootCheck();
}

// 检查nodejs version
function checkNodeVersion(): void {
    const currentVersion: string = process.version;
    const lowestVersion: string = LOWEST_NODE_VERSION;
    if (!semver.gte(currentVersion, lowestVersion)) {
        throw new Error(colors.red(`wxkzd-cli需要安装v${lowestVersion}以上版本的Node.js`));
    }
}

// 检查package version
function checkPkgVersion(): void {
    log.notice('cli', pkg.version);
}
