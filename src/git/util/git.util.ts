import { execSync } from 'child_process';

export class GitUtil {

    public constructor(private cmd: string) { }

    public exec(args) {
        try {
            return execSync(`git ${this.cmd} ${args}`).toString().trim();
        } catch (err) {
            return null;
        }
    }

}
