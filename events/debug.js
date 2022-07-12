const client = require('../index')
const { MessageEmbed,WebhookClient } = require('discord.js')
const config = require('../config')
client.on('debug', (info) => {
    const debugwebhook = new WebhookClient({ url: config.debugwebhook })
    let embed = new MessageEmbed()
    .setTitle("調適錯誤訊息:")
    .setDescription("\`\`\`js\n" + info + "\`\`\`")
    .setColor("RED")
    debugwebhook.send({
        embeds: [embed]
    })
})