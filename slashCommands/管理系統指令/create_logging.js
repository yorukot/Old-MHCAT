const text_xp = require("../../models/text_xp.js");
const canvacord = require("canvacord")
const logging = require('../../models/logging.js');
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
module.exports = {
    name: '設置日誌頻道',
    description: '設置日誌訊息要在哪發送',
    options: [{
        name: '頻道',
        type: 'CHANNEL',
        channel_types: [0,5],
        description: '輸入日誌頻道!',
        required: true,
    }],
    //video: 'https://mhcat.xyz/commands/announcement.html',
    UserPerms: '訊息管理',
    emoji: `<:logfile:985948561625710663>`,
    run: async (client, interaction, options) => {
        try {
        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");interaction.reply({embeds: [embed],ephemeral: true})}
        if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES))return errors("你沒有權限使用這個指令")
        const channel = interaction.options.getChannel("頻道")
        const channel_id = channel.id
        logging.findOne({
            guild: interaction.channel.guild.id,
        }, async (err, data) => {
            if(data){
                // 度資料庫的內容進行更新
                data.collection.update(({guild: interaction.channel.guild.id}), {$set: {channel_id: channel_id}})
                data.save()
                // 設定embed & send embed
                const announcement_set_embed = new MessageEmbed()
                .setTitle("公告系統")
                .setDescription(`您的公告頻道成功更新\n您目前的公告頻道為 ${channel}`)
                .setColor("GREEN")
                interaction.reply({embeds: [announcement_set_embed]})
            }else{
                // 創建一個新的data
                data = new logging({
                    guild: interaction.channel.guild.id,
                    channel_id: channel_id,
                })
                data.save()
                // 設定embed & send embed
                const announcement_set_embed = new MessageEmbed()
                .setTitle("公告系統")
                .setDescription(`您的公告頻道成功更新\n您目前的公告頻道為 ${channel}`)
                .setColor("GREEN")
                interaction.reply({embeds: [announcement_set_embed]})
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