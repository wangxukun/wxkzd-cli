module.exports = core;

const pkg = require('../package.json');
const log = require('@wxkzd-cli/log');
function core() {
  checkPkgVersion();
  log();
}

function checkPkgVersion() {
  console.log(pkg.version);
}
