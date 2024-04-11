import {CommandOptions} from '@commander-js/extra-typings';

interface myOptions extends CommandOptions {
    "force": boolean;
}

function init(projectName: string, options: myOptions) {
    console.log('init', projectName, options.force, process.env.CLI_TARGET_PATH);
}

export = init;