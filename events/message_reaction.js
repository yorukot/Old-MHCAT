const message_reaction = require("../models/message_reaction.js");
const {
    MessageActionRow,
    MessageButton,
    Interaction,
    Permissions,
    DiscordAPIError,
    discord,
    Discord,
    Modal,
} = require('discord.js');
const {
    MessageEmbed
} = require('discord.js');
const client = require('../index');

client.on("messageReactionAdd", async (reaction, user) => {
    function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");user.send({embeds: [embed],ephemeral: true})}
    message_reaction.findOne({
        guild: reaction.message.guild.id,
        message: reaction.message.id,
        react: reaction.emoji.id === null? reaction.emoji.name : `<:${reaction.emoji.name}:${reaction.emoji.id}>`,
    }, async (err, data) => {
        if (err) throw err; 
        if (!data) {
        return
        } else {
        const role = reaction.message.guild.roles.cache.get(data.role)
        if(!role || Number(role.position) >= Number(reaction.message.guild.me.roles.highest.position))return errors("我沒有權限給大家這個身分組或是身分組被刪除了(請把我的身分組調高)!")
        const member = reaction.message.guild.members.cache.get(user.id)
        member.roles.add(role)
        const warn = new MessageEmbed()
        .setColor("GREEN")
        .setTitle(`✅成功增加\`${role.name}\`!`)
        user.send({embeds: [warn]})
        }
    })
})
client.on("messageReactionRemove", async (reaction, user) => {
    function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");user.send({embeds: [embed],ephemeral: true})}
    message_reaction.findOne({
        guild: reaction.message.guild.id,
        message: reaction.message.id,
        react: reaction.emoji.id === null? reaction.emoji.name : `<:${reaction.emoji.name}:${reaction.emoji.id}>`,
    }, async (err, data) => {
        if (err) throw err; 
        if (!data) {
        return
        } else {
            const role = reaction.message.guild.roles.cache.get(data.role)
            if(!role || Number(role.position) >= Number(reaction.message.guild.me.roles.highest.position))return errors("我沒有權限給大家這個身分組或是身分組被刪除了(請把我的身分組調高)!")
            const member = reaction.message.guild.members.cache.get(user.id)
            member.roles.remove(role)
            const warn = new MessageEmbed()
            .setColor("GREEN")
            .setTitle(`✅成功刪除\`${role.name}\`!`)
            user.send({embeds: [warn]})
        }
    })
})