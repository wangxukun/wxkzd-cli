import * as path from "path";

import {homedir} from "node:os";

const pkgDir = require('pkg-dir').sync;
const npminstall = require('npminstall');
const formatPath = require('@wxkzd-cli/format-path');
import NpmInfo from "@wxkzd-cli/npm-info";

interface Options {
    targetPath: string | undefined;
    storeDir: string;
    name: string;
    version: string;
}

class Package {
    // package的目标路径
    private targetPath: string | undefined;
    // 缓存package的路径
    private storeDir: string | undefined;
    // package的name
    private name: string;
    // package的version
    private version: string;

    constructor(options: Options) {
        this.targetPath = options.targetPath;
        this.storeDir = options.storeDir;
        this.name = options.name;
        this.version = options.version;
    }

    // 判断当前Package是否存在
    exists() {
        return false;
    }

    // 安装Package
    install() {
        npminstall({
            root: this.targetPath,
            storeDir: path.resolve(homedir(), '.wxkzd-cli', 'node_modules'),
            registry: (new NpmInfo()).getDefaultRegistry(),
            pkgs: [{
                name: this.name,
                version: this.version
            }]
        });
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