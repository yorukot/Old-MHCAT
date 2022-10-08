const client = require('../index')
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
    ChannelType
} = require('discord.js');
client.on("messageCreate", async (message) => {
    if (message.channel.type === ChannelType.DM) return
    const good_web = require('../models/good_web.js')
    if (!message.guild) return
    good_web.findOne({
        guild: message.guild.id,
    }, async (err, data) => {
        if (!data) return
        if (!data.open) return
        const aaaaaa = message.content
        const not_a_good_web = require('../models/not_a_good_web.js')
        not_a_good_web.findOne({
            web: {
                $regex: aaaaaa
            }
        }, async (err, data) => {
            if (!data) return
            if (aaaaaa.includes(data.web)) {
                message.delete()
                message.channel.send("<:trashbin:995991389043163257> | 此消息包含詐騙或釣魚連結，以自動刪除!\n")
            } else {
                return
            }
        })
    })
})