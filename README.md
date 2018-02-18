# git-hook-email-selector

This is a pre-commit hook aimed at developers who want to be able to
easily manage making commits with multiple emails. For example, you can
use your work email to author commits for your job, and your personal
email to author commits for your hobby projects.

During the pre-commit, this hook well check `git config` to see whether
there is an email configured for the current repository. It does this
using the command:

```
git config --local --get user.email
```

If there is no local user email configured, it will prompt you to choose
from a list of configured emails, and attempt to pick the best default
by matching a pattern you define, using git config's global email as the
fallback default if no entries are match by pattern.

## Installation

This hook requires Node >= 5.12.0.

It is recommended that this hook is installed using the `core.hooksPath`
global configuration key. This will allow the hook to run for all of
your existing repositories, as well as any repositories you clone in the
future. To install this hook as a core hook, run the following commands:

**WARNING** This will overwrite any existing `core.hooksPath`
configuration.

```
npm i -g git-hook-email-selector
mkdir ~/.git-hooks
echo git-hook-email-selector > ~/.git-hooks/pre-commit
chmod a+x ~/.git-hooks/pre-commit
git config --global --add core.hooksPath ~/.git-hooks
```

## Configuration

The hook is configured entirely using `git config`.

To add an entry, add the following config keys:

```
git config --global --add email-chooser.DESCRIPTION.email YOUR_EMAIL
git config --global --add email-chooser.DESCRIPTION.email MATCH_PATTERN
```

For example:
```
git config --global --add email-chooser.work.email joe@schmoeco.com
git config --global --add email-chooser.work.email github.com:schmoeco
```

If you'd prefer to edit your `.gitconfig` file directly, it the section
should look like this:

```
[email-chooser "work"]
    email = joe@schmoeco.com
    pattern = github.com:schmoeco
```

You can add as many entries as you need. Patterns are optional if you
need to manually choose an email.

```
[email-chooser "work"]
    email = joe@schmoeco.com
    pattern = github.com:schmoeco

[email-chooser "hobby"]
    email = joe@home.com
    pattern = github.com:jschmoe

[email-chooser "oss-projects"]
    email = joe@joepensource.com
```
