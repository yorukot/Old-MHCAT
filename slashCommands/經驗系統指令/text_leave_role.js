const chat_role = require('../../models/chat_role.js');
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
    //name: '聊天經驗身分組設定',
    //description: '設定聊天經驗通知要在哪發送',
    options: [{
        name: '等級',
        type: 'INTEGER',
        description: '輸入要在幾等時給予身分組!',
        required: true
    },{
        name: '身分組',
        type: 'ROLE',
        description: '當到達設定的等級時時，要給甚麼身份組',
        required: true
    },{
        name: '刪除這個設定',
        type: 'BOOLEAN',
        description: '刪除之前設定過的這個設定',
        required: false
    }],
    video: 'https://mhcat.xyz/docs/chat_xp_set',
    UserPerms: '訊息管理',
    emoji: `<:configuration:984010500608249886>`,
    run: async (client, interaction, options) => {
        try {
        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");interaction.reply({embeds: [embed]})}
        if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES))return errors("你沒有權限使用這個指令")
        const leavel = interaction.options.getString("等級")
        const role = interaction.options.getRole("身分組")
        const aaaaa = interaction.options.getBoolean("刪除這個設定")
        chat_role.findOne({
            guild: interaction.channel.guild.id,
        }, async (err, data) => {
            if(aaaaa) {
                data.delete()
                const announcement_set_embed = new MessageEmbed()
                .setTitle(`${client.emoji.delete}聊天經驗系統`)
                .setDescription(`${client.emoji.done}成功刪除該設定`)
                .setColor(client.color.greate)
                return interaction.reply({embeds: [announcement_set_embed]})
            }
            if(data) data.delete()
                data = new chat_role({
                    guild: interaction.channel.guild.id,
                    leavel: leavel,
                    role: role.id
                })
                data.save()
                const announcement_set_embed = new MessageEmbed()
                .setTitle(`${client.emoji.delete}聊天經驗系統`)
                .setDescription(`${client.emoji.done}成功刪除該設定`)
                .setColor(client.color.greate)
                interaction.reply({embeds: [announcement_set_embed]})
        })

    } catch (error) {
        const error_send= require('../../functions/error_send.js')
        error_send(error, interaction)
    }
    }
}