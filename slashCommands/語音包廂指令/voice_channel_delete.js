const text_xp = require("../../models/text_xp.js");
const canvacord = require("canvacord")
const join_role = require("../../models/join_role.js")
const ticket_js = require('../../models/ticket.js')
const voice_channel = require('../../models/voice_channel.js')
const moment = require('moment')
const { 
    MessageActionRow,
    MessageSelectMenu,
    MessageButton,
    MessageEmbed,
    Collector,
    Discord,
    MessageAttachment,
    Modal,
    TextInputComponent,
    Permissions
 } = require('discord.js');
 function getRandomArbitrary(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }
const { errorMonitor } = require("ws");
module.exports = {
    name: '語音包廂刪除',
    description: '刪除語音包廂設置',
    options: [{
        name: '頻道或類別',
        type: 'CHANNEL',
        description: '刪除加入某個頻道後會創建新頻道的那個`某個頻道`或是類別裡的所有設定',
        required: true,
    }],
    //video: 'https://mhcat.xyz/commands/announcement.html',
    UserPerms: '訊息管理',
    emoji: `<:delete:985944877663678505>`,
    run: async (client, interaction, options, perms) => {
        try {

        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");interaction.reply({embeds: [embed],ephemeral: true})}
        if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES))return errors(`你需要有\`${perms}\`才能使用此指令`)
        const channel1 = interaction.options.getChannel("頻道或類別")
        const parent = channel1.parentId
        const channel = channel1.id
        if(channel1.type !== "GUILD_VOICE" && channel1.type !== "GUILD_CATEGORY")return errors("必須是一個語音頻道或是類別")
            if(channel1.type === "GUILD_VOICE"){
                voice_channel.findOne({
                    guild: interaction.guild.id,
                    ticket_channel: channel
                }, async (err, data) => {
                    if(!data){
                        return errors("你沒有對這個頻道做出設定過喔!")
                    }else if(data){
                        data.delete()
                        const embed = new MessageEmbed()
                        .setTitle("成功進行刪除")
                        .setColor("GREEN")
                        .setDescription("你成功對這個設定刪除")
                        interaction.reply({
                            embeds: [embed],
                        });
                    }
                })
            }else{
                voice_channel.find({
                    guild: interaction.guild.id,
                    parent: channel
                }, async (err, data) => {
                    if(!data || data.length === 0){
                        return errors("你沒有對這個類別沒有設定喔!")
                    }else if(data){
                        for(x = data.length -1; x > -1; x--){
                            data[x].delete()
                        }
                        const embed = new MessageEmbed()
                        .setTitle("成功進行刪除")
                        .setColor("GREEN")
                        .setDescription("你成功對這個設定刪除")
                        interaction.reply({
                            embeds: [embed],
                        });
                    }
                })
            }    

        } catch (error) {
            const error_send= require('../../functions/error_send.js')
            error_send(error, interaction)
        }
    }
}