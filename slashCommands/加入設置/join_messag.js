const join_message = require("../../models/join_message.js")
const {
    ApplicationCommandType,
    ButtonStyle,
    ApplicationCommandOptionType,
    ActionRowBuilder,
    SelectMenuBuilder,
    ButtonBuilder,
    EmbedBuilder,
    Collector,
    Discord,
    AttachmentBuilder,
    ModalBuilder,
    TextInputBuilder,
    PermissionsBitField,
    TextInputStyle
} = require('discord.js');
const {
    EqualsOperation
} = require("sift");
module.exports = {
    name: '加入訊息設置',
    cooldown: 10,
    description: '設定玩家加入時發送甚麼訊息',
    options: [{
        name: '頻道',
        type: ApplicationCommandOptionType.Channel,
        description: '輸入加入訊息要在那發送!',
        channel_types: [0, 5],
        required: true,
    }],
    video: 'https://mhcat.xyz/docs/join_message',
    UserPerms: '訊息管理',
    emoji: `<:comments:985944111725019246>`,

    run: async (client, interaction, options, perms) => {

        try {



            function errors(content) {
                const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red");
                interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                })
            }
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return errors(`你需要有\`${perms}\`才能使用此指令`)
            const channel = interaction.options.getChannel("頻道")
            const channel_id = channel.id
            join_message.findOne({
                guild: interaction.guild.id,
            }, async (err, data) => {
                if (!data) {
                    data = new join_message({
                        guild: interaction.guild.id,
                        message_content: null,
                        color: null,
                        channel: channel_id,
                        img: null
                    })
                    data.save()
                } else {
                    data.collection.updateOne(({
                        guild: interaction.channel.guild.id
                    }), {
                        $set: {
                            channel: channel_id
                        }
                    })
                }
                const modal = new ModalBuilder()
                    .setCustomId("nal")
                    .setTitle('加入訊息設置!');
                const color = new TextInputBuilder()
                    .setCustomId('join_msgcolor')
                    .setLabel("請輸入你的加入訊息要甚麼顏色(要隨機顏色可輸入:Random)")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
                    .setValue(data ? data.color !== null ? data.color : '' : '')
                const content = new TextInputBuilder()
                    .setCustomId('join_msgcontent')
                    .setLabel("訊息內文(如要顯示用戶名可輸入:(MEMBERNAME)，要tag請輸入(TAG))")
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true)
                    .setValue(data ? data.message_content !== null ? data.message_content : '(MEMBERNAME)' : '(MEMBERNAME)')
                const img = new TextInputBuilder()
                    .setCustomId('join_img')
                    .setLabel("圖片URL")
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(false)
                    .setValue(data ? data.img ? data.img !== null ? data.img : '' : '' : '')
                const color1 = new ActionRowBuilder().addComponents(color);
                const content1 = new ActionRowBuilder().addComponents(content);
                const img1 = new ActionRowBuilder().addComponents(img);
                modal.addComponents(color1, content1, img1);
                await interaction.showModal(modal);
            })

        } catch (error) {
            const error_send = require('../../functions/error_send.js')
            error_send(error, interaction)
        }
    }
}