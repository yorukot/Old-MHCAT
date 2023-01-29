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
    name: 'user-info',
    cooldown: 10,
    description: '查看使用者的資料',
    options: [{
        name: '使用者',
        type: ApplicationCommandOptionType.User,
        description: '要查詢的使用者',
        required: true,
    }],
    //video: 'https://mhcat.xyz/commands/announcement.html',
    emoji: `<:info:985946738403737620>`,
    run: async (client, interaction, options, perms) => {
        try {
        function errors(content){const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red");interaction.reply({embeds: [embed],ephemeral: true})}
        const user = interaction.options.getUser("使用者")
        const member = interaction.guild.members.cache.get(user.id)
        const embed = new EmbedBuilder()
        .setTitle(`<:info:985946738403737620> 以下是${user.username}的資料`)
        .setColor("Random")
        .setThumbnail(member.displayAvatarURL({dynamic: true}))
        .setFields(
            {name: "<:page:992009288232996945> **創建時間:**", value: `<t:${Math.round(user.createdTimestamp / 1000)}>`},
            {name: "<:joins:956444030487642112> **加入時間:**", value: `<t:${Math.round(member.joinedTimestamp / 1000)}>`}
        )
        interaction.reply({embeds:[embed]})

} catch (error) {
    const error_send= require('../../functions/error_send.js')
    error_send(error, interaction)
}
}}