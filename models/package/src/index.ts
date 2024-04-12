import {packageDirectory} from "pkg-dir";

interface Options {
    "targetPath":string;
    "storePath":string;
    "name":string;
    "version":string;
}
class Package {
    private targetPath:string;
    private storePath:string;
    private name:string;
    private version:string;
    constructor(options:Options) {
        this.targetPath = options.targetPath;
        this.storePath = options.storePath;
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
        // 2. 读取package.json
        // 3. 寻找main或lib
        // 4. 路径的兼容（macOS/windows）
        console.log(packageDirectory())
    }
}

export default Package;