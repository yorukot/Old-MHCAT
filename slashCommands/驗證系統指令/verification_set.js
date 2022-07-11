const text_xp = require("../../models/text_xp.js");
const canvacord = require("canvacord")
const verification = require("../../models/verification.js")
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
    name: '驗證設置',
    description: '設置驗證完成後要給甚麼身份組',
    options: [{
        name: '身分組',
        type: 'ROLE',
        description: '輸入身份組!',
        required: true,
    }],
    video: 'https://mhcat.xyz/commands/announcement.html',
    UserPerms: '訊息管理',
    emoji: `<:configuration:984010500608249886>`,
    run: async (client, interaction, options) => {
        try {
        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");interaction.reply({embeds: [embed],ephemeral: true})}
        if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES))return errors("你沒有權限使用這個指令")
        const role1 = interaction.options.getRole("身分組")
        const role = role1.id
        if(Number(role1.position) >= Number(interaction.guild.me.roles.highest.position)) return errors("我沒有權限為大家增加這個身分組，請將我的身分組位階調高")
        verification.findOne({
            guild: interaction.guild.id,
            role: role
        }, async (err, data) => {
            if (err) throw err; 
            if (!data) {
            data = new verification({
                guild: interaction.guild.id,
                role: role
            })
            data.save()
            } else {
            data.collection.update(({guild: interaction.guild.id,member: interaction.member.id,}), {$set: {role: role}})
            }
            const embed = new MessageEmbed()
            .setTitle("設置成功!")
            .setColor("GREEN")
            .setDescription(`身分組: <@${role}>!`)
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