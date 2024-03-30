#! /usr/bin/env node

// 引入import-local库
import importLocal from 'import-local';
import npmlog from 'npmlog';
import Core from '../lib';

if (importLocal(__filename)) {
    npmlog.info('cli', '正在使用 wxkzd-cli 本地版本');
} else {
    // require('../lib')(process.argv.slice(2));
    const core = new Core()
    core.start();

}
