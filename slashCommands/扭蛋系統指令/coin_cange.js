const gift_change = require("../../models/gift_change.js");
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
    name: '扭蛋所需代幣變更',
    description: '改變每次扭蛋所需的代幣數量',
    options: [{
        name: '數量',
        type: 'INTEGER',
        description: '每次扭蛋所需的代幣數量',
        required: true,
    }],     
   // video: 'https://mhcat.xyz/commands/announcement.html',
    emoji: `<:coins:997352176194175066>`,
    UserPerms: '訊息管理',
    run: async (client, interaction, options) => {
        try{
        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");interaction.reply({embeds: [embed],ephemeral: true})}
        const number = interaction.options.getInteger("數量")
        if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES))return errors("你沒有權限使用這個指令")
        gift_change.findOne({
                guild: interaction.guild.id,
            }, async (err, data) => {
                if(!data){
                    data = new gift_change({
                        guild: interaction.guild.id,
                        coin_number: number,
                    })
                    data.save()
                }else{
                    data.delete()
                    data = new gift_change({
                        guild: interaction.guild.id,
                        coin_number: number,
                    })
                    data.save()
                }
                const good = new MessageEmbed()
                .setTitle(`<:money:997100999305068585>成功改變每次扭蛋所需代幣，目前所需代幣:\`${number}\``)
                .setFooter("MHCAT", interaction.member.displayAvatarURL({
                    dynamic: true
                }))
                .setColor('RANDOM')
                interaction.reply({embeds: [good]})
            })

        } catch (error) {
            const error_send= require('../../functions/error_send.js')
            error_send(error, interaction)
        }
    }
}