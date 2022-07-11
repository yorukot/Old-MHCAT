const {
    Client,
    Message,
    MessageEmbed
} = require('discord.js');
const warndb = require('../../models/warndb')
const { 
    MessageActionRow,
    MessageSelectMenu,
    MessageButton,
    Collector,
    Discord,
    MessageAttachment,
    Modal,
    TextInputComponent,
    Permissions
 } = require('discord.js');
module.exports = {
    name: '警告紀錄',
    description: '收尋一位使用者的警告',
    options: [{
        name: '使用者',
        type: 'USER',
        description: '要收尋的使用者!',
        required: false,
    }],
    //video: 'https://mhcat.xyz/commands/announcement.html',
    UserPerms: '訊息管理',
    emoji: `<:searching:986107902777491497>`,
    run: async (client, interaction, options) => {
        try {
        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");interaction.reply({embeds: [embed],ephemeral: true})}
        const user = interaction.options.getUser("使用者") ? interaction.options.getUser("使用者") : interaction.user

        warndb.findOne({
            guild: interaction.guild.id, 
            user: user.id
        }, async (err, data) => {
            if (err) throw err
            if (data) {
                const e = data.content.map(
                    (w, i) => `\n${i + 1} \`\`\`- 警告者: ${interaction.guild.members.cache.get(w.moderator).user.tag}\n- 原因: ${w.reason}\n- 時間: ${w.time}\`\`\``
                )
                const embed = new MessageEmbed()
                    .setTitle(`以下是${interaction.user.username}的警告紀錄`)
                    .setDescription(e.join(' '))
                    .setColor("RANDOM")
                interaction.reply({
                    embeds: [embed]
                })
            } else {
                errors("這位使用者沒有任何警告!")
            }
        })


    } catch (error) {
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
        return interaction.reply({
            embeds:[new MessageEmbed()
            .setTitle("<a:error:980086028113182730> | 很抱歉，出現了錯誤!")
            .setDescription("**如果可以的話再麻煩幫我到支援伺服器回報w**" + `\n\`\`\`${error}\`\`\`\n常見錯誤:\n\`Missing Access\`:**沒有權限**\n\`Missing Permissions\`:**沒有權限**`)
            .setColor("RED")
            ],
            components:[row]
        })
    }
    }
}