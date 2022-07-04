const message_reaction = require("../../models/message_reaction.js");
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
    name: '選取身分組刪除-表情符號版',
    description: '選取身分組刪除-表情符號版(進行刪除)',
    options: [{
        name: '訊息url',
        type: 'STRING',
        description: '輸入訊息的url(對訊息點右鍵按複製訊息連結)!',
        required: true,
    },{
        name: '表情符號',
        type: 'STRING',
        description: '請輸入要放在訊息下面的表情符號',
        required: true,
    }],
    //video: 'https://mhcat.xyz/commands/announcement.html',
    UserPerms: '訊息管理',
    emoji: `<:add:985948803469279303>`,
    run: async (client, interaction, options) => {
        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");interaction.reply({embeds: [embed],ephemeral: true})}
        if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES))return errors("你沒有權限使用這個指令")
        const emoji = interaction.options.getString("表情符號")
        const url = interaction.options.getString("訊息url") + "{"
        if(!url.includes("https://discord.com/channels/")) return errors('你輸入的不是一個訊息連結')
        var aa = url.replace("https://discord.com/channels/", '')
        var channel1 = aa.substring(aa.indexOf("/") + 1, aa.lastIndexOf("/"));
        var messageaa = aa.substring(aa.indexOf("/") + 1, aa.lastIndexOf("{"));
        var message1 = messageaa + "{"
        var message2 = message1.substring(message1.indexOf("/") + 1, message1.lastIndexOf("{"));
        const channel = interaction.guild.channels.cache.get(channel1)
        if(!channel)return errors("很抱歉，找不到這個訊息")
        const message = channel.messages.fetch(message2)
        .then(message32 => {
            if(!message32)return errors("很抱歉，找不到這個訊息")
            message32.react(emoji)
        message_reaction.findOne({
            guild: interaction.guild.id,
            message: message32.id,
            react: emoji,
        }, async (err, data) => {
            if (err) throw err; 
            if(!data) return errors("這個表情符號沒有在這個訊息上設定")
            if(data) data.delete();
            const embed = new MessageEmbed()
            .setTitle("表情符號選取身分組成功刪除")
            .setColor("GREEN")
            interaction.reply({embeds:[embed]})
            return
        })
    })
}}