const client = require('../index')
const { MessageEmbed,WebhookClient } = require('discord.js')
const config = require('../config')
client.on('error', () => {
    console.log(`error`)
    const errorWebhook = new WebhookClient({ url: config.errorWebhook })
    let embed = new MessageEmbed()
    .setTitle("出現錯誤啦!!!")
    .setDescription("\`\`\`js\n" + error + "\`\`\`")
    .setColor("RED")
    errorWebhook.send({
        embeds: [embed]
    })
})