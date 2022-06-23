const voice_xp_channel = require('../../models/voice_xp_channel.js');
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
    name: '語音經驗設定',
    description: '設定語音經驗通知要在哪發送',
    options: [{
        name: '頻道',
        type: 'CHANNEL',
        description: '輸入頻道!',
        channel_types: [0,5],
        required: true
    },{
        name: '顏色',
        type: 'STRING',
        description: '輸入要甚麼顏色(默認為白色)!',
        channel_types: [0,5],
        required: false
    },{
        name: '背景',
        type: 'STRING',
        description: '輸入背景(默認為discord色)支援png和jpg(可使用discord的複製連結)最佳大小為931*231',
        channel_types: [0,5],
        required: false
    }],
    //video: 'https://mhcat.xyz/commands/announcement.html',
    UserPerms: '訊息管理',
    emoji: `<:configuration:984010500608249886>`,
    run: async (client, interaction, options) => {
        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");interaction.reply({embeds: [embed]})}
        if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES))return errors("你沒有權限使用這個指令")
        const channel1 = interaction.options.getChannel("頻道")
        const color = interaction.options.getString("顏色")
        const image = interaction.options.getString("背景")
        if(color){
            if (!validateColor(color)) return errors('你傳送的並不是顏色(色碼)')
        }
        if(image){
            if (!validateColor(image)){
                if(!checkURL(image)){
                    return errors('你傳送的並不是顏色或png或jpg連結')
                }
            }
        }
        
        const channel = channel1.id
        voice_xp_channel.findOne({
            guild: interaction.channel.guild.id,
        }, async (err, data) => {
            if(data){
                data.update(({guild: interaction.channel.guild.id}), {$set: {channel: channel}})
                data.update(({guild: interaction.channel.guild.id}), {$set: {background: image}})
                data.update(({guild: interaction.channel.guild.id}), {$set: {color: color}})
                const announcement_set_embed = new MessageEmbed()
                .setTitle("語音經驗系統")
                .setDescription(`您的語音經驗升等頻道成功更新\n您目前的升等通知頻道為 ${channel1}`)
                .setColor("GREEN")
                interaction.reply({embeds: [announcement_set_embed]})
            }else{
                data = new voice_xp_channel({
                    guild: interaction.channel.guild.id,
                    channel: channel,
                    background: image ? image : null,
                    color: color ? color : null
                })
                data.save()
                const announcement_set_embed = new MessageEmbed()
                .setTitle("語音經驗系統")
                .setDescription(`您的語音經驗升等頻道成功創建\n您目前的升等通知頻道為 ${channel1}`)
                .setColor("GREEN")
                interaction.reply({embeds: [announcement_set_embed]})
            }
        })
    }
}