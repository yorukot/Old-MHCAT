const gift = require("../../models/gift.js");
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
    name: '扭蛋獎池刪除',
    description: '刪除扭蛋的獎池',
    options: [{
        name: '獎品名稱',
        type: 'STRING',
        description: '輸入這個獎品叫甚麼，以及簡單概述',
        required: true,
    }],
    video: 'https://mhcat.xyz/docs/prize_removal',
    emoji: `<:trashbin:995991389043163257>`,
    UserPerms: '訊息管理',
    run: async (client, interaction, options, perms) => {
        try{
        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");interaction.reply({embeds: [embed],ephemeral: true})}
        if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES))return errors(`你需要有\`${perms}\`才能使用此指令`)
        const gift_name = interaction.options.getString("獎品名稱")
        gift.findOne({
            guild: interaction.guild.id,
            gift_name: gift_name,
            }, async (err, data) => {
                if(!data){
                    return errors("找不到這個獎品!")
                }else{
                    data.delete()
                    return interaction.reply({
                        embeds:[
                            new MessageEmbed()
                            .setTitle(client.emoji.done + "成功刪除!")
                            .setDescription("獎品名:" + data.gift_name)
                            .setColor(client.color.greate)
                        ]
                    })
                }
            })
        } catch (error) {
            const error_send= require('../../functions/error_send.js')
            error_send(error, interaction)
        }
    }
}