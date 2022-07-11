const verification = require("../../models/verification.js");
const Captcha = require("@haileybot/captcha-generator");
const { 
    MessageActionRow,
    MessageSelectMenu,
    MessageButton,
    MessageEmbed,
    Collector,
    Discord,
    MessageAttachment
 } = require('discord.js');
 
module.exports = {
    name: '驗證',
    description: '確保你不是機器人',
    video: 'https://mhcat.xyz/commands/announcement.html',
    emoji: `<:tickmark:985949769224556614>`,
    run: async (client, interaction, options) => {
        try {
        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");interaction.reply({embeds: [embed],ephemeral: true,})}
        verification.findOne({
            guild: interaction.guild.id,
        }, async (err, data) => {
            if (err) throw err;
            if (!data) {
            errors("這服的管理員沒有設置驗證系統，所以不能使用喔!")
            } else {
                const role = interaction.guild.roles.cache.get(data.role)
                if(!role) return errors("驗證身分組已經不存在了，請通管理員!")
                if(Number(role.position) >= Number(interaction.guild.me.roles.highest.position)) return errors("請通知群主管裡員我沒有權限給你這個身分組(請把我的身分組調高)!")
                let captcha = new Captcha();
                const attachment = new MessageAttachment(captcha.JPEGStream, "captcha.jpeg");
                const bt = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                        .setCustomId(captcha.value + "verification")
                        .setLabel('點我進行驗證!')
                        .setEmoji("<a:arrow:986268851786375218>")
                        .setStyle('SUCCESS'),
                    );
                    interaction.reply({
                        files: [attachment],
                        ephemeral: true,
                        components: [bt]
                    });
            }
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