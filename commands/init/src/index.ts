import {Command} from 'commander';

class Init {
    constructor() {
    }

    public start(projectName: string, cmdObj: Command) {
        console.log('init', projectName, cmdObj);
    }

}

export default Init;