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
    name: '備份刪除',
    cooldown: 10,
    description: '將之前的備份刪除',
    options: [{
        name: '備份id',
        type: ApplicationCommandOptionType.String,
        description: '設定抽獎要在甚麼時候結束(ex:2022060823 (2022年6月8號23點))',
        required: true,
    }],
    //video: 'https://mhcat.xyz/docs/join_message',
    UserPerms: "服主",
    emoji: `<:delete:985944877663678505>`,
    run: async (client, interaction, options, perms) => {
        try{

        await interaction.deferReply().catch(e => { });
        function errors(content){const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red");interaction.followUp({embeds: [embed],ephemeral: true})}
        if(interaction.member.id !== interaction.guild.ownerId)return errors("你必須擁有\`服主\`才能使用")
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
                new EmbedBuilder()
                .setTitle(`<a:greentick:980496858445135893> | 成功刪除!`)
                .setColor("Green")
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