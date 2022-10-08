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
    PermissionsBitField
} = require('discord.js');
const moment = require('moment')
const client = require('../index')
const config = require("../config.json");
const {
    intersection
} = require('lodash');
client.on("interactionCreate", async (interaction) => {
    if (interaction.isButton()) {
        if (interaction.customId === 'del') {
            interaction.channel.messages.fetch({
                limit: 2
            }).then(messages => {
                let msg = messages.last()
                let msg1 = messages.first()
                if (interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages) || msg.author.id === "null" && !(msg.embeds[0].description.includes("此頻道已被使用，請要求管理員幫您刪除!") || msg1.embeds[0].description.includes("此頻道已被使用，請要求管理員幫您刪除!"))) {
                    interaction.channel.delete()
                } else {
                    const warn = new EmbedBuilder()
                        .setColor("Red")
                        .setTitle("__**私人頻道**__")
                        .setDescription("你開啟了一個私人頻道，請靜候客服人員的回復!")
                    interaction.reply({
                        embeds: [warn]
                    })
                }
            })
        }
    }
}) // you can put this code even in index.js to make it neat i put it in a event folder