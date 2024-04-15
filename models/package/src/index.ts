import * as path from "path";
import * as fse from 'fs-extra';

const pkgDir = require('pkg-dir').sync;
const pathExists = require("path-exists").sync;

const npminstall = require('npminstall');
const formatPath = require('@wxkzd-cli/format-path');
import NpmInfo from "@wxkzd-cli/npm-info";

interface Options {
    targetPath: string;
    storeDir: string;
    name: string;
    version: string;
}

class Package {
    // package的目标路径
    private targetPath: string;
    // 缓存package的路径
    private storeDir: string;
    // package的name
    private name: string;
    // package的version
    private version: string | null;
    private npmInfo: NpmInfo;
    private cacheFilePathPrefix: string;
    private cacheTargetFilePathFix: string;

    constructor(options: Options) {
        this.targetPath = options.targetPath;
        this.storeDir = options.storeDir;
        this.name = options.name;
        this.version = options.version;

        this.npmInfo = new NpmInfo();

        this.cacheFilePathPrefix = this.name.replace('/', '+');
        this.cacheTargetFilePathFix = this.name.replace('/', '\\');
    }

    async prepare() {
        if (this.storeDir && !pathExists(this.storeDir)) {
            fse.mkdirpSync(this.storeDir); // 将storeDir路径上没有创建的目录全部创建
        }
        if (this.version === 'latest') {
            this.version = await this.npmInfo.getNpmLatestVersion(this.name, this.npmInfo.getDefaultRegistry(true));
        }
    }

    // 判断当前Package是否存在
    async exists() {
        if (this.storeDir) {
            await this.prepare();
            return pathExists(this.cacheFilePath);
        } else {
            return pathExists(this.targetPath);
        }
    }

    get cacheFilePath() {
        // C:\Users\wangx\.wxkzd-cli\dependencies\node_modules\.store\@wxkzd-cli+init@0.2.2
        return path.resolve(this.storeDir, '.store', `${this.cacheFilePathPrefix}@${this.version}`);
    }

    get cacheTargetFilePath() {
        // C:\Users\wangx\.wxkzd-cli\dependencies\node_modules\@wxkzd-cli\init
        return path.resolve(this.storeDir, this.cacheTargetFilePathFix)
    }

    getSpecificCacheFilePath(version: string) {
        // C:\Users\wangx\.wxkzd-cli\dependencies\node_modules\.store\@wxkzd-cli+init@0.2.2
        return path.resolve(this.storeDir, '.store', `${this.cacheFilePathPrefix}@${version}`);
    }

    // 安装Package
    async install() {
        await this.prepare();
        // 是一个异步函数
        return npminstall({
            root: this.targetPath,
            storeDir: this.storeDir,
            registry: this.npmInfo.getDefaultRegistry(true),
            pkgs: [{
                name: this.name,
                version: this.version
            }]
        });
    }

    // 更新Package
    async update() {
        await this.prepare();
        // 1. 获取最新的npm模块版本号
        // 2. 查询最新版本号对应的路径是否存在
        // 3. 如果不存在，则直接安装最新版本
        const latestVersion = await this.npmInfo.getNpmLatestVersion(this.name, this.npmInfo.getDefaultRegistry(true));
        const latestCacheFilePath = this.getSpecificCacheFilePath(latestVersion as string);
        if (!pathExists(latestCacheFilePath)) {
            console.log("开始更新"); // 感觉有点多余，永不会执行，只有exec包下的packageVersion值不是latest，而是特定版本号时，才有可能被执行
            await npminstall({
                root: this.targetPath,
                storeDir: this.storeDir,
                registry: this.npmInfo.getDefaultRegistry(true),
                pkgs: [{
                    name: this.name,
                    version: latestVersion
                }]
            });
            this.version = latestVersion;
        }
    }

    // 获取入口文件的路径
    getRootFilePath() {
        function _getRootFile(targetPath: string) {
            // 1. 获取package.json所在目录
            const rootDir = pkgDir(targetPath);
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

        if (this.storeDir) {
            return _getRootFile(this.cacheTargetFilePath);
        } else {
            return _getRootFile(this.targetPath);
        }
    }
}

export default Package;