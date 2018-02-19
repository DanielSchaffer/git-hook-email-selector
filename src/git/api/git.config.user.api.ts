import { GitConfigScopedProperty } from './git.config.scoped.property';
import { GitConfigSectionApi }     from './git.config.section.api';

export class GitConfigUserApi extends GitConfigSectionApi {

    public readonly name: GitConfigScopedProperty = this.scopedProperty('name');
    public readonly email: GitConfigScopedProperty = this.scopedProperty('email');

    constructor() {
        super('user');
    }

}
