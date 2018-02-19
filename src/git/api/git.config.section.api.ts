import { GitConfigScopedProperty } from './git.config.scoped.property';
import { GitConfigSectionUtil }    from '../util/git.config.section.util';

export class GitConfigSectionApi extends GitConfigSectionUtil {

    constructor(section: string) {
        super(section);
    }

    protected scopedProperty(key: string): GitConfigScopedProperty {
        return new GitConfigScopedProperty(this.section, key);
    }
}
