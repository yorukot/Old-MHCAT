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
    ChannelType,
    PermissionsBitField
} = require('discord.js');
const moment = require('moment')
const client = require('../index')
const config = require("../config.json");
const {
    intersection
} = require('lodash');
const ticket_js = require("../models/ticket")
client.on("interactionCreate", async (interaction) => {
    if (interaction.isButton()) {
        if (interaction.customId === 'tic') {
            const name = interaction.user.id
            if (!interaction.guild.channels.cache.find(channel => channel.name === name)) {
                let channelName = name;
                try {
                    ticket_js.findOne({
                        guild: interaction.guild.id,
                    }, async (err, data) => {
                        if (!data) {
                            const data_delete = await interaction.reply(":x: 這個創建私人頻道的設置已經被刪除了喔，請麻煩管理員重新創建!")
                            interaction.message.delete()
                            setTimeout(() => {
                                data_delete.delete()
                            }, 3000);
                            return
                        }
                        interaction.guild.channels.create({
                            name: channelName,
                            type: ChannelType.GuildText,
                            parent: data.ticket_channel,
                            permissionOverwrites: [{
                                id: data.admin_id,
                                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory], //Allow permissions
                                deny: [PermissionsBitField.Flags.CreateInstantInvite]
                            }, {
                                id: interaction.guild.roles.everyone.id,
                                deny: [PermissionsBitField.Flags.ViewChannel]
                            }, {
                                id: interaction.user.id,
                                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory], //Allow permissions
                                deny: [PermissionsBitField.Flags.CreateInstantInvite]
                            }, {
                                id: interaction.guild.members.me.id,
                                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory], //Allow permissions
                                deny: [PermissionsBitField.Flags.CreateInstantInvite]
                            }]
                        }).then(channel => {
                            channel.send({
                                content: "||@everyone||",
                                embeds: [welcome],
                                components: [del]
                            })
                            let a = new EmbedBuilder()
                                .setTitle("__**頻道**__")
                                .setColor("#00DB00")
                                .setDescription(":white_check_mark: 你成功開啟了頻道!")
                            interaction.reply({
                                embeds: [a],
                                ephemeral: true
                            })
                        })
                    })
                } catch (e) {
                    console.log(e)
                    return false
                }
                const del = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId('del')
                        .setLabel('🗑️ 刪除!')
                        .setStyle(ButtonStyle.Danger),
                    );
                const welcome = new EmbedBuilder()
                    .setColor("Green")
                    .setTitle("__**私人頻道**__")
                    .setDescription("你開啟了一個私人頻道，請等待客服人員的回復!")
            } else {
                const warn = new EmbedBuilder()
                    .setColor("Red")
                    .setTitle("__**客服頻道**__")
                    .setDescription(":warning: 你已經有一個客服頻道了!")
                interaction.reply({
                    embeds: [warn],
                    ephemeral: true
                })
            }
        }
    }
})