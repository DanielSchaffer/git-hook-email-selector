import { GitConfigUtil }    from '../util/git.config.util';
import { GitConfigUserApi } from './git.config.user.api';

export class GitConfigApi extends GitConfigUtil {

    public readonly user = new GitConfigUserApi();

    constructor() {
        super();
    }


}
