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
    name: '扭蛋獎池增加',
    description: '增加扭蛋的獎池',
    options: [{
        name: '獎品名稱',
        type: 'STRING',
        description: '輸入這個獎品叫甚麼，以及簡單概述',
        required: true,
    },{
        name: '機率',
        type: 'NUMBER',
        description: '輸入中獎機率(百分比)ex:10 代表10% 0.1代表0.1%',
        required: true,
    },{
        name: '獎品代碼',
        type: 'STRING',
        description: '填上獎品的代碼ex:stram序號nitro連結等',
        required: false,
    }],
   // video: 'https://mhcat.xyz/commands/announcement.html',
    emoji: `<:ticket:985945491093205073>`,
    UserPerms: '訊息管理',
    run: async (client, interaction, options) => {
        try{
        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");interaction.reply({embeds: [embed],ephemeral: true})}
        if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES))return errors("你沒有權限使用這個指令")
        const gift_name = interaction.options.getString("獎品名稱")
        const gift_code = interaction.options.getString("獎品代碼")
        const gift_chence = interaction.options.getNumber("機率")
        gift.findOne({
            guild: interaction.guild.id,
            gift_name: gift_name,
            }, async (err, data) => {
                if(!data){
                    const data = new gift({
                        guild: interaction.guild.id,
                        gift_name: gift_name,
                        gift_code: gift_code,
                        gift_chence: gift_chence ? gift_chence : null,
                    })
                    data.save()
                    return interaction.reply({
                        embeds:[
                            new MessageEmbed()
                            .setTitle(client.emoji.done + "設置成功")
                            .addFields(
                                { name: '<:id:985950321975128094> **獎品名:**', value: `${gift_name}`, inline: true},
                                { name: '<:dice:997143550099718144> **獎品機率:**', value: `${gift_chence}`, inline: true},
                                { name: '<:security:997143793537122395> **獎品代碼:**', value: gift_code ? `${gift_code}` : "該獎品無代碼", inline: true}
                            )
                            .setColor(client.color.greate)
                        ],
                        ephemeral: true
                    })
                }else{
                    return errors("獎品名稱重複，請將之前的刪除或等待被抽中!")
                }
            })
        } catch (error) {
            const error_send= require('../../functions/error_send.js')
            error_send(error, interaction)
        }
    }
}