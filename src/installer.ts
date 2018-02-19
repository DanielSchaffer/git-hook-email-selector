import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { GitApi } from './git/api/git.api';

const api = new GitApi();

function ensureHooksPath(): string {
    let hooksPath = api.config.core.hooksPath.global;
    if (hooksPath) {
        return hooksPath;
    }
    hooksPath = '~/.git-hooks';
    api.config.core.hooksPath.global = hooksPath;
    return hooksPath;
}

function ensurePath(dir): void {
    const path = resolve(dir);
    if (existsSync(path)) {
        return;
    }
    mkdirSync(path);
}

function readHookFile(hook): string {
    const hookPath = resolve(hooksPath, hook);
    if (existsSync(hookPath)) {
        return readFileSync(hookPath, 'utf-8');
    }
    return '';
}

function appendHookFile(hook, content): void {
    const hookPath = resolve(hooksPath, hook);
    let appendedContent = content;
    if (appendedContent) {
        appendedContent += '\n';
    }
    appendedContent += '#!/usr/bin/env bash\n';
    appendedContent += 'git-hook-email-selector\n';
    writeFileSync(hookPath, appendedContent, 'utf-8');
}

const hooksPath = ensureHooksPath();
ensurePath(hooksPath);

const hookFileContent = readHookFile('pre-commit');
appendHookFile('pre-commit', hookFileContent);


