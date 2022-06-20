const verification = require("../../models/verification.js");
const { createCaptchaSync } = require('captcha-canvas');
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
                const { image, text } = createCaptchaSync(300, 100);
                const attachment = new MessageAttachment(image, "createCaptchaSync.png");
                const bt = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                        .setCustomId(text + "verification")
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
    }
}