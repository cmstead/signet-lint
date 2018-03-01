Signet-Lint -- A Signet type verifier for your project
======================================================

## Installation ##

Signet-lint should be installed globally for greatest utility.  Installation is just like any other global npm package:

`npm install -g signet-lint`

Once this is done, you can run Signet-lint just like any other command-line utility!

## Project Setup ##

For any project you want to lint, simply open the project directory in your favorite terminal utility.  Once in your project, run the following command:

`signet-lint init`

This will create a shiny new configuration (.signetlintrc) file in your project which you can edit.  The internals will look a lot like this:

```json
{
    "typeFiles": [
        "./signet-types.js"
    ],
    "sourceFiles": [
        "./app/**/*.js"
    ],
    "excludeFiles": []
}
```

There are some pretty big assumptions made here, but nothing is stopping you from reconfiguring things to fit your project.  Go nuts!

Here's what the .signetlintrc file looks like for Signet-lint:

```json
{
    "typeFiles": [
        "./signet-types.js",
        "type-data/*.js"
    ],
    "sourceFiles": [
        "./bin/**/*.js"
    ],
    "excludeFiles": [
        "./bin/typeUtils/typeLoader.js",
        "./bin/verificationUtils/verifiers.js"
    ]
}
```

Once you have everything set to go, you're ready to start linting!

## Running the Linter ##

To lint your project, just run `signet-lint` in the command line from within your project directory, wherever your .signetlintrc file is.  That's it.  It practically does all the work for you! (Which is kind of the point.)

Following is the output from the help screen for further options:

```
Signet-lint will lint your signet types and useage throughout your project.

Command:

signet-lint [init][help] [--json] [--file <filename>]

Options:

init        Creates default .signetlintrc file in current directory
help        Prints help information
--file      Allows linting of single file, still requires configuration, ignores excluded files.
--json      Produces lint output as JSON
```

A few important things to note:

- This linter is opinionated. You might get errors from the linter which work fine in code. The goal is to help keep things organized, tidy and well structured.  You might curse the linter, but one day it will catch that type you misspelled.
- File order matters.  If you load your files into memory in a certain order, but you don't account for it in your lint configuration, things might not go so smoothly.
- Globbing is allowed. If file order doesn't matter, then just use a glob pattern and let the linter go wild.

## Version History ##

**v1.0.0**

Initial release!