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
    }
}