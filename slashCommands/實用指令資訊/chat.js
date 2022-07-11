const chat = require('../../models/chat.js');
const canvacord = require("canvacord")
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
 var validateColor = require("validate-color").default;
 function checkURL(image) {
    return(image.match(/\.(jpg|png)$/) != null);
}
module.exports = {
    name: '自動聊天頻道',
    description: '設定自動聊天頻道要在哪裡發送',
    options: [{
        name: '頻道',
        type: 'CHANNEL',
        description: '輸入頻道!',
        channel_types: [0,5],
        required: true
    }],
    video: 'https://mhcat.xyz/docs/chat_xp_set',
    UserPerms: '訊息管理',
    emoji: `<:configuration:984010500608249886>`,
    run: async (client, interaction, options) => {
        try {

        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");interaction.reply({embeds: [embed]})}
        if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES))return errors("你沒有權限使用這個指令")
        const channel1 = interaction.options.getChannel("頻道")
        const channel = channel1.id
        chat.findOne({
            guild: interaction.channel.guild.id,
        }, async (err, data) => {
            if(data) data.delete();
                data = new chat({
                    guild: interaction.channel.guild.id,
                    channel: channel,
                })
                data.save()
                const announcement_set_embed = new MessageEmbed()
                .setTitle("自動聊天系統")
                .setDescription(`您的自動聊天頻道成功創建\n您目前的自動聊天頻道為 ${channel1}`)
                .setColor("GREEN")
                interaction.reply({embeds: [announcement_set_embed]})
            
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