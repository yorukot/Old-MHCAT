const client = require('../index')
const { MessageEmbed } = require('discord.js')
const moment = require('moment')

client.on('ready', () => {
    /*const guild = client.guilds.cache.get("976879837471973416")
    guild.invites.fetch()
  .then(console.log)
  .catch(console.error);*/
    console.log(`|機器人成功上線!|`)
    setInterval(() => {
        const arrayOfStatus = [
            `/help`
            //'正在進行維護中'
        ]
        client.user.setPresence({
            activities: [{
                name: arrayOfStatus[Math.floor(Math.random() * arrayOfStatus.length)]
            }],
            status: 'IDLE',
            type: "IDLE"
        })
    }, 5000)
/*onst { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
    
const rest = new REST({ version: '9' }).setToken();
rest.get(Routes.applicationCommands("964185876559196181"))
    .then(data => {
        const promises = [];
        for (const command of data) {
            const deleteUrl = `${Routes.applicationCommands("964185876559196181")}/${command.id}`;
            promises.push(rest.delete(deleteUrl));
        }
        return Promise.all(promises);
    });*/
})