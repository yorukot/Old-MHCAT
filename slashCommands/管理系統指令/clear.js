const text_xp = require("../../models/text_xp.js");
const canvacord = require("canvacord")
const join_role = require("../../models/join_role.js")
const ticket_js = require('../../models/ticket.js')
const lotter = require('../../models/lotter.js');
const moment = require('moment')
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
    name: '刪除訊息',
    description: '刪除大量訊息',
    options: [{
        name: '刪除數量',
        type: 'INTEGER',
        description: '設定要刪除幾個訊息(最高99最低1)(只能刪除14天內的消息)',
        required: true,
    },{
        name: '使用者',
        type: 'USER',
        description: '選擇是否要刪除某個特定的使用者的訊息(如填選這項，第一項代表的將是檢測訊息數量)',
        required: false,
    }],
    //video: 'https://mhcat.xyz/commands/announcement.html',
    UserPerms: '訊息管理',
    emoji: `<:delete:985944877663678505>`,
    run: async (client, interaction, options) => {
        try {
        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");interaction.reply({embeds: [embed],ephemeral: true})}
        if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES))return errors("你沒有權限使用這個指令")
        const number = interaction.options.getInteger("刪除數量")
        const user = interaction.options.getUser("使用者")
            let delamount = number;
            if (parseInt(delamount < 1 || parseInt(delamount) > 99)) return errors('你只能清除1-99則消息')
            if (user) {
                interaction.channel.messages.fetch({
                limit: parseInt(delamount),
                }).then((messages) => {
                messages.forEach((message) => {
                    if(message.author.id === user.id){
                        message.delete()
                    }
                })
                })
            }else{
                interaction.channel.bulkDelete(delamount, true)
            }
            interaction.reply({content: `<a:greentick:980496858445135893> | 成功清除 **${delamount}** 條訊息!`, ephemeral: true})  
        } catch (error) {
            const error_send= require('../../functions/error_send.js')
            error_send(error, interaction)
        }  
    }
}