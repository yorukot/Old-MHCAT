const {
    Client,
    Message,
    MessageEmbed
} = require('discord.js');
const { 
    MessageActionRow,
    MessageSelectMenu,
    MessageButton,
    Collector,
    Discord,
    MessageAttachment,
    Modal,
    TextInputComponent,
    Permissions
 } = require('discord.js');
const warndb = require('../../models/warndb');
const moment = require('moment')
const errors_set = require('../../models/errors_set');
module.exports = {
    name: '警告',
    description: '警告一個使用者',
    options: [{
        name: '使用者',
        type: 'USER',
        description: '要警告的使用者!',
        required: true
    },{
        name: '原因',
        type: 'STRING',
        description: '警告他的原因',
        required: true
    }],
    //video: 'https://mhcat.xyz/commands/announcement.html',
    UserPerms: '訊息管理',
    emoji: `<:warning:985590881698590730>`,
    run: async (client, interaction, options) => {
        try {
        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");interaction.reply({embeds: [embed]})}
        if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES))return errors("你沒有權限使用這個指令")
        const user = interaction.options.getUser("使用者")
        const reason = interaction.options.getString("原因")
        warndb.findOne({
            guild: interaction.guild.id,
            user: user.id
        }, async (err, data) => {
            if (err) throw err;
            if (!data) {
                data = new warndb({
                    guild: interaction.guild.id,
                    user: user.id,
                    content: [{
                        time: moment().utcOffset("+08:00").format('YYYY年MM月DD日 HH點mm分'),
                        moderator: interaction.user.id,
                        reason: reason
                    }]
                })
            } else {
                const object = {
                    time: moment().utcOffset("+08:00").format('YYYY年MM月DD日 HH點mm分'),
                    moderator: interaction.user.id,
                    reason: reason
                }
                data.content.push(object)
                errors_set.findOne({
                    guild: interaction.guild.id,
                }, async (err, data111) => {
                    if(!data111)return
                    if(data.content.length + 1 >=  Number(data111.ban_count)){
                        if(data111.move === "停權"){
                            if(!interaction.guild.me.permissions.has(Permissions.FLAGS.BAN_MEMBERS  ))return errors("我沒有權限ban掉他")
                            interaction.guild.members.ban(user.id)
                            const aaaaa = new MessageEmbed()
                            .setTitle("<a:greentick:980496858445135893> | 這位使用者已到達警告須執行條件，成功對他執行`停權`!")
                            .setColor("GREEN")
                            interaction.channel.send({embeds:[aaaaa]})
                        }else{
                            if(!interaction.guild.me.permissions.has(Permissions.FLAGS.KICK_MEMBERS ))return errors("我沒有權限踢出他")
                            interaction.guild.members.kick(user.id)
                            const dsadsadsa = new MessageEmbed()
                            .setTitle("<a:greentick:980496858445135893> | 這位使用者已到達警告須執行條件，成功對他執行`踢出`!")
                            .setColor("GREEN")
                            interaction.channel.send({embeds:[dsadsadsa]})
                        }
                    }
                })
            }
            data.save()

        })
        const embed = new MessageEmbed()
        .setTitle("<a:greentick:980496858445135893> | 成功警告這位使用者!")
        .setColor("GREEN")
        interaction.reply({embeds:[embed]})
        const warn = new MessageEmbed()
        .setColor("RED")
        .setTitle("警告系統")
        .setDescription("-你被警告了!\n" + `-原因:${reason}`)
        user.send({embeds: [warn] })

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