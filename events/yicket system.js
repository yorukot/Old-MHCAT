const {
    MessageActionRow,
    MessageButton,
    Interaction,
    Permissions,
    DiscordAPIError,
    discord
} = require('discord.js');
const {
    MessageEmbed
} = require('discord.js')
const moment = require('moment')
const client = require('../index')
const config = require("../config.json");
const { intersection } = require('lodash');
client.on("interactionCreate", async (interaction) => {
    if (interaction.isButton()) {
        if (interaction.customId === 'del') {
            interaction.channel.messages.fetch({ limit: 2 }).then(messages => {
                let msg = messages.last()
                let msg1 = messages.first()
            if(interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES) || msg.author.id === "null" && !(msg.embeds[0].description.includes("此頻道已被使用，請要求管理員幫您刪除!") || msg1.embeds[0].description.includes("此頻道已被使用，請要求管理員幫您刪除!"))){
                
                interaction.channel.delete()
            }else{
                const warn = new MessageEmbed()
                .setColor("RED")
                .setTitle("__**客服頻道**__")
                .setDescription(":warning: 此頻道已被使用，請要求管理員幫您刪除!")
                interaction.reply({embeds: [warn] })
            }
    }
    )}}
}) // you can put this code even in index.js to make it neat i put it in a event folder