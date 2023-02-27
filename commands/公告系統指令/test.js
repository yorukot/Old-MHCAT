const {
    Client,
    Message,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder

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
        function errors(content) {
            const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("RED");
            message.reply({
                embeds: [embed],
                ephemeral: true
            })
        }
        errors("a")
    }
}