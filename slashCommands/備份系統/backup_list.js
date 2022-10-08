const join_message = require("../../models/join_message.js")
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
const backup = require("discord-backup");
module.exports = {
    name: '備份列表',
    cooldown: 10,
    description: '將現在的頻道備份',
    //video: 'https://mhcat.xyz/docs/join_message',
    UserPerms: '管理者',
    emoji: `<:list:992002476360343602>`,

    run: async (client, interaction, options, perms) => {
        try {
            function errors(content) {
                const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red");
                interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                })
            }
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return errors(`你需要有\`${perms}\`才能使用此指令`)
            var fs = require('fs');
            const dir1111 = process.cwd()
            var dir = dir1111 + "/backups" + `/${interaction.guild.id}`;
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            backup.setStorageFolder(dir);
            backup.list().then((backups) => {
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`<:list:992002476360343602> 以下是${interaction.guild.name}的所有備份id`)
                        .setDescription(`輸入\`/備份查詢 備份id\`可進行查看詳細資訊\`\n${backups.join("\n")}\``)
                        .setColor("Random")
                    ]
                })
            });


        } catch (error) {
            const error_send = require('../../functions/error_send.js')
            error_send(error, interaction)
        }
    }
}