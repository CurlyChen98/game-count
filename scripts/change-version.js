/**
 * @example yarn run version 0.1.0
 */
const shell = require('shelljs');

async function set() {
  let version = process.argv[2];

  let workspacesResult = shell.exec(`yarn workspaces info --json`);
  let workspaces = Object.keys(JSON.parse(workspacesResult.stdout)).filter((item) => {
    return !['common', 'govmo-common'].includes(item);
  });

  let vString = `version --new-version ${version} --no-git-tag-version`;
  shell.exec(`yarn ${vString}`);
  workspaces.forEach((item) => {
    shell.exec(`yarn workspace ${item} ${vString}`);
  });
}
set();
