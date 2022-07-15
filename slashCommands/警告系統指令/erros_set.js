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
const errors_set = require('../../models/errors_set');
const moment = require('moment')
module.exports = {
    name: '警告設定',
    description: '警告的各種設定',
    options: [{
        name: '執行的動作',
        type: 'STRING',
        description: '警告他的原因',
        required: true,
        choices:[
            { name: '停權', value: '停權' },
            { name: '踢出', value: '踢出' },
        ]
    },{
        name: '幾次警告後執行動作',
        type: 'INTEGER',
        description: '被警告幾次後要執行這個動作!',
        required: true
    }],
    //video: 'https://mhcat.xyz/commands/announcement.html',
    UserPerms: '訊息管理',
    emoji: `<:configuration:984010500608249886>`,
    run: async (client, interaction, options, perms) => {
        try {
        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");interaction.reply({embeds: [embed]})}
        if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES))return errors(`你需要有\`${perms}\`才能使用此指令`)
        const user = interaction.options.getInteger("幾次警告後執行動作")
        const reason = interaction.options.getString("執行的動作")
        errors_set.findOne({
            guild: interaction.guild.id,
        }, async (err, data) => {
            if(data){
                data.collection.update(({guild: interaction.channel.guild.id}), {$set: {ban_count: user}})
                data.collection.update(({guild: interaction.channel.guild.id}), {$set: {move: reason}})
                const announcement_set_embed = new MessageEmbed()
                .setTitle("警告系統")
                .setDescription(`警告成功設為警告${user}次後\n執行${reason}`)
                .setColor("GREEN")
                interaction.reply({embeds: [announcement_set_embed]})
            }else{
                // 創建一個新的data
                data = new errors_set({
                    guild: interaction.channel.guild.id,
                    ban_count: user,
                    move: reason
                })
                data.save()
                // 設定embed & send embed
                const announcement_set_embed = new MessageEmbed()
                .setTitle("警告系統")
                .setDescription(`警告成功設為警告${user}次後\n執行${reason}`)
                .setColor("GREEN")
                interaction.reply({embeds: [announcement_set_embed]})
            }
        })


    } catch (error) {
        const error_send= require('../../functions/error_send.js')
        error_send(error, interaction)
    }
    }
}