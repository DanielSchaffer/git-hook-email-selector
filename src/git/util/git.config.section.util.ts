import { GitConfigScope }          from './git.config.scope';
import { GitConfigUtil }           from './git.config.util';

export class GitConfigSectionUtil extends GitConfigUtil {

    constructor(protected section: string) {
        super();
    }

    public getSectionKey(key: string, scope?: GitConfigScope): string {
        return this.configCmd(`--get ${this.section}.${key}`, scope);
    }

    public replaceSectionKey(key: string, value: string, scope: GitConfigScope): void {
        this.configCmd(`--replace ${this.section}.${key} ${value}`, scope);
    }

    public addSectionKey(key: string, value: string, scope: GitConfigScope): void {
        this.configCmd(`--add ${this.section}.${key} ${value}`, scope);
    }

}
