const {
    Client,
    Message,
    MessageEmbed,
    MessageActionRow,
    MessageButton

} = require('discord.js');
const guild = require('../../models/guild.js');
var validateColor = require("validate-color").default;
module.exports = {
    name: 'test',
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async (client, message, args, Discord, interaction) => {
        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");message.reply({embeds: [embed],ephemeral: true})}
        errors("a")
}}