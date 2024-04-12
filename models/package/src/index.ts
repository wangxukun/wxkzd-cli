import * as path from "path";

const pkgDir = require('pkg-dir').sync;
const formatPath = require('@wxkzd-cli/format-path');

interface Options {
    "targetPath": string | undefined;
    "name": string;
    "version": string;
}

class Package {
    private targetPath: string | undefined;
    private name: string;
    private version: string;

    constructor(options: Options) {
        this.targetPath = options.targetPath;
        this.name = options.name;
        this.version = options.version;
    }

    // 判断当前Package是否存在
    exists() {
    }

    // 安装Package
    install() {
    }

    // 更新Package
    update() {
    }

    // 获取入口文件的路径
    getRootFilePath() {
        // 1. 获取package.json所在目录
        const rootDir = pkgDir(this.targetPath);
        if (rootDir) {
            // 2. 读取package.json
            const pkg = require(path.resolve(rootDir, 'package.json'));
            // 3. 寻找main或lib
            if (pkg && pkg.main) {
                // 4. 路径的兼容（macOS/windows）
                return formatPath(path.resolve(rootDir, pkg.main));
            }
        }
        return null;
    }
}

export default Package;