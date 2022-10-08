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
    name: '備份還原',
    cooldown: 300,
    description: '將現在的伺服器還原到之前的備份',
    options: [{
        name: '備份id',
        type: ApplicationCommandOptionType.String,
        description: '設定抽獎要在甚麼時候結束(ex:2022060823 (2022年6月8號23點))',
        required: true,
    }],
    //video: 'https://mhcat.xyz/docs/join_message',
    UserPerms: '服主',
    emoji: `<:backup:992010707354783775>`,
    run: async (client, interaction, options, perms) => {
        try {
        await interaction.deferReply().catch(e => { });
        function errors(content){const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red");interaction.followUp({embeds: [embed],ephemeral: true})}
        return errors("該功能正在進行維護中，造成不便敬請見諒!")
        function naaaaa(content){const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red");interaction.channel.send({embeds: [embed],ephemeral: true})}
        if(interaction.member.id !== interaction.guild.ownerId)return errors("你必須擁有\`服主\`才能使用")
        if(!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.Administrator))return errors("我沒有\`管理者\`權限，請給我`管理者`權限!!!")
        const backup_id = interaction.options.getString("備份id")
        var fs = require('fs');
        const dir1111 = process.cwd()
        var dir = dir1111+"/backups"+`/${interaction.guild.id}`;
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        backup.setStorageFolder(dir);
        backup.fetch(backup_id).then(async () => {
           interaction.followUp({content:":warning: | 一但還原，___**將無法復原**___，如確定要還原請於60秒內輸入\`^確認^\`(只有一次機會)!!!"}
           );
           const filter = m => (m.member.id === interaction.member.id);
                const collector =  interaction.channel.createMessageCollector({
                    filter,
                    max: 1,
                    time: 60000
                })
                collector.on('collect', m => {
                    if(m.content !== "^確認^") return naaaaa("你輸入了錯誤的確認!因此視為取消還原")
                    interaction.member.send({embeds: [
                        new EmbedBuilder()
                        .setTitle(`<a:greentick:980496858445135893> | 開始進行還原!`)
                        .setColor("Green")
                    ]});
                    backup.load(backup_id, interaction.guild).then(() => {
                        interaction.member.send({embeds: [
                            new EmbedBuilder()
                            .setTitle(`<a:greentick:980496858445135893> | 成功還原!`)
                            .setColor("Green")
                        ]});
                    }).catch((err) => {
                        return naaaaa("很抱歉，我沒有足夠的權限幫你還原!請給我管理者權限")
                    });
                    });
        }).catch((err) => {
            console.log(err);
            return errors(`找不到\`${backup_id}\`請使用\`/備份列表\`查看備份id`)
        });

    } catch (error) {
        const error_send= require('../../functions/error_send.js')
        error_send(error, interaction)
    }
    }
}