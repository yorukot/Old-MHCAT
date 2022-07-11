const chat = require('../../models/chat.js');
const canvacord = require("canvacord")
const { 
    MessageActionRow,
    MessageSelectMenu,
    MessageButton,
    MessageEmbed,
    Collector,
    Discord,
    MessageAttachment,
    Permissions
 } = require('discord.js');
 var validateColor = require("validate-color").default;
 function checkURL(image) {
    return(image.match(/\.(jpg|png)$/) != null);
}
module.exports = {
    name: '自動聊天頻道刪除',
    description: '刪除自動聊天頻道要在哪裡發送',
    video: 'https://mhcat.xyz/docs/chat_xp_set',
    UserPerms: '訊息管理',
    emoji: `<:delete:985944877663678505>`,
    run: async (client, interaction, options) => {
        try {
        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");interaction.reply({embeds: [embed]})}
        if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES))return errors("你沒有權限使用這個指令")
        console.log("ytestsetsw")
        chat.findOne({
            guild: interaction.channel.guild.id,
        }, async (err, data) => {
            if(!data) return errors("你沒有設定過，我不知道要刪除甚麼!")
                data.delete()
                const announcement_set_embed = new MessageEmbed()
                .setTitle("自動聊天系統")
                .setDescription(`您的自動聊天頻道成功刪除`)
                .setColor("GREEN")
                interaction.reply({embeds: [announcement_set_embed]})
            
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