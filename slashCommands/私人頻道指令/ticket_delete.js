const text_xp = require("../../models/text_xp.js");
const canvacord = require("canvacord")
const join_role = require("../../models/join_role.js")
const ticket_js = require('../../models/ticket.js')
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
module.exports = {
    name: '私人頻道刪除',
    description: '刪除之前設置的私人頻道',
    //video: 'https://mhcat.xyz/commands/announcement.html',
    UserPerms: '訊息管理',
    emoji: `<:delete:985944877663678505>`,
    run: async (client, interaction, options, perms) => {
        try {
        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");interaction.reply({embeds: [embed],ephemeral: true})}
        if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES))return errors(`你需要有\`${perms}\`才能使用此指令`)
        ticket_js.findOne({
            guild: interaction.guild.id,
        }, async (err, data) => {
            if(data){
                data.delete()
            }
            const delete_message = data ? "成功刪除私人頻道的設置\n現在你可以重新創建了!" : "你還沒有創建私人頻道的設定\n是要怎麼刪除啦!"
            const embed = new MessageEmbed()
            .setColor("RED")
            .setDescription(delete_message)
            .setTitle("刪除私人頻道設定")
            interaction.reply({
                embeds: [embed],
            });
        })


    } catch (error) {
        const error_send= require('../../functions/error_send.js')
        error_send(error, interaction)
    }
    }
}