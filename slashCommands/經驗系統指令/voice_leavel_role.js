const chat_role = require('../../models/voice_role.js');
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
    name: '語音經驗身分組設定',
    description: '設定聊天經驗通知要在哪發送(兼增加、刪除、設定查詢)',
    options: [{
        name: '增加',
        type: 'SUB_COMMAND',
        description: '當有人的等級達到後要給予身分組',
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
        }]
    },{
        name: '刪除',
        type: 'SUB_COMMAND',
        description: '刪除之前的設定',
        options: [{
            name: '等級',
            type: 'INTEGER',
            description: '輸入之前設定的身分組!',
            required: true
        },{
            name: '身分組',
            type: 'ROLE',
            description: '輸入之前設定的身分組',
            required: true
        }]
    },{
        name: '設定查詢',
        type: 'SUB_COMMAND',
        description: '查看之前的設定',
    }],
    video: 'https://mhcat.xyz/docs/chat_xp_set',
    UserPerms: '訊息管理',
    emoji: `<:configuration:984010500608249886>`,
    run: async (client, interaction, options, perms) => {
    try {
        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");interaction.reply({embeds: [embed]})}
        if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES))return errors(`你需要有\`${perms}\`才能使用此指令`)
        const leavel = interaction.options.getInteger("等級")
        const role11 = interaction.options.getRole("身分組")
        const role = role11 ? role11 : {id: "dsa"}
        chat_role.findOne({
            guild: interaction.channel.guild.id,
            role: role.id,
            leavel: `${leavel}`
        }, async (err, data) => {
            if(interaction.options.getSubcommand() === "增加"){
                if(Number(role.position) >= Number(interaction.guild.me.roles.highest.position)) return errors("我沒有權限給大家這個身分組(請把我的身分組調高)!")
                if(data) data.delete()
                data = new chat_role({
                    guild: interaction.channel.guild.id,
                    leavel: leavel,
                    role: role.id
                })
                    data.save()
                    const announcement_set_embed = new MessageEmbed()
                    .setTitle(`${client.emoji.channel}語音經驗系統`)
                    .setDescription(`${client.emoji.done}成功\`增加\`/\`修改\`該設定`)
                    .setColor(client.color.greate)
                    interaction.reply({embeds: [announcement_set_embed]})
            }else if(interaction.options.getSubcommand() === "設定查詢"){
                chat_role.find({}, async (err, data) => {
                    const testsetse = []
                    for(let i = 0; i < data.length; i++) {
                        let aaaaaaaaa = {name: `<:levelup:990254382845157406> **等級:**` + `\`${data[i].leavel}\``, value:`<:roleget:991997549726662706> **身分組:**<@&${data[i].role}>`, inline: true}
                        testsetse.push(aaaaaaaaa)
                    } 
                    interaction.reply({
                        embeds:[
                            {type: 'rich',
                            title: `<:Voice:994844272790610011> 以下是語音經驗身分組的所有設定!!`,
                            color: 'RANDOM',
                            fields: testsetse
                        }
                        ]
                    })
                })
            }else{
                if(data) {
                    data.delete()
                    const announcement_set_embed = new MessageEmbed()
                    .setTitle(`${client.emoji.delete}語音經驗系統`)
                    .setDescription(`${client.emoji.done}成功刪除該設定`)
                    .setColor(client.color.greate)
                    return interaction.reply({embeds: [announcement_set_embed]})
                }else{
                    return errors("你沒有設定過這個選項!")
                }
            }
        })
        
    } catch (error) {
        const error_send= require('../../functions/error_send.js')
        error_send(error, interaction)
    }
    }
}