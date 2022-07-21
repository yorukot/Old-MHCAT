const client = require('../index')
const { MessageEmbed,WebhookClient } = require('discord.js')
const config = require('../config')
const readywebhook = new WebhookClient({ url: config.readyWebhook })
client.once('ready', () => {
    const chalk = require('chalk')
    console.log(chalk.hex('#00FFFF').bold('┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓'))
    console.log(chalk.hex('#00FFFF').bold('┃           機器人成功上線             ┃'))
    console.log(chalk.hex('#00FFFF').bold('┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛'))
    setInterval(() => {
        if(client.user.id === "984485913201635358") return
        const dsadsa = Math.round(Date.now() / 1000)
        const channel = client.channels.cache.get("977249506489946193")
        channel.messages.fetch('999611792147890196').then(msg => msg.edit(`<:chronometer:986065703369080884> 最後更新時間:\n<t:${dsadsa}>\n<:warning:985590881698590730>超過五分鐘沒更新代表機器人怪怪的`))
    }, 60*5*1000);
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