const shell = require('shelljs');
const env = process.argv[2] || '';
const cmd = env ? `build:${env}` : 'build';

shell.mkdir('-p', './dist');

shell.rm('-rf', './dist/admin-platform');
shell.exec(`cd ./packages/admin-platform && yarn run ${cmd} && cd ../../`);
shell.cp('-rf', './packages/admin-platform/dist', `./dist/fax-admin`);

const AdmZip = require('adm-zip');
const zip = new AdmZip();
zip.addLocalFolder('./dist/fax-admin', '/fax-admin');
zip.writeZip(`./dist/fax-admin-${env ? `${env}` : 'prod'}.zip`);
