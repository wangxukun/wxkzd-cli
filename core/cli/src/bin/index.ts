#! /usr/bin/env node

// 引入import-local库
import importLocal from 'import-local';
import npmlog from 'npmlog';
import { core } from '../lib/index';

// 检查当前的命令行工具是否有本地安装版本
if (importLocal(__filename)) {
  // 如果有本地版本，import-local会自动引入本地版本并运行，然后结束当前进程
  // 这样可以确保总是优先使用本地版本，而不是全局版本
  npmlog.info('cli', '正在使用wxkzd-cli本地版本-1');
} else {
  // 如果没有本地版本，就运行全局版本
  console.log('Running global version-2');
  // 在这里添加你的全局版本代码...
  core();
}
