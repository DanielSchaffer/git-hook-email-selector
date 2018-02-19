import { GitConfigScope }       from '../util/git.config.scope';
import { GitConfigSectionUtil } from '../util/git.config.section.util';

export class GitConfigScopedProperty extends GitConfigSectionUtil {

    public get local(): string {
        return this.getValue(GitConfigScope.local);
    }
    public set local(value: string) {
        this.setValue(value, GitConfigScope.local);
    }
    public addLocal(value: string) {
        this.addValue(value, GitConfigScope.local);
    }

    public get global(): string {
        return this.getValue(GitConfigScope.global);
    }
    public set global(value) {
        this.setValue(value, GitConfigScope.global);
    }
    public addGlobal(value: string) {
        this.addValue(value, GitConfigScope.global);
    }

    public get system(): string {
        return this.getValue(GitConfigScope.system);
    }
    public set system(value) {
        this.setValue(value, GitConfigScope.system);
    }
    public addSystem(value: string) {
        this.addValue(value, GitConfigScope.system);
    }

    public constructor(section: string, private key: string) {
        super(section);
    }

    private getValue(scope?: GitConfigScope): string {
        return this.getSectionKey(this.key, scope);
    }

    private setValue(value: string, scope: GitConfigScope): void {
        this.replaceSectionKey(this.key, value, scope);
    }

    private addValue(value: string, scope: GitConfigScope): void {
        this.addSectionKey(this.key, value, scope);
    }

    public toString(): string {
        return this.getValue();
    }

    public valueOf(): string {
        return this.getValue();
    }

}
