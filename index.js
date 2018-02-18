const { execSync } = require('child_process');
const readline = require('readline');
const tty = require('tty');

function gitConfigCommand(scope, cmd) {
    try {
        return execSync(`git config --${scope} ${cmd}`).toString().trim();
    } catch (err) {
        return null;
    }
}

function getConfig(scope, key) {
    return gitConfigCommand(scope, `--get ${key}`);
}

function getEmail(scope) {
    return getConfig(scope, 'user.email');
}

/** @returns {Config} **/
function loadConfig() {
    return gitConfigCommand('global', '--get-regexp email-selector')
        .split('\n')
        .reduce((config, entry) => {
            let parts = entry.split(' ');
            let keyParts = parts[0].split('.');
            let key = keyParts[1];
            let prop = keyParts[2];
            let value = parts[1];

            if (!config[key]) {
                config[key] = {};
            }
            config[key][prop] = value;

            return config;
        }, {});
}

function loadConfigEntries() {
    const config = loadConfig();
    return Object.keys(config)
        .map(key => ({
            key,
            email: config[key].email,
            pattern: config[key].pattern,
        }));
}

const currentEmail = getEmail('local');

if (currentEmail) {
    process.exit(0);
}

const configEntries = loadConfigEntries();
const globalEmail = getEmail('global');

const origin = (() => {
    try { return execSync('git remote get-url origin').toString(); }
    catch (err) { return null; }
})();

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

const input = new tty.ReadStream(1);
const output = new tty.WriteStream(1);
const io = readline.createInterface({
    input,
    output,
});

const options = [];
if (repoEntry) {
    options.push({
        email: repoEntry.email,
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
        tags: [entry.key],
    }));

if (extraOptions) {
    options.push(...extraOptions);
}

let question = 'You have not confirmed the email address to use for this repository:\n';
question += options.map((entry, index) => {
    let option = '\t';
    if (index === 0) {
        option += '[1]';
    } else {
        option += ` ${index + 1})`
    }
    option += ` ${entry.email}`;
    if (entry.tags) {
        option += ` (${entry.tags.join(', ')})`;
    }
    return option;
}).join('\n');
question += '\n> ';

function prompt() {
    io.question(question, response => {
        if (response === '') {
            response = 1;
        }
        const selectedOption = options[response - 1];
        if (selectedOption) {
            execSync(`git config --local --add user.email ${selectedOption.email}`);
            process.exit(0);
        }

        setTimeout(prompt);
    });
}

prompt();
