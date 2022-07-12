const leave_message = require("../../models/leave_message.js")
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
const { EqualsOperation } = require("sift");
module.exports = {
    name: '退出訊息設置',
    description: '設定玩家退出時發送甚麼訊息',
    options: [{
        name: '頻道',
        type: 'CHANNEL',
        channel_types: [0,5],
        description: '輸入加入訊息要在那發送!',
        required: true,
    }],
    //video: 'https://mhcat.xyz/commands/announcement.html',
    UserPerms: '訊息管理',
    emoji: `<:comments:985944111725019246>`,

    run: async (client, interaction, options) => {
        try {
        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");interaction.reply({embeds: [embed],ephemeral: true})}
        if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES))return errors("你沒有權限使用這個指令")
        const channel = interaction.options.getChannel("頻道")
        const channel_id = channel.id
        if(channel.type !== 'GUILD_TEXT' && channel.type !== 'GUILD_NEWS')return errors("很抱歉，你給的並不是一個**文字**頻道")
        leave_message.findOne({
            guild: interaction.guild.id,
        }, async (err, data) => {
            if(!data){
                data = new leave_message({
                    guild: interaction.guild.id,
                    message_content: null,
                    title: null,
                    color: null,
                    channel: channel_id,
                })
                data.save()
            }else{
                data.collection.update(({guild: interaction.channel.guild.id}), {$set: {channel: channel_id}})
            }
            const modal = new Modal()
            .setCustomId("nal")
            .setTitle('退出訊息設置!');
            const color = new TextInputComponent()
            .setCustomId('leave_msgcolor')
            .setLabel("請輸入你的加入訊息要甚麼顏色(要隨機顏色可輸入:RANDOM)")
            .setStyle('SHORT')
            .setRequired(true)
            .setValue(data ? data.color !== null ? data.color : '' : '')
            const title1 = new TextInputComponent()
            .setCustomId('leave_msgtitle')
            .setLabel("請輸入訊息標題")
            .setStyle('SHORT')
            .setRequired(true)
            .setValue(data ? data.title !== null? data.title : '' : '')
            const content = new TextInputComponent()
            .setCustomId('leave_msgcontent')
            .setLabel("請輸入訊息內文(如要顯示用戶名可輸入: (membername) )")
            .setStyle('PARAGRAPH')
            .setRequired(true)
            .setValue(data.message_content !== null? data.message_content : '')
            const color1 = new MessageActionRow().addComponents(color);
            const content1 = new MessageActionRow().addComponents(content);
            const title = new MessageActionRow().addComponents(title1);
            modal.addComponents(color1,title,content1,);
            await interaction.showModal(modal);
        })


    } catch (error) {
        const error_send= require('../../functions/error_send.js')
        error_send(error, interaction)
    }
    }
}