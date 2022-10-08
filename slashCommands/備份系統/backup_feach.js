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
    name: '備份查詢',
    cooldown: 10,
    description: '查詢某個特定的備份',
    options: [{
        name: '備份id',
        type: ApplicationCommandOptionType.String,
        description: '輸入備份id可以使用 /備份列表 進行查詢所有備份',
        required: true,
    }],
    //video: 'https://mhcat.xyz/docs/join_message',
    UserPerms: '管理者',
    emoji: `<:searching:986107902777491497>`,
    run: async (client, interaction, options, perms) => {
        try{
        function errors(content){const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red");interaction.reply({embeds: [embed],ephemeral: true})}
        function naaaaa(content){const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red");interaction.channel.send({embeds: [embed],ephemeral: true})}
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))return errors(`你需要有\`${perms}\`才能使用此指令`)
        var fs = require('fs');
        const dir1111 = process.cwd()
        var dir = dir1111+"/backups"+`/${interaction.guild.id}`;
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        backup.setStorageFolder(dir);
        const backup_id = interaction.options.getString("備份id")
        backup.fetch(backup_id).then((backupInfos) => {
            const date = new Date(backupInfos.data.createdTimestamp);
            const yyyy = date.getFullYear().toString(), mm = (date.getMonth()+1).toString(), dd = date.getDate().toString();
            const formatedDate = `${yyyy}/${(mm[1]?mm:"0"+mm[0])}/${(dd[1]?dd:"0"+dd[0])}`;
            let embed = new EmbedBuilder()
                .setTitle("<:info:985946738403737620> 備份資訊")
                .addFields([
                    {name: `<:id:992009480063692801> 備份id`, value: backupInfos.id, inline: true},
                    {name: `<:server:986064124209418251> 伺服器id`, value: backupInfos.data.guildID, inline: true},
                    {name: `<:paper:992009289923313755> 該備份大小`, value: `${backupInfos.size} kb`, inline: true},
                    {name: `<:page:992009288232996945> 創建於`, value: formatedDate, inline: true},
                ])
                .setColor("Random");
            interaction.reply({embeds:[embed]})
        }).catch((err) => {
            return errors("找不到這個備份，請使用\`/備份列表\`進行查看")
        });

    } catch (error) {
        const error_send= require('../../functions/error_send.js')
        error_send(error, interaction)
    }
    }
}