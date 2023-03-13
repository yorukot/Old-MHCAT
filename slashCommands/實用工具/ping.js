const message_reaction = require("../../models/message_reaction.js");
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
module.exports = {
    name: 'ping',
    cooldown: 10,
    description: '查看我的ping',
    //video: 'https://mhcat.xyz/commands/announcement.html',
    emoji: `<:icons_goodping:1084881470075703367>`,
    run: async (client, interaction, options, perms) => {
        try {
            console.log(interaction.createdTimestamp)
            console.log(Date.now())
            interaction.reply(`${Date.now() - interaction.createdTimestamp > 100 ? Date.now() - interaction.createdTimestamp > 200 ? "<:icons_badping:1084881519581069482>"  : "<:icons_idelping:1084881570013388860>" : "<:icons_goodping:1084881470075703367>"} **Pong!** \`${Date.now() - interaction.createdTimestamp}\``)
        } catch (error) {
            const error_send = require('../../functions/error_send.js')
            error_send(error, interaction)
        }
    }
}