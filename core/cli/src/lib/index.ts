module.exports = core;

import semver from 'semver';
import colors from 'colors/safe';

const rootCheck = require('root-check');
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

    } catch (e: any) {
        log.error("cli", e.message);
    }
}

function checkRoot() {
    rootCheck();
}

function checkNodeVersion(): void {
    const currentVersion: string = process.version;
    const lowestVersion: string = LOWEST_NODE_VERSION;
    if (!semver.gte(currentVersion, lowestVersion)) {
        throw new Error(colors.red(`wxkzd-cli需要安装v${lowestVersion}以上版本的Node.js`));
    }
}

function checkPkgVersion(): void {
    log.notice('cli', pkg.version);
}
