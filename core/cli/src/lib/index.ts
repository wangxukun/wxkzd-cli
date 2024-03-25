module.exports = core;

// @ts-ignore
import pkg from '../package.json';
// @ts-ignore
import log from '@wxkzd-cli/log';

function core() {
    checkPkgVersion();
}

function checkPkgVersion() {
    log.notice('cli', pkg.version);
}
