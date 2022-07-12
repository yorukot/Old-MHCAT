const chalk = require(`chalk`);
const {
    WebhookClient,
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require(`discord.js`);
const {errorWebhook} = require('../config.json')
const error_send = (error,interaction) => {
    const row = new MessageActionRow()
    .addComponents(
        new MessageButton()
        .setURL("https://discord.gg/7g7VE2Sqna")
        .setStyle("LINK")
        .setLabel("支援伺服器")
        .setEmoji("<:customerservice:986268421144592415>"),
        new MessageButton()
        .setURL("https://mhcat.xyz")
        .setEmoji("<:worldwideweb:986268131284627507>")
        .setStyle("LINK")
        .setLabel("官方網站")
    );
    const errorwebhook = new WebhookClient({ url: errorWebhook })
    let embed = new MessageEmbed()
    .setTitle("<a:error:980086028113182730> 出現錯誤啦!!!")
    .setDescription(`\`\`\`js\n${error}\`\`\``)
    .setColor("RED")
    .setTimestamp()
    errorwebhook.send({
        embeds: [embed]
    })
    return interaction.reply({
        embeds:[new MessageEmbed()
        .setTitle("<a:error:980086028113182730> | 很抱歉，出現了錯誤!")
        .setDescription("**如果可以的話再麻煩幫我到支援伺服器回報w**" + `\n\`\`\`${error}\`\`\`\n常見錯誤:\n\`Missing Access\`:**沒有權限**\n\`Missing Permissions\`:**沒有權限**`)
        .setColor("RED")
        ],
        components:[row]
    })
}

module.exports = error_send;