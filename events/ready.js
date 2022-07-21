const client = require('../index')
const { MessageEmbed,WebhookClient } = require('discord.js')
const config = require('../config')
const readywebhook = new WebhookClient({ url: config.readyWebhook })
client.once('ready', () => {
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
    }, 10000)
})