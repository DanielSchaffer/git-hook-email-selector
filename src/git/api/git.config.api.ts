import { GitConfigUtil }    from '../util/git.config.util';

import { GitConfigCoreApi } from './git.config.core.api';
import { GitConfigUserApi } from './git.config.user.api';

export class GitConfigApi extends GitConfigUtil {

    public readonly core = new GitConfigCoreApi();
    public readonly user = new GitConfigUserApi();

    constructor() {
        super();
    }


}
