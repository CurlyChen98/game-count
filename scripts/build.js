const shell = require('shelljs');
const env = process.argv[2] || '';
const cmd = env ? `build:${env}` : 'build';

shell.mkdir('-p', './dist');

shell.rm('-rf', './dist/game-count');
shell.exec(`cd ./packages/game-count && yarn run ${cmd} && cd ../../`);
shell.cp('-rf', './packages/game-count/dist', `./dist/game-count`);

const AdmZip = require('adm-zip');
const zip = new AdmZip();
zip.addLocalFolder('./dist/game-count', '/game-count');
zip.writeZip(`./dist/game-count-${env ? `${env}` : 'prod'}.zip`);
