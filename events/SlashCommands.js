const client = require('../index');
client.on('interactionCreate', async (interaction) => {
    if (interaction.isCommand()) {
        let cmd = client.slash_commands.get(interaction.commandName);
        if (!cmd) return 
        let options = interaction.options._hoistedOptions;
        const perms = cmd.UserPerms
        cmd.run(client, interaction, options, perms)
    }
})