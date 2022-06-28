const client = require('../index');

client.on('interactionCreate', async (interaction) => {
    if (interaction.isCommand()) {
        let cmd = client.slash_commands.get(interaction.commandName);
        if (!cmd) return 
        let options = interaction.options._hoistedOptions;

        cmd.run(client, interaction, options)
    }
}) //smth is wrong :(, let me check brb