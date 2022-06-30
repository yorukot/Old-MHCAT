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
    name: '備份設置',
    description: '將現在的頻道備份',
    //video: 'https://mhcat.xyz/docs/join_message',
    UserPerms: '管理者',
    emoji: `<:configuration:985943474786414722>`,
    run: async (client, interaction, options) => {
        await interaction.deferReply().catch(e => { });
        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");interaction.followUp({embeds: [embed],ephemeral: true})}
        if(!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR))return errors("你必須擁有\`管理者\`才能使用")
        var fs = require('fs');
        var dir = __dirname+"/backups/"+`${interaction.guild.id}`;
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        backup.setStorageFolder(__dirname+"/backups/"+`${interaction.guild.id}`);
        backup.list().then((backups) => {
            if(backups.length > 4)return errors("最高只能記錄\`4\`次備份!請使用\`/備份刪除 備份id\`")
            const lodding = new MessageEmbed().setTitle("<a:load:986319593444352071> | 我正在玩命幫你備份(根據伺服器大小約需要1-20秒)!").setColor("GREEN")
                const lodding_msg = await interaction.followUp({
                    embeds: [lodding]
                })
            backup.create(interaction.guild, {
                maxMessagesPerChannel: 200,
                jsonBeautify: true,
                saveImages: "base64"
            }).then((backupData) => {
                lodding_msg.update({embeds: [
                    new MessageEmbed()
                    .setTitle(`<a:greentick:980496858445135893> | 成功備份，你的備份id為\`${backupData.id}\`使用\`/加載備份進行還原 id:${backupData.id}\``)
                    .setColor("GREEN")
                ]});
                interaction.member.send({embeds: [
                    new MessageEmbed()
                    .setTitle(`<a:greentick:980496858445135893> | 成功備份，你的備份id為\`${backupData.id}\`使用\`/加載備份進行還原 id:${backupData.id}\``)
                    .setColor("GREEN")
                ]});
            });
        });
    }
}