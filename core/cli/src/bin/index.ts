#! /usr/bin/env node

import importLocal from 'import-local';

if (importLocal(__filename)) {
  require('npmlog').info('cli', '正在使用wxkzd-cli本地版本');
} else {
  require('../lib')(process.argv.slice(2));
  console.log(__filename);
  require('npmlog').info('cli', importLocal(__filename));
}
