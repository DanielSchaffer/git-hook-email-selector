import { GitConfigScopedProperty } from './git.config.scoped.property';
import { GitConfigSectionApi }     from './git.config.section.api';

export class GitConfigCoreApi extends GitConfigSectionApi {

    public readonly hooksPath: GitConfigScopedProperty = this.scopedProperty('hooksPath');

    constructor() {
        super('core');
    }

}
