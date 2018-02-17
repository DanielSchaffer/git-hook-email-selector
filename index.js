const { execSync } = require('child_process');
const readline = require('readline');
const tty = require('tty');

// TODO: can this be stored in the global git config?
/** @type {Config} **/
const config = require('./config');

function getEmail(scope) {
    try {
        return execSync(`git config --${scope} --get user.email`).toString().trim();
    } catch (err) {
        return null;
    }
}

const currentEmail = getEmail('local');

if (currentEmail) {
    process.exit(0);
}

const globalEmail = getEmail('global');

const origin = (() => {
    try { return execSync('git remote get-url origin').toString(); }
    catch (err) { return null; }
})();

const repoEmail = origin ? Object.keys(config.emails)
    .find(email => {
        const patterns = config.emails[email];
        return patterns.find(pattern => {
            if (pattern.startsWith('/') && pattern.endsWith('/')) {
                return new RegExp(pattern.substring(1, pattern.length - 1)).test(origin);
            }
            return origin.indexOf(pattern) >= 0;
        })
    }) : null;

const input = new tty.ReadStream(1);
const output = new tty.WriteStream(1);
const io = readline.createInterface({
    input,
    output,
});

const options = [];
if (repoEmail) {
    options.push({
        email: repoEmail,
        tag: 'repository match',
    });
}
if (globalEmail) {
    options.push({
        email: globalEmail,
        tag: 'global default',
    });
}

const extraOptions = Object.keys(config.emails)
    .filter(email => email !== repoEmail && email !== globalEmail)
    .map(email => ({ email }));

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
    if (entry.tag) {
        option += ` (${entry.tag})`;
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
