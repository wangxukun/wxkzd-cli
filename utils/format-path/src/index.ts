import * as path from 'path';

module.exports = function formatPath(p: string): string {
    if (p) {
        // 分割符
        const sep = path.sep;
        if (sep === '/') {
            return p;
        } else {
            return p.replace(/\\/g, '/');
        }
    }
    return p;
}