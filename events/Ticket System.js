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
const ticket_js = require("../models/ticket")
client.on("interactionCreate", async (interaction) => {
    if (interaction.isButton()) {
        if (interaction.customId === 'tic') {
            const name = interaction.user.id
            if(!client.channels.cache.find(channel => channel.name === name)){
            let channelName = name;
            try {
                ticket_js.findOne({
                    guild: interaction.guild.id,
                }, async (err, data) => {
                if(!data) {
                     const data_delete = await interaction.reply(":x: 這個創建私人頻道的設置已經被刪除了喔，請麻煩管理員重新創建!")
                     interaction.message.delete()
                     setTimeout(() => {
                         data_delete.delete()
                     }, 3000);
                     return
                }
                interaction.guild.channels.create(channelName, {
                    type: "text",
                    parent: data.ticket_channel,
                    permissionOverwrites: [
                        {
                          id: data.admin_id,
                          allow: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.READ_MESSAGE_HISTORY], //Allow permissions
                          deny: [Permissions.FLAGS.CREATE_INSTANT_INVITE]
                        },{
                            id: interaction.guild.roles.everyone.id,
                            deny: [Permissions.FLAGS.VIEW_CHANNEL]
                        },{
                            id: interaction.user.id,
                            allow: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.READ_MESSAGE_HISTORY], //Allow permissions
                            deny: [Permissions.FLAGS.CREATE_INSTANT_INVITE]
                        },{
                            id: interaction.guild.me.id,
                            allow: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.READ_MESSAGE_HISTORY], //Allow permissions
                          deny: [Permissions.FLAGS.CREATE_INSTANT_INVITE]
                        }
                    ]
                })
            })
            } catch (e) {
            console.log(e)
                return false
            }
        const del = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    .setCustomId('del')
                    .setLabel('🗑️ 刪除!')
                    .setStyle('DANGER'),
                );
        const welcome = new MessageEmbed()
        .setTitle("私人頻道")
        .setDescription("如果是按錯請按下方的刪除\n:warning: __**注意**__:一但您進行發言，將無法自行刪除!!!")
        .setColor("#FF5809")
        setTimeout(() => {
            const channel123 = client.channels.cache.find(channel => channel.name === name);
            channel123.send({
                content: "||@everyone||",
                embeds: [welcome],
                components: [del]
            })
            let a = new MessageEmbed()
            .setTitle("__**頻道**__")
            .setColor("#00DB00")
            .setDescription(":white_check_mark: 你成功開啟了頻道!")
            interaction.reply({embeds: [a], ephemeral: true})
        }, 1000)
        }else{
            const warn = new MessageEmbed()
            .setColor("RED")
            .setTitle("__**客服頻道**__")
            .setDescription(":warning: 你已經有一個客服頻道了!")
        interaction.reply({embeds: [warn], ephemeral: true})
        }
    }
}})