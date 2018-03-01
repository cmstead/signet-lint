'use strict';

function cliHelp() {

    function printHelp() {
        const helpInfo =
`
Signet-lint will lint your signet types and useage throughout your project.

Command:

signet-lint [init][help] [--json] [--file <filename>]

Options:

init        Creates default .signetlintrc file in current directory
help        Prints help information
--file      Allows linting of single file, still requires configuration, ignores excluded files.
--json      Produces lint output as JSON
`;

        console.log(helpInfo);
    }

    return {
        printHelp: printHelp
    };
}

module.exports = cliHelp;