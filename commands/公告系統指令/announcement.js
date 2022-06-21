const {
    Client,
    Message,
    MessageEmbed,
    MessageActionRow,
    MessageButton

} = require('discord.js');
const guild = require('../../models/guild.js');
var validateColor = require("validate-color").default;
module.exports = {
    name: '公告',
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
        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");message.reply({embeds: [embed]})}
        // 設置公告是否有圖片
        const pic = message.attachments.size > 0 ? message.attachments.first().url : null
        // 設置變數
        const title = args[0]
        const tag = args[1];
        const color = args[2]
        const reason = args.slice(3).join(' ');
        // 檢查變數
        if (!title) return errors('你必須說明標題!');
        if (!tag) return errors('你必須說出要tag誰!');
        if (!color) return errors('你必須說出您的嵌入的邊框顏色(色碼)!');
        if (!reason) return errors('你必須說出公告內容!');
        if (!validateColor(color)) return errors('你傳送的並不是顏色(色碼)')
        // 設定embed
        const announcement = new MessageEmbed()
        .setTitle(title)
        .setDescription("" + reason + "")
        .setColor(color)
        .setImage(pic)
        .setFooter(
            `來自${message.author.tag}的公告`,
            message.author.displayAvatarURL({
                dynamic: true
            })
        );
        // 設定是否傳送按鈕
        const yesno = new MessageEmbed()
        .setTitle("是否將此訊息送往公告?(請於六秒內點擊:P)")
        .setColor("#00ff19")
        const yes = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId("announcement_yes")
            .setEmoji("✅")
            .setLabel('是')
            .setStyle('PRIMARY'),
        new MessageButton()
            .setCustomId('announcement_no')
            .setLabel('否')
            .setEmoji("❎")
            .setStyle('DANGER'),
        );
        // 發送訊息
        try {
            message.channel.send({content: tag, embeds: [announcement] })
        } catch (error) {
            // 如果有錯誤
            const error_embed = new MessageEmbed()
            .setTitle("錯誤 | error")
            .setDescription("很抱歉出現了錯誤!\n" + `\`\`\`${error}\`\`\`` + "\n如果可以再麻煩您回報給`夜貓#5042`")
            .setColor("red")
            message.channel.send({embeds: [error_embed]})
        }
        // 說出是否發送+公告預覽
        const await_embed = await message.channel.send({embeds: [yesno] ,components: [yes] })
        const collector = message.channel.createMessageComponentCollector({
            time: 6000,
            max:1,
        })
        setTimeout(() => {await_embed.delete()}, 6000);
        collector.on('collect', async (ButtonInteraction) => {
            const id = ButtonInteraction.customId;
                if (id === `announcement_yes`) {
                    guild.findOne({
                        guild: message.channel.guild.id,
                    }, async (err, data) => {
                        if(!data || data.announcement_id === "0"){
                            ButtonInteraction.reply("很抱歉!\n你還沒有對您的公告頻道進行選擇!\n命令:`<> 公告頻道設置 [公告頻道id]`\n有問題歡迎打`<>幫助`")
                            return   
                        }else{
                            const channel111 = client.channels.cache.get(data.announcement_id)
                            const hasPermissionInChannel = channel111
                            .permissionsFor(message.guild.me)
                            .has('SEND_MESSAGES', false)
                            const hasPermissionInChannel1 = channel111
                            .permissionsFor(message.guild.me)
                            .has('VIEW_CHANNEL', false)
                        if(!hasPermissionInChannel || !hasPermissionInChannel1){
                            return errors("我沒有權限在" + channel111.name + "發送消息!")
                        }
                            channel111.send({content: tag , embeds: [announcement] })
                            ButtonInteraction.reply("成功發送")
                        }
                    })
            }if (id === 'announcement_no') {
                ButtonInteraction.reply("已取消")
                return 
            }
    })
}}