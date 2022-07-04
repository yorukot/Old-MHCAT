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
        const lodding = new MessageEmbed().setTitle("<a:load:986319593444352071> | 我正在玩命幫你備份(根據伺服器大小約需要1-60秒)!").setColor("GREEN")
                const lodding_msg = await interaction.followUp({
                    embeds: [lodding]
                })
        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");lodding_msg.edit({embeds: [embed],ephemeral: true})}
        if(!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR))return errors("你必須擁有\`管理者\`才能使用")
        if(!interaction.guild.me.permissions.has(Permissions.FLAGS.ADMINISTRATOR))return errors("我沒有\`管理者\`權限，請給我`管理者`權限!!!")
        console.log(interaction.guild.me.permissions)
        var fs = require('fs');
        var dir = __dirname+"/backups/"+`${interaction.guild.id}`;
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        backup.setStorageFolder(__dirname+"/backups/"+`${interaction.guild.id}`);
        backup.list().then((backups) => {
            if(backups.length >= 2)return errors("最高只能記錄\`2\`次備份!請使用\`/備份刪除 備份id:\`")
            backup.create(interaction.guild, {
                maxMessagesPerChannel: 10,
                jsonBeautify: true,
                saveImages: "base64"
            }).then((backupData) => {
                lodding_msg.edit({embeds: [
                    new MessageEmbed()
                    .setTitle(`<a:greentick:980496858445135893> | 成功備份，你的備份id為\`${backupData.id}\`使用\`/加載備份 id:${backupData.id}\`進行還原`)
                    .setColor("GREEN")
                ]});
                interaction.member.send({embeds: [
                    new MessageEmbed()
                    .setTitle(`<a:greentick:980496858445135893> | 成功備份，你的備份id為\`${backupData.id}\`使用\`/加載備份 id:${backupData.id}\`進行還原`)
                    .setColor("GREEN")
                ]});
            });
        });
    }
}