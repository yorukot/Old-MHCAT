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
    name: '聊天經驗設定',
    description: '設定聊天經驗通知要在哪發送',
    options: [{
        name: '訊息頻道通知',
        type: 'BOOLEAN',
        description: '是否在升級當下的那個訊息所在頻道通知true代表是false代表否!',
        required: true
    },{
        name: '頻道',
        type: 'CHANNEL',
        description: '輸入頻道!',
        required: false
    }],
    //video: 'https://mhcat.xyz/commands/announcement.html',
    UserPerms: '訊息管理',
    emoji: `<:configuration:984010500608249886>`,
    run: async (client, interaction, options) => {
        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");interaction.reply({embeds: [embed]})}
        if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES))return errors("你沒有權限使用這個指令")
        const tf = interaction.options.getBoolean("訊息頻道通知")
        const channel = interaction.options.getChannel("頻道")
        if(tf === true && channel) {
            return  errors("你已經設定要在訊息頻道通知，沒辦法再設定`頻道`")
        }if(tf === false && !channel){
            return errors("由於你填要在特定頻道發送，因此你必須設定要在哪個頻道發送通知")
        }if(channel && channel.type !== "GUILD_TEXT") return errors("你必須輸入文字頻道")
        const onc = tf === true ? "ONCHANEL" : channel.id
        text_xp_channel.findOne({
            guild: interaction.channel.guild.id,
        }, async (err, data) => {
            if(data){
                data.collection.update(({guild: interaction.channel.guild.id}), {$set: {channel: onc}})
                const announcement_set_embed = new MessageEmbed()
                .setTitle("聊天經驗系統")
                .setDescription(`您的聊天經驗驗升等頻道成功更新\n您目前的升等通知頻道為 <#${channel}>`)
                .setColor("GREEN")
                interaction.reply({embeds: [announcement_set_embed]})
            }else{
                data = new text_xp_channel({
                    guild: interaction.channel.guild.id,
                    channel: channel,
                })
                data.save()
                const announcement_set_embed = new MessageEmbed()
                .setTitle("聊天經驗系統")
                .setDescription(`您的聊天經驗升等頻道成功創建\n您目前的升等通知頻道為 <#${onc}>`)
                .setColor("GREEN")
                interaction.reply({embeds: [announcement_set_embed]})
            }
        })
        
    }
}