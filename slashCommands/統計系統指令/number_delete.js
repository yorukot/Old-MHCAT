const Number = require("../../models/Number.js");
const {
    Client,
    Message,
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    MessageAttachment,
    Permissions

} = require('discord.js');
const canvacord = require("canvacord");
module.exports = {
    name: '統計系統刪除',
    description: '刪除統計消息',
    UserPerms: 'MANAGE_MESSAGES',
    //video: 'https://mhcat.xyz/commands/statistics.html',
    emoji: `<:delete1:986068526387314690>`,
    run: async (client, interaction, options) => {
        try {
        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");interaction.reply({embeds: [embed],ephemeral: true})}
        Number.findOne({
            guild: interaction.guild.id,
        }, async (err, data) => {
            if(data){
                data.delete()
                const embed = new MessageEmbed()
                .setTitle("<a:greentick:980496858445135893> | 成功刪除，該類別以下的頻道我已經管不了囉!(類別id:" + data.parent + ")")
                .setColor("GREEN")
                interaction.reply({embeds: [embed]})
            }else{
                return errors("你還沒有創建過統計數據，是要刪除甚麼啦!")           
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
}}