import { GitConfigScope } from './git.config.scope';
import { GitUtil }        from './git.util';

export class GitConfigUtil extends GitUtil {

    constructor() {
        super('config');
    }

    public configCmd(cmd: string, scope?: GitConfigScope) {
        if (scope) {
            cmd = `--${scope} ${cmd}`;
        }
        return this.exec(cmd);
    }

    public getRegExp(pattern: string, scope?: GitConfigScope) {
        return this.configCmd(`--get-regexp ${pattern}`, scope);
    }

}
