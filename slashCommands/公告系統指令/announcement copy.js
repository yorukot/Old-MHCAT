const text_xp = require("../../models/text_xp.js");
const canvacord = require("canvacord")
const guild = require('../../models/guild.js');
const { PermissionFlagsBits } = require('discord-api-types/v9');
const { 
    MessageActionRow,
    MessageSelectMenu,
    MessageButton,
    MessageEmbed,
    Collector,
    Discord,
    MessageAttachment,
    Modal,
    TextInputComponent,
    Permissions,
 } = require('discord.js');
module.exports = {
    name: '公告發送',
    description: '發送公告訊息',
    video: 'https://mhcat.xyz/docs/ann',
    UserPerms: '訊息管理',
    emoji: `<:megaphone:985943890148327454>`,
    run: async (client, interaction, options, perms) => {
        try {

        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");interaction.reply({embeds: [embed],ephemeral: true})}
        if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES))return errors(`你需要有\`${perms}\`才能使用此指令`)
        const modal = new Modal()
        .setCustomId("nal")
        .setTitle('公告系統!');
        const tag = new TextInputComponent()
        .setCustomId("anntag")
        .setLabel("請輸入你要tag誰")
        .setRequired(true)
        .setStyle('SHORT');
        const color = new TextInputComponent()
        .setCustomId('anncolor')
        .setLabel("請輸入你的公告要甚麼顏色")
        .setRequired(true)
        .setStyle('SHORT');
        const title = new TextInputComponent()
        .setCustomId('anntitle')
        .setLabel("請輸入你的公告標題")
        .setRequired(true)
        .setStyle('SHORT');
        const content = new TextInputComponent()
        .setCustomId('anncontent')
        .setLabel("請輸入公告內文")
        .setRequired(true)
        .setStyle('PARAGRAPH');
        const firstActionRow = new MessageActionRow().addComponents(tag);
        const color1 = new MessageActionRow().addComponents(color);
        const title1 = new MessageActionRow().addComponents(title);
        const content1 = new MessageActionRow().addComponents(content);
        modal.addComponents(firstActionRow,color1,title1,content1);
        await interaction.showModal(modal);




    } catch (error) {
        const error_send= require('../../functions/error_send.js')
        error_send(error, interaction)
    }
    }
}