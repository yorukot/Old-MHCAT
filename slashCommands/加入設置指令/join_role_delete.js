const text_xp = require("../../models/text_xp.js");
const canvacord = require("canvacord")
const join_role = require("../../models/join_role.js")
const { 
    MessageActionRow,
    MessageSelectMenu,
    MessageButton,
    MessageEmbed,
    Collector,
    Discord,
    MessageAttachment,
    Permissions
 } = require('discord.js');
module.exports = {
    name: '加入身份組刪除',
    description: '刪除之前設定的加入身份組',
    options: [{
        name: '身分組',
        type: 'ROLE',
        description: '輸入身分組!',
        required: true,
    }],
    video: 'https://mhcat.xyz/docs/join_role_delete',
    UserPerms: '訊息管理',
    emoji: `<:delete:985944877663678505>`,
    run: async (client, interaction, options) => {
        try {


        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");interaction.reply({embeds: [embed],ephemeral: true})}
        if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES))return errors("你沒有權限使用這個指令")
        const role1 = interaction.options.getRole("身分組")
        const role = role1.id
        join_role.findOne({
            guild: interaction.guild.id,
            role: role
        }, async (err, data) => {
            if (err) throw err; 
            if (!data) {
            return errors("找不到這個身份組!")
            } else {
                data.delete()
            }
            const embed = new MessageEmbed()
            .setTitle("🪂 加入身分組系統")
            .setColor(client.color.greate)
            .setDescription(`<:trashbin:986308183674990592>**成功刪除:**\n身分組: <@${role}>!`)
            interaction.reply({embeds: [embed]})
        })

    } catch (error) {
        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setURL("https://discord.gg/7g7VE2Sqna")
            .setStyle("LINK")
            .setLabel("支援伺服器")
            .setEmoji("<:customerservice:986268421144592415>"),
            new MessageButton()
            .setURL("https://mhcat.xyz")
            .setEmoji("<:worldwideweb:986268131284627507>")
            .setStyle("LINK")
            .setLabel("官方網站")
        );
        return interaction.reply({
            embeds:[new MessageEmbed()
            .setTitle("<a:error:980086028113182730> | 很抱歉，出現了錯誤!")
            .setDescription("**如果可以的話再麻煩幫我到支援伺服器回報w**" + `\n\`\`\`${error}\`\`\`\n常見錯誤:\n\`Missing Access\`:**沒有權限**\n\`Missing Permissions\`:**沒有權限**`)
            .setColor("RED")
            ],
            components:[row]
        })
    }
    }
}