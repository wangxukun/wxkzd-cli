import {Command} from '@commander-js/extra-typings';

function init(projectName: string, cmdObj: Command) {
    console.log('init', projectName, cmdObj);
}

export = init;