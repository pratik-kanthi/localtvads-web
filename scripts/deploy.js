/* eslint no-console: 0 */

/********************* Mandatory Env Variables ******************/
// SERVERHOST=x.x.x.x
// USERNAME=appadmin
// SSHKEY=/Users/johndoe/.ssh/id_rsa
// DESTINATION=/var/www/helloworld
// DESTINATION_STAGING=/var/www/test
// FOLDERNAME=dist

require('dotenv').config();
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const node_ssh = require('node-ssh');
const ssh = new node_ssh();
const folderPath = path.join(__dirname + '/../' + process.env.FOLDERNAME);

const args = require('minimist')(process.argv.slice(2));
let isStaging = true;
if (!args['environment'] || ['staging', 'production'].indexOf(args['environment']) === -1) {
    process.stdout.write('environment arg is missing or incorrect. Please either pass production or staging as environment argument');
    process.exit(1);
} else {
    isStaging = args['environment'] === 'staging';
    try {
        if (process.env.FOLDERNAME && fs.existsSync(folderPath)) {
            ssh.connect({
                host: process.env.SERVERHOST,
                username: process.env.USERNAME,
                privateKey: process.env.SSHKEY
            }).then(
                () => {
                    const failed = [];
                    const animation = (() => {
                        const sign = ['\\', '|', '/', '-'];
                        let x = 0;
                        process.stdout.write('Please wait while we deploy your build... \n');
                        return setInterval(() => {
                            process.stdout.write('\r' + sign[x++]);
                            x &= 3;
                        }, 250);
                    })();
                    ssh.putDirectory(folderPath, isStaging ? process.env.DESTINATION_STAGING : process.env.DESTINATION, {
                        recursive: true,
                        concurrency: 10,
                        tick: (localPath, remotePath, error) => {
                            if (error) {
                                failed.push(localPath);
                            }
                        }
                    }).then(status => {
                        clearInterval(animation);
                        console.log(status ? chalk.bgWhite.green('SUCCESSFUL') : chalk.bgWhite.red('FAILED'));
                        if (failed.length) {
                            console.log('Following files were failed');
                            failed.forEach(path => {
                                console.log(path);
                            });
                        }
                        ssh.dispose();
                    });
                },
                err => {
                    console.error(`  ${chalk.bgWhite.red(' ERROR ')} ${chalk.red('There was an error connecting to the Host')}\n\n`);
                    console.error(err);
                    ssh.dispose();
                }
            );
        } else {
            console.error(`  ${chalk.bgWhite.red(' ERROR ')} ${chalk.red('Folder doesn\'t exist. Please check the FOLDERNAME env variable')}\n\n`);
        }
    } catch (err) {
        console.error(err);
    }
}
