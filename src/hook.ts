import { createInterface }         from 'readline';
import { ReadStream, WriteStream } from 'tty';
import * as colors                 from 'colors';

import { Config, ConfigEntry } from './config';
import { GitApi }              from './git/api/git.api';

const git = new GitApi();

function loadConfig(): Config {
    return git.config.getRegExp('email-selector')
        .split('\n')
        .reduce((config, entry) => {
            const path = entry.substring(0, entry.indexOf(' '));
            let keyParts = path.split('.');
            let key = keyParts[1];
            let prop = keyParts[2];
            let value = entry.substring(entry.indexOf(' ') + 1);

            if (!config[key]) {
                config[key] = {};
            }
            config[key][prop] = value;

            return config;
        }, {});
}

function loadConfigEntries(): ConfigEntry[] {
    const config = loadConfig();
    return Object.keys(config)
        .map(key => ({
            key,
            name: config[key].name,
            email: config[key].email,
            pattern: config[key].pattern,
        }));
}

const currentEmail = git.config.user.email.local;

if (currentEmail) {
    process.exit(0);
}

const configEntries = loadConfigEntries();

const globalEmail = git.config.user.email.global;
const globalName = git.config.user.name.global;
const systemName = git.config.user.name.system;

const origin = git.remote.origin;

const repoEntry = origin ? configEntries
    .find(entry => {
        if (!entry.pattern) {
            return false;
        }
        if (entry.pattern.startsWith('/') && entry.pattern.endsWith('/')) {
            return new RegExp(entry.pattern.substring(1, entry.pattern.length - 1)).test(origin);
        }
        return origin.indexOf(entry.pattern) >= 0;
    }) : null;

const input = new ReadStream(1 as any);
const output = new WriteStream(1 as any);
const io = createInterface({
    input,
    output,
});

const options = [];
if (repoEntry) {
    options.push({
        email: repoEntry.email,
        name: repoEntry.name,
        tags: [repoEntry.key, 'repository match'],
    });
}
if (globalEmail) {
    options.push({
        email: globalEmail,
        tags: ['global'],
    });
}

const extraOptions = configEntries
    .filter(entry => entry.email !== (repoEntry && repoEntry.email) && entry.email !== globalEmail)
    .map(entry => ({
        email: entry.email,
        name: entry.name,
        tags: [entry.key],
    }));

if (extraOptions) {
    options.push(...extraOptions);
}

let question: string = colors.bold('\nYou have not confirmed the user to use for this repository:\n'.yellow.bgBlack);
question += options.map((entry, index) => {
    let option = `  ${index + 1}) ${entry.email}`;
    if (entry.name) {
        option += ` [${entry.name}]`
    } else if (globalName) {
        option += ` [global name - ${globalName}]`;
    } else if (systemName) {
        option += ` [system name - ${systemName}]`;
    }
    if (entry.tags) {
        option += ` (${entry.tags.join(', ')})`;
    }
    return option;
}).join('\n');
question += '\n\nPress enter for default [1]';
question += '\n> ';

function prompt() {
    io.question(question, response => {
        if (response === '') {
            response = '1';
        }
        const choice = parseInt(response);
        const selectedOption = options[choice - 1];
        if (selectedOption) {
            let result = `Setting local user to ${selectedOption.email}`;
            git.config.user.email.local = selectedOption.email;
            if (selectedOption.name) {
                result += ` (${selectedOption.name})`;
                git.config.user.name.local = selectedOption.name;
            }
            console.log(`\n${colors.bold(result.yellow)}\n`);
            process.exit(0);
        }

        setTimeout(prompt, 0);
    });
}

prompt();
