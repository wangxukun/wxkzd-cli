import log from '@wxkzd-cli/log';

interface myOptions {
    "force": boolean;
}

function init(projectName: string, options: myOptions) {
    log.verbose('init', 'init.js was executed');
    console.log('init', projectName, options.force, process.env.CLI_TARGET_PATH);
}

export = init;