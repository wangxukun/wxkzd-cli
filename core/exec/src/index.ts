import {SpawnOptions} from "node:child_process";

const cp = require('child_process');
import path from 'path';
import Package from "@wxkzd-cli/package";
import log from '@wxkzd-cli/log';

module.exports = exec;

const SETTINGS = {
    init: '@wxkzd-cli/init'
}

const CACHE_DIR = 'dependencies/';

async function exec() {
    let targetPath: string | undefined = process.env.CLI_TARGET_PATH;
    const homePath: string | undefined = process.env.CLI_HOME_PATH;
    let storeDir: string = '';
    let pkg;
    const cmdObj = arguments[arguments.length - 1];
    const cmdName = cmdObj.name();
    const packageName = SETTINGS[cmdName as keyof typeof SETTINGS];
    // 这里的latest更改为特定的版本号，Package类的下update才有可能被调用
    const packageVersion = 'latest';

    if (!targetPath) {
        targetPath = path.resolve(homePath as string, CACHE_DIR) // 生成缓存路径
        const storeDir = path.resolve(targetPath, 'node_modules');
        log.verbose('targetPath', targetPath);
        log.verbose('storeDir', storeDir);

        pkg = new Package({
            targetPath: targetPath,
            storeDir: storeDir,
            name: packageName,
            version: packageVersion
        });
        if (await pkg.exists()) {
            // update package
            log.verbose('cache-pkg', 'update');
            await pkg.update();
        } else {
            // install package
            log.verbose('cache-pkg', 'install');
            await pkg.install();
        }
    } else {
        pkg = new Package({
            targetPath: targetPath,
            storeDir: storeDir,
            name: packageName,
            version: packageVersion
        });
        log.verbose('targetPath', targetPath);
        log.verbose('storeDir', storeDir);
    }
    const rootFile = pkg.getRootFilePath();
    log.verbose('rootFile', rootFile);
    if (rootFile) {
        try {
            // 在当前进程中调用，动态加载子命令（模块）
            // require(rootFile).call(null, Array.from(arguments)); // 执行init函数
            // TODO require(rootFile).call(null, Array.from(arguments)); // 执行init函数
            // 在node子进程中调用
            // TODO 在node子进程中调用
            const args = Array.from(arguments);
            const cmd = args[args.length - 1];
            const o = Object.create(null);
            Object.keys(cmd).forEach(key => {
                if (cmd.hasOwnProperty(key) && !key.startsWith('_') && key !== 'parent') {
                    o[key] = cmd[key];
                }
            });
            args[args.length - 1] = o;
            const code = `require('${rootFile}').call(null, ${JSON.stringify(args)})`;
            const child = spawn('node', ['-e', code], {
                cwd: process.cwd(),
                stdio: 'inherit'
            });
            child.on('error', (e: any) => {
                log.error('cli', e.message)
                process.exit(1);
            })
            child.on('exit', (e: any) => {
                log.verbose('命令执行成功：', +e);
                process.exit(e);
            })

        } catch (e: any) {
            log.error("cli", e.message);
        }
    }
}

function spawn(command: string, args: readonly string[], options: SpawnOptions) {
    const wind32 = process.platform === 'win32';

    const cmd = wind32 ? 'cmd' : command;
    const cmdArgs = wind32 ? ['/c'].concat(command, args) : args;

    return cp.spawn(cmd, cmdArgs, options || {});
}