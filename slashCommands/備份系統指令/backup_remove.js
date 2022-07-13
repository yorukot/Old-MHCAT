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
    name: '備份刪除',
    description: '將之前的備份刪除',
    options: [{
        name: '備份id',
        type: 'STRING',
        description: '設定抽獎要在甚麼時候結束(ex:2022060823 (2022年6月8號23點))',
        required: true,
    }],
    //video: 'https://mhcat.xyz/docs/join_message',
    UserPerms: "服主",
    emoji: `<:delete:985944877663678505>`,
    run: async (client, interaction, options) => {
        try{

        await interaction.deferReply().catch(e => { });
        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");interaction.followUp({embeds: [embed],ephemeral: true})}
        if(!interaction.member.id === interaction.guild.ownerId)return errors("你必須擁有\`服主\`才能使用")
        const backup_id = interaction.options.getString("備份id")
        var fs = require('fs');
        const dir1111 = process.cwd()
        var dir = dir1111+"/backups"+`/${interaction.guild.id}`;
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        backup.setStorageFolder(dir);
        backup.remove(backup_id).then(async () => {
            interaction.followUp({embeds: [
                new MessageEmbed()
                .setTitle(`<a:greentick:980496858445135893> | 成功刪除!`)
                .setColor("GREEN")
            ]})
        }).catch((err) => {
            return errors("找不到這個id，請使用\`/備份列表\`")
        })


    } catch (error) {
        const error_send= require('../../functions/error_send.js')
        error_send(error, interaction)
    }
    }
}