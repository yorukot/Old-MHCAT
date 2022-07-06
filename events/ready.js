const client = require('../index')
const { MessageEmbed,WebhookClient } = require('discord.js')
const config = require('../config')
const readywebhook = new WebhookClient({ url: config.readyWebhook })
client.on('ready', () => {
    console.log(`|機器人成功上線!|`)
    let embed = new MessageEmbed()
    .setTitle(`**${client.user.username}**已就緒`)
    .setColor("GREEN")
    readywebhook.send({
        embeds: [embed]
    })
    setInterval(() => {
        const arrayOfStatus = [
            `/help`
        ]
        client.user.setPresence({
            activities: [{
                name: arrayOfStatus[Math.floor(Math.random() * arrayOfStatus.length)]
            }],
            status: 'IDLE',
            type: "IDLE"
        })
    }, 10000)/*
const {token} = require('../config.json')
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const rest = new REST({ version: '9' }).setToken(`${token}`);
rest.get(Routes.applicationCommands("964185876559196181"))
    .then(data => {
        const promises = [];
        for (const command of data) {
            if(command.id !== "986904974778834984" && command.id !== "990430736421117992" && command.id !== "990431300626317382" && command.id !== "990432161037430875"){
                client.application.commands.fetch(`${command.id}`)
                .then( (command) => {
              console.log(`Fetched command ${command.name}`)
              command.delete()
              console.log(`Deleted command ${command.name}`)
              }).catch(console.error);
            }
        }
    });*/
})