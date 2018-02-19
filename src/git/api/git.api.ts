import { GitConfigApi } from './git.config.api';
import { GitRemoteApi } from './git.remote.api';

export class GitApi {

    public readonly config = new GitConfigApi();
    public readonly remote = new GitRemoteApi();

}
