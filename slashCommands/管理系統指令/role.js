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
    name: '選取身分組-表情符號版',
    description: '設定領取身分組的消息-點按鈕自動增加身分組(如要更改某個表情符號所給予的身分組，請一樣打這個指令)',
    options: [{
        name: '訊息url',
        type: 'STRING',
        description: '輸入訊息的url(對訊息點右鍵按複製訊息連結)!',
        required: true,
    },{
        name: '身分組',
        type: 'ROLE',
        description: '輸入要給的身分組!',
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
        try {
        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");interaction.reply({embeds: [embed],ephemeral: true})}
        if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES))return errors("你沒有權限使用這個指令")
        const role1 = interaction.options.getRole("身分組")
        const emoji = interaction.options.getString("表情符號")
        const url = interaction.options.getString("訊息url") + "{"
        if(Number(role1.position) >= Number(interaction.guild.me.roles.highest.position)) return errors("我沒有權限給大家這個身分組(請把我的身分組調高)!")
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
            if(!channel || !message32)return errors("很抱歉，找不到這個訊息")
            message32.react(emoji)
        message_reaction.findOne({
            guild: interaction.guild.id,
            message: message32.id,
            react: emoji,
        }, async (err, data) => {
            if (err) throw err; 
            if(data) data.delete();
            data = new message_reaction({
                guild: interaction.guild.id,
                message: message32.id,
                react: emoji,
                role: role1.id,
            })
            data.save()
            const embed = new MessageEmbed()
            .setTitle("表情符號選取身分組成功設定")
            .setColor("GREEN")
            interaction.reply({embeds:[embed]})
            return
        })
    })


} catch (error) {
    const error_send= require('../../functions/error_send.js')
    error_send(error, interaction)
}
}}