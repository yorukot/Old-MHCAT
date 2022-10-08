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
    if(message.channel.type === ChannelType.DM) return 
    const ann_all_set = require('../models/ann_all_set.js');
    if (message.author.bot) return;
    ann_all_set.findOne({
        guild: message.guild.id,
        announcement_id: message.channel.id
    }, async (err, data) => {
        if (!data) return
        const announcement_set_embed = new EmbedBuilder()
            .setTitle(data.title)
            .setDescription(message.content)
            .setColor(data.color === 'RANDOM' ? 'Random' : data.color)
            .setFooter({
                text: `來自${message.author.tag}的公告`,
                iconURL: message.author.displayAvatarURL({
                    dynamic: true
                })
            });
<<<<<<< HEAD
=======
        message.delete()
>>>>>>> a0da53e (🌟 | 更新各種東西)
        message.channel.send({
            content: `${data.tag}`,
            embeds: [announcement_set_embed]
        })
    })
})