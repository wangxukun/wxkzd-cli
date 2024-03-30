import log from 'npmlog';


log.level = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'info';
log.heading = 'wxkzd';
log.headingStyle = {fg: 'black', bg: 'blue'}
log.addLevel('success', 2000, {fg: 'blue', bg: 'green', bold: true});

export = log;