const text_xp_channel = require('../../models/text_xp_channel.js');
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
module.exports = {
    name: '聊天經驗刪除',
    description: '刪除聊天經驗發送訊息設置',
    //video: 'https://mhcat.xyz/commands/announcement.html',
    UserPerms: '訊息管理',
    emoji: `<:delete:985944877663678505>`,
    run: async (client, interaction, options) => {
        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");interaction.reply({embeds: [embed]})}
        if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES))return errors("你沒有權限使用這個指令")
        text_xp_channel.findOne({
            guild: interaction.channel.guild.id,
        }, async (err, data) => {
            if(data){
                data.delete();
                const announcement_set_embed = new MessageEmbed()
                .setTitle("聊天經驗系統")
                .setDescription(`成功刪除!`)
                .setColor("GREEN")
                interaction.reply({embeds: [announcement_set_embed]})
            }else{
                errors("你本來就沒有對聊天經驗設定喔!")
            }
        })
        
    }
}