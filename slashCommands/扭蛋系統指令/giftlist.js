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
    name: '扭蛋獎池查詢',
    description: '增加扭蛋的獎池',
   // video: 'https://mhcat.xyz/commands/announcement.html',
    emoji: `<:list:992002476360343602>`,
    run: async (client, interaction, options) => {
        try{
        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");interaction.reply({embeds: [embed],ephemeral: true})}
        gift.find({
            guild: interaction.guild.id,
            }, async (err, data) => {
                if(data.length === 0){
                    return errors("目前獎池沒有任何獎品喔!")
                }else{
                    const e = data.map(
                        (w, i) => `**<:id:985950321975128094> 獎品名:** \n\`${w.gift_name}\`\n**<:dice:997143550099718144> 獎品抽中概率:**\n\`${w.gift_chence}\`%\n`
                    )
                    return interaction.reply({
                        embeds:[
                            new MessageEmbed()
                            .setTitle(`<:list:992002476360343602> 以下是${interaction.guild.name}的獎池`)
                            .setDescription(e.join('\n'))
                            .setFooter(
                                `${interaction.user.tag}的查詢`,
                                interaction.user.displayAvatarURL({
                                dynamic: true
                                }))
                            .setColor('RANDOM')
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