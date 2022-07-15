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
    name: '語音包廂設置',
    description: '設定語音包廂',
    options: [{
        name: '語音頻道',
        type: 'CHANNEL',
        channel_types: [2,13],
        description: '設定哪個頻道加入後會開啟語音包廂',
        required: true,
    },{
        name: '設定頻道名稱',
        type: 'STRING',
        description: '設定開啟的語音包廂要叫做甚麼',
        required: true,
    },{
        name: '設定人數上限',
        type: 'INTEGER',
        description: '設定頻道人數上限(如果不填，即為無上限)',
        required: false,
    },],
    //video: 'https://mhcat.xyz/commands/announcement.html',
    UserPerms: '訊息管理',
    emoji: `<:mapsandflags:985949507114131587>`,
    run: async (client, interaction, options, perms) => {
        try {
        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");interaction.reply({embeds: [embed],ephemeral: true})}
        if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES))return errors(`你需要有\`${perms}\`才能使用此指令`)
        const limit1 = interaction.options.getInteger("設定人數上限")
        const channel1 = interaction.options.getChannel("語音頻道")
        const channel = channel1.id
        const channel_name = interaction.options.getString("設定頻道名稱")
        if(limit1 && (Number(limit1) > 99 || Number(limit1 <1)))return errors("必須為1-99的整數!", "參數錯誤")
        const limit = limit1 ? limit1 : 0
        const perant = channel1.parentId === null ? null : channel1.parentId
            voice_channel.findOne({
                guild: interaction.guild.id,
                ticket_channel: channel
            }, async (err, data) => {
                if(!data){
                    data = new voice_channel({
                        guild: interaction.guild.id,
                        ticket_channel: channel,
                        limit: limit,
                        name: channel_name,
                        parent: perant
                    })
                    data.save()
                    const embed = new MessageEmbed()
            .setTitle("成功進行設定")
            .setColor("GREEN")
            .setDescription("你成功對語音包廂進行 設定")
            interaction.reply({
                embeds: [embed],
            });
                }else{
                    voice_channel.findOne({
                        guild: interaction.guild.id,
                        parent: perant
                    }, async (err, data) => {
                        if(data.ticket_channel !== channel){
                        const error_embed = new MessageEmbed()
                        .setTitle("錯誤")
                        .setColor("RED")
                        .setDescription("一個類別只能有一個語音包廂\n如果需要可以把舊的設定刪除\n使用\`<>語音包廂刪除 [類別id]\`")
                        return message.channel.send({
                            embeds: [error_embed],
                        });
                        }
                    })
                    data.collection.update(({guild: interaction.channel.guild.id,ticket_channel: channel}), {$set: {limit: limit}})
                    data.collection.update(({guild: interaction.channel.guild.id,ticket_channel: channel}), {$set: {name: channel_name}})
                    data.collection.update(({guild: interaction.channel.guild.id,ticket_channel: channel}), {$set: {parent: perant}})
                    data.save()
                    const embed = new MessageEmbed()
                    .setTitle("成功進行設定")
                    .setColor("GREEN")
                    .setDescription("你成功對語音包廂進行 編輯")
                    interaction.reply({
                        embeds: [embed],
                    });
                }
            })


        } catch (error) {
            const error_send= require('../../functions/error_send.js')
            error_send(error, interaction)
        }
    }
}