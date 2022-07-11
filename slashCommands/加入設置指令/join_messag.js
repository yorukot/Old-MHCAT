const join_message = require("../../models/join_message.js")
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
    name: '加入訊息設置',
    description: '設定玩家加入時發送甚麼訊息',
    options: [{
        name: '頻道',
        type: 'CHANNEL',
        description: '輸入加入訊息要在那發送!',
        channel_types: [0,5],
        required: true,
    }],
    video: 'https://mhcat.xyz/docs/join_message',
    UserPerms: '訊息管理',
    emoji: `<:comments:985944111725019246>`,

    run: async (client, interaction, options) => {
        try {



        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");interaction.reply({embeds: [embed],ephemeral: true})}
        if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES))return errors("你沒有權限使用這個指令")
        const channel = interaction.options.getChannel("頻道")
        const channel_id = channel.id
        join_message.findOne({
            guild: interaction.guild.id,
        }, async (err, data) => {
            if(!data){
                data = new join_message({
                    guild: interaction.guild.id,
                    message_content: null,
                    color: null,
                    channel: channel_id,
                })
                data.save()
            }else{
                data.collection.update(({guild: interaction.channel.guild.id}), {$set: {channel: channel_id}})
            }
            const modal = new Modal()
        .setCustomId("nal")
        .setTitle('加入訊息設置!');
        const color = new TextInputComponent()
        .setCustomId('join_msgcolor')
        .setLabel("請輸入你的加入訊息要甚麼顏色(要隨機顏色可輸入:RANDOM)")
        .setStyle('SHORT')
        .setRequired(true)
        .setValue(data ? data.color !== null ? data.color : '' : '')
        const content = new TextInputComponent()
        .setCustomId('join_msgcontent')
        .setLabel("請輸入訊息內文(如要顯示用戶名可輸入: (membername) )")
        .setStyle('PARAGRAPH')
        .setRequired(true)
        .setValue(data ? data.message_content !== null ? data.message_content : '' : '')
        const color1 = new MessageActionRow().addComponents(color);
        const content1 = new MessageActionRow().addComponents(content);
        modal.addComponents(color1,content1);
        await interaction.showModal(modal);
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