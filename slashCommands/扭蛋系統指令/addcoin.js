const coin = require("../../models/coin.js");
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
const { errorMonitor } = require("ws");
module.exports = {
    name: '扭蛋改變',
    description: '改變扭蛋數量',
    options: [{
        name: '使用者',
        type: 'USER',
        description: '要改變的人',
        required: true,
    },{
        name: '增加或減少',
        type: 'STRING',
        description: '輸入這個獎品叫甚麼，以及簡單概述',
        required: true,
        choices:[
            { name: '增加', value: 'add' },
            { name: '減少', value: 'reduce' },
        ],
    },{
        name: '數量',
        type: 'INTEGER',
        description: '增加或減少的數量',
        required: true,
    }],     
   // video: 'https://mhcat.xyz/commands/announcement.html',
    emoji: `<:income:997352058652995664>`,
    UserPerms: '訊息管理',
    run: async (client, interaction, options) => {
        try{
        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");interaction.reply({embeds: [embed],ephemeral: true})}
        const user = interaction.options.getUser("使用者")
        const add_reduce = interaction.options.getString("增加或減少")
        const number = interaction.options.getInteger("數量")
        if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES))return errors("你沒有權限使用這個指令")
        coin.findOne({
                guild: interaction.guild.id,
                member: user.id
            }, async (err, data) => {
                if(!data){
                    if(add_reduce === "reduce")return errors("不可減到負數!")
                    data = new coin({
                        guild: interaction.guild.id,
                        member: interaction.member.id,
                        coin: number,
                        today: true
                    })
                    data.save()
                }else{
                    if(add_reduce === "reduce"){
                        if(data.coin - number < 0) return errors("不可減到負數!")
                        data.collection.update(({guild: interaction.channel.guild.id, member: interaction.member.id}), {$set: {coin: data.coin - number}})
                    }else{
                        data.collection.update(({guild: interaction.channel.guild.id, member: interaction.member.id}), {$set: {coin: data.coin + number}})
                    }
                }
                const good = new MessageEmbed()
                .setTitle(`<:money:997100999305068585>已為${user.username}增加:\`${number}\`個代幣!`)
                .setFooter(`增加${number}`,interaction.member.displayAvatarURL({
                    dynamic: true
                }))
                .setColor('RANDOM')
                interaction.reply({embeds: [good],ephemeral: true})
            })

        } catch (error) {
            const error_send= require('../../functions/error_send.js')
            error_send(error, interaction)
        }
    }
}