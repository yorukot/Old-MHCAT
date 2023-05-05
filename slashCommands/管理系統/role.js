const message_reaction = require("../../models/message_reaction.js");
const {
    ApplicationCommandType,
    ButtonStyle,
    ApplicationCommandOptionType,
    ActionRowBuilder,
    SelectMenuBuilder,
    ButtonBuilder,
    EmbedBuilder,
    Collector,
    Discord,
    AttachmentBuilder,
    ModalBuilder,
    TextInputBuilder,
    PermissionsBitField
} = require('discord.js');
module.exports = {
    name: '選取身分組-表情符號',
    cooldown: 10,
    description: '設定領取身分組的消息-點按鈕自動增加身分組(如要更改某個表情符號所給予的身分組，請一樣打這個指令)',
    options: [{
        name: '訊息url',
        type: ApplicationCommandOptionType.String,
        description: '輸入訊息的url(對訊息點右鍵按複製訊息連結)!',
        required: true,
    },{
        name: '身分組',
        type: ApplicationCommandOptionType.Role,
        description: '輸入要給的身分組!',
        required: true,
    },{
        name: '表情符號',
        type: ApplicationCommandOptionType.String,
        description: '請輸入要放在訊息下面的表情符號',
        required: true,
    }],
    //video: 'https://docs.mhcat.xyzz/commands/announcement.html',
    UserPerms: '訊息管理',
    emoji: `<:add:985948803469279303>`,
    run: async (client, interaction, options, perms) => {
        await interaction.deferReply();
        try {
        function errors(content){const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red");interaction.editReply({embeds: [embed],ephemeral: true})}
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages))return errors(`你需要有\`${perms}\`才能使用此指令`)
        const role1 = interaction.options.getRole("身分組")
        const emoji = interaction.options.getString("表情符號")
        const url = interaction.options.getString("訊息url") + "{"
        if(Number(role1.position) >= Number(interaction.guild.members.me.roles.highest.position)) return errors("我沒有權限給大家這個身分組(請把我的身分組調高)!")
        if(!url.includes("https://discord.com/channels/") && !url.includes("https://discordapp.com/channels/")) return errors('你輸入的不是一個訊息連結')
        var aa = url.replace("https://discord.com/channels/", '').replace("https://discordapp.com/channels/", '')
        var channel1 = aa.substring(aa.indexOf("/") + 1, aa.lastIndexOf("/"));
        var messageaa = aa.substring(aa.indexOf("/") + 1, aa.lastIndexOf("{"));
        var message1 = messageaa + "{"
        var message2 = message1.substring(message1.indexOf("/") + 1, message1.lastIndexOf("{"));
        var  emoji_test = emoji.replace(':', '')
        var emoji_id = emoji_test.substring(emoji_test.indexOf(":") + 1, emoji_test.lastIndexOf(">"));
        const channel = interaction.guild.channels.cache.get(channel1)
        if(!channel)return errors("很抱歉，找不到這個訊息")
        const reactionEmoji = client.emojis.cache.get(emoji_id);
        function isEmoji(str) {
            var ranges = [
                '(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])' // U+1F680 to U+1F6FF
            ];
            if (str.match(ranges.join('|'))) {
                return true;
            } else {
                return false;
            }
        }
        if(!reactionEmoji && !isEmoji(emoji)) return errors('你必須輸入正確的表情符號!(表情符號所在伺服器我必須在裡面!)')
        const message = channel.messages.fetch({ message: message2, cache: false, force: true })
        .then(message32 => {
            if(!channel || !message32)return errors("很抱歉，找不到這個訊息")
            message32.react(reactionEmoji ? reactionEmoji : emoji)
        message_reaction.findOne({
            guild: interaction.guild.id,
            message: message32.id,
            react: isEmoji(emoji) ? emoji : emoji_id,
        }, async (err, data) => {
            if (err) throw err; 
            if(data) data.delete();
            data = new message_reaction({
                guild: interaction.guild.id,
                message: message32.id,
                react: !isEmoji(emoji) ? emoji_id : emoji,
                role: role1.id,
            })
            data.save()
            const embed = new EmbedBuilder()
            .setTitle(client.emoji.done + " | 表情符號選取身分組成功設定")
            .setColor("Green")
            interaction.editReply({embeds:[embed]})
            return
        })
    })


} catch (error) {
    const error_send= require('../../functions/error_send.js')
    error_send(error, interaction)
}
}}