// Based on reconlx handler

const { glob } = require('glob') // Do npm install glob
const { promisify } = require('util'); // This is pre-installed
const { aliases } = require('..');

const globPromise = promisify(glob);

module.exports = async (client) => {
    //Command Handler
    const commandfiles = await globPromise(`${process.cwd()}/commands/**/*.js`);
    commandfiles.map((value) => {
        const file = require(value);
        const splitted = value.split('/');
        const directory = splitted[splitted.length - 2];

        if (file.name) {
            const properties = { directory, ...file }
            client.commands.set(file.name, properties)
        }
        if (file.aliases && Array.isArray(file.aliases)) { file.aliases.forEach(alias => client.aliases.set(alias, file.name)) }
    })

    //Event Handler
    const eventfiles = await globPromise(`${process.cwd()}/events/*.js`);
    eventfiles.map((value) => require(value)); // Now lets add a prefix
}

// You can make multiple folders