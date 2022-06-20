const client = require('../index')

client.on("messageCreate", async (message) => {
    if (message.author.bot || !message.guild) return //To make your code more easier we will add discord to our parameters
    if (!message.content.startsWith(client.prefix)) return;
    const [cmd, ...args] = message.content
        .slice(client.config.prefix.length)
        .trim()
        .split(" ");
    const Discord = require('discord.js')
    let command = client.commands.get(cmd)


    if (!command) command = client.commands.get(client.aliases.get(cmd))
    if (command) {              
    if(message.member.id !== "579544867626024960"){
        if (!message.member.permissions.has(command.UserPerms || [])) return message.channel.send(`你需要 \`${command.UserPerms || []}\` 權限`)
    }
        if (!message.guild.me.permissions.has(command.BotPerms || [])) return message.channel.send(`我需要 \`${command.BotPerms || []}\` 權限`)

        await command.run(client, message, args, Discord)
    }
})