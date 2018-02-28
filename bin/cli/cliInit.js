'use strict';

function cliInit(chalk, fs) {

    function getDefaultConfig() {
        return JSON.stringify({
            typeFiles: [
                './signet-types.js'
            ],
            sourceFiles: [
                './app/**/*.js'
            ],
            excludeFiles: []
        }, null, 4);
    }

    function fileExists(filePath) {
        try {
            return fs.lstatSync(filePath).isFile();
        } catch (e) {
            return false;
        }
    }

    function initialize() {
        const lintRcPath = process.cwd() + '/.signetlintrc';

        console.log('');

        if (!fileExists(lintRcPath)) {
            const defaultConfig = getDefaultConfig();
            fs.writeFileSync(lintRcPath, defaultConfig);

            console.log(chalk.green('Success! ') + `A new configuration has been created at ${lintRcPath}`);
        } else {
            console.log(chalk.yellow('Uh oh. ') + `A signet-lint configuration file already exists at: ${lintRcPath}`);
        }
        
        console.log('');        
    }

    return {
        initialize: initialize
    };

}

module.exports = cliInit;