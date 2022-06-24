const os = require('os');
const os_utils = require('os-utils');

const { 
    MessageActionRow,
    MessageSelectMenu,
    MessageButton,
    MessageEmbed,
    Collector,
    Discord,
    MessageAttachment
 } = require('discord.js');
module.exports = {
    name: 'info',
    description: '查詢機器人資訊',
    video: 'https://mhcat.xyz/docs/info',
    emoji: `<:info:985946738403737620>`,
    run: async (client, interaction, options) => {
        return
    }
}