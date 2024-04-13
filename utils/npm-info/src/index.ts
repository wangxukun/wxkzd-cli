import axios from "axios";
import urlJoin from "url-join";
import semver from "semver";

class NpmInfo {

    constructor() {
    }

    public getNpmInfo(npmName: string, registry?: string) {
        if (!npmName) {
            return null;
        }
        const registryUrl: string = registry || this.getDefaultRegistry(true);
        const npmInfoUrl = urlJoin(registryUrl, npmName);
        return axios.get(npmInfoUrl).then(response => {
            if (response.status === 200) {
                return response.data;
            }
            return null;
        }).catch(err => {
            return Promise.reject(err);
        });
    }

    public getDefaultRegistry(isOriginal: boolean = false): string {
        return isOriginal ? 'https://registry.npmjs.org' : 'https://registry.npm.taobao.org/';
    }

    public async getNpmVersions(npmName: string, registry?: string) {
        const data = await this.getNpmInfo(npmName, registry);
        if (data) {
            const keys = Object.keys(data.versions);
            return keys;
        } else {
            return [];
        }
    }

    public getSemverVersions(baseVersion: string, versions: string[]) {
        return versions
            .filter(version => semver.satisfies(version, `>${baseVersion}`))
            .sort((a: string, b: string) => semver.compare(b, a));
    }

    public async getNpmSemverVersion(baseVersion: string, npmName: string, registry?: string) {
        const versions = await this.getNpmVersions(npmName, registry);
        const newVersions = this.getSemverVersions(baseVersion, versions);
        if (newVersions && newVersions.length > 0) {
            return newVersions[0];
        }
        return null;
    }

    public async getNpmLatestVersion(npmName: string, registry: string): Promise<string | null> {
        let versions: string[] = await this.getNpmVersions(npmName, registry);
        if (versions) {
            versions = versions.sort((a: string, b: string) => semver.compare(b, a));
            return versions[0];
        }
        return null;
    }
}

export default NpmInfo;