const text_xp = require("../../models/text_xp.js");
const canvacord = require("canvacord")
const guild = require('../../models/guild.js');
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
    name: '公告頻道設置',
    description: '設定公告在哪發送',
    options: [{
        name: '頻道',
        type: 'CHANNEL',
        description: '輸入公告發送的頻道!',
        required: true,
        channel_types: [0,5],
    }],
    video: 'https://mhcat.xyz/docs/ann_set',
    UserPerms: '訊息管理',
    emoji: `<:configuration:984010500608249886>`,
    run: async (client, interaction, options) => {
        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");interaction.reply({embeds: [embed],ephemeral: true})}
        if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES))return errors("你沒有權限使用這個指令")
        const channel = interaction.options.getChannel("頻道")
        //對資料庫進行更改
        guild.findOne({
            guild: interaction.channel.guild.id,
        }, async (err, data) => {
            if(data){
                // 度資料庫的內容進行更新
                data.collection.update(({guild: interaction.channel.guild.id}), {$set: {announcement_id: channel.id}})
                // 設定embed & send embed
                const announcement_set_embed = new MessageEmbed()
                .setTitle("公告系統")
                .setDescription(`您的公告頻道成功更新\n您目前的公告頻道為 ${channel}`)
                .setColor("GREEN")
                interaction.reply({embeds: [announcement_set_embed]})
            }else{
                // 創建一個新的data
                data = new guild({
                    guild: interaction.channel.guild.id,
                    announcement_id: channel.id,
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