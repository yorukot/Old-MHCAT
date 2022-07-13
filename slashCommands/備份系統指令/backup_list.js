const join_message = require("../../models/join_message.js")
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
    Permissions
 } = require('discord.js');
 const backup = require("discord-backup");
module.exports = {
    name: '備份列表',
    description: '將現在的頻道備份',
    //video: 'https://mhcat.xyz/docs/join_message',
    UserPerms: '管理者',
    emoji: `<:list:992002476360343602>`,

    run: async (client, interaction, options) => {
        try {
        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");interaction.reply({embeds: [embed],ephemeral: true})}
        if(!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR))return errors("你必須擁有\`管理者\`才能使用")
        var fs = require('fs');
        const dir1111 = process.cwd()
        var dir = dir1111+"/backups"+`/${interaction.guild.id}`;
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        backup.setStorageFolder(dir);
        backup.list().then((backups) => {
            interaction.reply({embeds: [
                new MessageEmbed()
                .setTitle(`<:list:992002476360343602> 以下是${interaction.guild.name}的所有備份id`)
                .setDescription(`輸入\`/備份查詢 備份id\`可進行查看詳細資訊\`\n${backups.join("\n")}\``)
                .setColor("RANDOM")
            ]})
        });
        

    } catch (error) {
        const error_send= require('../../functions/error_send.js')
        error_send(error, interaction)
    }
    }
}