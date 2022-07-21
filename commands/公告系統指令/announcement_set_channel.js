const {
    Client,
    Message,
    MessageEmbed,
    MessageActionRow,
    MessageButton

} = require('discord.js');
const guild = require('../../models/guild.js');
module.exports = {
    name: '公告頻道設置',
    aliases: ['acs'],
    description: '設置公告頻道',
    video: 'https://mhcat.xyz/commands/announcement.html',
    usage: '[公告頻道id]',
    UserPerms: 'MANAGE_MESSAGES',
    emoji: `<:set:980100778771513364>`,
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async (client, message, args, Discord, interaction) => {
        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");message.reply({embeds: [embed]})}
        // 頻道id內容索取
        const channel = args[0]
        if (!channel) return errors("你必須給一個頻道id!!")
        // 判斷頻道是不是存在
        const channel_empty = message.guild.channels.cache.get(channel)
        if(!channel_empty) return errors("你給的並不是一個頻道!")
        //對資料庫進行更改
        guild.findOne({
            guild: message.channel.guild.id,
        }, async (err, data) => {
            if(data){
                // 度資料庫的內容進行更新
                data.collection.updateOne(({guild: message.channel.guild.id}), {$set: {announcement_id: channel}})
                data.save()
                // 設定embed & send embed
                const announcement_set_embed = new MessageEmbed()
                .setTitle("公告系統")
                .setDescription(`您的公告頻道成功更新\n您目前的公告頻道為 <#${channel}>`)
                .setColor("GREEN")
                message.channel.send({embeds: [announcement_set_embed]})
            }else{
                // 創建一個新的data
                data = new guild({
                    guild: message.channel.guild.id,
                    announcement_id: channel,
                })
                data.save()
                // 設定embed & send embed
                const announcement_set_embed = new MessageEmbed()
                .setTitle("公告系統")
                .setDescription(`您的公告頻道成功更新\n您目前的公告頻道為 <#${channel}>`)
                .setColor("GREEN")
                message.channel.send({embeds: [announcement_set_embed]})
            }
        })
}}