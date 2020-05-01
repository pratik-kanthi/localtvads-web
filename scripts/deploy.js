/* eslint no-console: 0 */

/********************* Mandatory Env Variables ******************/
// SERVERHOST=x.x.x.x
// USERNAME=appadmin
// SSHKEY=/Users/johndoe/.ssh/id_rsa
// SSHPORT=22
// DESTINATION=/var/www/helloworld
// TEMP=/var/www/temp
// FOLDERNAME=dist
/****************************************************************/

// Note: Always try to run this file with new build. This script doesn't clean or flush your dist.

const path = require('path');
const args = require('minimist')(process.argv.slice(2));

if (!args['environment'] || ['staging', 'production'].indexOf(args['environment']) === -1) {
    process.stdout.write('environment arg is missing or incorrect. Please either pass production or staging as environment argument');
    process.exit(1);
} else {
    require('dotenv').config({
        path: path.join(__dirname, `/../.env.${args['environment']}`)
    });
    const chalk = require('chalk');
    const fs = require('fs');
    const node_ssh = require('node-ssh');
    const ssh = new node_ssh();
    const folderPath = path.join(__dirname + '/../' + process.env.FOLDERNAME); //Users/sharvilak/sites/flext-web/dist
    try {
        if (process.env.FOLDERNAME && fs.existsSync(folderPath) && process.env.DESTINATION && process.env.TEMP && process.env.SERVERHOST && process.env.USERNAME && process.env.SSHKEY) {
            let animation;
            ssh.connect({
                host: process.env.SERVERHOST,
                username: process.env.USERNAME,
                privateKey: process.env.SSHKEY,
                port: process.env.SSHPORT
            }).then(
                () => {
                    const failed = [];
                    animation = animate();
                    ssh.putDirectory(folderPath, process.env.TEMP, {
                        recursive: true,
                        concurrency: 5,
                        tick: (localPath, remotePath, error) => {
                            if (error) {
                                failed.push(localPath);
                            }
                        }
                    }).then(
                        async status => {
                            clearInterval(animation);
                            console.log(status ? chalk.green('SUCCESSFUL ✅') : chalk.red('FAILED 🤕'));
                            if (failed.length) {
                                const Promise = require('bluebird');
                                Promise.almost = r => Promise.all(r.map(p => (p.catch ? p.catch(e => e) : p)));

                                console.log('\nFollowing files were failed 📂');

                                const queue = [];
                                failed.forEach(path => {
                                    console.log(chalk.red(path));
                                    queue.push(pushFailedFile(path, ssh, folderPath));
                                });

                                // Retry Logic with putFile
                                console.log('\nRetrying... 📡  \n');
                                let result;
                                try {
                                    result = await Promise.almost(queue);
                                } catch (err) {
                                    console.log(err);
                                }
                                clearInterval(animation);
                                let success = 0;
                                result.forEach(r => {
                                    if (r) {
                                        console.log(chalk.red(r + ' couldn\'t be deployed for some reason. Please copy it manually'));
                                    } else {
                                        success++;
                                    }
                                });


                                if (success === queue.length && success !== 0) {
                                    console.log(chalk.green('Retries have been successful.'));
                                } else if (success !== queue.length) {
                                    console.log(` ${chalk.red(' Retries have failed ')}`);
                                    process.exit(1);
                                }
                            }
                            try {
                                await ssh.execCommand(`mv ${process.env.TEMP}/* ${process.env.DESTINATION}`);
                                console.log(chalk.green('Deployed 🚀 ✅ '));
                                ssh.dispose();
                                process.exit(0);
                            } catch (err) {
                                console.log(chalk.red(`There was an error while copying ${process.env.TEMP} to ${process.env.DESTINATION} 🚀 ✅ `));
                                ssh.dispose();
                                process.exit(1);
                            }
                        },
                        err => {
                            clearInterval(animation);
                            console.log(`  ${chalk.red(' ERROR ')} ${chalk.red('There was an unexpected error due to some reason 🤕')}\n\n`);
                            console.error(err);
                            ssh.dispose();
                            process.exit(0);
                        }
                    );
                },
                err => {
                    console.log(`  ${chalk.red(' ERROR ')} ${chalk.red('There was an error connecting to the Host 🤕')}\n\n`);
                    console.error(err);
                    ssh.dispose();
                    clearInterval(animation);
                    process.exit(0);
                }
            );
        } else {
            console.log(`  ${chalk.red(' ERROR ')} ${chalk.red('Required env variables are missing. Please check the env variables 🤷‍')}\n\n`);
            process.exit(0);
        }
    } catch (err) {
        console.error(err);
        process.exit(0);
    }
}

const animate = () => {
    const sign = ['\\', '|', '/', '-'];
    let x = 0;
    process.stdout.write('Please wait while we deploy your build... \n');
    return setInterval(() => {
        process.stdout.write('\r' + sign[x++]);
        x &= 3;
    }, 250);
};

const pushFailedFile = (path, ssh, folderPath) => {
    return new Promise((resolve, reject) => {
        ssh.putFile(path, process.env.DESTINATION + path.replace(folderPath, '')).then(
            () => {
                resolve();
            },
            () => {
                reject(path);
            }
        );
    });
};
