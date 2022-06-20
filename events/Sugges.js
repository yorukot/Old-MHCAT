const {
    MessageActionRow,
    MessageButton,
    Interaction,
    Permissions,
    DiscordAPIError,
    discord,
    MessageEmbed
} = require('discord.js');
const client = require('../index')
client.on("messageCreate", async (message) => {
    if (message.channel.id === '984103578543198228') {
        message.delete();
    }
    if (message.channel.id !== '977249272204521532') {
        return
    }

    function errors(content) {
        const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");
        message.reply({
            embeds: [embed]
        })
    }
    if (message.author.bot === true) return;
    const long = message.content

    function len(str) {
        return str.replace(/[^\x00-\xff]/g, "xx").length;
    }
    if (len(long) < 5) return message.delete()
    message.delete()
    if (message.channel.id === '977249272204521532') {
        const embed = new MessageEmbed()
            .setTitle(`BUG`)
            .setDescription(`${long}`)
            .setColor(message.guild.me.displayHexColor)
            .setFooter(
                `來自${message.author.tag}的回報`,
                message.author.displayAvatarURL({
                    dynamic: true
                })
            );
        message.channel.send({
            embeds: [embed]
        })
    }
})