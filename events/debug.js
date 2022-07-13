const client = require('../index')
const { MessageEmbed,WebhookClient } = require('discord.js')
const { debugWebhook } = require('../config.json')
client.once('ready', () => {
    client.on('debug', (info) => {
        const debugwebhook = new WebhookClient({ url: debugWebhook })
        let embed = new MessageEmbed()
        .setTitle("調適錯誤訊息:")
        .setDescription("\`\`\`js\n" + info + "\`\`\`")
        .setColor("RED")
        debugwebhook.send({
            embeds: [embed]
        })
    })
})
