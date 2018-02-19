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

Additionally, you have to option to configure a separate name. If no
name is configured, git will use whatever is set at the global or system
level.

## Installation

This hook requires the [NodeJS](https://nodejs.org/) runtime to be
installed.

It is recommended that this hook is installed using the `core.hooksPath`
global configuration key. This will allow the hook to run for all of
your existing repositories, as well as any repositories you clone in the
future. To install this hook as a core hook, run the following commands:

```
npm i -g git-hook-email-selector
install-git-hook-email-selector
```

The `install-git-hook-email-selector` script will attempt to install the
hook to `~/.git-hooks`. If you already have `core.hooksPath` defined, it
will use the existing path and attempt to append the
`git-hook-email-selector` command to any existing `pre-commit` hook.

## Configuration

The hook is configured entirely using `git config`.

To add an entry, add the following config keys:

```
git config --global --add email-selector.DESCRIPTION.email YOUR_EMAIL
git config --global --add email-selector.DESCRIPTION.pattern MATCH_PATTERN
# optional
git config --global --add email-selector.DESCRIPTION.name YOUR NAME
```

For example:
```
git config --global --add email-selector.work.email joe@schmoeco.com
git config --global --add email-selector.work.pattern github.com:schmoeco
# optional
git config --global --add email-selector.work.name Joe Schmoe
```

If you'd prefer to edit your `.gitconfig` file directly, it the section
should look like this:

```
[email-selector "work"]
    email = joe@schmoeco.com
    pattern = github.com:schmoeco
    name = Joe Schmoe
```

You can add as many entries as you need. Patterns are optional if you
need to manually choose an email.

```
[email-selector "work"]
    email = joe@schmoeco.com
    pattern = github.com:schmoeco

[email-selector "hobby"]
    email = joe@home.com
    pattern = github.com:jschmoe

[email-selector "oss-projects"]
    email = joe@joepensource.com
    name = Joe Incognischmoe
```

