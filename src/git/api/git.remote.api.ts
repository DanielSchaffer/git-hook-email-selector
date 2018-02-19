import { GitRemoteUtil } from '../util/git.remote.util';

export class GitRemoteApi extends GitRemoteUtil {

    public get origin(): string {
        return this.exec('get-url origin');
    }

}
