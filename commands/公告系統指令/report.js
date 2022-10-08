const {
    Client,
    Message,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder

} = require('discord.js');
const not_a_good_web = require('../../models/not_a_good_web.js');
module.exports = {
    name: 'report',
    aliases: ['act'],
    description: '發出一個簡易的公告訊息，還可以傳圖片喔，只需要再打出的指令裡附加圖片(**請先進行設置公告頻道**)',
    video: 'https://mhcat.xyz/commands/announcement.html',
    usage: '[標題] [tag的人] [嵌入顏色(支持色碼&英文顏色單字ex.RED)] [公告內容]',
    UserPerms: 'MANAGE_MESSAGES',
    emoji: `<:announcement:980100770483540009>`,
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async (client, message, args, Discord, interaction) => {
        if (message.guild.id !== "976879837471973416") return
        if (!args[0]) return
        message.delete()

        function errors(content) {
            const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red");
            message.channel.send({
                embeds: [embed]
            }).then((msg) => {
                setTimeout(() => {
                    msg.delete();
                }, 3000);
            })
        }
        not_a_good_web.findOne({
            web: args[0],
        }, async (err, data) => {
            if (data) return errors("該網址以回報過")
            data = new not_a_good_web({
                web: args[0]
            })
            data.save()
            message.channel.send("成功上傳").then((msg) => {
                setTimeout(() => {
                    msg.delete();
                }, 3000);
            })
        })
    }
}